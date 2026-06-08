import { useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "../../firebase";
import { getFirebaseStatus } from "../../config/firebase-config";

import { isUserAdmin } from "../../config/admin";

export const useAdminAuth = () => {
  const { isConfigured } = getFirebaseStatus();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    console.log("🕵️ [AUTH] Starting Auth Listener & Redirect Check...");

    // Check for redirect results (if user was sent back from Google)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("✅ [AUTH] Redirect Login Success:", result.user.email);
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("❌ [AUTH] Redirect Error:", error);
        setLoginError(`Redirect Login Failed: ${error.message}`);
      });

    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("👤 [AUTH] User state changed:", u?.email || "Signed Out");
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [isConfigured]);

  const handleLogin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    console.log("🚀 [AUTH] Attempting Popup Login...");

    try {
      await signInWithPopup(auth, googleProvider);
      console.log("✅ [AUTH] Popup Login Success");
    } catch (error: any) {
      console.error("❌ [AUTH] Popup Error Code:", error.code);
      console.error("❌ [AUTH] Popup Error Message:", error.message);

      // Handle specific error cases
      if (error.code === "auth/popup-closed-by-user") {
        setLoginError("Login cancelled. Please try again.");
      } else if (error.code === "auth/unauthorized-domain") {
        setLoginError(
          "This domain is not authorized. Please check Firebase Console."
        );
      } else if (error.code === "auth/popup-blocked") {
        setLoginError("Popup blocked by browser. Switching to redirect...");
        // Auto-fallback to redirect if popup is blocked
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          setLoginError(`Redirect Fallback Failed: ${redirectError.message}`);
        }
      } else {
        // General fallback for all other popup issues on localhost
        console.log("🔄 [AUTH] General Failure - Attempting Redirect Fallback...");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          setLoginError(`Login Error: ${error.message}`);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("❌ [AUTH] Signout Failed:", error);
    }
  };

  const isAuthorized = user && isUserAdmin(user.uid, user.email);

  return {
    user,
    loading,
    loginError,
    isLoggingIn,
    isAuthorized,
    handleLogin,
    handleLogout,
  };
};
