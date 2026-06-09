import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Download, Bell, Sparkles, ChevronRight, Zap, 
  ShieldCheck, LogOut, BookOpen, Video, Users, Play, Clock, ArrowUpRight, Lock
} from 'lucide-react';
import { auth, onAuthStateChanged, signOut, db, doc, getDoc, getDocs, collection, query, where } from '../firebase';
import { useSEO } from '../hooks/useSEO';
import { EcosystemCard } from '../components/ui/EcosystemCard';

import { Product, ProductTier } from '../types';
import { getPublishedProducts } from '../lib/product-utils';
import { useAnalytics } from '../hooks/useAnalytics';
import { MagneticButton } from '../components/ui/MagneticButton';
import { resolveTier, TIER_ORDER, TIERS } from '../lib/pricing';
import { cn } from '../lib/utils';
import { getContinueLearning, getRecommendedUnlocks, getUpgradePaths } from '../lib/recommendations';
import { ensureReferralCode } from '../lib/referral';
import { secureDownload } from '../lib/download';
import { VaultContinueLearning } from '../components/sections/VaultContinueLearning';
import { VaultRecommendedUnlocks } from '../components/sections/VaultRecommendedUnlocks';
import { VaultUpgradePath } from '../components/sections/VaultUpgradePath';
import { VaultStreak } from '../components/sections/VaultStreak';
import { VaultReferralShare } from '../components/sections/VaultReferralShare';
import { VaultNextUnlock } from '../components/sections/VaultNextUnlock';
import { VaultProductCard } from '../components/ui/VaultProductCard';

