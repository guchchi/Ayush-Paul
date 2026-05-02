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
  Rocket
} from 'lucide-react';
import { 
  auth, db, signOut, onAuthStateChanged, 
  collection, query, orderBy, onSnapshot, limit, 
  updateDoc, doc, getDocs, where
} from '../firebase';
import { cn } from '../lib/utils';
import { Section } from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: '', text: '', statusTag: 'Building' });

  const handleQuickPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await addDoc(collection(db, "updates"), {
        ...newUpdate,
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: serverTimestamp()
      });
      setNewUpdate({ title: '', text: '', statusTag: 'Building' });
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
                <span className="text-brand-primary">2026-05-02 14:32</span>
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
               { repo: "ayushpaul-os", msg: "feat: ecosystem-marquee integration", time: "2h" },
               { repo: "ayushpaul-os", msg: "refactor: momentum-board logic", time: "5h" },
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
            <button 
              type="submit" 
              disabled={isSyncing}
              className="px-8 py-4 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-2xl flex items-center gap-2"
            >
              {isSyncing ? "Syncing..." : "Sync to Momentum Board"} <ChevronRight size={14} />
            </button>
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

// --- Main Page ---

export const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        navigate('/admin'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
           <div className="h-96 flex items-center justify-center text-white/20 font-bold uppercase tracking-widest">
              Project Command Center Coming Soon
           </div>
        )}

        {activeTab === 'content' && (
           <div className="h-96 flex items-center justify-center text-white/20 font-bold uppercase tracking-widest">
              Content Engine Module Coming Soon
           </div>
        )}

        {activeTab === 'metrics' && (
           <div className="h-96 flex items-center justify-center text-white/20 font-bold uppercase tracking-widest">
              Advanced Growth Metrics Coming Soon
           </div>
        )}
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
