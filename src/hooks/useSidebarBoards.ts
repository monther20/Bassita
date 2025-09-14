import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FirestoreBoard } from '@/types/firestore';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from './useAuth';
import { useCurrentOrganization } from './useUserOrganizations';
import { queryKeys } from '@/lib/query-keys';

interface SidebarBoard {
    id: string;
    name: string;
    icon: string;
    href: string;
    workspaceId: string;
    organizationId: string;
    isOwner: boolean;
}

interface UseSidebarBoardsReturn {
    boards: SidebarBoard[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useSidebarBoards(currentWorkspaceId?: string, organizationId?: string): UseSidebarBoardsReturn {
    const { user } = useAuth();
    const currentOrganizationId = useCurrentOrganization();
    
    // Use provided organizationId or fall back to current organization
    const effectiveOrganizationId = organizationId || currentOrganizationId;

    const { data: boards = [], isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.boards.sidebar(user?.id || '', effectiveOrganizationId || ''),
        queryFn: async () => {
            if (!user?.id || !effectiveOrganizationId) {
                return [];
            }

            // If specific workspace is provided, get boards for that workspace
            if (currentWorkspaceId) {
                const firestoreBoards = await FirestoreService.getWorkspaceBoards(currentWorkspaceId);
                return firestoreBoards;
            }

            // Otherwise, get all boards for the current organization
            const orgWorkspaces = await FirestoreService.getOrganizationWorkspaces(effectiveOrganizationId, user.id);
            const allBoardsPromises = orgWorkspaces.map(workspace => 
                FirestoreService.getWorkspaceBoards(workspace.id)
            );
            const allBoardsArrays = await Promise.all(allBoardsPromises);
            return allBoardsArrays.flat();
        },
        enabled: !!(user?.id && effectiveOrganizationId),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Transform firestore boards to sidebar format
    const sidebarBoards: SidebarBoard[] = boards.map(board => ({
        id: board.id,
        name: board.name,
        icon: board.icon,
        href: `/organization/${effectiveOrganizationId}/workspace/${board.workspaceId}/board/${board.id}`,
        workspaceId: board.workspaceId,
        organizationId: effectiveOrganizationId || '',
        isOwner: board.ownerId === user?.id
    }));

    return {
        boards: sidebarBoards,
        loading: isLoading,
        error: error instanceof Error ? error.message : null,
        refetch
    };
}