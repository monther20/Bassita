"use client";

import { useState } from "react";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import BoardHeader from "@/components/board/BoardHeader";
import KanbanBoard from "@/components/board/KanbanBoard";
import TaskModal from "@/components/board/TaskModal";
import ColumnModal from "@/components/board/ColumnModal";

// Sample data for different boards
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
  assignee: { name: string; color: string };
  labels?: Label[];
}

interface BoardData {
  id: string;
  name: string;
  icon: string;
  members: Array<{ name: string; color: string }>;
  columns: Array<{
    id: string;
    title: string;
    badgeColor: string;
    tasks: Task[];
  }>;
  availableLabels: Label[];
}

const getBoardData = (boardId: string): BoardData => {
  const boardsData: { [key: string]: BoardData } = {
    "marketing-campaign": {
      id: "marketing-campaign",
      name: "Marketing Campaign",
      icon: "🚀",
      members: [
        { name: "JD", color: "spotlight-purple" },
        { name: "SM", color: "spotlight-pink" },
        { name: "AK", color: "spotlight-green" },
        { name: "MG", color: "spotlight-yellow" },
        { name: "TL", color: "spotlight-blue" }
      ],
      availableLabels: [
        { id: "priority-high", name: "High Priority", color: "bg-red-500" },
        { id: "priority-medium", name: "Medium Priority", color: "bg-yellow-500" },
        { id: "priority-low", name: "Low Priority", color: "bg-green-500" },
        { id: "feature", name: "Feature", color: "bg-blue-500" },
        { id: "bug", name: "Bug", color: "bg-red-600" },
        { id: "enhancement", name: "Enhancement", color: "bg-purple-500" },
        { id: "documentation", name: "Documentation", color: "bg-gray-500" },
        { id: "testing", name: "Testing", color: "bg-pink-500" }
      ],
      columns: [
        {
          id: "todo",
          title: "To Do",
          badgeColor: "bg-spotlight-purple",
          tasks: [
            {
              id: "task-1",
              title: "Design user interface",
              description: "Create wireframes and mockups",
              icon: "FiLayout",
              assignee: { name: "JD", color: "spotlight-purple" },
              labels: [
                { id: "priority-high", name: "High Priority", color: "bg-red-500" },
                { id: "feature", name: "Feature", color: "bg-blue-500" }
              ]
            },
            {
              id: "task-2",
              title: "Write documentation",
              description: "Update API docs",
              icon: "FiBook",
              assignee: { name: "SM", color: "spotlight-pink" },
              labels: [
                { id: "documentation", name: "Documentation", color: "bg-gray-500" }
              ]
            }
          ]
        },
        {
          id: "in-progress",
          title: "In Progress",
          badgeColor: "bg-spotlight-yellow",
          tasks: [
            {
              id: "task-3",
              title: "Implement dashboard",
              description: "Build React components",
              icon: "FiCode",
              assignee: { name: "AK", color: "spotlight-green" },
              labels: [
                { id: "priority-medium", name: "Medium Priority", color: "bg-yellow-500" },
                { id: "feature", name: "Feature", color: "bg-blue-500" }
              ]
            }
          ]
        },
        {
          id: "done",
          title: "Done",
          badgeColor: "bg-spotlight-green",
          tasks: [
            {
              id: "task-4",
              title: "Setup authentication",
              description: "OAuth integration complete",
              icon: "FiLock",
              assignee: { name: "MG", color: "spotlight-yellow" },
              labels: [
                { id: "feature", name: "Feature", color: "bg-blue-500" }
              ]
            },
            {
              id: "task-5",
              title: "Database schema",
              description: "PostgreSQL setup done",
              icon: "FiDatabase",
              assignee: { name: "TL", color: "spotlight-blue" },
              labels: [
                { id: "enhancement", name: "Enhancement", color: "bg-purple-500" }
              ]
            }
          ]
        }
      ]
    },
    "workspace-1": {
      id: "workspace-1",
      name: "Workspace 1",
      icon: "📱",
      members: [
        { name: "JD", color: "spotlight-blue" },
        { name: "SM", color: "spotlight-green" }
      ],
      availableLabels: [
        { id: "mobile", name: "Mobile", color: "bg-blue-500" },
        { id: "api", name: "API", color: "bg-green-500" },
        { id: "urgent", name: "Urgent", color: "bg-red-500" }
      ],
      columns: [
        {
          id: "todo",
          title: "To Do",
          badgeColor: "bg-spotlight-blue",
          tasks: [
            {
              id: "task-1",
              title: "Mobile app design",
              description: "Create mobile-first UI",
              icon: "FiSmartphone",
              assignee: { name: "JD", color: "spotlight-blue" },
              labels: [
                { id: "mobile", name: "Mobile", color: "bg-blue-500" }
              ]
            }
          ]
        },
        {
          id: "in-progress",
          title: "In Progress",
          badgeColor: "bg-spotlight-yellow",
          tasks: [
            {
              id: "task-2",
              title: "API integration",
              description: "Connect backend services",
              icon: "FiZap",
              assignee: { name: "SM", color: "spotlight-green" },
              labels: [
                { id: "api", name: "API", color: "bg-green-500" },
                { id: "urgent", name: "Urgent", color: "bg-red-500" }
              ]
            }
          ]
        },
        {
          id: "done",
          title: "Done",
          badgeColor: "bg-spotlight-green",
          tasks: []
        }
      ]
    },
    "board-1": {
      id: "board-1",
      name: "Board 1",
      icon: "🏷️",
      members: [
        { name: "JD", color: "spotlight-purple" },
        { name: "SM", color: "spotlight-pink" }
      ],
      availableLabels: [
        { id: "design", name: "Design", color: "bg-purple-500" },
        { id: "planning", name: "Planning", color: "bg-orange-500" }
      ],
      columns: [
        {
          id: "todo",
          title: "To Do",
          badgeColor: "bg-spotlight-purple",
          tasks: [
            {
              id: "task-1",
              title: "Design system setup",
              description: "Create component library",
              icon: "FiPalette",
              assignee: { name: "JD", color: "spotlight-purple" },
              labels: [
                { id: "design", name: "Design", color: "bg-purple-500" }
              ]
            }
          ]
        },
        {
          id: "in-progress",
          title: "In Progress",
          badgeColor: "bg-spotlight-yellow",
          tasks: []
        },
        {
          id: "done",
          title: "Done",
          badgeColor: "bg-spotlight-green",
          tasks: [
            {
              id: "task-2",
              title: "Project planning",
              description: "Define project scope and timeline",
              icon: "FiClipboard",
              assignee: { name: "SM", color: "spotlight-pink" },
              labels: [
                { id: "planning", name: "Planning", color: "bg-orange-500" }
              ]
            }
          ]
        }
      ]
    }
  };

  // Return board data or default
  return boardsData[boardId] || {
    id: boardId,
    name: boardId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    icon: "📋",
    members: [
      { name: "JD", color: "spotlight-purple" },
      { name: "SM", color: "spotlight-pink" }
    ],
    availableLabels: [
      { id: "priority-high", name: "High Priority", color: "bg-red-500" },
      { id: "priority-medium", name: "Medium Priority", color: "bg-yellow-500" },
      { id: "priority-low", name: "Low Priority", color: "bg-green-500" }
    ],
    columns: [
      {
        id: "todo",
        title: "To Do",
        badgeColor: "bg-spotlight-purple",
        tasks: []
      },
      {
        id: "in-progress",
        title: "In Progress",
        badgeColor: "bg-spotlight-yellow",
        tasks: []
      },
      {
        id: "done",
        title: "Done",
        badgeColor: "bg-spotlight-green",
        tasks: []
      }
    ]
  };
};

