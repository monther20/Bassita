import { useQuery } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from './useAuth';
import { useCurrentOrganization } from './useUserOrganizations';
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

interface UseAllUserBoardsReturn {
    boards: UserBoard[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useAllUserBoards(organizationId?: string): UseAllUserBoardsReturn {
    const { user } = useAuth();
    const currentOrganizationId = useCurrentOrganization();
    
    // Use provided organizationId or  back to current organization
    const effectiveOrganizationId = organizationId || currentOrganizationId;
    
    const workspacesQuery = useQuery({
        queryKey: queryKeys.workspaces.byUser(user?.id || '', effectiveOrganizationId),
        queryFn: async () => {
            if (!user?.id) {
                return [];
            }
            
            if (effectiveOrganizationId) {
                return await FirestoreService.getOrganizationWorkspaces(effectiveOrganizationId, user.id);
            } else {
                // Fall back to all user workspaces for backward compatibility
                return await FirestoreService.getUserWorkspaces(user.id);
            }
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const boardsQuery = useQuery({
        queryKey: queryKeys.boards.byUser(user?.id || '', effectiveOrganizationId),
        queryFn: async () => {
            if (!user?.id || !workspacesQuery.data) {
                return [];
            }
            
            // Fetch boards from all user workspaces (now filtered by organization)
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