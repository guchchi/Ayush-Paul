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
  getFirebaseStatus,
} from "../firebase";
import { cn } from "../lib/utils";
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
  >("dashboard");

  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newsletterData, setNewsletterData] = useState({ subject: "", content: "" });
  const [isSending, setIsSending] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

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
    };
    const collectionName = schemaMap[activeTab];
    if (!collectionName) return;

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
      }

      if (currentRecord?.id) {
        // Edit record
        await updateDoc(doc(db, collectionName, currentRecord.id), payload);
        addToast("Item updated successfully.", "success");
      } else {
        // Create new record
        payload.createdAt = serverTimestamp();
        if (collectionName === "blogPosts") {
          payload.views = 0;
        }
        await addDoc(collection(db, collectionName), payload);
        addToast("Item created successfully.", "success");
      }
      setIsEditing(false);
      setCurrentRecord(null);
    } catch (error) {
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
              { id: "users", label: "Users Registry", icon: <Users size={16} /> },
              { id: "purchases", label: "Orders Ledger", icon: <BarChart3 size={16} /> },
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

            {/* Dynamic CMS Listing views for other collections */}
            {currentSchema && (
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
