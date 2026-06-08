import React from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
} from "lucide-react";
import { cn } from "../../../lib/utils";

interface Purchase {
  id?: string;
  userId?: string;
  productId?: string;
  productTitle?: string;
  amountTotal?: number;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: any;
  creatorCode?: string;
  couponCode?: string;
}

interface CreatorCode {
  id?: string;
  code: string;
  creatorName?: string;
  commissionRate?: number;
  totalSales?: number;
  totalEarnings?: number;
}

interface Props {
  purchases: Purchase[];
  creatorCodes: CreatorCode[];
}

export const PurchaseAnalyticsDashboard: React.FC<Props> = ({ purchases, creatorCodes }) => {
  const completedPurchases = purchases.filter(p => p.status === 'completed' || p.status === 'paid');
  const totalRevenue = completedPurchases.reduce((sum, p) => sum + ((p.amountTotal || p.amount || 0) / 100), 0);
  const totalOrders = completedPurchases.length;

  // Per-product aggregation
  const productMap = new Map<string, { title: string; revenue: number; orders: number }>();
  completedPurchases.forEach((p) => {
    const key = p.productId || p.productTitle || 'unknown';
    const existing = productMap.get(key) || { title: p.productTitle || key, revenue: 0, orders: 0 };
    existing.revenue += (p.amountTotal || p.amount || 0) / 100;
    existing.orders += 1;
    productMap.set(key, existing);
  });

  // Per-creator aggregation
  const creatorMap = new Map<string, { name: string; revenue: number; orders: number; commission: number }>();
  completedPurchases.forEach((p) => {
    if (!p.creatorCode) return;
    const existing = creatorMap.get(p.creatorCode) || {
      name: p.creatorCode,
      revenue: 0,
      orders: 0,
      commission: 0,
    };
    const amount = (p.amountTotal || p.amount || 0) / 100;
    existing.revenue += amount;
    existing.orders += 1;
    const creator = creatorCodes.find(c => c.code === p.creatorCode);
    if (creator?.commissionRate) {
      existing.commission += amount * (creator.commissionRate / 100);
    }
    creatorMap.set(p.creatorCode, existing);
  });

  // Coupon usage
  const couponOrders = completedPurchases.filter(p => p.couponCode);
  const couponRevenue = couponOrders.reduce((sum, p) => sum + ((p.amountTotal || p.amount || 0) / 100), 0);

  // Conversion (placeholder — would need visitor data)
  const conversionRate = purchases.length > 0
    ? ((completedPurchases.length / purchases.length) * 100).toFixed(1)
    : '0';

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Purchase Analytics Dashboard</h3>
            <p className="text-white/40 text-xs">Revenue breakdown by product, creator, and conversion metrics.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
              <DollarSign size={12} /> Total Revenue
            </div>
            <div className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
              <ShoppingCart size={12} /> Total Orders
            </div>
            <div className="text-2xl font-bold text-white">{totalOrders}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
              <TrendingUp size={12} /> Avg Order Value
            </div>
            <div className="text-2xl font-bold text-brand-primary">₹{avgOrderValue.toFixed(0)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
              <Percent size={12} /> Conversion Rate
            </div>
            <div className="text-2xl font-bold text-white">{conversionRate}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
              <Package size={12} /> Coupon Orders
            </div>
            <div className="text-2xl font-bold text-white">{couponOrders.length}</div>
            <div className="text-[10px] text-white/30 mt-1">₹{couponRevenue.toFixed(0)} revenue</div>
          </div>
        </div>
      </div>

      {/* Revenue by Product */}
      <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8">
        <h4 className="text-md font-bold text-white mb-1 flex items-center gap-2">
          <Package size={16} className="text-brand-primary" /> Revenue by Product
        </h4>
        <p className="text-white/40 text-xs mb-6">Breakdown of revenue and orders per product.</p>

        {productMap.size === 0 ? (
          <div className="text-center py-8 text-white/30 text-xs">No product data available yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-[9px] font-bold uppercase tracking-wider">
                  <th className="text-left py-3 pr-4">Product</th>
                  <th className="text-right py-3 pr-4">Orders</th>
                  <th className="text-right py-3 pr-4">Revenue</th>
                  <th className="text-right py-3">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(productMap.entries())
                  .sort((a, b) => b[1].revenue - a[1].revenue)
                  .map(([id, data]) => (
                    <tr key={id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4 font-bold text-white">{data.title}</td>
                      <td className="py-3 pr-4 text-right text-white/70">{data.orders}</td>
                      <td className="py-3 pr-4 text-right font-bold text-brand-primary">₹{data.revenue.toFixed(0)}</td>
                      <td className="py-3 text-right text-white/50">
                        {totalRevenue > 0 ? ((data.revenue / totalRevenue) * 100).toFixed(1) : '0'}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revenue by Creator */}
      <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8">
        <h4 className="text-md font-bold text-white mb-1 flex items-center gap-2">
          <UserCheck size={16} className="text-brand-primary" /> Revenue by Creator
        </h4>
        <p className="text-white/40 text-xs mb-6">Creator-driven sales and commission breakdown.</p>

        {creatorMap.size === 0 ? (
          <div className="text-center py-8 text-white/30 text-xs">No creator-driven sales yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-[9px] font-bold uppercase tracking-wider">
                  <th className="text-left py-3 pr-4">Creator</th>
                  <th className="text-right py-3 pr-4">Orders</th>
                  <th className="text-right py-3 pr-4">Revenue</th>
                  <th className="text-right py-3">Commission</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(creatorMap.entries())
                  .sort((a, b) => b[1].revenue - a[1].revenue)
                  .map(([code, data]) => (
                    <tr key={code} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-bold text-white">{data.name}</span>
                        <span className="ml-2 text-[9px] text-white/30">{code}</span>
                      </td>
                      <td className="py-3 pr-4 text-right text-white/70">{data.orders}</td>
                      <td className="py-3 pr-4 text-right font-bold text-brand-primary">₹{data.revenue.toFixed(0)}</td>
                      <td className="py-3 text-right font-bold text-green-400">₹{data.commission.toFixed(0)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8">
        <h4 className="text-md font-bold text-white mb-1 flex items-center gap-2">
          <ShoppingCart size={16} className="text-brand-primary" /> Recent Orders
        </h4>
        <p className="text-white/40 text-xs mb-6">Last 20 completed transactions.</p>

        {completedPurchases.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-xs">No completed purchases yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-[9px] font-bold uppercase tracking-wider">
                  <th className="text-left py-3 pr-4">Product</th>
                  <th className="text-left py-3 pr-4">Amount</th>
                  <th className="text-left py-3 pr-4">Creator</th>
                  <th className="text-left py-3 pr-4">Coupon</th>
                  <th className="text-left py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {completedPurchases.slice(0, 20).map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-bold text-white">{p.productTitle || p.productId || 'Unknown Product'}</span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-brand-primary">
                      ₹{((p.amountTotal || p.amount || 0) / 100).toFixed(0)}
                    </td>
                    <td className="py-3 pr-4 text-white/50">{p.creatorCode || '—'}</td>
                    <td className="py-3 pr-4 text-white/50">{p.couponCode || '—'}</td>
                    <td className="py-3 text-white/40 text-[10px]">
                      {p.createdAt?.toDate?.()?.toLocaleDateString() || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
