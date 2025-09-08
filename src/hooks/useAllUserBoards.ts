import { useQuery } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from './useAuth';

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

interface UseAllUserBoardsReturn {
    boards: UserBoard[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useAllUserBoards(): UseAllUserBoardsReturn {
    const { user } = useAuth();
    
    const workspacesQuery = useQuery({
        queryKey: ['user-workspaces', user?.id],
        queryFn: async () => {
            if (!user?.id) {
                return [];
            }
            return await FirestoreService.getUserWorkspaces(user.id);
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const boardsQuery = useQuery({
        queryKey: ['all-user-boards', user?.id],
        queryFn: async () => {
            if (!user?.id || !workspacesQuery.data) {
                return [];
            }
            
            // Fetch boards from all user workspaces
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