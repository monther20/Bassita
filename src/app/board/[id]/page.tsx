"use client";

import { useState } from "react";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import BoardHeader from "@/components/board/BoardHeader";
import KanbanBoard from "@/components/board/KanbanBoard";

// Sample data for different boards
const getBoardData = (boardId: string) => {
  const boardsData: { [key: string]: any } = {
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
              emoji: "😀",
              assignee: { name: "JD", color: "spotlight-purple" }
            },
            {
              id: "task-2",
              title: "Write documentation",
              description: "Update API docs",
              emoji: "😀",
              assignee: { name: "SM", color: "spotlight-pink" }
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
              emoji: "🚀",
              assignee: { name: "AK", color: "spotlight-green" }
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
              emoji: "🚀",
              assignee: { name: "MG", color: "spotlight-yellow" }
            },
            {
              id: "task-5",
              title: "Database schema",
              description: "PostgreSQL setup done",
              emoji: "🚀",
              assignee: { name: "TL", color: "spotlight-blue" }
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
              emoji: "📱",
              assignee: { name: "JD", color: "spotlight-blue" }
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
              emoji: "⚡",
              assignee: { name: "SM", color: "spotlight-green" }
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
              emoji: "🎨",
              assignee: { name: "JD", color: "spotlight-purple" }
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
              emoji: "📋",
              assignee: { name: "SM", color: "spotlight-pink" }
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

  const handleShare = () => {
    console.log("Share board:", params.id);
    // TODO: Implement share functionality
  };

  const handleMenu = () => {
    console.log("Open board menu:", params.id);
    // TODO: Implement board menu
  };

  const handleAddColumn = () => {
    console.log("Add new column to board:", params.id);
    // TODO: Implement add column functionality
  };

  const handleAddTask = (columnId: string) => {
    console.log("Add task to column:", columnId);
    // TODO: Implement add task functionality
  };

  const handleTaskClick = (taskId: string) => {
    console.log("Open task:", taskId);
    // TODO: Implement task details modal
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
        />
      </div>
    </ProtectedLayout>
  );
}