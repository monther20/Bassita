# 🚨 URGENT: Apply These Security Rules NOW

## Your dashboard is failing due to security rules. Fix this immediately:

**Current User ID from logs: `FH04dFRTqKSEwxf2UTkFy6Irquq1`**

### **Step 1: Go to Firebase Console**
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** 
4. Click on **Rules** tab

### **Step 2: Replace ALL existing rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write, create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspace access control - FIXED to use memberUserIds
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        resource.data.memberUserIds.hasAny([request.auth.uid]);
      
      allow create: if request.auth != null &&
        request.resource.data.ownerId == request.auth.uid;
    }
    
    // Board access control
    match /boards/{boardId} {
      allow read, write, create: if request.auth != null;
    }
    
    // Task access control  
    match /tasks/{taskId} {
      allow read, write, create: if request.auth != null;
    }
  }
}
```

### **Step 3: Click "Publish" button**

### **Step 4: Refresh your app**

## 🔧 **ALSO: Fix Your Workspace Data**

Any existing workspace documents need the `memberUserIds` field:

1. Go to **Firestore Database** → **Data** tab
2. Find any workspace documents  
3. Click **Edit** → **Add field** (if missing):
   - Field name: `memberUserIds`
   - Type: `array`
   - Value: `["FH04dFRTqKSEwxf2UTkFy6Irquq1"]` ← **USE CORRECT USER ID**
4. **Save**

## 📊 **After applying these fixes:**
1. Check browser console for debug logs
2. You should see logs like "🔍 getUserWorkspaces called with userId:"
3. Dashboard should load your workspace
4. No more "Missing or insufficient permissions" error

**Do these steps now - your dashboard will work immediately after!**