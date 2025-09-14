# Template Creation Script

This script creates predefined board templates in Firestore that can be used by all users to create new boards.

## Prerequisites

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Firebase Admin SDK Authentication** (Choose one method):

   ### Method 1: Service Account Key File (Recommended)
   1. Go to [Firebase Console](https://console.firebase.google.com/)
   2. Select your project → Project Settings → Service Accounts
   3. Click "Generate new private key" and download the JSON file
   4. Set the environment variable:
      ```bash
      # Windows PowerShell
      $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account-key.json"
      
      # Windows CMD
      set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account-key.json
      
      # Linux/Mac
      export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
      ```

   ### Method 2: Service Account Key in Environment Variable
   1. Copy the entire service account JSON content
   2. Add to your `.env.local`:
      ```bash
      FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
      ```

   ### Method 3: Project ID Only (Limited functionality)
   If you have `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in your `.env.local`, the script will attempt to use default credentials. This may work in Google Cloud environments but will likely fail locally.

3. **Test Your Configuration**:
   ```bash
   npm run test-firebase-config
   ```
   This will check which authentication method will be used.

## Usage

### Create Templates
To create the predefined templates in Firestore:

```bash
npm run create-templates
```

### Clear and Recreate Templates
To clear existing templates and create fresh ones:

```bash
npm run create-templates:clear
```

## Available Templates

The script creates 3 predefined templates:

### 1. Kanban Board ⚡
- **Description**: Simple Kanban workflow
- **Columns**: To Do, In Progress, Done
- **Labels**: Bug, Feature, Urgent, Enhancement
- **Sample Tasks**: 3 example tasks

### 2. Sprint Planning 🏃
- **Description**: Agile sprint planning workflow
- **Columns**: Backlog, Current Sprint, In Progress, Review, Done
- **Labels**: User Story, Epic, Spike, High/Medium/Low Priority
- **Sample Tasks**: 3 example user stories

### 3. Project Tracker 📊
- **Description**: Complete project management workflow
- **Columns**: Planning, Development, Testing, Deployment, Completed
- **Labels**: Frontend, Backend, Database, Infrastructure, Security, Performance
- **Sample Tasks**: 3 example project tasks

## Template Structure

Each template includes:
- **Basic Info**: Name, description, icon, category
- **Columns**: Predefined workflow stages with colors
- **Labels**: Common task labels with colors
- **Sample Tasks**: Optional example tasks to help users get started

## Using Templates in the App

After running this script, templates will be available in:
1. The sidebar Templates section
2. When creating new boards (users can select a template)
3. The `FirestoreService.getTemplates()` method

## Firebase Collections

Templates are stored in the `templates` collection with the structure defined in `src/types/firestore.ts`.

## Troubleshooting

### Common Errors and Solutions

**Error: "Unable to detect a Project Id in the current environment"**
- Run `npm run test-firebase-config` to check your authentication setup
- Make sure you've set up one of the authentication methods above
- Verify your service account key file path is correct

**Error: "Permission denied"**
- Your service account needs Firestore write permissions
- In Firebase Console: IAM & Admin → Add "Cloud Datastore User" or "Firebase Admin" role

**Error: "Service account key file not found"**
- Check the file path in GOOGLE_APPLICATION_CREDENTIALS
- Use absolute paths, not relative paths
- Ensure the service account JSON file hasn't been moved or deleted

**Error: "Invalid JSON in FIREBASE_SERVICE_ACCOUNT_KEY"**
- Make sure the JSON is properly formatted in your .env.local
- Don't include extra quotes or line breaks
- The entire JSON should be on one line

### Debugging Steps

1. **Test Configuration**: `npm run test-firebase-config`
2. **Validate Templates**: `npm run validate-templates`  
3. **Check Permissions**: Verify your service account has proper Firestore access
4. **Check Network**: Ensure you can reach Firebase services (not blocked by firewall)

## Development

To modify templates:
1. Edit the `templates` array in `scripts/create-templates.ts`
2. Run the script to update Firestore
3. Templates are immediately available in the app