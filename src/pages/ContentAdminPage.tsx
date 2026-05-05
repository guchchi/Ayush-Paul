import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ArrowLeft, 
  Rocket, 
  LogIn, 
  AlertCircle,
  Clock,
  Layout,
  CheckCircle2,
  Shield,
  Search,
  Trash2,
  Mail,
  MessageSquare,
  FileText,
  Layers,
  Zap,
  BarChart3,
  History,
  Eye,
  Calendar,
  Edit,
  X,
  Type,
  List,
  Quote,
  Sparkles,
  Monitor,
  GripVertical,
  Upload,
  ImageIcon,
  Save as SaveIcon,
  Plus as PlusIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  googleProvider, 
  db, 
  getFirebaseStatus 
} from '../firebase';
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  getRedirectResult,
  signInWithRedirect
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { useSEO } from '../hooks/useSEO';
import { cn } from '../lib/utils';
import { FirebaseConfigWarning } from '../components/FirebaseConfigWarning';

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { uploadImage } from '../lib/storage-utils';

interface Milestone {
  id: string;
  year: string;
  title: string;
  desc: string;
  image?: string;
  imagePath?: string;
}

const SortableMilestone = ({ milestone, onUpdate, onDelete }: { 
  milestone: Milestone, 
  onUpdate: (id: string, field: string, value: any) => void,
  onDelete: (id: string) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: milestone.id });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { url, fullPath } = await uploadImage(file, 'milestones', (p) => setUploadProgress(p));
      onUpdate(milestone.id, 'image', url);
      onUpdate(milestone.id, 'imagePath', fullPath);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "glass-card p-6 rounded-3xl border border-white/10 flex items-start gap-4 transition-all duration-300",
        isDragging ? "opacity-50 scale-[0.98] border-brand-primary" : "hover:border-white/20"
      )}
    >
      <button 
        {...attributes} 
        {...listeners}
        className="p-3 mt-1 rounded-xl bg-white/5 text-white/20 hover:text-white cursor-grab active:cursor-grabbing transition-colors shrink-0"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1 grid md:grid-cols-[160px_1fr] gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">Artifact Image</label>
            <div className="relative aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 overflow-hidden group/image flex flex-col items-center justify-center">
              {milestone.image ? (
                <>
                  <img src={milestone.image} alt="Milestone" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="p-2 rounded-lg bg-white text-black cursor-pointer hover:scale-110 transition-transform">
                      <Upload size={14} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <button 
                      onClick={() => onUpdate(milestone.id, 'image', '')}
                      className="p-2 rounded-lg bg-red-500 text-white hover:scale-110 transition-transform"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer text-white/20 hover:text-white transition-colors">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[8px] font-bold">{Math.round(uploadProgress)}%</span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={24} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Upload Image</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                </label>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">Year</label>
            <input 
              type="text" 
              value={milestone.year}
              onChange={(e) => onUpdate(milestone.id, 'year', e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-sm font-bold"
              placeholder="2024"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">Event Title</label>
            <input 
              type="text" 
              value={milestone.title}
              onChange={(e) => onUpdate(milestone.id, 'title', e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-sm font-bold"
              placeholder="Won National Hackathon..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">Context / Impact</label>
            <textarea 
              value={milestone.desc}
              onChange={(e) => onUpdate(milestone.id, 'desc', e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-sm h-32 resize-none leading-relaxed"
              placeholder="Describe the achievement..."
            />
          </div>
        </div>
      </div>

      <button 
        onClick={() => onDelete(milestone.id)}
        className="p-3 mt-1 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

const MilestonesEditor = ({ items, onChange }: { items: Milestone[], onChange: (items: Milestone[]) => void }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDelete = (id: string) => {
    if (confirm("Permanently delete this milestone?")) {
      onChange(items.filter(item => item.id !== id));
    }
  };

  const handleAdd = () => {
    const newItem: Milestone = {
      id: Date.now().toString(),
      year: new Date().getFullYear().toString(),
      title: "",
      desc: ""
    };
    onChange([...items, newItem]);
  };

  return (
    <div className="space-y-8">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {items.map((item) => (
              <SortableMilestone 
                key={item.id} 
                milestone={item} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button 
        onClick={handleAdd}
        className="w-full py-6 rounded-[32px] border-2 border-dashed border-white/5 bg-white/5 text-white/20 hover:text-white hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <PlusIcon className="group-hover:scale-110 transition-transform" size={32} />
        <span className="font-bold text-sm uppercase tracking-widest">Append New Milestone Artifact</span>
      </button>
    </div>
  );
};

const ContentManager = ({ docs, onSave }: { docs: Record<string, any>, onSave: (id: string, data: any) => void }) => {
  const [selectedDoc, setSelectedDoc] = useState<string>("homepage");
  const [localData, setLocalData] = useState<any>(null);

  useEffect(() => {
    if (docs[selectedDoc]) {
      setLocalData(JSON.parse(JSON.stringify(docs[selectedDoc])));
    } else {
      const templates: Record<string, any> = {
        homepage: { hero: { headline: "I Design & Engineer Digital Experiences That Feel Alive.", subheadline: "I build production-ready systems combining engineering, design, and AI automation." }, stats: [] },
        about: { headline: "", bio: "", skills: [] },
        milestones: { items: [] },
        experience: { phases: [] }
      };
      setLocalData(templates[selectedDoc] || {});
    }
  }, [selectedDoc, docs]);

  if (!localData) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Synchronizing Artifacts...</p>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-12">
      <div className="space-y-4">
        {["homepage", "about", "milestones", "experience"].map(id => (
          <button
            key={id}
            onClick={() => setSelectedDoc(id)}
            className={cn(
              "w-full px-8 py-5 rounded-2xl font-bold text-left transition-all flex items-center justify-between group",
              selectedDoc === id ? "bg-white text-black shadow-lg shadow-white/5" : "bg-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            <span className="capitalize">{id}</span>
            {selectedDoc === id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
          </button>
        ))}
      </div>

      <div className="glass-card p-12 rounded-[40px] border border-white/10 space-y-12">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-bold capitalize mb-2">{selectedDoc} Editor</h3>
            <p className="text-white/40 text-sm">Modify the narrative structure of your {selectedDoc} section.</p>
          </div>
          <div className="flex gap-4">
            {Object.keys(docs).length === 0 && (
              <button
                onClick={async () => {
                  const schema = {
                    milestones: { items: [] },
                    about: { headline: "", bio: "", skills: [] },
                    experience: { phases: [] },
                    homepage: { hero: { headline: "", subheadline: "" }, stats: [] }
                  };
                  for (const [id, data] of Object.entries(schema)) {
                    await onSave(id, data);
                  }
                }}
                className="px-6 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold hover:text-white transition-all text-xs flex items-center gap-2"
              >
                <Zap size={16} /> Bootstrap
              </button>
            )}
            <button
              onClick={() => onSave(selectedDoc, localData)}
              className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
            >
              <SaveIcon size={20} /> Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-8 pt-8 border-t border-white/5">
          {selectedDoc === "homepage" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary ml-1">Main Headline</label>
                <input
                  type="text"
                  value={localData.hero?.headline || ""}
                  onChange={e => setLocalData({ ...localData, hero: { ...localData.hero, headline: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary text-xl font-bold"
                  placeholder="Hero headline..."
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary ml-1">Sub-headline / Value Prop</label>
                <textarea
                  value={localData.hero?.subheadline || ""}
                  onChange={e => setLocalData({ ...localData, hero: { ...localData.hero, subheadline: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary h-32 resize-none leading-relaxed"
                  placeholder="Tell your story in two sentences..."
                />
              </div>
            </div>
          )}

          {selectedDoc === "about" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary ml-1">Narrative Headline</label>
                <input
                  type="text"
                  value={localData.headline || ""}
                  onChange={e => setLocalData({ ...localData, headline: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary text-xl font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary ml-1">Professional Bio</label>
                <textarea
                  value={localData.bio || ""}
                  onChange={e => setLocalData({ ...localData, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary h-48 resize-none leading-relaxed"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary ml-1">Core Tech Stack (Comma Separated)</label>
                <input
                  type="text"
                  value={Array.isArray(localData.skills) ? localData.skills.join(", ") : ""}
                  onChange={e => setLocalData({ ...localData, skills: e.target.value.split(",").map(s => s.trim()) })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary font-mono text-sm"
                  placeholder="React, TypeScript, Node.js, AI..."
                />
              </div>
            </div>
          )}

          {selectedDoc === "milestones" && (
            <div className="space-y-8">
              <MilestonesEditor 
                items={localData.items || []} 
                onChange={(newItems) => setLocalData({ ...localData, items: newItems })} 
              />
              <div className="flex items-center gap-4 p-8 bg-brand-primary/5 rounded-[32px] border border-brand-primary/20">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Sparkles size={24} />
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  Milestones are displayed in the carousel on the About page. Reorder them using the grip handle to curate your journey's chronological impact.
                </p>
              </div>
            </div>
          )}

          {selectedDoc === "experience" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary ml-1">Live JSON Artifacts</label>
                <div className="px-4 py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-bold uppercase tracking-widest text-brand-primary">Structural Integrity Active</div>
              </div>
              <textarea
                value={JSON.stringify(localData.items || localData.phases || [], null, 2)}
                onChange={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setLocalData({ ...localData, phases: parsed });
                  } catch (err) {
                    // Invalid JSON - user is typing
                  }
                }}
                className="w-full bg-black/60 border border-white/10 rounded-[32px] px-8 py-8 outline-none focus:border-brand-primary h-[500px] font-mono text-sm leading-relaxed"
              />
              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                  <Type size={18} />
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-widest">
                  Ensure the JSON structure matches the frontend interface expectations. Use the Admin Dashboard's global audit to verify production readiness.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ContentAdminPage = () => {
  useSEO({ title: "Content Manager | Admin Dashboard", noindex: true });
  const { isConfigured } = getFirebaseStatus();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contentDocs, setContentDocs] = useState<Record<string, any>>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured) return;
    
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    const qContent = query(collection(db, "content"));
    const unsubContent = onSnapshot(qContent, (snapshot) => {
      const data: Record<string, any> = {};
      snapshot.docs.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setContentDocs(data);
    });

    return () => {
      unsubAuth();
      unsubContent();
    };
  }, [isConfigured]);

  const [auditLogs, setAuditLogs] = useState<Array<{ msg: string; type: 'info' | 'error' | 'success' }>>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const runSystemAudit = async () => {
    setIsAuditing(true);
    setAuditLogs([]);
    const log = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
      setAuditLogs(prev => [...prev, { msg, type }]);
      console.log(`[DIAGNOSTIC] ${msg}`);
    };

    log("Starting Deep System Audit...", "info");
    
    // 1. Configuration Audit
    const status = getFirebaseStatus();
    log(`Environment: ${status.mode} (Prod: ${status.isProduction})`, "info");
    if (!status.isConfigured) {
      log(`CRITICAL: Configuration Missing! Vars: ${status.missingVars.join(', ')}`, "error");
    } else {
      log(`Firebase Core Initialized (${status.projectId})`, "success");
    }

    // 2. Domain Audit
    log(`Current Origin: ${window.location.origin}`, "info");
    log(`Hostname: ${window.location.hostname}`, "info");
    log(`Authorized Auth Domain: ${status.authDomain || 'Not Set'}`, "info");
    if (status.authDomain && !window.location.origin.includes(status.authDomain) && !status.authDomain.includes('vercel.app')) {
      log("Warning: Multi-domain mismatch detected. Ensure current domain is added in Firebase Console.", "info");
    }

    // 3. Authentication Audit
    if (!user) {
      log("Auth State: NOT AUTHENTICATED", "error");
    } else {
      log(`Auth State: AUTHENTICATED (UID: ${user.uid})`, "success");
      try {
        const token = await user.getIdToken();
        log("Auth Token: VALID", "success");
      } catch (e: any) {
        log(`Auth Token: FAILED (${e.message})`, "error");
      }
    }

    // 4. Persistence / Write Audit
    try {
      log("Testing Firestore Write Connectivity...", "info");
      const testRef = doc(db, "test_connection", user?.uid || "anonymous");
      await setDoc(testRef, { 
        lastChecked: serverTimestamp(),
        origin: window.location.origin,
        ua: navigator.userAgent
      });
      log("Firestore Write: SUCCESS", "success");
    } catch (e: any) {
      log(`Firestore Write: FAILED (${e.code}: ${e.message})`, "error");
    }

    setIsAuditing(false);
  };

  const handleSave = async (id: string, data: any) => {
    try {
      console.log(`[ACTION] Attempting save for: ${id}`, data);
      const docRef = doc(db, "content", id);
      await setDoc(docRef, { 
        ...data, 
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user?.uid,
        origin: window.location.origin
      });
      alert(`✅ ${id.charAt(0).toUpperCase() + id.slice(1)} updated in real-time.`);
    } catch (err: any) {
      console.error(`[CRITICAL] Sync Failure:`, err);
      alert(`❌ Sync Error: ${err.message}\nCode: ${err.code}`);
    }
  };

  if (!isConfigured) return <FirebaseConfigWarning variant="fullscreen" />;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] gap-6">
      <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tighter mb-1">Accessing Neural Core</h2>
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">Decrypting Authority Keys...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6">
      <div className="glass-card p-12 rounded-[40px] border border-white/10 text-center max-w-md w-full">
        <div className="w-24 h-24 bg-brand-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8">
          <Shield size={48} className="text-brand-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tighter">Restricted Access</h1>
        <p className="text-white/40 mb-12">Sign in to the Neural Interface to modify your platform's narrative core.</p>
        
        <button 
          onClick={() => signInWithPopup(auth, googleProvider)}
          className="w-full py-5 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <LogIn size={24} /> Authenticate with Google
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <a href="/admin" className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                <ArrowLeft size={18} />
              </a>
              <div className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-bold uppercase tracking-widest text-brand-primary">Neural Core v2.4</div>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter">Content <span className="text-brand-primary">Manager</span></h1>
            <p className="text-white/40 mt-2 text-lg">Modify your platform's identity, milestones, and professional history.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={runSystemAudit} 
               disabled={isAuditing}
               className="px-6 py-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-primary/20 transition-all disabled:opacity-50"
             >
               <Zap size={16} className={isAuditing ? "animate-pulse" : ""} />
               {isAuditing ? "Auditing..." : "System Audit"}
             </button>
             <button onClick={() => signOut(auth)} className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold flex items-center gap-2 hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </div>

        {auditLogs.length > 0 && (
          <div className="mb-12 p-8 glass-card border-brand-primary/30 rounded-[32px] bg-brand-primary/[0.02]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-brand-primary flex items-center gap-2">
                <Shield size={14} /> Diagnostic Artifacts Generated
              </h3>
              <button onClick={() => setAuditLogs([])} className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Clear Logs</button>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              {auditLogs.map((log, i) => (
                <div key={i} className={cn(
                  "flex items-start gap-3",
                  log.type === 'error' ? "text-red-400" : log.type === 'success' ? "text-green-400" : "text-white/40"
                )}>
                  <span className="shrink-0 opacity-20">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ContentManager docs={contentDocs} onSave={handleSave} />
      </div>
    </div>
  );
};

export default ContentAdminPage;
