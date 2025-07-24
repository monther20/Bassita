import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FirestoreBoard } from '@/types/firestore';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from './useAuth';

interface SidebarBoard {
    id: string;
    name: string;
    icon: string;
    href: string;
    isOwner: boolean;
}

interface UseSidebarBoardsReturn {
    boards: SidebarBoard[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useSidebarBoards(currentWorkspaceId?: string): UseSidebarBoardsReturn {
    const { user } = useAuth();

    const { data: boards = [], isLoading, error, refetch } = useQuery({
        queryKey: ['sidebar-boards', currentWorkspaceId, user?.id],
        queryFn: async () => {
            console.log("workspaceId", currentWorkspaceId);
            if (!currentWorkspaceId || !user?.id) {
                return [];
            }

            const firestoreBoards = await FirestoreService.getWorkspaceBoards(currentWorkspaceId);
            return firestoreBoards;
        },
        enabled: !!(currentWorkspaceId && user?.id),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Transform firestore boards to sidebar format
    const sidebarBoards: SidebarBoard[] = boards.map(board => ({
        id: board.id,
        name: board.name,
        icon: board.icon,
        href: `/board/${board.id}`,
        isOwner: board.ownerId === user?.id
    }));

    return {
        boards: sidebarBoards,
        loading: isLoading,
        error: error instanceof Error ? error.message : null,
        refetch
    };
}