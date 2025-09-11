import { useMemo } from 'react';
import { useAllUserBoardsGlobal, useAllUserBoardsGlobalCount } from './useAllUserBoardsGlobal';
import { useRecentlyViewed } from './useDashboard';
import { useCurrentWorkspace } from './useSidebarWorkspaces';

interface RecentSidebarBoard {
    id: string;
    name: string;
    icon: string;
    href: string;
    workspaceId: string;
    workspaceName: string;
    organizationId: string;
    isOwner: boolean;
    lastAccessed?: number;
    isFromCurrentWorkspace?: boolean;
}

interface UseRecentSidebarBoardsReturn {
    boards: RecentSidebarBoard[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Hook for getting recent boards across all organizations for the sidebar
 * Prioritizes actually accessed boards over organization/workspace context
 */
export function useRecentSidebarBoards(): UseRecentSidebarBoardsReturn {
    const currentWorkspaceId = useCurrentWorkspace();
    const { recentItems } = useRecentlyViewed();
    
    // Get ALL user boards across all organizations (no org filter)
    const { boards: allBoards, loading, error, refetch } = useAllUserBoardsGlobal();

    const recentSidebarBoards = useMemo(() => {
        if (!allBoards.length) return [];

        // Create a map of recent board access times
        const recentBoardsMap = new Map(
            recentItems
                .filter(item => item.type === 'board')
                .map(item => [item.id, item.timestamp])
        );

        // Transform and sort boards
        const transformedBoards: RecentSidebarBoard[] = allBoards.map(board => ({
            id: board.id,
            name: board.name,
            icon: board.icon,
            href: board.href,
            workspaceId: board.workspaceId,
            workspaceName: board.workspaceName,
            organizationId: board.organizationId,
            isOwner: board.isOwner,
            lastAccessed: recentBoardsMap.get(board.id),
            isFromCurrentWorkspace: board.workspaceId === currentWorkspaceId,
        }));

        // Sort by priority:
        // 1. Recently accessed boards (by timestamp, newest first)
        // 2. Boards from current workspace (if no recent activity)
        // 3. Owned boards
        // 4. Alphabetical by name
        const sortedBoards = transformedBoards.sort((a, b) => {
            // Priority 1: Recent access timestamp
            if (a.lastAccessed && b.lastAccessed) {
                return b.lastAccessed - a.lastAccessed;
            }
            if (a.lastAccessed && !b.lastAccessed) return -1;
            if (!a.lastAccessed && b.lastAccessed) return 1;

            // Priority 2: Current workspace boards
            if (a.isFromCurrentWorkspace && !b.isFromCurrentWorkspace) return -1;
            if (!a.isFromCurrentWorkspace && b.isFromCurrentWorkspace) return 1;

            // Priority 3: Owned boards
            if (a.isOwner && !b.isOwner) return -1;
            if (!a.isOwner && b.isOwner) return 1;

            // Priority 4: Alphabetical
            return a.name.localeCompare(b.name);
        });

        // Return top 5 boards for sidebar
        return sortedBoards.slice(0, 5);
    }, [allBoards, recentItems, currentWorkspaceId]);

    return {
        boards: recentSidebarBoards,
        loading,
        error,
        refetch
    };
}

/**
 * Hook to get the total count of user boards across all organizations
 * Useful for "View all boards" functionality
 */
export function useAllBoardsCount(): number {
    return useAllUserBoardsGlobalCount();
}