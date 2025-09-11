import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { FirestoreBoard, FirestoreTask, FirestoreWorkspace } from '@/types/firestore';
import { useAuth } from './useAuth';
import { queryKeys, invalidationPatterns } from '@/lib/query-keys';

// Workspace Hooks
export function useUserWorkspaces() {
    const { user } = useAuth();
    
    return useQuery({
        queryKey: ['workspaces', user?.id],
        queryFn: () => FirestoreService.getUserWorkspaces(user!.id),
        enabled: !!user?.id
    });
}

export function useWorkspace(workspaceId: string) {
    return useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: () => FirestoreService.getWorkspace(workspaceId),
        enabled: !!workspaceId
    });
}

export function useWorkspaceBoards(workspaceId: string) {
    return useQuery({
        queryKey: ['workspace-boards', workspaceId],
        queryFn: () => FirestoreService.getWorkspaceBoards(workspaceId),
        enabled: !!workspaceId
    });
}

// Board Hooks
export function useBoard(boardId: string) {
    return useQuery({
        queryKey: ['board', boardId],
        queryFn: () => FirestoreService.getBoard(boardId),
        enabled: !!boardId
    });
}

export function useBoardTasks(boardId: string) {
    return useQuery({
        queryKey: ['tasks', boardId],
        queryFn: () => FirestoreService.getBoardTasks(boardId),
        enabled: !!boardId
    });
}

export function useUserBoards() {
    const { user } = useAuth();
    
    return useQuery({
        queryKey: ['user-boards', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const workspaces = await FirestoreService.getUserWorkspaces(user.id);
            const allBoards = await Promise.all(
                workspaces.map(workspace => FirestoreService.getWorkspaceBoards(workspace.id))
            );
            return allBoards.flat();
        },
        enabled: !!user?.id
    });
}

// Mutations
export function useCreateTask() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (taskData: Omit<FirestoreTask, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
            if (!user?.id) throw new Error('User not authenticated');

            return FirestoreService.createTask({
                ...taskData,
                createdBy: user.id
            });
        },
        onSuccess: (_, variables) => {
            // Invalidate tasks query using new query keys
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byBoard(variables.boardId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(variables.boardId) });
        }
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, boardId, updates }: { taskId: string; boardId: string; updates: Partial<FirestoreTask> }) => {
            return FirestoreService.updateTask(taskId, updates);
        },
        onMutate: async ({ taskId, boardId, updates }) => {
            // Optimistic update
            const tasksQueryKey = queryKeys.tasks.byBoard(boardId);
            await queryClient.cancelQueries({ queryKey: tasksQueryKey });

            const previousTasks = queryClient.getQueryData(tasksQueryKey);

            // Update the specific task in cache
            queryClient.setQueryData(tasksQueryKey, (old: any) => {
                if (!old) return old;
                return old.map((task: FirestoreTask) =>
                    task.id === taskId ? { ...task, ...updates } : task
                );
            });

            return { previousTasks, boardId };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousTasks && context?.boardId) {
                const tasksQueryKey = queryKeys.tasks.byBoard(context.boardId);
                queryClient.setQueryData(tasksQueryKey, context.previousTasks);
            }
        },
        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byBoard(variables.boardId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(variables.boardId) });
        }
    });
}

export function useMoveTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, boardId, columnId, position }: { taskId: string; boardId: string; columnId: string; position: number }) => {
            return FirestoreService.moveTask(taskId, columnId, position);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byBoard(variables.boardId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(variables.boardId) });
        }
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, boardId }: { taskId: string; boardId: string }) => {
            return FirestoreService.deleteTask(taskId);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byBoard(variables.boardId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(variables.boardId) });
        }
    });
}

export function useUpdateBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId, workspaceId, organizationId, updates }: { 
            boardId: string; 
            workspaceId: string;
            organizationId: string;
            updates: Partial<FirestoreBoard> 
        }) => {
            return FirestoreService.updateBoard(boardId, updates);
        },
        onMutate: async ({ boardId, updates }) => {
            // Optimistic update
            const boardQueryKey = queryKeys.boards.detail(boardId);
            await queryClient.cancelQueries({ queryKey: boardQueryKey });

            const previousBoard = queryClient.getQueryData(boardQueryKey);

            // Update the board in cache
            queryClient.setQueryData(boardQueryKey, (old: any) => {
                if (!old) return old;
                return { ...old, ...updates };
            });

            return { previousBoard };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousBoard) {
                queryClient.setQueryData(queryKeys.boards.detail(variables.boardId), context.previousBoard);
            }
        },
        onSettled: (_, __, variables) => {
            // Invalidate all related queries
            invalidationPatterns.board(variables.boardId, variables.workspaceId, variables.organizationId).forEach(queryKey => {
                queryClient.invalidateQueries({ queryKey });
            });
        }
    });
}

export function useReorderTasks() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId, taskUpdates }: { 
            boardId: string; 
            taskUpdates: Array<{ id: string; position: number; columnId?: string }> 
        }) => {
            return FirestoreService.reorderTasks(taskUpdates);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byBoard(variables.boardId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(variables.boardId) });
        }
    });
}

// Workspace Mutations
export function useCreateWorkspace() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (workspaceData: Omit<FirestoreWorkspace, 'id' | 'createdAt' | 'updatedAt'>) => {
            return FirestoreService.createWorkspace(workspaceData);
        },
        onSuccess: (_, variables) => {
            // Invalidate organization-specific workspace queries
            if (user?.id && variables.organizationId) {
                invalidationPatterns.workspace(variables.id || '', variables.organizationId).forEach(queryKey => {
                    queryClient.invalidateQueries({ queryKey });
                });
                
                // Invalidate user organization data
                invalidationPatterns.userOrganizationData(user.id, variables.organizationId).forEach(queryKey => {
                    queryClient.invalidateQueries({ queryKey });
                });
            }
        }
    });
}

export function useCreateBoard() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (boardData: Omit<FirestoreBoard, 'id' | 'createdAt' | 'updatedAt'>) => {
            return FirestoreService.createBoard(boardData);
        },
        onSuccess: (createdBoard, variables) => {
            if (user?.id) {
                // Invalidate workspace boards
                queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.boards(variables.workspaceId) });
                
                // Invalidate user boards for organization context
                queryClient.invalidateQueries({ queryKey: queryKeys.boards.byUser(user.id) });
                
                // Invalidate dashboard data
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                
                // Invalidate sidebar data
                queryClient.invalidateQueries({ queryKey: ['boards', 'sidebar'] });
                queryClient.invalidateQueries({ queryKey: ['workspaces', 'sidebar'] });
            }
        }
    });
}
