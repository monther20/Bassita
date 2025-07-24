import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { FirestoreBoard, FirestoreTask, FirestoreWorkspace } from '@/types/firestore';
import { useAuth } from './useAuth';

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
            // Invalidate tasks query to refetch
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
        }
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<FirestoreTask> }) => {
            return FirestoreService.updateTask(taskId, updates);
        },
        onMutate: async ({ taskId, updates }) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            const previousTasks = queryClient.getQueryData(['tasks']);

            // Update the specific task in cache
            queryClient.setQueryData(['tasks'], (old: any) => {
                if (!old) return old;
                return old.map((task: FirestoreTask) =>
                    task.id === taskId ? { ...task, ...updates } : task
                );
            });

            return { previousTasks };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks'], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });
}

export function useMoveTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, columnId, position }: { taskId: string; columnId: string; position: number }) => {
            return FirestoreService.moveTask(taskId, columnId, position);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskId: string) => {
            return FirestoreService.deleteTask(taskId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });
}

export function useUpdateBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId, updates }: { boardId: string; updates: Partial<FirestoreBoard> }) => {
            return FirestoreService.updateBoard(boardId, updates);
        },
        onMutate: async ({ boardId, updates }) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['board', boardId] });

            const previousBoard = queryClient.getQueryData(['board', boardId]);

            // Update the board in cache
            queryClient.setQueryData(['board', boardId], (old: any) => {
                if (!old) return old;
                return { ...old, ...updates };
            });

            return { previousBoard };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousBoard) {
                queryClient.setQueryData(['board', variables.boardId], context.previousBoard);
            }
        },
        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({ queryKey: ['board', variables.boardId] });
        }
    });
}

export function useReorderTasks() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskUpdates: Array<{ id: string; position: number; columnId?: string }>) => {
            return FirestoreService.reorderTasks(taskUpdates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', user?.id] });
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
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workspace-boards', variables.workspaceId] });
            queryClient.invalidateQueries({ queryKey: ['user-boards', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['workspaces', user?.id] });
        }
    });
}
