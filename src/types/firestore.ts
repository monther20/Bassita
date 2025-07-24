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
    memberUserIds: string[]; // Flattened array of user IDs for efficient querying
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

export interface FirestoreTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
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
    sampleTasks?: Array<{
        id: string;
        title: string;
        description: string;
        columnId: string;
        position: number;
        labels: string[]; // Array of label IDs
        icon?: string;
    }>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
