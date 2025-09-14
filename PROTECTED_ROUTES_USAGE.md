# Protected Routes Usage Guide

This guide shows how to use the protected routes system implemented in your Next.js app.

## Quick Start

### 1. Server-side Protection (Middleware)
The middleware automatically protects routes. No setup needed - it's already active.

**Protected routes** (require authentication):
- `/dashboard/*`
- `/tasks/*`
- `/projects/*`
- `/settings/*`
- Any route not in the public list

**Public routes** (no authentication required):
- `/` (home page)
- `/login/*` (login pages)
- `/signup/*` (signup pages)
- `/forgot-password`
- `/reset-password`

### 2. Client-side Protection

#### Option A: Use ProtectedLayout (Recommended)
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

#### Option B: Use AuthGuard Component
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

#### Option C: Use withAuth HOC
```tsx
import { withAuth } from '@/components';

function SettingsPage() {
  return (
    <div>
      <h1>Settings Page</h1>
      {/* Your protected content */}
    </div>
  );
}

export default withAuth(SettingsPage);
```

#### Option D: Use useAuth Hook
```tsx
import { useAuth } from '@/hooks';

export default function CustomPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
    </div>
  );
}
```

### 3. Guest-only Pages (Redirect if authenticated)
```tsx
import { GuestGuard } from '@/components';

export default function LoginPage() {
  return (
    <GuestGuard>
      {/* Login form - automatically redirects if user is logged in */}
    </GuestGuard>
  );
}
```

### 4. Role-based Protection
```tsx
import { useRequireRole } from '@/hooks';

export default function AdminPage() {
  const { hasPermission, isLoading } = useRequireRole('admin', '/dashboard');

  if (isLoading) return <div>Loading...</div>;
  if (!hasPermission) return <div>Access denied</div>;

  return <div>Admin content</div>;
}
```

### 5. Permission-based Protection
```tsx
import { usePermission } from '@/hooks';

export default function ManageUsersPage() {
  const canManageUsers = usePermission('manage_users');

  return (
    <div>
      <h1>Users</h1>
      {canManageUsers && (
        <button>Add User</button>
      )}
    </div>
  );
}
```

## Authentication Methods

### Login with Email
```tsx
import { useAuth } from '@/hooks';

const { login, error, isLoading } = useAuth();

const handleLogin = async () => {
  try {
    await login(email, password);
    // User is automatically redirected to dashboard or intended page
  } catch (error) {
    // Error is automatically stored in auth state
    console.error('Login failed:', error);
  }
};
```

### Login with Social Providers
```tsx
import { useAuth } from '@/hooks';

const { loginWithProvider } = useAuth();

const handleGoogleLogin = () => {
  loginWithProvider('google'); // or 'discord' or 'github'
};
```

### Logout
```tsx
import { useAuth } from '@/hooks';

const { logout } = useAuth();

const handleLogout = () => {
  logout(); // Automatically redirects to login page
};
```

## Customizing Redirects

### Custom redirect after login
```tsx
// The login page automatically handles redirect parameter
// Example: /login?redirect=/projects will redirect to /projects after login

// In your protected page, this happens automatically via middleware
// Manual redirect can be done like this:
const { login } = useAuth();
const router = useRouter();

await login(email, password);
router.push('/custom-dashboard');
```

### Custom unauthorized redirect
```tsx
import { useAuthGuard } from '@/hooks';

const { isAuthorized } = useAuthGuard({
  requireAuth: true,
  redirectTo: '/custom-login',
  onUnauthorized: () => {
    // Custom logic when user is not authorized
    console.log('Access denied');
  }
});
```

## Configuration

### Update Protected Routes
Edit `middleware.ts` to modify which routes are protected:

```typescript
const publicRoutes = [
  '/',
  '/login',
  '/about',          // Add new public route
  '/contact',        // Add new public route
];
```

### Update Redirect Destinations
- Login redirect: Modify `redirectTo` in middleware.ts
- Logout redirect: Modify the logout function in useAuth.ts
- Default dashboard: Update '/dashboard' references throughout the codebase