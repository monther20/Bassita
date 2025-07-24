import { useState, useEffect } from 'react';
import { FirestoreService } from '@/lib/firestore';
import { FirestoreBoard, FirestoreTask } from '@/types/firestore';

// UI-compatible interface (matches your existing components)
interface UITask {
  id: string;
  title: string;
  description: string;
  icon: string;
  assignee: { name: string; color: string };
  assignees?: Array<{ name: string; color: string }>;
  labels?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface UIBoardData {
  id: string;
  name: string;
  icon: string;
  members: Array<{ name: string; color: string }>;
  availableLabels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  columns: Array<{
    id: string;
    title: string;
    badgeColor: string;
    tasks: UITask[];
  }>;
}

export function useRealTimeBoard(boardId: string) {
  const [board, setBoard] = useState<FirestoreBoard | null>(null);
  const [tasks, setTasks] = useState<FirestoreTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to board changes
    const unsubscribeBoard = FirestoreService.subscribeToBoard(boardId, (boardData) => {
      if (boardData) {
        setBoard(boardData);
        setError(null);
      } else {
        setError('Board not found');
        setBoard(null);
      }
      setLoading(false);
    });

    // Subscribe to tasks changes
    const unsubscribeTasks = FirestoreService.subscribeToBoardTasks(boardId, (tasksData) => {
      setTasks(tasksData);
    });

    return () => {
      unsubscribeBoard();
      unsubscribeTasks();
    };
  }, [boardId]);

  // Convert Firestore data to UI format
  const boardData: UIBoardData | null = board ? {
    id: board.id,
    name: board.name,
    icon: board.icon,
    members: board.members.map(m => ({ 
      name: m.userId.substring(0, 2).toUpperCase(), // Extract initials for now
      color: 'spotlight-purple' // Default color - you can enhance this later
    })),
    availableLabels: board.availableLabels,
    columns: board.columns
      .sort((a, b) => a.order - b.order) // Sort by order
      .map(column => ({
        id: column.id,
        title: column.title,
        badgeColor: column.badgeColor,
        tasks: tasks
          .filter(task => task.columnId === column.id)
          .sort((a, b) => a.position - b.position)
          .map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            icon: task.icon || 'FiCircle',
            assignee: { 
              name: task.assigneeIds[0]?.substring(0, 2).toUpperCase() || 'UN', 
              color: 'spotlight-purple' 
            },
            assignees: task.assigneeIds.map(id => ({ 
              name: id.substring(0, 2).toUpperCase(), 
              color: 'spotlight-purple' 
            })),
            labels: task.labels
          }))
      }))
  } : null;

  return { 
    board: boardData, 
    loading, 
    error,
    // Expose raw data for advanced operations
    rawBoard: board,
    rawTasks: tasks
  };
}

// Helper hook for getting a specific task by ID
export function useTaskById(boardId: string, taskId: string) {
  const { rawTasks } = useRealTimeBoard(boardId);
  return rawTasks.find(task => task.id === taskId) || null;
}

// Helper hook for getting tasks in a specific column
export function useColumnTasks(boardId: string, columnId: string) {
  const { rawTasks } = useRealTimeBoard(boardId);
  return rawTasks
    .filter(task => task.columnId === columnId)
    .sort((a, b) => a.position - b.position);
}