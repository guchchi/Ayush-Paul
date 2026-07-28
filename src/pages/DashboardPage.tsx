import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  MessageSquare, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  Search, 
  MoreHorizontal,
  Mail,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Target,
  PenTool,
  LogOut,
  Calendar,
  Layout,
  Rocket,
  Globe,
  Sparkles
} from 'lucide-react';
import { 
  auth, db, signOut, onAuthStateChanged, 
  collection, query, orderBy, onSnapshot, limit, 
  updateDoc, doc, getDocs, where, getDoc,
  addDoc, serverTimestamp
} from '../firebase';
import { cn } from '../lib/utils';
import { Section } from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { VARIANTS } from '../lib/motion-presets';
import { WorkspaceEmptyState } from '../components/workspace/WorkspaceEmptyState';
import { WorkspaceLoadingState } from '../components/workspace/WorkspaceLoadingState';

// --- Types ---

interface Opportunity {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  status: 'New' | 'Replied' | 'Archived';
  timestamp: any;
}

interface Project {
  id: string;
  title: string;
  status: string;
  progress: number;
}

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Layout size={20} /> },
    { id: 'inbox', name: 'Inbox', icon: <Mail size={20} /> },
    { id: 'projects', name: 'Projects', icon: <Layers size={20} /> },
    { id: 'content', name: 'Content', icon: <PenTool size={20} /> },
    { id: 'metrics', name: 'Metrics', icon: <BarChart3 size={20} /> },
    { id: 'growth', name: 'Growth', icon: <TrendingUp size={20} /> },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-[#0A0A0A] border-r border-white/5 p-8 flex flex-col justify-between hidden lg:flex">
      <div className="space-y-12">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-black">
            <Rocket size={18} />
          </div>
          OS.1
        </div>

        <nav className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <button 
        onClick={() => signOut(auth)}
        className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};

