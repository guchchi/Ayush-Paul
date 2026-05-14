import { collection, query, where, getDocs, getDoc, doc, updateDoc, increment, addDoc, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Product, DownloadAnalytics } from "../types";
import { handleFirestoreError } from "./firebase-utils";
import { OperationType } from "../types";

// Fetch all published products
export const getPublishedProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("isPublished", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "products");
    return [];
  }
};

// Fetch a single product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const q = query(
      collection(db, "products"),
      where("slug", "==", slug),
      where("isPublished", "==", true),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `products/${slug}`);
    return null;
  }
};

// Increment view count safely
export const trackProductView = async (productId: string) => {
  const storageKey = `viewed_product_${productId}`;
  if (sessionStorage.getItem(storageKey)) return;

  try {
    await updateDoc(doc(db, "products", productId), {
      viewCount: increment(1)
    });
    sessionStorage.setItem(storageKey, "true");
  } catch (error) {
    console.error("Failed to track view:", error);
  }
};

// Track a free download
export const trackFreeDownload = async (product: Product, userId?: string) => {
  try {
    // 1. Increment the product's download count
    await updateDoc(doc(db, "products", product.id), {
      downloadCount: increment(1)
    });

    // 2. Add an analytics record
    const analyticsRef = collection(db, "downloads");
    const analyticsRecord: Partial<DownloadAnalytics> = {
      productId: product.id,
      productSlug: product.slug,
      timestamp: new Date().toISOString(),
      isAnonymous: !userId,
      ...(userId && { userId })
    };
    await addDoc(analyticsRef, analyticsRecord);

    return true;
  } catch (error) {
    console.error("Failed to track download:", error);
    return false;
  }
};

// Track Premium Intent (Upgrade Clicks)
export const trackPremiumIntent = async (productId: string, userId?: string) => {
  try {
    const intentRef = collection(db, "premium_intents");
    await addDoc(intentRef, {
      productId,
      timestamp: new Date().toISOString(),
      userId: userId || "anonymous"
    });
  } catch (error) {
    console.error("Failed to track premium intent:", error);
  }
};
