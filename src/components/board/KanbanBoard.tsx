"use client";

import BoardColumn from "./BoardColumn";
import AddColumnButton from "./AddColumnButton";

interface Task {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
  assignee?: {
    name: string;
    color: string;
  };
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  badgeColor?: string;
}

interface KanbanBoardProps {
  columns: Column[];
  onAddColumn?: () => void;
  onAddTask?: (columnId: string) => void;
  onTaskClick?: (taskId: string) => void;
}

export default function KanbanBoard({
  columns,
  onAddColumn = () => console.log("Add column clicked"),
  onAddTask = (columnId) => console.log("Add task to column:", columnId),
  onTaskClick = (taskId) => console.log("Task clicked:", taskId)
}: KanbanBoardProps) {
  return (
    <div className="flex-1 p-6 overflow-x-auto">
      <div className="flex items-center justify-center">
        <div className="flex gap-6 h-full min-h-[calc(100vh-200px)]">
          {/* Render columns */}
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              title={column.title}
              tasks={column.tasks}
              badgeColor={column.badgeColor}
              onAddTask={() => onAddTask(column.id)}
              onTaskClick={onTaskClick}
            />
          ))}

          {/* Add Column Button */}
          <AddColumnButton onClick={onAddColumn} />
        </div>
      </div>
    </div>
  );
}