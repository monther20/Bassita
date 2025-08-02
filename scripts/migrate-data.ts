import { FirestoreService } from '../src/lib/firestore';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

// Your existing mock data structure
const mockWorkspace = {
    name: "Default Workspace",
    organizationId: "your-organization-id", // Replace with actual organization ID
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

        // 2. Create boards
        for (const boardData of mockBoards) {
            const boardId = await FirestoreService.createBoard({
                ...boardData,
                workspaceId
            });

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

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

// Migration function to add memberUserIds to existing workspaces
export async function migrateExistingWorkspaces() {
    try {
        
        const workspacesRef = collection(db, 'workspaces');
        const querySnapshot = await getDocs(workspacesRef);
        
        let migrated = 0;
        let skipped = 0;
        
        for (const workspaceDoc of querySnapshot.docs) {
            const workspaceData = workspaceDoc.data();
            
            // Check if memberUserIds already exists
            if (workspaceData.memberUserIds) {
                console.log(`⏩ Skipping ${workspaceData.name} - already has memberUserIds`);
                skipped++;
                continue;
            }
            
            // Extract memberUserIds from members array
            const memberUserIds = workspaceData.members?.map((member: any) => member.userId) || [];
            
            // Update the document
            await updateDoc(doc(db, 'workspaces', workspaceDoc.id), {
                memberUserIds
            });
            
            migrated++;
        }
        
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
}
