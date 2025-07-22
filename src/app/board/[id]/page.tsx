"use client";

import { useState, use } from "react";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import BoardHeader from "@/components/board/BoardHeader";
import KanbanBoard from "@/components/board/KanbanBoard";
import TaskModal from "@/components/board/TaskModal";
import ColumnModal from "@/components/board/ColumnModal";
import { useRealTimeBoard } from "@/hooks/useRealTimeBoard";
import { useMoveTask, useCreateTask, useUpdateTask, useUpdateBoard, useDeleteTask } from "@/hooks/useFirestore";
import { FirestoreTask } from "@/types/firestore";
import { v4 as uuidv4 } from "uuid";


// UI-compatible interfaces (matches useRealTimeBoard output)
interface Label {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  icon: string;
  assignee: { name: string; color: string }; // backward compatibility
  assignees?: Array<{ name: string; color: string }>;
  labels?: Label[];
}

// Type for mutation error handling
type MutationError = Error | { message: string };

interface BoardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  // Unwrap async params for Next.js 15 compatibility
  const { id: boardId } = use(params);
  
  // Real-time Firestore data subscription
  const { board: boardData, loading, error } = useRealTimeBoard(boardId);
  
  // Firestore mutations
  const moveTaskMutation = useMoveTask();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const updateBoardMutation = useUpdateBoard();
  const deleteTaskMutation = useDeleteTask();
  
  // Mutation states for loading/error handling
  const isAnyMutationLoading = 
    moveTaskMutation.isPending || 
    createTaskMutation.isPending || 
    updateTaskMutation.isPending || 
    updateBoardMutation.isPending ||
    deleteTaskMutation.isPending;
  
  // Local UI state
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string; badgeColor: string } | null>(null);
  const [addTaskToColumn, setAddTaskToColumn] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  
  // Clear errors when they occur
  const clearError = () => setMutationError(null);
  
  // Show loading state
  if (loading) {
    return (
      <ProtectedLayout showSidebar={false} className="bg-background-primary">
        <div className="flex items-center justify-center h-full">
          <div className="text-text-secondary font-display text-lg">Loading board...</div>
        </div>
      </ProtectedLayout>
    );
  }
  
  // Show error state
  if (error || !boardData) {
    return (
      <ProtectedLayout showSidebar={false} className="bg-background-primary">
        <div className="flex items-center justify-center h-full">
          <div className="text-text-secondary font-display text-lg">
            {error || 'Board not found'}
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  const handleShare = () => {
    console.log("Share board:", boardId);
    // TODO: Implement share functionality
  };

  const handleMenu = () => {
    console.log("Open board menu:", boardId);
    // TODO: Implement board menu
  };

  const handleAddColumn = () => {
    setEditingColumn(null);
    setShowColumnModal(true);
  };

  const handleColumnClick = (columnId: string) => {
    const column = boardData.columns.find(col => col.id === columnId);
    if (column) {
      setEditingColumn({
        id: column.id,
        title: column.title,
        badgeColor: column.badgeColor
      });
      setShowColumnModal(true);
    }
  };

  const handleAddTask = (columnId: string) => {
    setAddTaskToColumn(columnId);
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleTaskClick = (taskId: string) => {
    // Find the task across all columns
    let foundTask: Task | null = null;
    for (const column of boardData.columns) {
      foundTask = column.tasks.find(task => task.id === taskId) || null;
      if (foundTask) break;
    }

    if (foundTask) {
      setEditingTask(foundTask);
      setAddTaskToColumn(null);
      setShowTaskModal(true);
    }
  };

  const handleTaskMove = (taskId: string, sourceColumnId: string, targetColumnId: string, targetPosition?: number) => {
    // Calculate position - if not provided, add to end
    const targetColumn = boardData.columns.find(col => col.id === targetColumnId);
    const position = targetPosition !== undefined ? targetPosition : (targetColumn?.tasks.length || 0);
    
    clearError();
    
    // Use Firestore mutation to move task
    moveTaskMutation.mutate({
      taskId,
      columnId: targetColumnId,
      position
    }, {
      onError: (error: MutationError) => {
        setMutationError(`Failed to move task: ${error.message}`);
      }
    });
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    clearError();
    deleteTaskMutation.mutate(taskId, {
      onError: (error: MutationError) => {
        setMutationError(`Failed to delete task: ${error.message}`);
      }
    });
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    // Data validation
    if (!taskData.title.trim()) {
      setMutationError('Task title is required');
      return;
    }
    
    if (!taskData.description.trim()) {
      setMutationError('Task description is required');
      return;
    }
    
    clearError();
    
    if ('id' in taskData) {
      // Editing existing task - convert UI format to Firestore format
      const firestoreUpdates: Partial<FirestoreTask> = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        icon: taskData.icon,
        assigneeIds: taskData.assignees?.map(a => a.name) || [taskData.assignee.name],
        labels: taskData.labels || []
      };
      
      updateTaskMutation.mutate({
        taskId: taskData.id,
        updates: firestoreUpdates
      }, {
        onSuccess: () => {
          setShowTaskModal(false);
          setEditingTask(null);
          setAddTaskToColumn(null);
        },
        onError: (error: MutationError) => {
          setMutationError(`Failed to update task: ${error.message}`);
        }
      });
    } else {
      // Adding new task
      if (addTaskToColumn) {
        const targetColumn = boardData.columns.find(col => col.id === addTaskToColumn);
        const position = targetColumn?.tasks.length || 0;
        
        const newFirestoreTask: Omit<FirestoreTask, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
          title: taskData.title.trim(),
          description: taskData.description.trim(),
          boardId: boardId,
          columnId: addTaskToColumn,
          position,
          assigneeIds: taskData.assignees?.map(a => a.name) || [taskData.assignee.name],
          labels: taskData.labels || [],
          icon: taskData.icon
        };
        
        createTaskMutation.mutate(newFirestoreTask, {
          onSuccess: () => {
            setShowTaskModal(false);
            setEditingTask(null);
            setAddTaskToColumn(null);
          },
          onError: (error: MutationError) => {
            setMutationError(`Failed to create task: ${error.message}`);
          }
        });
      }
    }
  };

  const handleSaveColumn = (columnData: { title: string; badgeColor: string } | { id: string; title: string; badgeColor: string }) => {
    // Data validation
    if (!columnData.title.trim()) {
      setMutationError('Column title is required');
      return;
    }
    
    // Check for duplicate column names (excluding the current column being edited)
    const existingColumn = boardData.columns.find(col => 
      col.title.toLowerCase() === columnData.title.trim().toLowerCase() && 
      ('id' in columnData ? col.id !== columnData.id : true)
    );
    
    if (existingColumn) {
      setMutationError('A column with this name already exists');
      return;
    }
    
    clearError();
    
    if ('id' in columnData) {
      // Editing existing column
      const updatedColumns = boardData.columns.map(column =>
        column.id === columnData.id
          ? { ...column, title: columnData.title.trim(), badgeColor: columnData.badgeColor }
          : column
      );
      
      updateBoardMutation.mutate({
        boardId: boardId,
        updates: { columns: updatedColumns }
      }, {
        onSuccess: () => {
          setShowColumnModal(false);
          setEditingColumn(null);
        },
        onError: (error: MutationError) => {
          setMutationError(`Failed to update column: ${error.message}`);
        }
      });
    } else {
      // Adding new column
      const newColumn = {
        id: uuidv4(),
        title: columnData.title.trim(),
        badgeColor: columnData.badgeColor,
        order: boardData.columns.length
      };
      
      const updatedColumns = [...boardData.columns, newColumn];
      
      updateBoardMutation.mutate({
        boardId: boardId,
        updates: { columns: updatedColumns }
      }, {
        onSuccess: () => {
          setShowColumnModal(false);
          setEditingColumn(null);
        },
        onError: (error: MutationError) => {
          setMutationError(`Failed to create column: ${error.message}`);
        }
      });
    }
  };

  return (
    <ProtectedLayout showSidebar={false} className="bg-background-primary">
      <div className="flex flex-col h-full">
        {/* Error Banner */}
        {mutationError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 mx-6 mt-4 rounded-lg flex items-center justify-between">
            <span>{mutationError}</span>
            <button 
              onClick={clearError}
              className="text-red-400 hover:text-red-300 ml-4"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isAnyMutationLoading && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 mx-6 mt-2 rounded-lg text-center">
            <span>Saving changes...</span>
          </div>
        )}

        {/* Board Header */}
        <BoardHeader
          boardName={boardData.name}
          boardIcon={boardData.icon}
          members={boardData.members}
          onShare={handleShare}
          onMenu={handleMenu}
        />

        {/* Kanban Board */}
        <KanbanBoard
          columns={boardData.columns}
          onAddColumn={handleAddColumn}
          onColumnClick={handleColumnClick}
          onAddTask={handleAddTask}
          onTaskClick={handleTaskClick}
          onTaskMove={handleTaskMove}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedTask={draggedTask}
        />
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
          setAddTaskToColumn(null);
          clearError();
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={editingTask}
        availableLabels={boardData.availableLabels}
        members={boardData.members}
      />

      <ColumnModal
        isOpen={showColumnModal}
        onClose={() => {
          setShowColumnModal(false);
          setEditingColumn(null);
        }}
        onSave={handleSaveColumn}
        column={editingColumn}
      />
    </ProtectedLayout>
  );
}