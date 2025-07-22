# 🔥 Firebase + Firestore Backend Implementation Guide

## 📊 **Project Analysis**

### ✅ **What You Already Have**
- ✅ Firebase project configured (`firebase.ts`, `firebaseAuth.ts`)
- ✅ Complete authentication system (email, Google, GitHub, Microsoft)
- ✅ Firebase emulator support for development
- ✅ Next.js 15 + React 19 + TypeScript setup
- ✅ React Query for caching and state management
- ✅ Beautiful kanban board UI with drag & drop
- ✅ Mock data structure already defined

### 🎯 **What We Need to Implement**
- 🚀 Firestore data models and services
- 🚀 Real-time board subscriptions
- 🚀 CRUD operations for boards, columns, and tasks
- 🚀 Security rules for multi-user access
- 🚀 Optimistic updates with React Query
- 🚀 Collaborative real-time editing

---

## 🏗️ **Phase 1: Core Backend Setup**

### **Step 1: Install Missing Dependencies**

```bash
# Already have firebase and firebase-admin - we're good!
npm install uuid
npm install @types/uuid -D
```

### **Step 2: Create Firestore Data Models**

Create `src/types/firestore.ts`:

```typescript
export interface FirestoreUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  workspaces: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreWorkspace {
  id: string;
  name: string;
  ownerId: string;
  members: Array<{
    userId: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreBoard {
  id: string;
  name: string;
  icon: string;
  workspaceId: string;
  ownerId: string;
  members: Array<{
    userId: string;
    role: 'owner' | 'admin' | 'member';
  }>;
  columns: Array<{
    id: string;
    title: string;
    badgeColor: string;
    order: number;
  }>;
  availableLabels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreTask {
  id: string;
  title: string;
  description: string;
  boardId: string;
  columnId: string;
  position: number; // For ordering within column
  assigneeIds: string[];
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  icon?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Step 3: Create Firestore Service Layer**

Create `src/lib/firestore.ts`:

```typescript
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  FirestoreUser, 
  FirestoreWorkspace, 
  FirestoreBoard, 
  FirestoreTask 
} from '@/types/firestore';

// Collections
const USERS = 'users';
const WORKSPACES = 'workspaces';
const BOARDS = 'boards';
const TASKS = 'tasks';

export class FirestoreService {
  // ===============================
  // USER OPERATIONS
  // ===============================
  
