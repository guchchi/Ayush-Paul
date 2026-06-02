import { useState, useEffect } from "react";
import {
  db,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "../../firebase";
import { handleFirestoreError, formatDate } from "../../lib/firebase-utils";
import { OperationType } from "../../types";

export interface SystemStatus {
  isQuotaExceeded: boolean;
  lastError: string | null;
  lastSync: Date | null;
}

export const useAdminData = (addToast: (message: string, type?: "info" | "success" | "warning" | "error") => void) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    isQuotaExceeded: false,
    lastError: null,
    lastSync: null,
  });

  const forceRefresh = async () => {
    console.log("🔄 [SYNC] Manual refresh triggered...");
    setSystemStatus(prev => ({ ...prev, isQuotaExceeded: false, lastError: null }));
    await fetchSecondaryData();
  };

  const fetchSecondaryData = async () => {
    try {
      console.log("📊 [SYNC] Fetching secondary metrics...");
      const [msgSnap, collabSnap, subSnap, updSnap] = await Promise.all([
        getDocs(query(collection(db, "contact_messages"))),
        getDocs(query(collection(db, "collaboration_requests"))),
        getDocs(query(collection(db, "subscribers"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "updates"), orderBy("date", "desc"))),
      ]);

      const mergedInquiries = [
        ...msgSnap.docs.map((doc) => ({ id: doc.id, inquiryType: "Contact Inquiry", ...doc.data() })),
        ...collabSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      ].sort((a: any, b: any) => {
        const getMillis = (t: any) => {
          if (!t) return 0;
          if (typeof t.toMillis === "function") return t.toMillis();
          if (typeof t.toDate === "function") return t.toDate().getTime();
          return new Date(t).getTime() || 0;
        };
        return getMillis(b.timestamp || b.createdAt) - getMillis(a.timestamp || a.createdAt);
      });

      setMessages(mergedInquiries);
      setSubscribers(subSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setUpdates(updSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setSystemStatus((prev) => ({
        ...prev,
        lastSync: new Date(),
        isQuotaExceeded: false,
        lastError: null,
      }));
      console.log("✅ [SYNC] Metrics updated successfully");
    } catch (error: any) {
      console.error("❌ [SYNC] Failed to fetch secondary data:", error);
      const errInfo = handleFirestoreError(
        error,
        OperationType.GET,
        "secondary_data"
      );
      if (errInfo.isQuotaExceeded) {
        setSystemStatus((prev) => ({
          ...prev,
          isQuotaExceeded: true,
          lastError: "Usage limit reached (Quota Exceeded)",
        }));
        addToast("Sync failed: Firestore Quota Exceeded.", "error");
      }
    }
  };

  useEffect(() => {
    console.log("🔄 [SYNC] Initializing Dashboard Synchronization Pipeline...");

    // 1. Critical Real-time Listeners (Blogs & Projects & Campaigns)
    const qBlogs = query(collection(db, "blogs"));
    const unsubscribeBlogs = onSnapshot(
      qBlogs,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => {
            const getMillis = (date: any) => {
              if (!date) return 0;
              if (typeof date.toMillis === "function") return date.toMillis();
              if (typeof date.toDate === "function") return date.toDate().getTime();
              if (date.seconds) return date.seconds * 1000;
              if (date._seconds) return date._seconds * 1000;
              const parsed = new Date(date).getTime();
              return isNaN(parsed) ? 0 : parsed;
            };
            return getMillis(b.createdAt) - getMillis(a.createdAt);
          });
        setPosts(data);
        setSystemStatus((prev) => ({
          ...prev,
          lastSync: new Date(),
          isQuotaExceeded: false,
          lastError: null,
        }));
      },
      (error) => {
        const errInfo = handleFirestoreError(error, OperationType.GET, "blogs");
        if (errInfo.isQuotaExceeded) {
          setSystemStatus((prev) => ({
            ...prev,
            isQuotaExceeded: true,
            lastError: "Daily usage limit reached (Quota Exceeded)",
          }));
        }
      }
    );

    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribeProjects = onSnapshot(
      qProjects,
      (snapshot) => {
        setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "projects");
      }
    );

    const qCampaigns = query(
      collection(db, "newsletter_campaigns"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeCampaigns = onSnapshot(
      qCampaigns,
      (snapshot) => {
        setCampaigns(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "newsletter_campaigns");
      }
    );

    const qProducts = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeProducts = onSnapshot(
      qProducts,
      (snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "products");
      }
    );

    const qCourses = query(
      collection(db, "courses"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeCourses = onSnapshot(
      qCourses,
      (snapshot) => {
        setCourses(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "courses");
      }
    );

    // 2. Optimized One-Time Fetches
    fetchSecondaryData();

    return () => {
      unsubscribeBlogs();
      unsubscribeProjects();
      unsubscribeCampaigns();
      unsubscribeProducts();
      unsubscribeCourses();
    };
  }, []);

  return {
    posts,
    setPosts,
    projects,
    setProjects,
    products,
    setProducts,
    courses,
    setCourses,
    messages,
    setMessages,
    subscribers,
    setSubscribers,
    campaigns,
    setCampaigns,
    updates,
    setUpdates,
    systemStatus,
    setSystemStatus,
    forceRefresh,
    refreshSecondary: fetchSecondaryData,
  };
};
