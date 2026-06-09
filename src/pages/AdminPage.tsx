import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  LogIn,
  Trash2,
  Plus,
  Shield,
  Clock,
  X,
  Save,
  Layout,
  FileText,
  Layers,
  MessageSquare,
  Eye,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  ArrowLeft,
  LogOut,
  Mail,
  Zap,
  ShieldAlert,
  BookOpen,
  Users,
  Folder,
  UserCheck,
  Receipt,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Tag,
  CalendarClock,
  ChevronRight,
  Share2,
  Trophy,
  Video,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import {
  auth,
  db,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "../firebase";
import { getFirebaseStatus } from "../config/firebase-config";
import { cn, parseResponse } from "../lib/utils";
import { handleFirestoreError } from "../lib/firebase-utils";
import { OperationType } from "../types";
import { FirebaseConfigWarning } from "../components/FirebaseConfigWarning";
import { Toaster, Toast } from "../components/ui/Toaster";
import { useSEO } from "../hooks/useSEO";

// Custom admin hooks & modular parts
import { useAdminAuth } from "../hooks/admin/useAdminAuth";
import { useAdminData } from "../hooks/admin/useAdminData";
import { HealthDashboard } from "../components/admin/layout/HealthDashboard";
import { AdminStatCard } from "../components/admin/analytics/AdminStatCard";
import { ComposeNewsletterModal } from "../components/admin/shared/ComposeNewsletterModal";

// Schema dynamic CMS parts
import { CMS_SCHEMAS } from "../config/cms-schemas";
import { SchemaDrivenList } from "../components/admin/cms/SchemaDrivenList";
import { SchemaDrivenForm } from "../components/admin/cms/SchemaDrivenForm";
import { CouponManagementPanel } from "../components/admin/coupons/CouponManagementPanel";
import { PurchaseAnalyticsDashboard } from "../components/admin/analytics/PurchaseAnalyticsDashboard";
import { WorkshopDashboard } from "../components/admin/workshops/WorkshopDashboard";

const AdminDashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "blogs"
    | "products"
    | "courses"
    | "projects"
    | "updates"
    | "messages"
    | "subscribers"
    | "users"
    | "purchases"
    | "creators"
    | "coupons"
    | "analytics"
    | "scheduled_emails"
    | "workshops"
    | "workshop_registrations"
    | "mentorship"
  >("dashboard");

  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newsletterData, setNewsletterData] = useState({ subject: "", content: "" });
  const [isSending, setIsSending] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const handleMentorshipStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'mentorship_applications', id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      addToast(`Request marked as ${newStatus}.`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'mentorship_applications');
      addToast('Failed to update status.', 'error');
    }
  };

  const addToast = (message: string, type: Toast["type"] = "info", duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronized Firestore Data Pipeline
  const {
    posts,
    projects,
    products,
    courses,
    users,
    purchases,
    messages,
    subscribers,
    campaigns,
    updates,
    creatorCodes,
    creatorSalesLog,
    coupons,
    scheduledEmails,
    shareEvents,
    streakMilestones,
    workshops,
    workshopRegistrations,
    mentorshipApplications,
    systemStatus,
    setSystemStatus,
    forceRefresh,
    refreshSecondary,
  } = useAdminData(addToast);

  const getCollectionData = (schemaName: string) => {
    switch (schemaName) {
      case "blogPosts":
        return posts;
      case "products":
        return products;
      case "courses":
        return courses;
      case "users":
        return users;
      case "purchases":
        return purchases;
      case "subscribers":
        return subscribers;
      case "projects":
        return projects;
      case "updates":
        return updates;
      case "creator_codes":
        return creatorCodes;
      case "creator_sales_log":
        return creatorSalesLog;
      case "coupons":
        return coupons;
      case "scheduled_emails":
        return scheduledEmails;
      case "share_events":
        return shareEvents;
      case "streak_milestones":
        return streakMilestones;
      case "workshops":
        return workshops;
      case "workshop_registrations":
        return workshopRegistrations;
      case "mentorship_applications":
        return mentorshipApplications;
      default:
        return [];
    }
  };

  const handleEditRecord = (record: any) => {
    // Map list representation back to form representation if required
    const mapped = { ...record };
    if (activeTab === "products" && Array.isArray(record.features)) {
      mapped.features = record.features.map((f: any) => f.name).join(", ");
    }
    setCurrentRecord(mapped);
    setIsEditing(true);
  };

  const handleSaveRecord = async (formData: any) => {
    const schemaMap: Record<string, string> = {
      blogs: "blogPosts",
      products: "products",
      courses: "courses",
      users: "users",
      purchases: "purchases",
      subscribers: "subscribers",
      projects: "projects",
      updates: "updates",
      creators: "creator_codes",
      coupons: "coupons",
      scheduled_emails: "scheduled_emails",
      workshops: "workshops",
      workshop_registrations: "workshop_registrations",
      mentorship: "mentorship_applications",
    };
    const collectionName = schemaMap[activeTab];
    if (!collectionName) return;

    const RULES_ADMIN_UID = "80OJfcmVXCRNmSZuthVU68K6vJq2";
    const RULES_ADMIN_EMAIL = "ap877@cornell.edu";
    const uid = auth.currentUser?.uid;
    const email = auth.currentUser?.email;
    console.log("COLLECTION:", collectionName);
    console.log("USER UID:", uid);
    console.log("USER EMAIL:", email);
    console.log("MATCHES firestore.rules isAdmin():");
    console.log("  uid check (request.auth.uid == RULES_ADMIN_UID):", uid === RULES_ADMIN_UID);
    console.log("  email check (request.auth.token.email == RULES_ADMIN_EMAIL):", email === RULES_ADMIN_EMAIL);
    console.log("  would isAdmin() pass on server?:", (uid === RULES_ADMIN_UID) || (email === RULES_ADMIN_EMAIL));

    try {
      const payload = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      // Custom Sanitizations before writing
      if (collectionName === "blogPosts") {
        const textContent = Array.isArray(payload.blocks)
          ? payload.blocks
              .filter((b: any) => b.type === "text" || b.type === "heading")
              .map((b: any) => (typeof b.content === "string" ? b.content.replace(/<[^>]*>/g, "") : ""))
              .join(" ")
          : "";
        const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
        payload.readingTime = Math.max(1, Math.ceil(wordCount / 200));
        payload.content = textContent;
        payload.excerpt = payload.description || "";
        payload.author = user.email || "Founder";
        payload.status = payload.published ? "published" : "draft";
      }

      if (collectionName === "products") {
        if (typeof payload.features === "string") {
          payload.features = payload.features
            .split(",")
            .map((f: string) => ({ name: f.trim(), isPremiumOnly: payload.type === "paid" }))
            .filter((f: any) => f.name);
        }
        payload.basePrice = Number(payload.basePrice) || 0;
        payload.salePrice = Number(payload.salePrice) || 0;
        if (payload.stripePriceId && payload.salePrice > 0) {
          payload.type = "paid";
        }
      }

      if (collectionName === "creator_codes") {
        if (payload.code) payload.code = payload.code.trim().toUpperCase();
      }

      if (collectionName === "coupons") {
        if (payload.code) payload.code = payload.code.trim().toUpperCase();
        if (payload.assignedToCreator) payload.assignedToCreator = payload.assignedToCreator.trim().toUpperCase();
      }

      if (currentRecord?.id) {
        // Edit record
        console.log("PAYLOAD (edit):", payload);
        await updateDoc(doc(db, collectionName, currentRecord.id), payload);
        if (collectionName === "products") {
          try { localStorage.removeItem("products_cache"); } catch { /* localStorage may be unavailable */ }
        }
        addToast("Item updated successfully.", "success");
      } else {
        // Create new record
        payload.createdAt = serverTimestamp();
        if (collectionName === "blogPosts") {
          payload.views = 0;
        }
        console.log("PAYLOAD (create):", JSON.stringify(payload, (key, val) => key === 'updatedAt' || key === 'createdAt' ? '<serverTimestamp>' : val, 2));
        console.log("[DEBUG] Collection:", collectionName, "| Has id?:", !!currentRecord?.id, "| Payload keys:", Object.keys(payload).join(", "));
        try {
          const docRef = await addDoc(collection(db, collectionName), payload);
          console.log("SUCCESS: docRef.id =", docRef.id);
          console.log("[DEBUG] Post-save: Document written to", collectionName, "/", docRef.id);
        } catch (error: any) {
          console.error("FIRESTORE WRITE FAILED");
          console.error("ERROR:", error);
          console.error("ERROR CODE:", error.code);
          console.error("ERROR MESSAGE:", error.message);
          throw error;
        }
        addToast("Item created successfully.", "success");
      }
      setIsEditing(false);
      setCurrentRecord(null);
    } catch (error: any) {
      console.error("CATCH ALL - error:", error);
      console.error("CATCH ALL - code:", error.code);
      console.error("CATCH ALL - message:", error.message);
      handleFirestoreError(error, OperationType.WRITE, collectionName);
      addToast("Failed to write to database.", "error");
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (window.confirm(`Are you sure you want to delete this record from ${collectionName}?`)) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        addToast("Record deleted successfully.", "success");
        refreshSecondary();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, collectionName);
        addToast("Deletion failed.", "error");
      }
    }
  };

  const handleSendNewsletter = async (resumingCampaignId?: string, isTest?: boolean) => {
    setIsSending(true);
    try {
      const userInstance = auth.currentUser;
      if (!userInstance) throw new Error("Not authenticated");
      const token = await userInstance.getIdToken();

      const payload = {
        subject: newsletterData.subject,
        content: newsletterData.content,
        campaignId: resumingCampaignId,
        isTestMode: isTest,
      };

      if (resumingCampaignId) {
        const camp = campaigns.find((c) => c.id === resumingCampaignId);
        payload.subject = camp.subject;
        payload.content = camp.content;
      }

      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to send");

      addToast(result.message, "success");

      if (!isTest) {
        setShowComposeModal(false);
        setNewsletterData({ subject: "", content: "" });
        refreshSecondary();
      }
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleMessageStatus = async (id: string, currentStatus: string, inquiryType?: string) => {
    try {
      const collectionName = inquiryType === "Contact Inquiry" ? "contact_messages" : "collaboration_requests";
      await updateDoc(doc(db, collectionName, id), {
        status: currentStatus === "read" ? "unread" : "read",
      });
      refreshSecondary();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "messages");
    }
  };

  const testConnection = async () => {
    setIsAuditing(true);
    try {
      const testRef = collection(db, "test_connection");
      await addDoc(testRef, {
        status: "firebase-working",
        time: serverTimestamp(),
        author: user.email,
      });
      addToast("Firebase connection confirmed.", "success");
    } catch (error: any) {
      console.error("Firestore test connection failure:", error);
      const errInfo = handleFirestoreError(error, OperationType.CREATE, "test_connection");

      if (errInfo.isQuotaExceeded) {
        addToast("CRITICAL: daily limit reached (Quota Exceeded).", "error");
        setSystemStatus((prev) => ({ ...prev, isQuotaExceeded: true, lastError: "Quota Exceeded" }));
      } else {
        addToast(`Backend Error: ${error.message}`, "error");
      }
    } finally {
      setIsAuditing(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    if (typeof date.toDate === "function") return date.toDate().toLocaleDateString();
    return new Date(date).toLocaleDateString();
  };

  // Determine current active schema
  const schemaMap: Record<string, string> = {
    blogs: "blogPosts",
    products: "products",
    courses: "courses",
    users: "users",
    purchases: "purchases",
    subscribers: "subscribers",
    projects: "projects",
    updates: "updates",
    creators: "creator_codes",
    workshops: "workshops",
    workshop_registrations: "workshop_registrations",
    mentorship: "mentorship_applications",
  };
  const currentSchemaName = schemaMap[activeTab];
  const currentSchema = currentSchemaName ? CMS_SCHEMAS[currentSchemaName] : null;

  return (
    <div className="bg-[#080808] text-white min-h-screen pb-24 font-sans selection:bg-brand-primary selection:text-black">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-[100] border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Rocket size={20} />
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-white flex items-center gap-2">
                Creator Studio
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white/40">
                  v2.0 Beta
                </span>
              </h1>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                Owner: {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {systemStatus.lastSync && (
              <div className="hidden md:flex items-center gap-2.5 text-xs text-white/30 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Synced {systemStatus.lastSync.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-xl font-bold flex items-center gap-2 hover:text-white transition-colors text-xs"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 mt-12">
        {/* Navigation Tabs Bar */}
        {!isEditing && (
          <div className="flex flex-wrap gap-3 mb-12">
            {[
              { id: "dashboard", label: "Dashboard", icon: <Layout size={16} /> },
              { id: "blogs", label: "Blog Posts", icon: <FileText size={16} /> },
              { id: "products", label: "Blueprints", icon: <Layers size={16} /> },
              { id: "courses", label: "Academy Courses", icon: <BookOpen size={16} /> },
              { id: "projects", label: "Projects", icon: <Folder size={16} /> },
              { id: "updates", label: "Momentum", icon: <Zap size={16} /> },
              { id: "messages", label: "Inbox Messages", icon: <MessageSquare size={16} /> },
              { id: "subscribers", label: "Subscribers", icon: <Mail size={16} /> },
              { id: "creators", label: "Creator Affiliates", icon: <UserCheck size={16} /> },
              { id: "coupons", label: "Coupons", icon: <Tag size={16} /> },
              { id: "analytics", label: "Revenue Analytics", icon: <BarChart3 size={16} /> },
              { id: "scheduled_emails", label: "Email Queue", icon: <CalendarClock size={16} /> },
              { id: "workshops", label: "Workshops", icon: <Video size={16} /> },
              { id: "workshop_registrations", label: "Workshop Regs", icon: <ClipboardList size={16} /> },
              { id: "mentorship", label: "1-on-1 Sessions", icon: <MessageCircle size={16} /> },
              { id: "users", label: "Users Registry", icon: <Users size={16} /> },
              { id: "purchases", label: "Orders Ledger", icon: <ShoppingCart size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-xs",
                  activeTab === tab.id
                    ? "bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}

        {!isEditing && <HealthDashboard />}

        {/* Dynamic Display Rendering */}
        {isEditing && currentSchema ? (
          <SchemaDrivenForm
            schema={currentSchema}
            initialData={currentRecord}
            onSave={handleSaveRecord}
            onCancel={() => {
              setIsEditing(false);
              setCurrentRecord(null);
            }}
            user={user}
          />
        ) : (
          <div className="space-y-12">
            {/* Overview / Analytics Cockpit */}
            {activeTab === "dashboard" && (
              <div className="space-y-12">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  <AdminStatCard
                    label="Total Posts"
                    value={posts.length}
                    icon={<FileText size={20} />}
                  />
                  <AdminStatCard
                    label="Total Views"
                    value={posts.reduce((acc, p) => acc + (p.views || 0), 0)}
                    icon={<Eye size={20} />}
                  />
                  <AdminStatCard
                    label="Inbox Messages"
                    value={messages.length}
                    icon={<MessageSquare size={20} />}
                  />
                  <AdminStatCard
                    label="Subscribers"
                    value={subscribers.length}
                    icon={<Mail size={20} />}
                  />
                  <AdminStatCard
                    label="Total Sales ($)"
                    value={purchases.reduce((acc, p) => acc + ((p.amountTotal || 0) / 100), 0)}
                    icon={<BarChart3 size={20} />}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* System Health Check Trigger */}
                  <div
                    className="p-8 rounded-[2.5rem] bg-brand-primary/5 border border-brand-primary/10 flex flex-col items-center justify-center text-center gap-4 group hover:bg-brand-primary/10 transition-all cursor-pointer"
                    onClick={testConnection}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-all">
                      {isAuditing ? <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /> : <Zap size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-md">Diagnostic Test</h4>
                      <p className="text-white/40 text-xs mt-1">Run writes verification audit on Firebase collections.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Creator Affiliate Analytics Panel */}
            {activeTab === "creators" && (
              <div className="space-y-8">
                {/* Hero Summary */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <UserCheck size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Creator Affiliate Analytics</h3>
                        <p className="text-white/40 text-xs">Track, log, calculate, and summarize all creator-driven sales automatically.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentRecord(null);
                        setIsEditing(true);
                        setActiveTab("creators");
                      }}
                      className="shrink-0 px-5 py-3 rounded-xl bg-brand-primary hover:bg-white text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20"
                    >
                      <UserCheck size={14} /> Create Creator
                    </button>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminStatCard
                      label="Total Creators"
                      value={creatorCodes.length}
                      icon={<Users size={18} />}
                    />
                    <AdminStatCard
                      label="Total Sales"
                      value={creatorSalesLog.length}
                      icon={<ShoppingCart size={18} />}
                    />
                    <AdminStatCard
                      label="Total Commission Paid"
                      value={`₹${creatorCodes.reduce((sum, c) => sum + (c.totalCommission || 0), 0).toLocaleString('en-IN')}`}
                      icon={<DollarSign size={18} />}
                    />
                    <AdminStatCard
                      label="Avg Commission Rate"
                      value={`${creatorCodes.length > 0 ? Math.round(creatorCodes.reduce((sum, c) => sum + (c.creatorCommissionPercent || c.commissionRate || 0), 0) / creatorCodes.length) : 0}%`}
                      icon={<Percent size={18} />}
                    />
                  </div>
                </div>

                {/* Per-Creator Breakdown */}
                {creatorCodes.length === 0 ? (
                  <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-16 text-center">
                    <UserCheck className="mx-auto mb-4 text-white/20" size={48} />
                    <h4 className="text-lg font-bold text-white mb-1">No Creators Yet</h4>
                    <p className="text-white/40 text-xs">Create a creator code from the schema list below to start tracking affiliate sales.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {creatorCodes.map((creator) => {
                      const creatorSales = creatorSalesLog.filter(s => s.creatorCode === creator.code);
                      const totalCommission = creatorSales.reduce((sum, s) => sum + (s.commission || 0), 0);
                      const uniqueBuyers = new Set(creatorSales.map(s => s.userId)).size;

                      return (
                        <div
                          key={creator.id || creator.code}
                          className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 group hover:border-brand-primary/20 transition-all"
                        >
                          {/* Creator Header */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg">
                                {creator.creatorName?.[0] || 'C'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-lg font-bold text-white">{creator.creatorName}</h4>
                                  <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-bold uppercase tracking-wider">
                                    {creator.code}
                                  </span>
                                  {!creator.isActive && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-wider">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/40 text-xs mt-0.5">{creator.userId ? `UID: ${creator.userId.slice(0, 12)}...` : 'No user linked'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-lg font-bold text-brand-primary">₹{totalCommission.toLocaleString('en-IN')}</div>
                                <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Earned</div>
                              </div>
                            </div>
                          </div>

                          {/* Creator Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Sales</div>
                              <div className="text-xl font-bold text-white">{creator.totalSales ?? creatorSales.length}</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Commission (on original)</div>
                              <div className="text-xl font-bold text-brand-primary">{creator.creatorCommissionPercent || creator.commissionRate || 10}%</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Unique Buyers</div>
                              <div className="text-xl font-bold text-white">{uniqueBuyers}</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Avg Order Value</div>
                              <div className="text-xl font-bold text-white">
                                ₹{creatorSales.length > 0 ? (creatorSales.reduce((s, x) => s + (x.originalPrice || x.productPrice || x.paidAmount || 0), 0) / creatorSales.length).toFixed(0) : '0'}
                              </div>
                            </div>
                          </div>

                          {/* Recent Transactions */}
                          {creatorSales.length > 0 && (
                            <div className="border-t border-white/5 pt-6">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-4 flex items-center gap-2">
                                <Receipt size={12} /> Recent Transactions
                              </h5>
                              <div className="space-y-2">
                                {creatorSales.slice(0, 10).map((sale) => (
                                  <div
                                    key={sale.id}
                                    className="flex items-center justify-between bg-white/[0.02] rounded-xl px-4 py-3 border border-white/5 text-xs"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-6 h-6 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                                        <TrendingUp size={11} />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-bold text-white truncate">{sale.productTitle || sale.productId}</p>
                                        <p className="text-[10px] text-white/30">
                                          Commission: ₹{sale.commission} at {sale.commissionPercent || sale.commissionRate}%
                                          {sale.discountApplied > 0 && ` • Discount: ₹${sale.discountApplied}`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                      <p className="font-bold text-brand-primary">₹{sale.originalPrice || sale.productPrice || sale.paidAmount || 0}</p>
                                      <p className="text-[10px] text-white/30">{sale.currency?.toUpperCase() || 'INR'}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Full Sales Log */}
                {creatorSalesLog.length > 0 && (
                  <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8">
                    <h4 className="text-md font-bold text-white mb-1 flex items-center gap-2">
                      <Receipt size={16} className="text-brand-primary" /> Full Sales Ledger
                    </h4>
                    <p className="text-white/40 text-xs mb-6">All creator-driven transactions ordered by date.</p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-white/5 text-white/40 text-[9px] font-bold uppercase tracking-wider">
                            <th className="text-left py-3 pr-4">Creator</th>
                            <th className="text-left py-3 pr-4">Product</th>
                            <th className="text-left py-3 pr-4">Original</th>
                            <th className="text-left py-3 pr-4">Paid</th>
                            <th className="text-left py-3 pr-4">Discount</th>
                            <th className="text-left py-3 pr-4">Commission</th>
                            <th className="text-left py-3 pr-4">Rate</th>
                            <th className="text-left py-3">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {creatorSalesLog.map((sale) => (
                            <tr key={sale.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 pr-4">
                                <span className="font-bold text-white">{sale.creatorName || sale.creatorCode}</span>
                              </td>
                              <td className="py-3 pr-4 text-white/70 truncate max-w-[150px]">
                                {sale.productTitle || sale.productId}
                              </td>
                              <td className="py-3 pr-4 font-bold text-white">₹{sale.originalPrice || sale.productPrice || sale.paidAmount || 0}</td>
                              <td className="py-3 pr-4 text-white/50">₹{sale.paidAmount || sale.productPrice || 0}</td>
                              <td className="py-3 pr-4 text-white/50">{sale.discountApplied > 0 ? `₹${sale.discountApplied}` : '—'}</td>
                              <td className="py-3 pr-4 font-bold text-brand-primary">₹{sale.commission}</td>
                              <td className="py-3 pr-4 text-white/50">{sale.commissionPercent || sale.commissionRate || 0}%</td>
                              <td className="py-3 text-white/40 text-[10px]">
                                {sale.timestamp?.toDate?.()?.toLocaleDateString() || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Schema-driven management */}
                {currentSchema && (
                  <div className="pt-4">
                    <SchemaDrivenList
                      schema={currentSchema}
                      items={getCollectionData(currentSchemaName)}
                      onEdit={handleEditRecord}
                      onDelete={handleDelete}
                      onCreateNew={() => {
                        setCurrentRecord(null);
                        setIsEditing(true);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Custom Messages Inbox (not a typical CRUD schema) */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">Inquiries Inbox</h3>
                  <p className="text-white/40 text-xs">Review contact forms and collaboration proposals.</p>
                </div>

                {messages.length === 0 ? (
                  <div className="glass-card rounded-[2.5rem] border border-white/10 p-16 text-center">
                    <MessageSquare className="mx-auto mb-4 text-white/20" size={48} />
                    <h4 className="text-lg font-bold text-white mb-1">Inbox Clean</h4>
                    <p className="text-white/40 text-xs">No customer inquiries or proposals outstanding.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="glass-card p-6 rounded-[2rem] border border-white/10 group hover:border-brand-primary/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-md">
                            {msg.name ? msg.name[0] : "A"}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-md flex items-center gap-2">
                              {msg.name}
                              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold uppercase tracking-wider text-white/40">
                                {msg.inquiryType || "Collaboration Request"}
                              </span>
                            </h3>
                            <p className="text-white/40 text-xs">{msg.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                            {formatDate(msg.timestamp || msg.createdAt)}
                          </div>
                          <button
                            onClick={() => handleToggleMessageStatus(msg.id, msg.status, msg.inquiryType)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                              msg.status === "read"
                                ? "bg-white/5 text-white/30 hover:text-white"
                                : "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
                            )}
                          >
                            {msg.status === "read" ? "Mark Unread" : "Mark Read"}
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id, msg.inquiryType === "Contact Inquiry" ? "contact_messages" : "collaboration_requests")}
                            className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-bold text-brand-primary">{msg.subject || "Project Scope Application"}</div>
                          {msg.status !== "read" && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">{msg.message || msg.projectDescription}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Coupon Management */}
            {activeTab === "coupons" && (
              <CouponManagementPanel
                coupons={coupons}
                onRefresh={refreshSecondary}
                addToast={addToast}
              />
            )}

            {/* Purchase Analytics Dashboard */}
            {activeTab === "analytics" && (
              <PurchaseAnalyticsDashboard
                purchases={purchases}
                creatorCodes={creatorCodes}
              />
            )}

            {/* Scheduled Emails Queue */}
            {activeTab === "scheduled_emails" && (
              <div className="space-y-8">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <CalendarClock size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Email Queue</h3>
                      <p className="text-white/40 text-xs">Scheduled automated emails pending processing.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Total Scheduled</div>
                      <div className="text-2xl font-bold text-white">{scheduledEmails.length}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Pending</div>
                      <div className="text-2xl font-bold text-white">{scheduledEmails.filter(e => e.status === 'pending').length}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Sent</div>
                      <div className="text-2xl font-bold text-white">{scheduledEmails.filter(e => e.status === 'sent').length}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Failed</div>
                      <div className="text-2xl font-bold text-white">{scheduledEmails.filter(e => e.status === 'failed').length}</div>
                    </div>
                  </div>
                </div>

                {scheduledEmails.length === 0 ? (
                  <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-16 text-center">
                    <CalendarClock className="mx-auto mb-4 text-white/20" size={48} />
                    <h4 className="text-lg font-bold text-white mb-1">Queue Empty</h4>
                    <p className="text-white/40 text-xs">No scheduled emails yet. They will appear here when growth loop triggers fire.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/5 text-white/40 text-[9px] font-bold uppercase tracking-wider">
                          <th className="text-left py-3 pr-4">Type</th>
                          <th className="text-left py-3 pr-4">User</th>
                          <th className="text-left py-3 pr-4">Scheduled At</th>
                          <th className="text-left py-3 pr-4">Sent At</th>
                          <th className="text-left py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduledEmails.map((email) => (
                          <tr key={email.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 pr-4">
                              <span className="font-bold text-white capitalize">{email.type?.replace(/_/g, ' ')}</span>
                            </td>
                            <td className="py-3 pr-4 text-white/70 truncate max-w-[150px]">
                              {email.userName || email.userEmail || email.userId?.slice(0, 12)}
                            </td>
                            <td className="py-3 pr-4 text-white/50 text-[10px]">
                              {email.sendAt?.toDate?.()?.toLocaleString() || '—'}
                            </td>
                            <td className="py-3 pr-4 text-white/50 text-[10px]">
                              {email.sentAt?.toDate?.()?.toLocaleString() || '—'}
                            </td>
                            <td className="py-3">
                              <span className={cn(
                                "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider",
                                email.status === 'sent' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                email.status === 'failed' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                email.status === 'cancelled' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                "bg-white/5 text-white/50 border border-white/10"
                              )}>
                                {email.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Workshops tab with per-row live notification action */}
            {activeTab === "workshops" && currentSchema && (
              <div className="space-y-6">
                <WorkshopDashboard
                  workshops={workshops}
                  workshopRegistrations={workshopRegistrations}
                  addToast={addToast}
                  onRefresh={refreshSecondary}
                />
                <SchemaDrivenList
                  schema={currentSchema}
                  items={getCollectionData(currentSchemaName)}
                  onEdit={handleEditRecord}
                  onDelete={handleDelete}
                  onCreateNew={() => { setCurrentRecord(null); setIsEditing(true); }}
                  onRowAction={{
                    label: "Send Live Notification",
                    icon: "Bell",
                    condition: (item) => item.workshopStatus === "LIVE" && !!item.meetingLink,
                    handler: async (item) => {
                      if (!item?.id) return;
                      try {
                        const res = await fetch("/api/workshop-email", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "send-live-notification", workshopId: item.id }),
                        });
                        const data = await parseResponse(res);
                        if (data.success) {
                          addToast(`Notified ${data.notified} registrant(s) about "${item.title}".`, "success");
                        } else {
                          addToast(data.error || "Failed to send notifications.", "error");
                        }
                      } catch (err: any) {
                        addToast("Failed to send notifications.", "error");
                      }
                    },
                  }}
                />
              </div>
            )}

            {/* Workshop Registrations tab */}
            {activeTab === "workshop_registrations" && currentSchema && (
              <div className="space-y-6">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <ClipboardList size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Workshop Registrations</h3>
                      <p className="text-white/40 text-xs">
                        {workshopRegistrations.length} total registration(s)
                      </p>
                    </div>
                  </div>
                </div>
                <SchemaDrivenList
                  schema={currentSchema}
                  items={getCollectionData(currentSchemaName)}
                  onEdit={handleEditRecord}
                  onDelete={handleDelete}
                  onCreateNew={undefined}
                />
              </div>
            )}

            {/* Mentorship / 1-on-1 Session Requests tab */}
            {activeTab === "mentorship" && (
              <div className="space-y-6">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <div className="flex items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <MessageCircle size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">1-on-1 Session Requests</h3>
                        <p className="text-white/40 text-xs">{mentorshipApplications.length} total request(s)</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Filter Pills */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["ALL", "PENDING", "APPROVED", "PAID", "CONFIRMED", "REJECTED"].map((s) => {
                      const count = s === "ALL" ? mentorshipApplications.length : mentorshipApplications.filter((r: any) => r.status === s).length;
                      return (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                            statusFilter === s
                              ? "bg-white text-black"
                              : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {s === "ALL" ? "All" : s} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                  {(statusFilter === "ALL"
                    ? mentorshipApplications
                    : mentorshipApplications.filter((r: any) => r.status === statusFilter)
                  ).length === 0 ? (
                    <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/10 text-center">
                      <p className="text-white/30 text-sm">No requests found.</p>
                    </div>
                  ) : (
                    (statusFilter === "ALL"
                      ? mentorshipApplications
                      : mentorshipApplications.filter((r: any) => r.status === statusFilter)
                    ).map((req: any) => {
                      const statusColors: Record<string, string> = {
                        PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                        APPROVED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                        PAID: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                        CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
                        REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
                      };
                      const isExpanded = expandedRequestId === req.id;
                      return (
                        <div
                          key={req.id}
                          className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden transition-all"
                        >
                          <button
                            onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors cursor-pointer border-none bg-transparent"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                                {req.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">{req.name}</p>
                                <p className="text-white/40 text-xs mt-0.5">{req.topic || 'No topic'} — {req.contact}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border", statusColors[req.status] || "bg-white/5 text-white/40")}>
                                {req.status || 'PENDING'}
                              </span>
                              <ChevronRight size={16} className={cn("text-white/30 transition-transform", isExpanded && "rotate-90")} />
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-6 pb-6 pt-2 border-t border-white/5">
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Contact</p>
                                  <p className="text-sm text-white font-medium">{req.contact}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Topic</p>
                                  <p className="text-sm text-white font-medium">{req.topic || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Preferred Date</p>
                                  <p className="text-sm text-white font-medium">{req.preferredDate || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Preferred Time</p>
                                  <p className="text-sm text-white font-medium">{req.preferredTime || '—'} {req.timezone ? `(${req.timezone})` : ''}</p>
                                </div>
                              </div>

                              {req.description && (
                                <div className="mb-6">
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Problem Description</p>
                                  <p className="text-sm text-white/70 leading-relaxed bg-white/[0.03] p-4 rounded-2xl border border-white/5">{req.description}</p>
                                </div>
                              )}

                              {/* Status action buttons */}
                              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                {req.status === 'PENDING' && (
                                  <>
                                    <button onClick={() => handleMentorshipStatusUpdate(req.id, 'APPROVED')} className="px-5 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer">
                                      <CheckCircle2 size={12} className="inline mr-1.5" /> Approve
                                    </button>
                                    <button onClick={() => handleMentorshipStatusUpdate(req.id, 'REJECTED')} className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer">
                                      <X size={12} className="inline mr-1.5" /> Reject
                                    </button>
                                  </>
                                )}
                                {req.status === 'APPROVED' && (
                                  <button onClick={() => handleMentorshipStatusUpdate(req.id, 'PAID')} className="px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer">
                                    <DollarSign size={12} className="inline mr-1.5" /> Mark as Paid
                                  </button>
                                )}
                                {req.status === 'PAID' && (
                                  <button onClick={() => handleMentorshipStatusUpdate(req.id, 'CONFIRMED')} className="px-5 py-2.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer">
                                    <CheckCircle2 size={12} className="inline mr-1.5" /> Confirm Session
                                  </button>
                                )}
                                {(req.status === 'PENDING' || req.status === 'APPROVED' || req.status === 'PAID') && (
                                  <button onClick={() => handleMentorshipStatusUpdate(req.id, 'REJECTED')} className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer">
                                    <X size={12} className="inline mr-1.5" /> Reject
                                  </button>
                                )}
                                <button onClick={() => handleDelete(req.id, 'mentorship_applications')} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-red-500/20 hover:text-red-400 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ml-auto">
                                  <Trash2 size={12} className="inline mr-1.5" /> Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Dynamic CMS Listing views for other collections */}
            {currentSchema && activeTab !== "creators" && activeTab !== "coupons" && activeTab !== "analytics" && activeTab !== "scheduled_emails" && activeTab !== "workshops" && activeTab !== "workshop_registrations" && (
              <SchemaDrivenList
                schema={currentSchema}
                items={getCollectionData(currentSchemaName)}
                onEdit={handleEditRecord}
                onDelete={handleDelete}
                onCreateNew={() => {
                  setCurrentRecord(null);
                  setIsEditing(true);
                }}
                onSpecialAction={
                  activeTab === "subscribers"
                    ? {
                        label: "Compose Campaign",
                        icon: "Plus",
                        handler: () => setShowComposeModal(true),
                      }
                    : undefined
                }
              />
            )}
          </div>
        )}
      </div>

      {/* Compose modal for sending Resend email newsletter broadcasts */}
      <ComposeNewsletterModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        subscribersCount={subscribers.length}
        newsletterData={newsletterData}
        setNewsletterData={setNewsletterData}
        isSending={isSending}
        onSend={handleSendNewsletter}
      />

      <Toaster toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export const AdminPage = () => {
  useSEO({ title: "Creator Studio | Admin Dashboard", noindex: true });
  const { isConfigured } = getFirebaseStatus();

  // Custom Authentication Custom Hook
  const {
    user,
    loading,
    loginError,
    isLoggingIn,
    isAuthorized,
    handleLogin,
    handleLogout,
  } = useAdminAuth();

  if (!isConfigured) {
    return <FirebaseConfigWarning variant="fullscreen" />;
  }

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] gap-6">
        <div className="w-12 h-12 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold text-white">Initializing Studio</h2>
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.2em] animate-pulse">
            Checking Authority Keys...
          </p>
        </div>
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
            <Rocket size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-white">Admin Access</h1>
          <p className="text-white/40 text-xs mb-8">
            Please sign in with your authorized account to manage the startup portal.
          </p>

          {loginError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs text-left">
              <AlertCircle size={16} className="shrink-0" />
              <p>{loginError}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all",
              isLoggingIn
                ? "bg-white/10 text-white/20 cursor-not-allowed"
                : "bg-white text-black hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={18} />
            )}
            {isLoggingIn ? "Authenticating..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] p-6">
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-white">Unauthorized</h1>
          <p className="text-white/40 text-xs mb-8">
            This account does not have administrative privileges. Please switch to the authorized identity.
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />;
};
