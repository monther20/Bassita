import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FirestoreWorkspace } from '@/types/firestore';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from './useAuth';
import { useCurrentOrganization } from './useUserOrganizations';
import { queryKeys } from '@/lib/query-keys';

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

export function useSidebarWorkspaces(organizationId?: string): UseSidebarWorkspacesReturn {
    const { user } = useAuth();
    const currentOrganizationId = useCurrentOrganization();
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
    
    // Use provided organizationId or fall back to current organization
    const effectiveOrganizationId = organizationId || currentOrganizationId;
    
    const { data: workspaces = [], isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.workspaces.sidebar(user?.id || '', effectiveOrganizationId || ''),
        queryFn: async () => {
            if (!user?.id) {
                return [];
            }
            
            // Fetch organization-specific workspaces if organizationId is provided
            if (effectiveOrganizationId) {
                const firestoreWorkspaces = await FirestoreService.getOrganizationWorkspaces(effectiveOrganizationId, user.id);
                return firestoreWorkspaces;
            } else {
                // Fall back to all user workspaces for backward compatibility
                const firestoreWorkspaces = await FirestoreService.getUserWorkspaces(user.id);
                return firestoreWorkspaces;
            }
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Set initial workspace when workspaces load
    useEffect(() => {
        if (workspaces.length > 0 && !currentWorkspaceId) {
            // Try to get from localStorage first, scoped by organization
            const storageKey = `current-workspace-id-${effectiveOrganizationId || 'default'}`;
            const savedWorkspaceId = localStorage.getItem(storageKey);
            const validWorkspace = workspaces.find(w => w.id === savedWorkspaceId);
            
            if (validWorkspace) {
                setCurrentWorkspaceId(savedWorkspaceId);
            } else {
                // Default to first workspace (usually the user's own workspace)
                setCurrentWorkspaceId(workspaces[0].id);
                localStorage.setItem(storageKey, workspaces[0].id);
            }
        }
    }, [workspaces, currentWorkspaceId, effectiveOrganizationId]);

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
        // Store workspace selection scoped by organization
        const storageKey = `current-workspace-id-${effectiveOrganizationId || 'default'}`;
        localStorage.setItem(storageKey, workspaceId);
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