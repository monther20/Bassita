import { useQuery } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from './useAuth';
import { queryKeys } from '@/lib/query-keys';

interface UserBoard {
    id: string;
    name: string;
    icon: string;
    href: string;
    workspaceId: string;
    workspaceName: string;
    organizationId: string;
    isOwner: boolean;
}

interface UseAllUserBoardsGlobalReturn {
    boards: UserBoard[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Hook to fetch ALL user boards across ALL organizations and workspaces
 * This hook does NOT filter by current organization context
 * Use this when you need truly global access to all user boards
 */
export function useAllUserBoardsGlobal(): UseAllUserBoardsGlobalReturn {
    const { user } = useAuth();
    
    const workspacesQuery = useQuery({
        queryKey: queryKeys.workspaces.byUser(user?.id || '', 'all'),
        queryFn: async () => {
            if (!user?.id) {
                return [];
            }
            
            // Get ALL user workspaces across all organizations
            return await FirestoreService.getUserWorkspaces(user.id);
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const boardsQuery = useQuery({
        queryKey: queryKeys.boards.byUser(user?.id || '', 'all'),
        queryFn: async () => {
            if (!user?.id || !workspacesQuery.data) {
                return [];
            }
            
            // Fetch boards from ALL user workspaces (no organization filtering)
            const allBoardsPromises = workspacesQuery.data.map(async (workspace) => {
                const boards = await FirestoreService.getWorkspaceBoards(workspace.id);
                return boards.map(board => ({
                    ...board,
                    workspaceName: workspace.name,
                    workspaceId: workspace.id,
                    organizationId: workspace.organizationId
                }));
            });

            const allBoardsArrays = await Promise.all(allBoardsPromises);
            return allBoardsArrays.flat();
        },
        enabled: !!user?.id && !!workspacesQuery.data,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Transform firestore boards to UI format
    const userBoards: UserBoard[] = (boardsQuery.data || []).map(board => ({
        id: board.id,
        name: board.name,
        icon: board.icon,
        href: `/organization/${board.organizationId}/workspace/${board.workspaceId}/board/${board.id}`,
        workspaceId: board.workspaceId,
        workspaceName: board.workspaceName,
        organizationId: board.organizationId,
        isOwner: board.ownerId === user?.id
    }));

    return {
        boards: userBoards,
        loading: workspacesQuery.isLoading || boardsQuery.isLoading,
        error: (workspacesQuery.error || boardsQuery.error) instanceof Error 
            ? (workspacesQuery.error || boardsQuery.error)?.message || null 
            : null,
        refetch: () => {
            workspacesQuery.refetch();
            boardsQuery.refetch();
        }
    };
}

/**
 * Hook to get the total count of ALL user boards across all organizations
 */
export function useAllUserBoardsGlobalCount(): number {
    const { boards } = useAllUserBoardsGlobal();
    return boards.length;
}