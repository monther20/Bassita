import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FirestoreWorkspace } from '@/types/firestore';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from './useAuth';

interface SidebarWorkspace {
    id: string;
    name: string;
    memberCount: number;
    boardCount: number;
    isOwner: boolean;
}

interface UseSidebarWorkspacesReturn {
    workspaces: SidebarWorkspace[];
    currentWorkspace: SidebarWorkspace | null;
    loading: boolean;
    error: string | null;
    switchWorkspace: (workspaceId: string) => void;
    refetch: () => void;
}

// Note: For now, we're managing workspace state locally in each hook
// In a full implementation, this would be moved to a proper React Context Provider

export function useSidebarWorkspaces(): UseSidebarWorkspacesReturn {
    const { user } = useAuth();
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
    
    const { data: workspaces = [], isLoading, error, refetch } = useQuery({
        queryKey: ['sidebar-workspaces', user?.id],
        queryFn: async () => {
            if (!user?.id) {
                return [];
            }
            
            const firestoreWorkspaces = await FirestoreService.getUserWorkspaces(user.id);
            return firestoreWorkspaces;
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Set initial workspace when workspaces load
    useEffect(() => {
        if (workspaces.length > 0 && !currentWorkspaceId) {
            // Try to get from localStorage first
            const savedWorkspaceId = localStorage.getItem('current-workspace-id');
            const validWorkspace = workspaces.find(w => w.id === savedWorkspaceId);
            
            if (validWorkspace) {
                setCurrentWorkspaceId(savedWorkspaceId);
            } else {
                // Default to first workspace (usually the user's own workspace)
                setCurrentWorkspaceId(workspaces[0].id);
                localStorage.setItem('current-workspace-id', workspaces[0].id);
            }
        }
    }, [workspaces, currentWorkspaceId]);

    // Get board counts for each workspace (could be optimized with a single query)
    const sidebarWorkspaces: SidebarWorkspace[] = workspaces.map(workspace => ({
        id: workspace.id,
        name: workspace.name,
        memberCount: workspace.members.length,
        boardCount: 0, // Will be filled by separate query or cached data
        isOwner: workspace.ownerId === user?.id
    }));

    const currentWorkspace = sidebarWorkspaces.find(w => w.id === currentWorkspaceId) || null;

    const switchWorkspace = (workspaceId: string) => {
        setCurrentWorkspaceId(workspaceId);
        localStorage.setItem('current-workspace-id', workspaceId);
    };

    return {
        workspaces: sidebarWorkspaces,
        currentWorkspace,
        loading: isLoading,
        error: error instanceof Error ? error.message : null,
        switchWorkspace,
        refetch
    };
}

// Hook to get just the current workspace ID
export function useCurrentWorkspace(): string | null {
    const { currentWorkspace } = useSidebarWorkspaces();
    return currentWorkspace?.id || null;
}