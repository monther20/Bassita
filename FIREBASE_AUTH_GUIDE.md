# Firebase Authentication Implementation Guide

## Overview

Your Next.js application now uses Firebase Authentication instead of custom JWT authentication. This provides better security, automatic token refresh, and built-in social authentication providers.

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Authentication in the Firebase Console
4. Configure sign-in methods:
   - Email/Password
   - Google
   - GitHub
   - (Discord can be added later)

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.local.example .env.local
```

Get these values from Firebase Project Settings > General > Your apps:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# For Firebase Admin SDK (server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### 3. Firebase Admin SDK Setup

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values for the environment variables above

## Usage Guide

### Authentication Methods

#### Email/Password Authentication

```tsx
import { useAuth } from '@/hooks';

function LoginForm() {
  const { login, signUp, error, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // User is automatically redirected
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      await signUp(email, password, name);
      // User is automatically redirected
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };
}
```

#### Social Authentication

```tsx
import { useAuth } from '@/hooks';

function SocialLogin() {
  const { loginWithGoogle, loginWithGithub } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // User is automatically redirected
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub();
      // User is automatically redirected
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  };
}
```

#### Password Reset

```tsx
import { useAuth } from '@/hooks';

function ForgotPassword() {
  const { sendPasswordReset } = useAuth();

  const handlePasswordReset = async (email: string) => {
    try {
      await sendPasswordReset(email);
      alert('Password reset email sent!');
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };
}
```

### Protected Routes

#### Using ProtectedLayout (Recommended)

```tsx
import ProtectedLayout from '@/components/layouts/ProtectedLayout';

export default function TasksPage() {
  return (
    <ProtectedLayout>
      <h1>Tasks Page</h1>
      {/* Your protected content */}
    </ProtectedLayout>
  );
}
```

#### Using AuthGuard Component

```tsx
import { AuthGuard } from '@/components';

export default function ProjectsPage() {
  return (
    <AuthGuard>
      <h1>Projects Page</h1>
      {/* Your protected content */}
    </AuthGuard>
  );
}
```

#### Using GuestGuard (for auth pages)

```tsx
import { GuestGuard } from '@/components';

export default function LoginPage() {
  return (
    <GuestGuard>
      {/* Login form - redirects authenticated users */}
    </GuestGuard>
  );
}
```

#### Using Hooks

```tsx
import { useAuth } from '@/hooks';

export default function CustomPage() {
  const { isAuthenticated, isLoading, user, isInitialized } = useAuth();

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
    </div>
  );
}
```

### User Information

```tsx
import { useAuth } from '@/hooks';

function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <img src={user?.avatar} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <p>Provider: {user?.provider}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Architecture

### Components Created

1. **Firebase Configuration** (`src/lib/firebase.ts`)
   - Firebase app initialization
   - Auth and Firestore exports
   - Emulator connection for development

2. **Firebase Auth Service** (`src/lib/firebaseAuth.ts`)
   - Email/password authentication
   - Social authentication (Google, GitHub)
   - Password reset functionality
   - Token management
   - Cookie management for middleware

3. **Auth Store** (`src/stores/auth.ts`)
   - Zustand store with persistence
   - User state management
   - Loading and error states

4. **Auth Provider** (`src/components/providers/FirebaseAuthProvider.tsx`)
   - Firebase auth state listener
   - Automatic token refresh
   - Cookie synchronization

5. **Auth Hooks** (`src/hooks/useAuth.ts`)
   - React hooks for authentication
   - Simplified API for components

6. **Middleware** (`middleware.ts`)
   - Server-side route protection
   - Token validation
   - Automatic redirects

7. **Protected Components**
   - `AuthGuard` - Require authentication
   - `GuestGuard` - Require no authentication
   - `ProtectedLayout` - Layout with auth guard

## Security Features

### Client-Side Security
- Automatic token refresh
- Secure token storage
- Auth state persistence
- Real-time auth state updates

### Server-Side Security
- Middleware route protection
- Firebase ID token validation
- Secure cookie management
- CSRF protection

### Best Practices
- HttpOnly cookies for tokens
- Secure and SameSite cookie attributes
- Token expiration handling
- Error boundary protection

## Migration from Custom JWT

The following files replace the old custom JWT system:

| Old File | New File | Status |
|----------|----------|---------|
| `src/lib/auth.ts` | `src/lib/firebaseAuth.ts` | ✅ Replaced |
| Custom JWT tokens | Firebase ID tokens | ✅ Replaced |
| Manual token refresh | Automatic refresh | ✅ Replaced |
| Custom social auth | Firebase providers | ✅ Replaced |

## Development vs Production

### Development
- Firebase emulators can be used
- Detailed error logging
- Hot reload support

### Production
- Production Firebase project
- Error handling and reporting
- Performance monitoring

## Troubleshooting

### Common Issues

1. **"Firebase app not initialized"**
   - Check environment variables
   - Verify Firebase config

2. **Social login popup blocked**
   - Use redirect flow instead
   - Configure popup settings

3. **Token validation fails**
   - Check Firebase Admin SDK setup
   - Verify private key format

4. **Middleware redirects not working**
   - Check cookie settings
   - Verify middleware matcher

### Debug Mode

Set environment variable for debugging:
```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

## Next Steps

1. Set up Firebase project and get credentials
2. Configure environment variables
3. Test authentication flows
4. Set up production deployment
5. Monitor authentication metrics

## Support

- [Firebase Documentation](https://firebase.google.com/docs/auth)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- [Firebase Console](https://console.firebase.google.com/)