const OpportunityInbox = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const q = query(collection(db, "contact_messages"), orderBy("timestamp", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOpportunities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity)));
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "contact_messages", id), { status });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight">Opportunity Inbox</h3>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
          {opportunities.length} Total Submissions
        </div>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 glass-card border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                  opp.status === 'Replied' ? "text-green-500 border-green-500/20 bg-green-500/5" :
                  opp.status === 'Archived' ? "text-white/20 border-white/10 bg-white/5" :
                  "text-brand-primary border-brand-primary/20 bg-brand-primary/5"
                )}>
                  {opp.status || 'New'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                  {opp.inquiryType}
                </span>
              </div>
              <h4 className="text-lg font-bold">{opp.name} <span className="text-white/20 font-medium text-sm ml-2">({opp.email})</span></h4>
              <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{opp.message}</p>
            </div>

            <div className="flex items-center gap-2">
               <button 
                onClick={() => updateStatus(opp.id, 'Replied')}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-green-500 hover:border-green-500/20 transition-all"
                title="Mark as Replied"
               >
                 <CheckCircle2 size={18} />
               </button>
               <button 
                onClick={() => updateStatus(opp.id, 'Archived')}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                title="Archive"
               >
                 <MoreHorizontal size={18} />
               </button>
               <a 
                href={`mailto:${opp.email}`}
                className="px-4 py-2 rounded-lg bg-brand-primary text-black text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
               >
                 Reply
               </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ExecutionPanel = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="p-8 glass-card border-white/5 space-y-6">
        <div className="flex items-center gap-3 text-brand-primary">
          <Target size={20} />
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Today's Focus</h4>
        </div>
        <div className="space-y-4">
          {["Finalize Ecosystem Marquee", "Audit Contact Form Logic", "Draft Weekly Momentum"].map((task, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center group-hover:border-brand-primary transition-all">
                 <div className="w-2 h-2 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <span className="text-sm text-white/60 font-medium">{task}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 glass-card border-brand-primary/10 bg-brand-primary/[0.02] space-y-6">
        <div className="flex items-center gap-3 text-white">
          <Zap size={20} className="text-brand-primary" />
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Weekly Mission</h4>
        </div>
        <p className="text-xl font-bold tracking-tight text-white/90">
          Scale the Founder Operating System to 100% production readiness.
        </p>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
           <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-brand-primary" />
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30">
          <span>65% Complete</span>
          <span>4 Days Left</span>
        </div>
      </div>

      <div className="p-8 glass-card border-white/5 space-y-6">
        <div className="flex items-center gap-3 text-brand-accent">
          <MessageSquare size={20} />
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Quick Notes</h4>
        </div>
        <textarea 
          placeholder="Jot down a fleeting thought..."
          className="w-full bg-transparent border-none outline-none text-sm text-white/60 resize-none h-32 leading-relaxed"
        />
      </div>
    </div>
  );
};

const AutomationHub = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ 
    title: '', 
    text: '', 
    statusTag: 'Building',
    isPublic: false 
  });

  const handleQuickPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await addDoc(collection(db, "updates"), {
        ...newUpdate,
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: serverTimestamp()
      });
      setNewUpdate({ title: '', text: '', statusTag: 'Building', isPublic: false });
      alert("Momentum Log Synchronized.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Deployment & GitHub Status */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 glass-card border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Deployment Status</h4>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-green-500">Live</span>
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white/40 font-mono text-[10px]">Δ</div>
                   <div className="text-xs font-bold">Vercel Production</div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Synced 4m ago</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-mono px-2">
                <span className="text-white/20">Last Deploy</span>
                <span className="text-brand-primary">2026-05-15 14:32</span>
             </div>
          </div>
        </div>

        <div className="p-6 glass-card border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">GitHub Activity</h4>
            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-primary">ACTIVE</span>
          </div>
          <div className="space-y-3 font-mono text-[11px]">
             {[
               { repo: "ayushpaul-os", msg: "feat: monetization-engine integration", time: "2h" },
               { repo: "ayushpaul-os", msg: "refactor: momentum-trust loops", time: "5h" },
               { repo: "startup-engine", msg: "fix: auth-provider-types", time: "1d" }
             ].map((commit, i) => (
               <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 group cursor-default">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary">#</span>
                    <span className="text-white/60 group-hover:text-white transition-colors truncate max-w-[120px]">{commit.msg}</span>
                  </div>
                  <span className="text-white/20">{commit.time}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Momentum Sync */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-8 glass-card border-brand-primary/20 bg-brand-primary/[0.02] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Zap size={120} />
          </div>
          
          <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-primary mb-8">Momentum Sync Engine</h4>
          
          <form onSubmit={handleQuickPublish} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Log Title (e.g. Dashboard OS V1)"
                value={newUpdate.title}
                onChange={e => setNewUpdate({...newUpdate, title: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-medium outline-none focus:border-brand-primary"
                required
              />
              <select 
                value={newUpdate.statusTag}
                onChange={e => setNewUpdate({...newUpdate, statusTag: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-brand-primary appearance-none"
              >
                <option value="Building">Building</option>
                <option value="Shipped">Shipped</option>
                <option value="Research">Research</option>
              </select>
            </div>
            <textarea 
              placeholder="System update details..."
              value={newUpdate.text}
              onChange={e => setNewUpdate({...newUpdate, text: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-medium outline-none focus:border-brand-primary h-32 resize-none"
              required
            />
            
            <div className="flex items-center justify-between gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-6 rounded-full transition-colors relative ${newUpdate.isPublic ? 'bg-brand-primary' : 'bg-white/10'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={newUpdate.isPublic}
                    onChange={e => setNewUpdate({...newUpdate, isPublic: e.target.checked})}
                  />
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${newUpdate.isPublic ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Make Public (Momentum Feed)</span>
              </label>

              <button 
                type="submit" 
                disabled={isSyncing}
                className="px-8 py-4 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-2xl flex items-center gap-2"
              >
                {isSyncing ? "Syncing..." : "Sync to Momentum Board"} <ChevronRight size={14} />
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { name: "New Update", icon: <Zap size={18} />, action: () => {} },
             { name: "Publish Blog", icon: <PenTool size={18} />, action: () => navigate('/admin') },
             { name: "Add Project", icon: <Plus size={18} />, action: () => navigate('/admin') },
             { name: "Global Sync", icon: <Globe size={18} />, action: () => alert("Global Ecosystem Synchronized.") }
           ].map((action, i) => (
             <button 
              key={i}
              onClick={action.action}
              className="p-6 glass-card border-white/5 hover:border-brand-primary/30 transition-all flex flex-col items-center gap-4 group"
             >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                   {action.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white">{action.name}</span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

const FounderIntelligence = () => {
  const intelligenceModules = [
    {
      title: "Opportunity Intelligence",
      icon: <Target className="text-brand-primary" size={18} />,
      data: [
        { label: "Priority Conversations", value: "3", sub: "High Strategic Alignment" },
        { label: "Recent High-Engagement", value: "2", sub: "Repeat Profile Views" },
        { label: "Avg. Response Urgency", value: "High", sub: "Inquiry Spike detected" }
      ]
    },
    {
      title: "Build Intelligence",
      icon: <Rocket className="text-brand-accent" size={18} />,
      data: [
        { label: "Views vs Inquiries", value: "4.2%", sub: "Above Industry Avg (3%)" },
        { label: "Impactful Project", value: "Ecosystem", sub: "Driving 45% of traffic" },
        { label: "Momentum Trend", value: "+15%", sub: "Shipping velocity increasing" }
      ]
    },
    {
      title: "Visibility Intelligence",
      icon: <Globe className="text-brand-secondary" size={18} />,
      data: [
        { label: "Top Source", value: "LinkedIn", sub: "Direct + Referral" },
        { label: "Content Reach", value: "12k+", sub: "Last 7 days cumulative" },
        { label: "Consistency", value: "92%", sub: "4 Updates / Week avg" }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Weekly Report Header */}
      <div className="p-10 glass-card border-brand-primary/20 bg-brand-primary/[0.03] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-brand-primary/10">
          <TrendingUp size={160} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded-full bg-brand-primary text-black text-[10px] font-bold uppercase tracking-widest">Weekly Report</div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">May 01 - May 07</span>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
             {[
               { l: "Ships", v: "04" },
               { l: "Visitors", v: "1,240" },
               { l: "Opportunities", v: "12" },
               { l: "Growth Signal", v: "STRONG" }
             ].map((stat, i) => (
               <div key={i} className="space-y-1">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">{stat.l}</div>
                 <div className="text-3xl font-bold tracking-tighter text-white">{stat.v}</div>
               </div>
             ))}
          </div>
          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-brand-primary" />
                <p className="text-sm font-bold text-white/60">
                   <span className="text-white">Recommended Focus:</span> Double down on "AI Automation" content to capture rising interest.
                </p>
             </div>
             <button className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-white transition-colors flex items-center gap-2">
                Download Analysis <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {intelligenceModules.map((module, i) => (
          <div key={i} className="p-8 glass-card border-white/5 space-y-8">
            <div className="flex items-center gap-3">
              {module.icon}
              <h4 className="text-xs font-bold uppercase tracking-[0.2em]">{module.title}</h4>
            </div>
            <div className="space-y-6">
               {module.data.map((item, j) => (
                 <div key={j} className="space-y-1 group">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">{item.label}</div>
                    <div className="flex items-end justify-between">
                       <div className="text-2xl font-bold tracking-tighter text-white/90">{item.value}</div>
                       <div className="text-[9px] font-medium text-white/30 italic">{item.sub}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricsGrid = () => {
  const metrics = [
    { label: "Daily Visitors", value: "1,284", change: "+12%", icon: <TrendingUp size={16} /> },
    { label: "Contact Conversion", value: "4.8%", change: "+2%", icon: <TrendingUp size={16} /> },
    { label: "Avg. Ship Speed", value: "6.2 Days", change: "-0.5d", icon: <Clock size={16} /> },
    { label: "Ecosystem Health", value: "99.9%", change: "Stable", icon: <CheckCircle2 size={16} /> }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m, i) => (
        <div key={i} className="p-6 glass-card border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{m.label}</span>
            <div className="text-brand-primary">{m.icon}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tighter">{m.value}</div>
            <div className={cn(
              "text-[9px] font-bold px-2 py-0.5 rounded",
              m.change.startsWith('+') ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/40"
            )}>
              {m.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const GrowthMetrics = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        // Parallel fetch for speed
        const [purchaseSnap, analyticsSnap, productSnap] = await Promise.all([
          getDocs(query(collection(db, "purchases"), orderBy("createdAt", "desc"), limit(100))),
          getDocs(query(collection(db, "analytics_events"), orderBy("timestamp", "desc"), limit(500))),
          getDocs(query(collection(db, "products")))
        ]);

        setPurchases(purchaseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setAnalytics(analyticsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setProducts(productSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching growth data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrowthData();
  }, []);

  const totalRevenue = purchases.reduce((acc, curr) => acc + (curr.amountTotal || 0), 0) / 100;
  
  // Calculate Funnel
  const productViews = analytics.filter(e => e.eventName === 'product_view').length;
  const checkoutStarts = analytics.filter(e => e.eventName === 'checkout_start').length;
  const purchaseSuccess = purchases.length;

  const checkoutRate = productViews > 0 ? ((checkoutStarts / productViews) * 100).toFixed(1) : 0;
  const purchaseRate = checkoutStarts > 0 ? ((purchaseSuccess / checkoutStarts) * 100).toFixed(1) : 0;
  const overallConversion = productViews > 0 ? ((purchaseSuccess / productViews) * 100).toFixed(1) : 0;

  // Product Performance Data
  const productPerformance = products.map(p => {
    const pPurchases = purchases.filter(pur => pur.productId === p.id);
    const pRevenue = pPurchases.reduce((acc, curr) => acc + (curr.amountTotal || 0), 0) / 100;
    return {
      id: p.id,
      title: p.title,
      sales: pPurchases.length,
      revenue: pRevenue,
      slug: p.slug
    };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
            <TrendingUp size={24} className="text-brand-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Revenue Intelligence</h2>
            <p className="text-white/40">Real-time performance and conversion monitoring.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <Calendar size={14} className="text-white/20" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Last 30 Days</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 glass-card border border-white/5 space-y-4 group hover:border-brand-primary/20 transition-colors">
          <div className="flex items-center gap-3 text-white/40 mb-2">
            <Target size={20} />
            <h4 className="text-xs font-bold uppercase tracking-widest">Gross Revenue</h4>
          </div>
          <p className="text-4xl font-bold text-white tracking-tighter">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRevenue)}
          </p>
          <div className="text-xs text-green-500 font-bold tracking-widest uppercase flex items-center gap-1 mt-2">
            <TrendingUp size={12} /> +18.4% from last period
          </div>
        </div>

        <div className="p-8 glass-card border border-white/5 space-y-4 group hover:border-brand-primary/20 transition-colors">
          <div className="flex items-center gap-3 text-white/40 mb-2">
            <Layers size={20} />
            <h4 className="text-xs font-bold uppercase tracking-widest">Conversion Rate</h4>
          </div>
          <p className="text-4xl font-bold text-white tracking-tighter">
            {overallConversion}%
          </p>
          <div className="text-xs text-brand-primary font-bold tracking-widest uppercase flex items-center gap-1 mt-2">
            <Zap size={12} /> Benchmarked at Top 5%
          </div>
        </div>

        <div className="p-8 glass-card border border-brand-primary/10 bg-brand-primary/[0.02] space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Rocket size={80} className="text-brand-primary" />
          </div>
          <div className="flex items-center gap-3 text-brand-primary/60 mb-2">
            <BarChart3 size={20} />
            <h4 className="text-xs font-bold uppercase tracking-widest">Active Customers</h4>
          </div>
          <p className="text-4xl font-bold text-white tracking-tighter relative z-10">
            {purchases.length}
          </p>
          <div className="text-xs text-white/40 font-bold tracking-widest uppercase mt-2 relative z-10">
            Across {products.length} Products
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Conversion Funnel */}
        <div className="p-8 glass-card border border-white/5 space-y-8">
          <h3 className="text-lg font-bold flex items-center gap-2"><BarChart3 size={18} className="text-brand-primary"/> Conversion Funnel</h3>
          
          <div className="space-y-12">
            {/* Views */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Product Views</div>
                  <div className="text-2xl font-bold">{productViews.toLocaleString()}</div>
                </div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Baseline</div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-white/20" />
              </div>
            </div>

            {/* Checkouts */}
            <div className="space-y-4 relative">
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                  <ArrowRight size={10} className="rotate-90" /> {checkoutRate}% Drop-off
               </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Checkout Initiated</div>
                  <div className="text-2xl font-bold">{checkoutStarts.toLocaleString()}</div>
                </div>
                <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{checkoutRate}% Rate</div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${checkoutRate}%` }} className="h-full bg-brand-primary/40" />
              </div>
            </div>

            {/* Purchases */}
            <div className="space-y-4 relative">
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                  <ArrowRight size={10} className="rotate-90" /> {purchaseRate}% Final Conversion
               </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Successful Sales</div>
                  <div className="text-2xl font-bold">{purchaseSuccess.toLocaleString()}</div>
                </div>
                <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{overallConversion}% Total</div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${overallConversion}%` }} className="h-full bg-green-500/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Performance */}
        <div className="p-8 glass-card border border-white/5 space-y-8">
          <h3 className="text-lg font-bold flex items-center gap-2"><Layers size={18} className="text-brand-accent"/> Product Performance</h3>
          
          <div className="space-y-4">
            {productPerformance.slice(0, 5).map((p, i) => (
              <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-brand-accent/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/20">
                    0{i+1}
                  </div>
                  <div>
                    <div className="text-sm font-bold truncate max-w-[150px]">{p.title}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">{p.sales} Sales</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-brand-accent">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.revenue)}
                  </div>
                  <div className="text-[10px] text-green-500 font-bold uppercase">Top Performer</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-primary"/> Recent Transactions</h3>
        {loading ? (
           <div className="p-12 text-center text-white/20 font-bold uppercase tracking-widest animate-pulse">Synchronizing Ledger...</div>
        ) : (
          <div className="space-y-4">
            {purchases.length === 0 ? (
              <div className="p-12 rounded-[2rem] border border-dashed border-white/10 text-center text-white/20">
                Waiting for first acquisition signal...
              </div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="p-6 glass-card border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10">
                      <Rocket size={20} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-white/90 group-hover:text-white transition-colors">{p.productId}</p>
                      <p className="text-xs text-white/30 font-medium">{new Date(p.createdAt?.toDate?.() || Date.now()).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 justify-between sm:justify-end">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Method</p>
                      <p className="text-xs text-white/60 font-mono">Stripe_WebHook</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500 text-lg">
                        +{new Intl.NumberFormat('en-IN', { style: 'currency', currency: p.currency?.toUpperCase() || 'INR' }).format(p.amountTotal / 100)}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[9px] uppercase font-bold tracking-widest text-green-500/60">{p.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Page ---

export const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Role check
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists() && userDoc.data().role === 'founder') {
          setUser(u);
        } else {
          // If logged in but not founder, redirect to customer lab or home
          navigate('/vault');
        }
      } else {
        navigate('/admin'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <WorkspaceLoadingState fullScreen message="Loading Dashboard..." />;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="lg:ml-64 p-8 md:p-12 space-y-12 pb-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tighter">Founder Dashboard</h2>
            <p className="text-white/40 font-medium">Command center for your digital ecosystem.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-white/10 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="avatar" />
                  </div>
                ))}
             </div>
             <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">3 Active Sprints</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-white/20">Synced 2m ago</div>
             </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <motion.div variants={VARIANTS.fadeUp} initial="initial" animate="animate" className="space-y-12">
            <AutomationHub />
            <FounderIntelligence />
            <ExecutionPanel />
            <MetricsGrid />
            <div className="grid lg:grid-cols-2 gap-12">
               <OpportunityInbox />
               <div className="space-y-6">
                  <h3 className="text-2xl font-bold tracking-tight">Active Sprints</h3>
                  <div className="space-y-4">
                     {[
                       { title: "Dashboard OS Expansion", status: "Building", progress: 85 },
                       { title: "AI Content Pipeline", status: "Planning", progress: 20 },
                       { title: "Mobile UI Audit", status: "Building", progress: 45 }
                     ].map((s, i) => (
                       <div key={i} className="p-6 glass-card border-white/5 space-y-4">
                          <div className="flex justify-between items-center">
                             <h4 className="text-lg font-bold">{s.title}</h4>
                             <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                               {s.status}
                             </span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} className="h-full bg-white/20" />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inbox' && <OpportunityInbox />}
        
        {activeTab === 'projects' && (
           <WorkspaceEmptyState
             icon={<Layers size={24} />}
             title="Project Command Center"
             description="Manage all active development initiatives from one place."
             primaryAction={{
               label: "Create First Project",
               onClick: () => {}
             }}
           />
        )}

        {activeTab === 'content' && (
           <WorkspaceEmptyState
             icon={<PenTool size={24} />}
             title="Content Engine Module"
             description="Automate and distribute content seamlessly across channels."
             primaryAction={{
               label: "Draft New Content",
               onClick: () => {}
             }}
           />
        )}

        { activeTab === 'metrics' && (
           <WorkspaceEmptyState
             icon={<BarChart3 size={24} />}
             title="Advanced Metrics"
             description="Deep insights into your digital ecosystem's performance."
             primaryAction={{
               label: "Connect Data Sources",
               onClick: () => {}
             }}
           />
        )}

        { activeTab === 'growth' && <GrowthMetrics /> }
      </main>

      {/* Mobile Nav Overlay */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 z-[100]">
        {['overview', 'inbox', 'projects'].map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              activeTab === t ? "bg-brand-primary text-black" : "text-white/40 hover:text-white"
            )}
          >
            {t === 'overview' ? <Layout size={20} /> : t === 'inbox' ? <Mail size={20} /> : <Layers size={20} />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