  static async createUser(userId: string, userData: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const userRef = doc(db, USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      id: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  static async getUser(userId: string): Promise<FirestoreUser | null> {
    const userRef = doc(db, USERS, userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as FirestoreUser;
    }
    return null;
  }

  // ===============================
  // WORKSPACE OPERATIONS
  // ===============================

  static async createWorkspace(workspaceData: Omit<FirestoreWorkspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const workspaceRef = await addDoc(collection(db, WORKSPACES), {
      ...workspaceData,
      memberIds: workspaceData.member.map(m => m.userId)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return workspaceRef.id;
  }

  static async getUserWorkspaces(userId: string): Promise<FirestoreWorkspace[]> {
    const workspacesRef = collection(db, WORKSPACES);
    const q = query(
      workspacesRef, 
      where('members', 'array-contains-any', [{ userId }])
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as FirestoreWorkspace[];
  }

  // ===============================
  // BOARD OPERATIONS
  // ===============================

  static async createBoard(boardData: Omit<FirestoreBoard, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const boardRef = await addDoc(collection(db, BOARDS), {
      ...boardData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return boardRef.id;
  }

  static async getBoard(boardId: string): Promise<FirestoreBoard | null> {
    const boardRef = doc(db, BOARDS, boardId);
    const boardSnap = await getDoc(boardRef);
    if (boardSnap.exists()) {
      const data = boardSnap.data();
      return {
        ...data,
        id: boardId,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as FirestoreBoard;
    }
    return null;
  }

  static async getWorkspaceBoards(workspaceId: string): Promise<FirestoreBoard[]> {
    const boardsRef = collection(db, BOARDS);
    const q = query(boardsRef, where('workspaceId', '==', workspaceId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as FirestoreBoard[];
  }

  static async updateBoard(boardId: string, updates: Partial<FirestoreBoard>): Promise<void> {
    const boardRef = doc(db, BOARDS, boardId);
    await updateDoc(boardRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  // ===============================
  // TASK OPERATIONS
  // ===============================

  static async createTask(taskData: Omit<FirestoreTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const taskRef = await addDoc(collection(db, TASKS), {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return taskRef.id;
  }

  static async getBoardTasks(boardId: string): Promise<FirestoreTask[]> {
    const tasksRef = collection(db, TASKS);
    const q = query(
      tasksRef, 
      where('boardId', '==', boardId),
      orderBy('position')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as FirestoreTask[];
  }

  static async updateTask(taskId: string, updates: Partial<FirestoreTask>): Promise<void> {
    const taskRef = doc(db, TASKS, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, TASKS, taskId);
    await deleteDoc(taskRef);
  }

  static async moveTask(taskId: string, newColumnId: string, newPosition: number): Promise<void> {
    const taskRef = doc(db, TASKS, taskId);
    await updateDoc(taskRef, {
      columnId: newColumnId,
      position: newPosition,
      updatedAt: serverTimestamp()
    });
  }

  // ===============================
  // REAL-TIME SUBSCRIPTIONS
  // ===============================

  static subscribeToBoard(boardId: string, callback: (board: FirestoreBoard | null) => void): () => void {
    const boardRef = doc(db, BOARDS, boardId);
    return onSnapshot(boardRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as FirestoreBoard);
      } else {
        callback(null);
      }
    });
  }

  static subscribeToBoardTasks(boardId: string, callback: (tasks: FirestoreTask[]) => void): () => void {
    const tasksRef = collection(db, TASKS);
    const q = query(
      tasksRef,
      where('boardId', '==', boardId),
      orderBy('position')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as FirestoreTask[];
      
      callback(tasks);
    });
  }

  // ===============================
  // BATCH OPERATIONS
  // ===============================

  static async reorderTasks(taskUpdates: Array<{ id: string; position: number; columnId?: string }>): Promise<void> {
    const batch = writeBatch(db);
    
    taskUpdates.forEach(({ id, position, columnId }) => {
      const taskRef = doc(db, TASKS, id);
      const updateData: any = { 
        position,
        updatedAt: serverTimestamp() 
      };
      if (columnId) updateData.columnId = columnId;
      
      batch.update(taskRef, updateData);
    });
    
    await batch.commit();
  }
}
```

### **Step 4: Create React Query Hooks**

Create `src/hooks/useFirestore.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { FirestoreBoard, FirestoreTask } from '@/types/firestore';
import { useAuth } from './useAuth';

// Board Hooks
export function useBoard(boardId: string) {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => FirestoreService.getBoard(boardId),
    enabled: !!boardId
  });
}

export function useBoardTasks(boardId: string) {
  return useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => FirestoreService.getBoardTasks(boardId),
    enabled: !!boardId
  });
}

// Mutations
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (taskData: Omit<FirestoreTask, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      return FirestoreService.createTask({
        ...taskData,
        createdBy: user.id
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<FirestoreTask> }) => {
      return FirestoreService.updateTask(taskId, updates);
    },
    onMutate: async ({ taskId, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      // Update the specific task in cache
      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old;
        return old.map((task: FirestoreTask) => 
          task.id === taskId ? { ...task, ...updates } : task
        );
      });
      
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, columnId, position }: { taskId: string; columnId: string; position: number }) => {
      return FirestoreService.moveTask(taskId, columnId, position);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}
```

---

## 🔄 **Phase 2: Real-time Integration**

### **Step 5: Replace Mock Data with Real Firestore**

Update your board page to use Firestore instead of mock data:

Create `src/hooks/useRealTimeBoard.ts`:

```typescript
import { useState, useEffect } from 'react';
import { FirestoreService } from '@/lib/firestore';
import { FirestoreBoard, FirestoreTask } from '@/types/firestore';

export function useRealTimeBoard(boardId: string) {
  const [board, setBoard] = useState<FirestoreBoard | null>(null);
  const [tasks, setTasks] = useState<FirestoreTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    // Subscribe to board changes
    const unsubscribeBoard = FirestoreService.subscribeToBoard(boardId, (boardData) => {
      setBoard(boardData);
      setLoading(false);
    });

    // Subscribe to tasks changes
    const unsubscribeTasks = FirestoreService.subscribeToBoardTasks(boardId, (tasksData) => {
      setTasks(tasksData);
    });

    return () => {
      unsubscribeBoard();
      unsubscribeTasks();
    };
  }, [boardId]);

  // Convert Firestore tasks to your UI format
  const boardData = board ? {
    id: board.id,
    name: board.name,
    icon: board.icon,
    members: board.members.map(m => ({ name: m.userId, color: 'spotlight-purple' })), // You'll want to join with user data
    availableLabels: board.availableLabels,
    columns: board.columns.map(column => ({
      id: column.id,
      title: column.title,
      badgeColor: column.badgeColor,
      tasks: tasks.filter(task => task.columnId === column.id)
        .sort((a, b) => a.position - b.position)
        .map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          icon: task.icon || 'FiCircle',
          assignee: { name: 'User', color: 'spotlight-purple' }, // You'll want to join with user data
          assignees: [{ name: 'User', color: 'spotlight-purple' }],
          labels: task.labels
        }))
    }))
  } : null;

  return { board: boardData, loading, error };
}
```

---

## 🔐 **Phase 3: Security Rules**

### **Step 6: Create Firestore Security Rules**

Create/update your Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspace access control
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        resource.data.members.hasAny([
          {'userId': request.auth.uid}
        ]);
      
      allow create: if request.auth != null &&
        request.resource.data.ownerId == request.auth.uid;
    }
    
    // Board access control
    match /boards/{boardId} {
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        resource.data.members.hasAny([
          {'userId': request.auth.uid}
        ])
      );
      
      allow write: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        resource.data.members.hasAny([
          {'userId': request.auth.uid, 'role': 'admin'}
        ])
      );
      
      allow create: if request.auth != null &&
        request.resource.data.ownerId == request.auth.uid;
    }
    
    // Task access control
    match /tasks/{taskId} {
      function getBoardData() {
        return get(/databases/$(database)/documents/boards/$(resource.data.boardId));
      }
      
      allow read, write: if request.auth != null && (
        getBoardData().data.ownerId == request.auth.uid ||
        getBoardData().data.members.hasAny([
          {'userId': request.auth.uid}
        ])
      );
      
      allow create: if request.auth != null;
    }
  }
}
```

---

## 🚀 **Phase 4: Migration Strategy**

### **Step 7: Data Migration Script**

Create `scripts/migrate-data.ts`:

```typescript
import { FirestoreService } from '../src/lib/firestore';
import { v4 as uuidv4 } from 'uuid';

// Your existing mock data structure
const mockWorkspace = {
  name: "Default Workspace",
  ownerId: "your-user-id", // Replace with actual user ID
  members: [
    { userId: "your-user-id", role: 'owner' as const, joinedAt: new Date() }
  ]
};

const mockBoards = [
  {
    name: "Marketing Campaign",
    icon: "🚀",
    workspaceId: "", // Will be filled after workspace creation
    ownerId: "your-user-id",
    members: [
      { userId: "your-user-id", role: 'owner' as const }
    ],
    columns: [
      { id: "todo", title: "To Do", badgeColor: "bg-spotlight-purple", order: 0 },
      { id: "in-progress", title: "In Progress", badgeColor: "bg-spotlight-yellow", order: 1 },
      { id: "done", title: "Done", badgeColor: "bg-spotlight-green", order: 2 }
    ],
    availableLabels: [
      { id: "priority-high", name: "High Priority", color: "bg-red-500" },
      { id: "priority-medium", name: "Medium Priority", color: "bg-yellow-500" },
      { id: "priority-low", name: "Low Priority", color: "bg-green-500" }
    ]
  }
];

export async function migrateData() {
  try {
    // 1. Create workspace
    const workspaceId = await FirestoreService.createWorkspace(mockWorkspace);
    console.log('Created workspace:', workspaceId);
    
    // 2. Create boards
    for (const boardData of mockBoards) {
      const boardId = await FirestoreService.createBoard({
        ...boardData,
        workspaceId
      });
      console.log('Created board:', boardId);
      
      // 3. Create sample tasks
      await FirestoreService.createTask({
        title: "Setup Firebase Integration",
        description: "Implement Firestore backend",
        boardId,
        columnId: "todo",
        position: 0,
        assigneeIds: ["your-user-id"],
        labels: [{ id: "priority-high", name: "High Priority", color: "bg-red-500" }],
        icon: "FiCode",
        createdBy: "your-user-id"
      });
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
```

### **Step 8: Update Your Board Page Component**

Replace the mock data logic in your board page:

```typescript
// src/app/board/[id]/page.tsx
import { useRealTimeBoard } from '@/hooks/useRealTimeBoard';
import { useUpdateTask, useMoveTask } from '@/hooks/useFirestore';

export default function BoardPage({ params }: BoardPageProps) {
  const { board: boardData, loading, error } = useRealTimeBoard(params.id);
  const updateTaskMutation = useUpdateTask();
  const moveTaskMutation = useMoveTask();
  
  if (loading) {
    return <div>Loading board...</div>;
  }
  
  if (error || !boardData) {
    return <div>Board not found</div>;
  }
  
  const handleTaskMove = (taskId: string, sourceColumnId: string, targetColumnId: string, targetPosition?: number) => {
    moveTaskMutation.mutate({
      taskId,
      columnId: targetColumnId,
      position: targetPosition || 0
    });
  };
  
  // Rest of your component logic remains the same
  return (
    // Your existing JSX
  );
}
```

---

## 📊 **Phase 5: Performance Optimization**

### **Step 9: Implement Composite Indexes**

In Firebase Console → Firestore → Indexes, create these composite indexes:

1. **Tasks by Board and Position:**
   - Collection: `tasks`
   - Fields: `boardId` (Ascending), `position` (Ascending)

2. **Tasks by Board and Column:**
   - Collection: `tasks`
   - Fields: `boardId` (Ascending), `columnId` (Ascending), `position` (Ascending)

### **Step 10: Implement Caching Strategy**

```typescript
// src/lib/cache-config.ts
export const queryOptions = {
  // Cache boards for 5 minutes
  boards: {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  },
  
  // Cache tasks for 2 minutes (they change more frequently)
  tasks: {
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  }
};
```

---

## 🧪 **Phase 6: Testing**

### **Step 11: Setup Firebase Emulators for Testing**

```json
// firebase.json
{
  "emulators": {
    "firestore": {
      "port": 8080
    },
    "auth": {
      "port": 9099
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### **Step 12: Create Integration Tests**

```typescript
// src/__tests__/firestore.test.ts
import { FirestoreService } from '@/lib/firestore';

describe('Firestore Service', () => {
  beforeEach(() => {
    // Setup emulator connection
  });
  
  test('should create and retrieve board', async () => {
    const boardData = {
      name: 'Test Board',
      icon: '🧪',
      workspaceId: 'test-workspace',
      ownerId: 'test-user',
      members: [],
      columns: [],
      availableLabels: []
    };
    
    const boardId = await FirestoreService.createBoard(boardData);
    const retrievedBoard = await FirestoreService.getBoard(boardId);
    
    expect(retrievedBoard?.name).toBe('Test Board');
  });
});
```

---

## 🚀 **Phase 7: Deployment**

### **Step 13: Environment Variables**

Ensure your `.env.local` has:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

### **Step 14: Production Deployment Checklist**

- [ ] Firebase security rules deployed and tested
- [ ] Composite indexes created
- [ ] Environment variables configured in production
- [ ] Error logging setup (consider Sentry)
- [ ] Performance monitoring enabled
- [ ] Backup strategy configured

---

## 🔧 **Implementation Priority**

### **Week 1: Core Foundation**
1. ✅ Steps 1-3: Data models and Firestore service
2. ✅ Step 4: React Query hooks
3. ✅ Step 5: Basic real-time integration

### **Week 2: Real-time Features**
1. ✅ Step 6: Security rules
2. ✅ Step 7-8: Data migration and board page update
3. ✅ Test basic CRUD operations

### **Week 3: Polish & Performance**
1. ✅ Steps 9-10: Optimization and caching
2. ✅ Steps 11-12: Testing setup
3. ✅ Step 13-14: Production deployment

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Permission denied" errors:**
   - Check your Firestore security rules
   - Verify user authentication status
   - Ensure user has proper board membership

2. **Real-time updates not working:**
   - Check network connectivity
   - Verify Firestore listeners are properly attached
   - Check browser console for WebSocket errors

3. **Performance issues:**
   - Review your Firestore queries for efficiency
   - Implement proper indexing
   - Use pagination for large datasets

4. **Offline functionality:**
   - Enable Firestore offline persistence
   - Handle network state in your UI
   - Implement conflict resolution strategies

---

## 🎯 **Next Steps**

After implementing the core backend:

1. **Advanced Features:**
   - File attachments with Firebase Storage
   - Activity feeds and notifications
   - Team collaboration features
   - Board templates

2. **Mobile Experience:**
   - Progressive Web App setup
   - Touch-optimized drag & drop
   - Offline-first architecture

3. **Analytics & Monitoring:**
   - Firebase Analytics integration
   - Performance monitoring
   - User behavior tracking

---

## 📚 **Additional Resources**

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Next.js with Firebase Guide](https://nextjs.org/learn/dashboard-app/setting-up-your-database)

---

**🚀 Ready to implement? Start with Phase 1, Step 1!**