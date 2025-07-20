import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged,
  getIdToken,
} from 'firebase/auth';
import { auth } from './firebase';
import { User } from '@/stores';

export class FirebaseAuthService {
  // Convert Firebase User to our User interface
  static mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      avatar: firebaseUser.photoURL || undefined,
      provider: this.getProviderType(firebaseUser),
    };
  }

  // Determine provider type from Firebase user
  static getProviderType(firebaseUser: FirebaseUser): User['provider'] {
    const providerId = firebaseUser.providerData[0]?.providerId;
    switch (providerId) {
      case 'google.com':
        return 'google';
      case 'github.com':
        return 'github';
      case 'microsoft.com':
        return 'microsoft';
      case 'password':
      default:
        return 'email';
    }
  }

  // Email/Password Authentication
  static async signInWithEmail(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(userCredential.user);
      const user = this.mapFirebaseUser(userCredential.user);
      
      // Set token in cookie for middleware access
      this.setTokenCookie(token);
      
      return { user, token };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async signUpWithEmail(email: string, password: string, displayName?: string): Promise<{ user: User; token: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      const token = await getIdToken(userCredential.user);
      const user = this.mapFirebaseUser(userCredential.user);
      
      // Set token in cookie for middleware access
      this.setTokenCookie(token);
      
      return { user, token };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Cookie management
  static setTokenCookie(token: string): void {
    if (typeof document !== 'undefined') {
      document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; secure; samesite=strict`;
    }
  }

  static removeTokenCookie(): void {
    if (typeof document !== 'undefined') {
      document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  // Social Authentication
  static async signInWithGoogle(): Promise<{ user: User; token: string }> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      const token = await getIdToken(userCredential.user);
      const user = this.mapFirebaseUser(userCredential.user);
      
      // Set token in cookie for middleware access
      this.setTokenCookie(token);
      
      return { user, token };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async signInWithGithub(): Promise<{ user: User; token: string }> {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('user:email');
      
      const userCredential = await signInWithPopup(auth, provider);
      const token = await getIdToken(userCredential.user);
      const user = this.mapFirebaseUser(userCredential.user);
      
      // Set token in cookie for middleware access
      this.setTokenCookie(token);
      
      return { user, token };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async signInWithMicrosoft(): Promise<{ user: User; token: string }> {
    try {
      const provider = new OAuthProvider('microsoft.com');
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      const token = await getIdToken(userCredential.user);
      const user = this.mapFirebaseUser(userCredential.user);
      
      // Set token in cookie for middleware access
      this.setTokenCookie(token);
      
      return { user, token };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Alternative: Redirect-based social auth (better for mobile)
  static async signInWithGoogleRedirect(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    await signInWithRedirect(auth, provider);
  }

  static async signInWithGithubRedirect(): Promise<void> {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');
    await signInWithRedirect(auth, provider);
  }

  static async signInWithMicrosoftRedirect(): Promise<void> {
    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('email');
    provider.addScope('profile');
    await signInWithRedirect(auth, provider);
  }

  // Handle redirect result (call this on app initialization)
  static async handleRedirectResult(): Promise<{ user: User; token: string } | null> {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        const token = await getIdToken(result.user);
        const user = this.mapFirebaseUser(result.user);
        return { user, token };
      }
      return null;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Password Reset
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign Out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
      this.removeTokenCookie();
    } catch (error: any) {
      this.removeTokenCookie(); // Remove cookie even if signOut fails
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Get ID token for current user
  static async getCurrentToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      return await getIdToken(user);
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  // Auth state listener
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = this.mapFirebaseUser(firebaseUser);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  // Error message mapping
  static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completion.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by the browser.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in method.';
      default:
        return 'An error occurred during authentication.';
    }
  }
}