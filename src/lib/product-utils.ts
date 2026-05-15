import { collection, query, where, getDocs, getDoc, doc, updateDoc, increment, addDoc, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Product, DownloadAnalytics } from "../types";
import { handleFirestoreError } from "./firebase-utils";
import { OperationType } from "../types";

const CACHE_KEY = "products_cache";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CacheData {
  timestamp: number;
  products: Product[];
}

let memoryCache: Product[] | null = null;
let memoryCacheTimestamp: number = 0;

// Fetch all published products with Multi-Tier Cache (Memory -> LocalStorage -> Firestore)
export const getPublishedProducts = async (): Promise<Product[]> => {
  const now = Date.now();

  // 1. Check Memory Cache
  if (memoryCache && (now - memoryCacheTimestamp < CACHE_TTL_MS)) {
    console.log("[Cache] Product List: Memory Hit");
    return memoryCache;
  }

  // 2. Check LocalStorage Cache
  try {
    const localCacheStr = localStorage.getItem(CACHE_KEY);
    if (localCacheStr) {
      const localCache: CacheData = JSON.parse(localCacheStr);
      if (now - localCache.timestamp < CACHE_TTL_MS) {
        console.log("[Cache] Product List: LocalStorage Hit");
        memoryCache = localCache.products;
        memoryCacheTimestamp = localCache.timestamp;
        return localCache.products;
      }
    }
  } catch (e) {
    console.warn("Failed to read from localStorage cache:", e);
  }

  // 3. Fallback to Firestore (Network)
  console.log("[Cache] Product List: Network Fetch (Firestore)");
  try {
    const q = query(
      collection(db, "products"),
      where("isPublished", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // Update caches
    memoryCache = products;
    memoryCacheTimestamp = now;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now, products }));
    } catch (e) {
      console.warn("Failed to write to localStorage cache:", e);
    }

    return products;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "products");
    return memoryCache || []; // Return stale memory cache if network fails
  }
};

// Fetch a single product by slug (leverages the same cache)
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  // Try to find it in the cached list first to save a document read
  const allProducts = await getPublishedProducts();
  const cachedProduct = allProducts.find(p => p.slug === slug);
  if (cachedProduct) {
    console.log(`[Cache] Product '${slug}': Hit`);
    return cachedProduct;
  }

  // If not found in cache (e.g. unpublished but directly linked, or cache stale), fetch directly
  console.log(`[Cache] Product '${slug}': Network Fetch (Firestore)`);
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

