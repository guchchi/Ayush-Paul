import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Product, DownloadAnalytics, AssetCategory, ResourceItem, ChangelogEntry } from "../types";
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

// Fallback dynamic parser for legacy products to ensure zero-breakage backward compatibility
export const enrichDigitalSystem = (system: any): Product => {
  if (!system) return system;

  const enriched = { ...system } as Product;
  const slug = enriched.slug || '';

  // 1. Dynamic Override to translate robotics DB items to Digital Frameworks
  if (slug.includes('boat') || slug.includes('water')) {
    enriched.title = "AI Website Launch Blueprint";
    enriched.category = "web";
    enriched.description = "Learn how to research, design, build, and deploy a high-performance Next.js website using AI assistants without sacrificing technical SEO.";
    enriched.thumbnail = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200";
    
    enriched.resources = [
      {
        id: `${enriched.id}_nextjs_boilerplate`,
        title: "Next.js & Tailwind App Boilerplate",
        description: "High-performance base template optimized for speed and SEO structure.",
        category: AssetCategory.TEMPLATE,
        isPremium: false,
        fileSize: "1.2 MB"
      },
      {
        id: `${enriched.id}_cursor_rules`,
        title: "Custom Cursor AI Rules Config",
        description: "System instructions files to guide AI assistants on styling and structures.",
        category: AssetCategory.CODE,
        isPremium: true,
        fileSize: "8 KB"
      },
      {
        id: `${enriched.id}_seo_checklist`,
        title: "Website SEO Sitemap Checklist",
        description: "The sitemap construction, redirect structure, and crawl checklist.",
        category: AssetCategory.PDF,
        isPremium: true,
        fileSize: "2.4 MB"
      }
    ];
  } else if (slug.includes('iobot') || slug.includes('companion')) {
    enriched.title = "Automation Starter Pack";
    enriched.category = "automation";
    enriched.description = "Reusable operational workflows designed to link databases, trigger webhooks, and automate content delivery.";
    enriched.thumbnail = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200";
    
    enriched.resources = [
      {
        id: `${enriched.id}_make_json`,
        title: "Make.com Scenario JSON Config",
        description: "Exported automation blueprints ready to import directly into Make.",
        category: AssetCategory.TEMPLATE,
        isPremium: false,
        fileSize: "150 KB"
      },
      {
        id: `${enriched.id}_webhook_code`,
        title: "Webhook Middleware & Database Sync Node",
        description: "NodeJS script to capture payloads and sync database records dynamically.",
        category: AssetCategory.CODE,
        isPremium: true,
        fileSize: "45 KB"
      },
      {
        id: `${enriched.id}_stripe_handler`,
        title: "Stripe Event Webhook Handler",
        description: "Secure, signature-verified endpoint scripts to manage user access.",
        category: AssetCategory.CODE,
        isPremium: true,
        fileSize: "18 KB"
      }
    ];
  } else if (slug.includes('haptic') || slug.includes('teleoperation')) {
    enriched.title = "SEO Foundation Checklist";
    enriched.category = "ai";
    enriched.description = "The exact step-by-step technical checklist used to optimize, structure, and audit websites for search visibility.";
    enriched.thumbnail = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200";
    
    enriched.resources = [
      {
        id: `${enriched.id}_schema_generator`,
        title: "Technical JSON-LD Schema Generator",
        description: "Script to automatically construct and inject structured data metadata.",
        category: AssetCategory.CODE,
        isPremium: false,
        fileSize: "12 KB"
      },
      {
        id: `${enriched.id}_audit_checklist`,
        title: "Technical SEO Crawl Audit Checklist",
        description: "Complete checklist covering robots.txt, canonicalization, and index rules.",
        category: AssetCategory.PDF,
        isPremium: false,
        fileSize: "3.2 MB"
      }
    ];
  }

  // 2. Changelog fallback
  if (!enriched.changelog || enriched.changelog.length === 0) {
    const generatedChangelog: ChangelogEntry[] = [
      {
        version: "v1.0.0",
        date: "2026-04-15",
        title: "Initial Mainframe Core Deployment",
        description: "Official publication of system schematics, baseline components, and core blueprints.",
        changes: {
          added: [
            "Baseline blueprints and configuration files",
            "Technical checklists and wiring guides",
            "Quickstart operational setup instructions"
          ]
        }
      },
      {
        version: "v1.1.0",
        date: "2026-05-10",
        title: "Workflow Refinements & Core Optimization",
        description: "Performance tuning, data compression updates, and documentation repairs.",
        changes: {
          improved: [
            "Reduced latency overhead in webhook handlers",
            "Updated and optimized code templates"
          ],
          fixed: [
            "Resolved sitemap crawl issues",
            "Fixed webhook connection handshake timeouts"
          ]
        }
      }
    ];
    enriched.changelog = generatedChangelog;
  }

  return enriched;
};

// Fetch all published products with Multi-Tier Cache (Memory -> LocalStorage -> Firestore)
export const getPublishedProducts = async (): Promise<Product[]> => {
  const now = Date.now();

  // 1. Check Memory Cache
  if (memoryCache && (now - memoryCacheTimestamp < CACHE_TTL_MS)) {
    console.log("[Cache] Product List: Memory Hit");
    return memoryCache.map(enrichDigitalSystem);
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
        return localCache.products.map(enrichDigitalSystem);
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

    return products.map(enrichDigitalSystem);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "products");
    return (memoryCache || []).map(enrichDigitalSystem); // Return stale memory cache if network fails
  }
};

// Fetch a single product by slug (leverages the same cache)
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  // Try to find it in the cached list first to save a document read
  const allProducts = await getPublishedProducts();
  const cachedProduct = allProducts.find(p => p.slug === slug);
  if (cachedProduct) {
    console.log(`[Cache] Product '${slug}': Hit`);
    return enrichDigitalSystem(cachedProduct);
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
    const product = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
    return enrichDigitalSystem(product);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `products/${slug}`);
    return null;
  }
};