interface BoardPageProps {
  params: {
    id: string;
  };
}

export default function BoardPage({ params }: BoardPageProps) {
  const [boardData, setBoardData] = useState(() => getBoardData(params.id));
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addTaskToColumn, setAddTaskToColumn] = useState<string | null>(null);

  const handleShare = () => {
    console.log("Share board:", params.id);
    // TODO: Implement share functionality
  };

  const handleMenu = () => {
    console.log("Open board menu:", params.id);
    // TODO: Implement board menu
  };

  const handleAddColumn = () => {
    setShowColumnModal(true);
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

  const handleTaskMove = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    if (sourceColumnId === targetColumnId) return;

    setBoardData(prevBoard => {
      const newColumns = [...prevBoard.columns];
      
      // Find source and target columns
      const sourceColumnIndex = newColumns.findIndex(col => col.id === sourceColumnId);
      const targetColumnIndex = newColumns.findIndex(col => col.id === targetColumnId);
      
      if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevBoard;
      
      // Find and remove task from source column
      const sourceColumn = { ...newColumns[sourceColumnIndex] };
      const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) return prevBoard;
      
      const task = sourceColumn.tasks[taskIndex];
      sourceColumn.tasks = sourceColumn.tasks.filter((_, index) => index !== taskIndex);
      
      // Add task to target column
      const targetColumn = { ...newColumns[targetColumnIndex] };
      targetColumn.tasks = [...targetColumn.tasks, task];
      
      // Update columns array
      newColumns[sourceColumnIndex] = sourceColumn;
      newColumns[targetColumnIndex] = targetColumn;
      
      return {
        ...prevBoard,
        columns: newColumns
      };
    });
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    setBoardData(prevBoard => {
      const newColumns = [...prevBoard.columns];
      
      if ('id' in taskData) {
        // Editing existing task
        const taskId = taskData.id;
        for (let i = 0; i < newColumns.length; i++) {
          const taskIndex = newColumns[i].tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            newColumns[i] = {
              ...newColumns[i],
              tasks: [
                ...newColumns[i].tasks.slice(0, taskIndex),
                taskData as Task,
                ...newColumns[i].tasks.slice(taskIndex + 1)
              ]
            };
            break;
          }
        }
      } else {
        // Adding new task
        if (addTaskToColumn) {
          const columnIndex = newColumns.findIndex(col => col.id === addTaskToColumn);
          if (columnIndex !== -1) {
            const newTask: Task = {
              ...taskData,
              id: `task-${Date.now()}`
            };
            
            newColumns[columnIndex] = {
              ...newColumns[columnIndex],
              tasks: [...newColumns[columnIndex].tasks, newTask]
            };
          }
        }
      }
      
      return {
        ...prevBoard,
        columns: newColumns
      };
    });
    
    setShowTaskModal(false);
    setEditingTask(null);
    setAddTaskToColumn(null);
  };

  const handleSaveColumn = (columnData: { title: string; badgeColor: string }) => {
    setBoardData(prevBoard => ({
      ...prevBoard,
      columns: [
        ...prevBoard.columns,
        {
          id: `column-${Date.now()}`,
          title: columnData.title,
          badgeColor: columnData.badgeColor,
          tasks: []
        }
      ]
    }));
    
    setShowColumnModal(false);
  };

  return (
    <ProtectedLayout showSidebar={false} className="bg-background-primary">
      <div className="flex flex-col h-full">
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
        }}
        onSave={handleSaveTask}
        task={editingTask}
        availableLabels={boardData.availableLabels}
        members={boardData.members}
      />
      
      <ColumnModal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        onSave={handleSaveColumn}
      />
    </ProtectedLayout>
  );
}