export const VaultPage = () => {
  console.log('[VaultPage] Component mounting');
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('blueprints');
  const [ownedProducts, setOwnedProducts] = useState<Product[]>([]);
  const [discoverProducts, setDiscoverProducts] = useState<Product[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [registeredWorkshops, setRegisteredWorkshops] = useState<any[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  const { trackEvent } = useAnalytics();
  console.log('[VaultPage] State initialized:', { loading, authChecked, user: !!user });

  useSEO({
    title: "My Digital Vault | Ayush Paul",
    description: "Your private authenticated vault for downloaded blueprints, courses, and registered workshops.",
  });

  useEffect(() => {
    console.log('[VaultPage] Auth listener mounted');
    trackEvent('lab_visit');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[VaultPage] Auth state changed:', currentUser ? `uid=${currentUser.uid}` : 'null');
      setAuthChecked(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const profileSnap = await getDoc(doc(db, 'users', currentUser.uid));
          const profileData = profileSnap.exists() ? profileSnap.data() : {};
          console.log('[VaultPage] Profile loaded:', { exists: profileSnap.exists(), keys: Object.keys(profileData) });
          setProfile(profileData);
          
          const ownedMap = profileData?.ownedProducts || {};
          const ownedIds = Object.keys(ownedMap);
          console.log('[VaultPage] Owned products:', { count: ownedIds.length, ids: ownedIds });

          const allProducts = await getPublishedProducts();
          console.log('[VaultPage] Published products:', { count: allProducts.length });

          // Fallback: also query purchases collection for any product IDs not in ownedProducts
          try {
            const purchaseSnap = await getDocs(
              query(collection(db, "purchases"), where("userId", "==", currentUser.uid))
            );
            const purchasedIds = purchaseSnap.docs.map(d => d.data().productId).filter(Boolean);
            if (purchasedIds.length > 0) {
              console.log('[VaultPage] Purchases collection IDs:', { count: purchasedIds.length, ids: purchasedIds });
              for (const pid of purchasedIds) {
                if (!ownedIds.includes(pid)) ownedIds.push(pid);
              }
            }
          } catch (purchaseErr) {
            console.warn('[VaultPage] Purchases collection query failed:', purchaseErr);
          }

          const filteredOwned = allProducts.filter(p => ownedIds.includes(p.id));
          setOwnedProducts(filteredOwned);
          
          const ownedOrClaimed = (p: Product) => ownedIds.includes(p.id) || p.type === 'free';
          setDiscoverProducts(allProducts.filter(p => !ownedOrClaimed(p)));
        } catch (profileErr) {
          console.error('[VaultPage] Profile/products load FAILED:', profileErr);
        }

        // Fetch Enrolled Courses
        try {
          console.log('[VaultPage] Fetching enrollments...');
          const enrollSnap = await getDocs(
            query(collection(db, "enrollments"), where("userId", "==", currentUser.uid))
          );
          console.log('[VaultPage] Enrollments fetched:', { count: enrollSnap.docs.length });
          const enrollMap: Record<string, any> = {};
          enrollSnap.docs.forEach((doc) => {
            const data = doc.data();
            if (data.courseId) {
              enrollMap[data.courseId] = data;
            }
          });

          const coursesSnap = await getDocs(
            query(collection(db, "courses"), where("isPublished", "==", true))
          );
          const coursesList = coursesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setAllCourses(coursesList);

          const enrolledList = coursesList.filter(c => enrollMap[c.id]).map(c => ({
            ...c,
            progressData: enrollMap[c.id]
          }));
          setEnrolledCourses(enrolledList);
          console.log('[VaultPage] Enrolled courses resolved:', { count: enrolledList.length });
        } catch (courseErr) {
          console.error('[VaultPage] Enrolled courses FAILED:', courseErr);
        }

        // Fetch Registered Workshops — only by userId (no email backfill)
        try {
          console.log('[VaultPage] Fetching workshop registrations for user:', { uid: currentUser.uid, email: currentUser.email });
          const userIdQuery = query(
            collection(db, "workshop_registrations"),
            where("userId", "==", currentUser.uid)
          );
          const userIdSnap = await getDocs(userIdQuery);
          console.log('[VaultPage] Registration query result:', {
            userId: currentUser.uid,
            docsFound: userIdSnap.docs.length,
            docs: userIdSnap.docs.map(d => ({ id: d.id, ...d.data() })),
          });

          const registeredIds = userIdSnap.docs
            .map(d => d.data().workshopId)
            .filter(Boolean);

          console.log('[VaultPage] Extracted workshopIds:', registeredIds);

          const allWorkshopsSnap = await getDocs(
            query(collection(db, "workshops"), where("isPublished", "==", true))
          );
          const allWorkshopsList = allWorkshopsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as any);
          console.log('[VaultPage] Published workshops available:', { count: allWorkshopsList.length, ids: allWorkshopsList.map((w: any) => w.id) });

          const filteredWorkshops = allWorkshopsList.filter((w: any) => registeredIds.includes(w.id));
          console.log('[VaultPage] Resolved registered workshops:', {
            count: filteredWorkshops.length,
            workshops: (filteredWorkshops as any[]).map(w => ({ id: w.id, title: w.title, workshopStatus: w.workshopStatus })),
          });
          setRegisteredWorkshops(filteredWorkshops);
        } catch (wErr) {
          console.error('[VaultPage] Workshops FAILED:', wErr);
        }

      }
      setLoading(false);
      console.log('[VaultPage] Data loading complete, setting loading=false');
    });
    return () => {
      console.log('[VaultPage] Auth listener unsubscribed');
      unsubscribe();
    };
  }, [navigate]);

  // Auto-generate referral code if missing
  useEffect(() => {
    if (user && profile && !profile.referralCode) {
      ensureReferralCode(user.uid, profile).then((code) => {
        if (code) setProfile((prev: any) => ({ ...prev, referralCode: code }));
      });
    }
  }, [user, profile]);

  useEffect(() => {
    if (!loading && authChecked && !user) {
      navigate('/', { replace: true });
    }
  }, [loading, authChecked, user, navigate]);

  const ownedByTier = useMemo(() => {
    const groups: Record<ProductTier, Product[]> = { free: [], starter: [], pro: [], premium: [] };
    for (const p of ownedProducts) {
      const tier = resolveTier(p);
      if (groups[tier]) groups[tier].push(p);
    }
    return groups;
  }, [ownedProducts]);

  const referralCode = profile?.referralCode || null;
  const paidOwnedCount = ownedProducts.filter(p => resolveTier(p) !== 'free').length;
  const freeOwnedCount = ownedByTier.free.length;
  const totalProductCount = ownedProducts.length + discoverProducts.length;

  const continueLearning = useMemo(
    () => getContinueLearning(enrolledCourses, ownedProducts),
    [enrolledCourses, ownedProducts],
  );

  const recommendedUnlocks = useMemo(
    () => getRecommendedUnlocks(ownedProducts, enrolledCourses, discoverProducts, allCourses),
    [ownedProducts, enrolledCourses, discoverProducts, allCourses],
  );

  const upgradePaths = useMemo(
    () => getUpgradePaths(ownedProducts, [...ownedProducts, ...discoverProducts]),
    [ownedProducts, discoverProducts],
  );

  if (loading || !user) {
    return (
      <div className="w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#d1f34d]/25 border-t-[#d1f34d] rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/40">Verifying Identity</span>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleDownload = async (product: Product) => {
    trackEvent('file_download', {
      product_id: product.id,
      product_name: product.title
    });

    try {
      const filename = product.title.replace(/\s+/g, '-').toLowerCase() + '.zip';
      await secureDownload(product.id, filename);
    } catch (err: any) {
      console.error('[Vault] Download failed:', err);
      alert(err.message || 'Download failed. Please try again.');
    }
  };

  const isNewPurchase = new URLSearchParams(window.location.search).get('product_id');


  const tabs = [
    { id: 'blueprints', label: 'Blueprints & Systems', icon: Package },
    { id: 'courses', label: 'Courses & Tracks', icon: BookOpen },
    { id: 'workshops', label: 'Live Workshops', icon: Video },
    { id: 'mentorship', label: '1-on-1 Sessions', icon: Users }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary pt-24 pb-32 relative overflow-hidden"
    >
      {/* Background Soft Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(11,28,48,0.02)_1px,transparent_0)] bg-[size:40px_40px] pointer-events-none opacity-100 -z-10" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Success / Onboarding Alert */}
        <AnimatePresence>
          {isNewPurchase && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-6 rounded-2xl bg-green-50 border border-green-200 overflow-hidden text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center">
                  <Zap size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#0b1c30] tracking-tight">System Unlocked Successfully</h4>
                  <p className="text-xs text-green-700 font-semibold">Your new innovation asset has been added to your Digital Vault.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-[#c2c6d6]/20">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-full border border-[#c2c6d6]/30 overflow-hidden relative bg-[#eff4ff] flex items-center justify-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[#0b1c30] uppercase">
                  {user?.email?.charAt(0) || 'I'}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#d1f34d]">Innovator Profile</span>
                <ShieldCheck size={12} className="text-[#d1f34d]" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">
                {profile?.displayName || "Innovator"}
              </h1>
              <p className="text-[#424754]/60 text-xs mt-0.5 font-semibold">{user?.email}</p>
            </div>
          </div>
          
          <MagneticButton>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-red-500/30 text-red-650 hover:bg-red-55 transition-all duration-300 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </MagneticButton>
        </div>

        {/* Info alerts */}
        <div className="p-4 rounded-2xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 flex items-start sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <Bell size={14} className="text-[#d1f34d] shrink-0" />
            <p className="text-xs text-[#424754] font-semibold">
              <strong className="text-[#0b1c30]">Secure Vault:</strong> Every digital track, live workshop access link, and code audit is cataloged inside your authenticated profile.
            </p>
          </div>
        </div>

        {/* Engine: Next Unlock / Upgrade Pressure */}
        <div className="mb-12">
          <VaultNextUnlock
            ownedTier={profile?.tier || null}
            ownedCount={paidOwnedCount}
            totalCount={totalProductCount}
          />
        </div>

        {/* Tab switcher navigation */}
        <div className="flex items-center gap-2 border-b border-[#c2c6d6]/20 pb-6 mb-12 flex-wrap text-left">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 cursor-pointer
                  ${isActive
                    ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-sm'
                    : 'bg-white border-[#c2c6d6]/30 text-[#424754]/85 hover:text-[#0b1c30] hover:border-[#d1f34d]'
                  }`}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Area */}
        <div className="mb-20 text-left">
          <AnimatePresence mode="wait">
            {activeTab === 'blueprints' && (
              <motion.div
                key="blueprints"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {ownedProducts.length > 0 ? (
                  <div className="space-y-16">
                    {/* Free Content Section */}
                    {freeOwnedCount > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <ShieldCheck size={16} className="text-[#558b2f]" />
                          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0b1c30]">Free Content</h3>
                          <span className="text-[10px] font-bold text-[#424754]/40">({freeOwnedCount})</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {ownedByTier.free.map(product => (
                            <VaultProductCard key={product.id} product={product} profile={profile} onDownload={handleDownload} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Owned Systems Section — paid products grouped by tier */}
                    {paidOwnedCount > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <Package size={16} className="text-[#6b35ff]" />
                          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0b1c30]">Owned Systems</h3>
                          <span className="text-[10px] font-bold text-[#424754]/40">({paidOwnedCount})</span>
                        </div>
                        {TIER_ORDER.filter(t => t !== 'free').map(tier => {
                          const tierProducts = ownedByTier[tier];
                          if (tierProducts.length === 0) return null;
                          return (
                            <div key={tier} className="mb-10 last:mb-0">
                              <div className="flex items-center gap-2 mb-4">
                                <span className={cn('w-2 h-2 rounded-full', TIERS[tier].dotColor)} />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/70">{TIERS[tier].label}</h4>
                                <span className="text-[9px] font-bold text-[#424754]/30">({tierProducts.length})</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tierProducts.map(product => (
                                  <VaultProductCard key={product.id} product={product} profile={profile} onDownload={handleDownload} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full p-12 rounded-[32px] border border-[#c2c6d6]/30 bg-white flex flex-col items-center justify-center text-center shadow-sm">
                    <Package size={36} className="text-[#424754]/25 mb-4" />
                    <h3 className="text-lg font-extrabold text-[#0b1c30] mb-1">Your blueprints are empty</h3>
                    <p className="text-[#424754]/60 text-xs mb-6 font-semibold">You haven't downloaded or purchased any blueprints yet.</p>
                    <MagneticButton>
                      <Link to="/blueprints" className="px-6 py-3 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] font-bold text-[10px] uppercase tracking-wider rounded-full transition-colors flex items-center justify-center h-11">
                        Explore Blueprints
                      </Link>
                    </MagneticButton>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8">
                  <VaultStreak enrollments={enrolledCourses} />
                </div>

                {enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map(course => {
                      const completedCount = course.progressData?.progress?.length || 0;
                      const totalCount = course.lessonsCount || 10;
                      const percent = Math.min(100, Math.round((completedCount / totalCount) * 100));

                      return (
                        <div key={course.id} className="p-6 rounded-[32px] bg-white border border-[#c2c6d6]/30 flex flex-col group hover:border-[#d1f34d] hover:shadow-ambient hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                          <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 relative bg-bg-secondary border border-[#c2c6d6]/10 flex items-center justify-center">
                            {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen size={48} className="text-gray-200" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#d1f34d] px-2.5 py-0.5 rounded-full bg-[#d1f34d]/10 border border-[#d1f34d]/20">
                            {course.category}
                          </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-green-650 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200">
                              Active Track
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-[#0b1c30] mb-1.5 line-clamp-1">{course.title}</h3>
                          
                          {/* Progress bar */}
                          <div className="mt-2 mb-6">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-2">
                              <span>Progress</span>
                              <span className="text-[#d1f34d]">{percent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#d1f34d] transition-all duration-500" style={{ width: `${percent}%` }} />
                            </div>
                          </div>

                          <MagneticButton className="w-full mt-auto">
                            <Link 
                              to={`/mastery/courses/${course.id}`}
                              className="w-full py-3.5 rounded-full bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-11"
                            >
                              <Play size={12} className="fill-current" /> Resume Study
                            </Link>
                          </MagneticButton>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full p-12 rounded-[32px] border border-[#c2c6d6]/30 bg-white flex flex-col items-center justify-center text-center shadow-sm">
                    <BookOpen size={36} className="text-[#424754]/25 mb-4" />
                    <h3 className="text-lg font-extrabold text-[#0b1c30] mb-1">No enrolled tracks</h3>
                    <p className="text-[#424754]/60 text-xs mb-6 font-semibold">You haven't enrolled in any self-paced compounding tracks yet.</p>
                    <MagneticButton>
                      <Link to="/mastery" className="px-6 py-3 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] font-bold text-[10px] uppercase tracking-wider rounded-full transition-colors flex items-center justify-center h-11">
                        Explore Mastery
                      </Link>
                    </MagneticButton>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'workshops' && (
              <motion.div
                key="workshops"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {registeredWorkshops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(() => {
                      const upcomingList = registeredWorkshops.filter(w =>
                        w.workshopStatus === 'UPCOMING' || w.workshopStatus === 'LIVE'
                      );
                      const pastList = registeredWorkshops.filter(w =>
                        w.workshopStatus === 'COMPLETED' || w.workshopStatus === 'CANCELLED'
                      );
                      const hasStatus = upcomingList.length > 0 || pastList.length > 0;
                      const displayList = hasStatus ? [...upcomingList, ...pastList] : registeredWorkshops;
                      return displayList.flatMap(workshop => {
                        const isLive = workshop.workshopStatus === 'LIVE';
                        const isUpcoming = workshop.workshopStatus === 'UPCOMING';
                        const showJoin = isLive && workshop.meetingLink;
                        const el = (
                          <div key={workshop.id} className="p-8 rounded-[32px] bg-white border border-[#c2c6d6]/30 flex flex-col justify-between group hover:border-[#d1f34d] hover:shadow-ambient hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                            <div className="space-y-4 text-left">
                              <div className="flex items-center gap-2">
                                {isLive ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Live Now
                                  </span>
                                ) : isUpcoming ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles size={11} /> Upcoming
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200 text-[9px] font-bold uppercase tracking-wider">
                                    {workshop.workshopStatus === 'CANCELLED' ? 'Cancelled' : 'Completed'}
                                  </span>
                                )}
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/50">
                                  Workshop
                                </span>
                              </div>
                              <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight">{workshop.title}</h3>
                              <p className="text-xs text-[#424754] leading-relaxed font-semibold">{workshop.description}</p>
                              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[#c2c6d6]/10 text-xs font-bold text-[#424754]/75">
                                <div className="flex items-center gap-1.5">
                                  <Clock size={14} className="text-[#d1f34d]" />
                                  <span>{workshop.date || 'TBD'}{workshop.time ? ` • ${workshop.time}` : ''}</span>
                                </div>
                                <div className="flex items-center gap-1.5 justify-end">
                                  <span>Instructor: {workshop.instructor || 'Ayush Paul'}</span>
                                </div>
                              </div>
                              {showJoin && workshop.meetingPassword && (
                                <div className="text-xs font-bold text-[#424754]/80 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                  <Lock size={12} className="text-[#d1f34d]" />
                                  <span>Password: <span className="font-mono text-[#0b1c30]">{workshop.meetingPassword}</span></span>
                                </div>
                              )}
                              {workshop.workshopStartTime && (
                                <div className="text-[10px] font-semibold text-[#424754]/60 flex items-center gap-1.5">
                                  <Clock size={11} className="text-[#d1f34d]" />
                                  <span>Scheduled: {workshop.workshopStartTime}</span>
                                </div>
                              )}
                            </div>
                            {showJoin ? (
              <MagneticButton className="w-full mt-6">
                <a href={workshop.meetingLink} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-11"
                >
                  <Play size={12} className="fill-current" /> Join Live Workshop <ArrowUpRight size={14} />
                </a>
              </MagneticButton>
            ) : isUpcoming ? (
              <div className="w-full mt-6 py-3.5 rounded-full bg-gray-100 text-[#424754]/50 font-bold text-xs uppercase tracking-wider text-center cursor-default">
                Reserved Seat
              </div>
            ) : workshop.workshopStatus === 'COMPLETED' && workshop.recordingUrl ? (
              <MagneticButton className="w-full mt-6">
                <a href={workshop.recordingUrl} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-11"
                >
                  <Play size={12} className="fill-current" /> Watch Recording <ArrowUpRight size={14} />
                </a>
              </MagneticButton>
            ) : (
              <div className="w-full mt-6 py-3.5 rounded-full bg-gray-100 text-[#424754]/50 font-bold text-xs uppercase tracking-wider text-center cursor-default">
                {workshop.workshopStatus === 'CANCELLED' ? 'Session Cancelled' : 'Recording Coming Soon'}
              </div>
            )}
                          </div>
                        );
                        return el;
                      });
                    })()}
                  </div>
                ) : (
                  <div className="w-full p-12 rounded-[32px] border border-[#c2c6d6]/30 bg-white flex flex-col items-center justify-center text-center shadow-sm">
                    <Video size={36} className="text-[#424754]/25 mb-4" />
                    <h3 className="text-lg font-extrabold text-[#0b1c30] mb-1">No registered workshops</h3>
                    <p className="text-[#424754]/60 text-xs mb-6 font-semibold">You are not registered for any upcoming live building sessions.</p>
                    <MagneticButton>
                      <Link to="/mastery" className="px-6 py-3 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] font-bold text-[10px] uppercase tracking-wider rounded-full transition-colors flex items-center justify-center h-11">
                        View Upcoming Workshops
                      </Link>
                    </MagneticButton>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'mentorship' && (
              <motion.div
                key="mentorship"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* For Phase 1 we display the empty state with CTA or application statuses */}
                <div className="w-full p-12 rounded-[32px] border border-[#c2c6d6]/30 bg-white flex flex-col items-center justify-center text-center shadow-sm">
                  <Users size={36} className="text-[#424754]/25 mb-4" />
                  <h3 className="text-lg font-extrabold text-[#0b1c30] mb-1">No active 1-on-1 sessions</h3>
                  <p className="text-[#424754]/60 text-xs mb-6 font-semibold">Prefer personalized learning? Book private sessions and learn directly with Ayush. Follow the same tracks with live guidance.</p>
                  <div className="flex gap-4 items-center justify-center flex-wrap">
                    <MagneticButton>
                      <Link to="/collaborate" className="px-6 py-3 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] font-bold text-[10px] uppercase tracking-wider rounded-full transition-colors flex items-center justify-center h-11">
                        Book Learning Session
                      </Link>
                    </MagneticButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Engine: Referral Share */}
        <div className="mb-12">
          <VaultReferralShare referralCode={referralCode} />
        </div>

        {/* Engine: Continue Learning */}
        <VaultContinueLearning items={continueLearning} />

        {/* Engine: Recommended Unlocks */}
        <VaultRecommendedUnlocks items={recommendedUnlocks} />

        {/* Engine: Upgrade Path */}
        <VaultUpgradePath offers={upgradePaths} />

        {/* Discovery / Upsell Section */}
        <div>
          <div className="flex items-center justify-between mb-8 border-t border-[#c2c6d6]/20 pt-12 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#d1f34d]" size={20} />
              <h2 className="text-xl font-extrabold tracking-tight text-[#0b1c30]">Discover Premium Blueprints</h2>
            </div>
            <Link to="/blueprints" className="text-[10px] font-bold uppercase tracking-wider text-[#d1f34d] hover:text-[#c0e045] transition-colors flex items-center gap-0.5 cursor-pointer">
              View All <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoverProducts.map(product => (
              <EcosystemCard key={product.id} project={product} />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default VaultPage;
