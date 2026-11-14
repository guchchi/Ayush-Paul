import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export interface GitGlowConnectedUser {
  uid: string;
  githubUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  accessToken: string;
  connectedAt: string;
}

const STORAGE_KEY = 'gitglow_connected_github_session';

/**
 * Configure GithubAuthProvider with repository permissions needed
 * for GitGlow badge missions (creating issues, merging PRs).
 */
export const gitglowGithubProvider = new GithubAuthProvider();
gitglowGithubProvider.addScope('repo');
gitglowGithubProvider.addScope('read:user');
gitglowGithubProvider.setCustomParameters({
  allow_signup: 'false',
});

/**
 * Connect GitHub account specifically for GitGlow missions
 */
export async function connectGitHubForGitGlow(): Promise<GitGlowConnectedUser> {
  try {
    const result = await signInWithPopup(auth, gitglowGithubProvider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (!accessToken) {
      throw new Error('Failed to retrieve GitHub access token from authentication.');
    }

    const additionalInfo = (result as any)._tokenResponse || {};
    const githubUsername =
      additionalInfo.screenName ||
      result.user.displayName ||
      result.user.email?.split('@')[0] ||
      'developer';

    const connectedUser: GitGlowConnectedUser = {
      uid: result.user.uid,
      githubUsername,
      displayName: result.user.displayName,
      avatarUrl: result.user.photoURL,
      accessToken,
      connectedAt: new Date().toISOString(),
    };

    // Save session in local storage for session persistence
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connectedUser));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    return connectedUser;
  } catch (error: any) {
    console.error('GitGlow GitHub Connect Error:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('GitHub connection popup was closed before completion.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Connection request was cancelled.');
    }
    throw new Error(error.message || 'Failed to connect with GitHub.');
  }
}

/**
 * Retrieve active connected GitHub session
 */
export function getSavedGitGlowSession(): GitGlowConnectedUser | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to parse saved GitGlow session:', e);
  }
  return null;
}

/**
 * Disconnect GitHub session from GitGlow
 */
export async function disconnectGitGlowSession(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY);
    await signOut(auth);
  } catch (e) {
    console.warn('Signout warning:', e);
  }
}

