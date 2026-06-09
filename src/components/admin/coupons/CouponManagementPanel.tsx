import React, { useState } from "react";
import {
  Tag,
  Plus,
  Power,
  PowerOff,
  Trash2,
  Copy,
  CheckCircle2,
  Percent,
  DollarSign,
  Users,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  db,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "../../../firebase";
import { cn } from "../../../lib/utils";
import { handleFirestoreError } from "../../../lib/firebase-utils";
import { OperationType } from "../../../types";
import { AdminStatCard } from "../analytics/AdminStatCard";

interface CouponData {
  id?: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  assignedToCreator?: string;
  usageLimit: number;
  usedCount: number;
  expiresAt?: any;
  minPurchaseAmount: number;
  createdBy?: string;
  createdAt?: any;
}

interface Props {
  coupons: CouponData[];
  onRefresh: () => void;
  addToast: (message: string, type?: "info" | "success" | "warning" | "error") => void;
}

export const CouponManagementPanel: React.FC<Props> = ({ coupons, onRefresh, addToast }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    active: true,
    assignedToCreator: '',
    usageLimit: 0,
    expiresAt: '',
    minPurchaseAmount: 0,
  });

  const activeCoupons = coupons.filter((c) => c.active);
  const totalUsage = coupons.reduce((s, c) => s + (c.usedCount || 0), 0);
  const assignedCoupons = coupons.filter((c) => c.assignedToCreator);

  const handleToggleActive = async (coupon: CouponData) => {
    if (!coupon.id) return;
    try {
      await updateDoc(doc(db, 'coupons', coupon.id), { active: !coupon.active });
      addToast(`Coupon ${coupon.code} ${coupon.active ? 'deactivated' : 'activated'}`, "success");
      onRefresh();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'coupons');
      addToast("Failed to toggle coupon", "error");
    }
  };

  const handleDelete = async (coupon: CouponData) => {
    if (!coupon.id) return;
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    try {
      await deleteDoc(doc(db, 'coupons', coupon.id));
      addToast(`Coupon ${coupon.code} deleted`, "success");
      onRefresh();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'coupons');
      addToast("Failed to delete coupon", "error");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast("Code copied to clipboard", "success");
  };

  const handleCreate = async () => {
    if (!form.code.trim()) {
      addToast("Coupon code is required", "error");
      return;
    }

    const normalizedCode = form.code.trim().toUpperCase();

    try {
      const payload: Record<string, any> = {
        code: normalizedCode,
        description: form.description,
        discountType: form.discountType,
        value: Number(form.value),
        active: form.active,
        assignedToCreator: form.assignedToCreator.trim().toUpperCase() || '',
        usageLimit: Number(form.usageLimit),
        usedCount: 0,
        minPurchaseAmount: Number(form.minPurchaseAmount),
        createdBy: 'admin',
        createdAt: serverTimestamp(),
      };

      if (form.expiresAt) {
        payload.expiresAt = new Date(form.expiresAt);
      }

      await addDoc(collection(db, 'coupons'), payload);
      addToast(`Coupon ${normalizedCode} created`, "success");
      setIsCreating(false);
      setForm({
        code: '', description: '', discountType: 'percentage', value: 10,
        active: true, assignedToCreator: '', usageLimit: 0,
        expiresAt: '', minPurchaseAmount: 0,
      });
      onRefresh();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'coupons');
      addToast("Failed to create coupon", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Tag size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Coupon Management</h3>
            <p className="text-white/40 text-xs">Create, activate, deactivate, and assign coupons to creators.</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard label="Total Coupons" value={coupons.length} icon={<Tag size={18} />} />
          <AdminStatCard label="Active Coupons" value={activeCoupons.length} icon={<CheckCircle2 size={18} />} />
          <AdminStatCard label="Total Uses" value={totalUsage} icon={<Percent size={18} />} />
          <AdminStatCard label="Creator-Assigned" value={assignedCoupons.length} icon={<Users size={18} />} />
        </div>
      </div>

      {/* Create Coupon */}
      <div className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden">
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              isCreating ? "bg-brand-primary/20 text-brand-primary" : "bg-white/5 text-white/30"
            )}>
              <Plus size={18} />
            </div>
            <span className="font-bold text-white">Create New Coupon</span>
          </div>
          <span className={cn(
            "text-xs font-bold transition-all",
            isCreating ? "text-brand-primary" : "text-white/30"
          )}>
            {isCreating ? 'Close' : 'Expand'}
          </span>
        </button>

        {isCreating && (
          <div className="px-6 pb-8 border-t border-white/5 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Coupon Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2024"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50 placeholder-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What's this coupon for?"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50 placeholder-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Discount Value *</label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  min={0}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Assigned to Creator Code</label>
                <input
                  type="text"
                  value={form.assignedToCreator}
                  onChange={(e) => setForm({ ...form, assignedToCreator: e.target.value })}
                  placeholder="CREATOR2024 (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50 placeholder-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Usage Limit (0 = unlimited)</label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                  min={0}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Min Purchase Amount (₹)</label>
                <input
                  type="number"
                  value={form.minPurchaseAmount}
                  onChange={(e) => setForm({ ...form, minPurchaseAmount: Number(e.target.value) })}
                  min={0}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                className="px-6 py-3 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-primary/90 transition-all"
              >
                Create Coupon
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-3 rounded-xl bg-white/5 text-white/40 font-bold text-xs hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Coupon List */}
      {coupons.length === 0 ? (
        <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-16 text-center">
          <Tag className="mx-auto mb-4 text-white/20" size={48} />
          <h4 className="text-lg font-bold text-white mb-1">No Coupons Yet</h4>
          <p className="text-white/40 text-xs">Create your first coupon above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {coupons.map((coupon) => {
            const expiresDate = coupon.expiresAt?.toDate?.() || (coupon.expiresAt ? new Date(coupon.expiresAt) : null);
            const isExpired = expiresDate && expiresDate < new Date();
            const isExhausted = coupon.usageLimit > 0 && (coupon.usedCount || 0) >= coupon.usageLimit;

            return (
              <div
                key={coupon.id}
                className={cn(
                  "bg-white/5 rounded-[2rem] border p-6 group hover:border-brand-primary/20 transition-all",
                  coupon.active ? "border-white/10" : "border-red-500/10"
                )}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold",
                      coupon.active ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "bg-white/5 text-white/20 border border-white/10"
                    )}>
                      {coupon.discountType === 'percentage' ? '%' : '₹'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white">{coupon.code}</h4>
                        <button onClick={() => handleCopyCode(coupon.code)} className="p-1 rounded-md hover:bg-white/10 text-white/30 hover:text-white transition-all">
                          <Copy size={12} />
                        </button>
                        {(isExpired || isExhausted) && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-bold uppercase tracking-wider">
                            {isExpired ? 'Expired' : 'Exhausted'}
                          </span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">
                        {coupon.description || (coupon.discountType === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value} off`)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-brand-primary">
                        {coupon.discountType === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      </div>
                      <div className="text-[10px] text-white/40">
                        Used {coupon.usedCount || 0}{coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {coupon.assignedToCreator && (
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Users size={10} /> {coupon.assignedToCreator}
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={cn(
                          "p-2.5 rounded-xl border transition-all",
                          coupon.active
                            ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                            : "bg-white/5 border-white/10 text-white/20 hover:text-white"
                        )}
                      >
                        {coupon.active ? <PowerOff size={14} /> : <Power size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {expiresDate && (
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-white/30">
                    <Calendar size={10} />
                    {coupon.active ? 'Expires' : 'Expired'}: {expiresDate.toLocaleDateString()}
                    {coupon.minPurchaseAmount > 0 && (
                      <span className="ml-3">Min purchase: ₹{coupon.minPurchaseAmount}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
