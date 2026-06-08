import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, UserCheck, TrendingUp, DollarSign, ShoppingCart, Users,
  Copy, CheckCircle2, Clock, CreditCard, ExternalLink, Receipt,
  Percent, ShieldCheck, Ban, Power, PowerOff, Calendar,
} from "lucide-react";
import { db, doc, updateDoc, serverTimestamp } from "../../../firebase";
import { cn } from "../../../lib/utils";

interface CreatorData {
  id?: string;
  code: string;
  creatorName: string;
  userId?: string;
  commissionRate: number;
  totalSales: number;
  totalEarnings: number;
  isActive: boolean;
  payoutStatus: string;
  lastPayoutDate?: any;
  lastPayoutAmount?: number;
}

interface SaleLog {
  id?: string;
  creatorCode: string;
  creatorName: string;
  orderId: string;
  productId: string;
  productTitle?: string;
  userId: string;
  productPrice: number;
  discountApplied: number;
  commission: number;
  commissionRate: number;
  currency: string;
  timestamp: any;
}

interface Props {
  creator: CreatorData;
  sales: SaleLog[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  addToast: (message: string, type?: "info" | "success" | "warning" | "error") => void;
}

export const CreatorDetailModal: React.FC<Props> = ({
  creator, sales, isOpen, onClose, onRefresh, addToast,
}) => {
  const [isUpdatingPayout, setIsUpdatingPayout] = useState(false);

  const totalCommission = sales.reduce((sum, s) => sum + (s.commission || 0), 0);
  const totalRevenue = sales.reduce((sum, s) => sum + (s.productPrice || 0), 0);
  const uniqueBuyers = new Set(sales.map((s) => s.userId)).size;
  const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
  const pendingCommission = creator.payoutStatus === 'pending' ? totalCommission : 0;
  const paidCommission = creator.payoutStatus === 'paid' ? totalCommission : sales.filter(s => s.commission).reduce((sum, s) => sum + (s.commission || 0), 0);

  const referralLink = `https://ayushpaul.in?ref=${creator.code}`;
  const creatorParamLink = `https://ayushpaul.in?creator=${creator.code}`;

  const [copied, setCopied] = useState<'ref' | 'creator' | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const copyToClipboard = async (text: string, type: 'ref' | 'creator') => {
    await navigator.clipboard.writeText(text);
    if (type === 'ref') setCopiedRef(true);
    else setCopied(type);
    setTimeout(() => { setCopiedRef(false); setCopied(null); }, 2000);
    addToast(`${type === 'ref' ? 'Referral' : 'Creator'} link copied!`, "success");
  };

  const handleToggleActive = async () => {
    if (!creator.id) return;
    try {
      await updateDoc(doc(db, 'creator_codes', creator.id), {
        isActive: !creator.isActive,
        updatedAt: serverTimestamp(),
      });
      addToast(`Creator ${creator.code} ${creator.isActive ? 'deactivated' : 'activated'}`, "success");
      onRefresh();
    } catch (err) {
      addToast("Failed to toggle creator status", "error");
    }
  };

  const handleUpdatePayout = async () => {
    if (!creator.id) return;
    setIsUpdatingPayout(true);
    try {
      const newStatus = creator.payoutStatus === 'paid' ? 'pending' : 'paid';
      const updateData: Record<string, any> = {
        payoutStatus: newStatus,
        updatedAt: serverTimestamp(),
      };
      if (newStatus === 'paid') {
        updateData.lastPayoutDate = serverTimestamp();
        updateData.lastPayoutAmount = totalCommission;
      }
      await updateDoc(doc(db, 'creator_codes', creator.id), updateData);
      addToast(`Payout marked as ${newStatus}`, "success");
      onRefresh();
    } catch (err) {
      addToast("Failed to update payout status", "error");
    } finally {
      setIsUpdatingPayout(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '—';
    if (typeof date.toDate === 'function') return date.toDate().toLocaleDateString('en-IN');
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] rounded-[2.5rem] border border-white/10 shadow-2xl z-[1001]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0A0A0A] border-b border-white/5 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg">
                  {creator.creatorName?.[0] || 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{creator.creatorName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-bold uppercase tracking-wider">
                      {creator.code}
                    </span>
                    {!creator.isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-wider">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs mt-0.5">
                    {creator.userId ? `UID: ${creator.userId.slice(0, 16)}...` : 'No user linked'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleActive}
                  className={cn(
                    "p-3 rounded-xl border transition-all",
                    creator.isActive
                      ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                      : "bg-white/5 border-white/10 text-white/30 hover:text-white"
                  )}
                >
                  {creator.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                </button>
                <button onClick={onClose} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    <ShoppingCart size={12} /> Total Sales
                  </div>
                  <div className="text-2xl font-bold text-white">{sales.length}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    <DollarSign size={12} /> Revenue Generated
                  </div>
                  <div className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    <TrendingUp size={12} /> Commission Earned
                  </div>
                  <div className="text-2xl font-bold text-brand-primary">₹{totalCommission.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    <Users size={12} /> Unique Buyers
                  </div>
                  <div className="text-2xl font-bold text-white">{uniqueBuyers}</div>
                </div>
              </div>

              {/* Creator Info + Payout + Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Creator Settings */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                    <UserCheck size={16} className="text-brand-primary" /> Creator Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/40">Commission Rate</span>
                      <span className="text-sm font-bold text-brand-primary">{creator.commissionRate || 10}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/40">Avg Order Value</span>
                      <span className="text-sm font-bold text-white">₹{avgOrderValue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/40">Status</span>
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider",
                        creator.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}>
                        {creator.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/40">Total Sales (counter)</span>
                      <span className="text-sm font-bold text-white">{creator.totalSales ?? sales.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-white/40">Total Earnings (counter)</span>
                      <span className="text-sm font-bold text-brand-primary">₹{(creator.totalEarnings || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Payout Status */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                    <CreditCard size={16} className="text-brand-primary" /> Payout Status
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/40">Status</span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        creator.payoutStatus === 'paid' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        creator.payoutStatus === 'partial' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                        "bg-white/5 text-white/50 border border-white/10"
                      )}>
                        {creator.payoutStatus || 'pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/40">Commission Owed</span>
                      <span className="text-sm font-bold text-white">
                        ₹{(creator.payoutStatus === 'paid' ? 0 : totalCommission).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/40">Last Payout</span>
                      <span className="text-sm text-white/70">{creator.lastPayoutDate ? formatDate(creator.lastPayoutDate) : '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-white/40">Last Amount</span>
                      <span className="text-sm font-bold text-white">₹{(creator.lastPayoutAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      onClick={handleUpdatePayout}
                      disabled={isUpdatingPayout}
                      className={cn(
                        "w-full py-3 rounded-xl font-bold text-xs transition-all mt-2",
                        creator.payoutStatus === 'paid'
                          ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                          : "bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20"
                      )}
                    >
                      {isUpdatingPayout ? 'Updating...' : creator.payoutStatus === 'paid' ? 'Reset to Pending' : 'Mark as Paid'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Share Links */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                  <ExternalLink size={16} className="text-brand-primary" /> Share Links
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">Referral Link (?ref=)</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-white/70 bg-white/5 rounded-lg px-3 py-2 truncate">{referralLink}</code>
                      <button
                        onClick={() => copyToClipboard(referralLink, 'ref')}
                        className="p-2.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-all shrink-0"
                      >
                        {copiedRef ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">Creator Param (?creator=)</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-white/70 bg-white/5 rounded-lg px-3 py-2 truncate">{creatorParamLink}</code>
                      <button
                        onClick={() => copyToClipboard(creatorParamLink, 'creator')}
                        className="p-2.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-all shrink-0"
                      >
                        {copied === 'creator' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales History */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h4 className="text-md font-bold text-white mb-1 flex items-center gap-2">
                  <Receipt size={16} className="text-brand-primary" /> Sales History
                </h4>
                <p className="text-white/40 text-xs mb-6">{sales.length} total transactions</p>

                {sales.length === 0 ? (
                  <div className="text-center py-8 text-white/30 text-xs">No sales yet for this creator.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/5 text-white/40 text-[9px] font-bold uppercase tracking-wider">
                          <th className="text-left py-3 pr-4">Product</th>
                          <th className="text-left py-3 pr-4">Buyer</th>
                          <th className="text-right py-3 pr-4">Price</th>
                          <th className="text-right py-3 pr-4">Discount</th>
                          <th className="text-right py-3 pr-4">Commission</th>
                          <th className="text-right py-3 pr-4">Rate</th>
                          <th className="text-right py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.map((sale) => (
                          <tr key={sale.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 pr-4 font-bold text-white truncate max-w-[180px]">
                              {sale.productTitle || sale.productId}
                            </td>
                            <td className="py-3 pr-4 text-white/50 text-[10px]">
                              {sale.userId?.slice(0, 10)}...
                            </td>
                            <td className="py-3 pr-4 text-right font-bold text-white">₹{sale.productPrice}</td>
                            <td className="py-3 pr-4 text-right text-white/50">
                              {sale.discountApplied > 0 ? `₹${sale.discountApplied}` : '—'}
                            </td>
                            <td className="py-3 pr-4 text-right font-bold text-brand-primary">₹{sale.commission}</td>
                            <td className="py-3 pr-4 text-right text-white/50">{sale.commissionRate}%</td>
                            <td className="py-3 text-right text-white/40 text-[10px]">
                              {formatDate(sale.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
