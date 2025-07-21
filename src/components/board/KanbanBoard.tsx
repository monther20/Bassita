"use client";

import BoardColumn from "./BoardColumn";
import AddColumnButton from "./AddColumnButton";

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  assignee?: {
    name: string;
    color: string;
  };
  labels?: Label[];
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
  onColumnClick?: (columnId: string) => void;
  onAddTask?: (columnId: string) => void;
  onTaskClick?: (taskId: string) => void;
  onTaskMove?: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  draggedTask?: string | null;
}

export default function KanbanBoard({
  columns,
  onAddColumn = () => console.log("Add column clicked"),
  onColumnClick = (columnId) => console.log("Column clicked:", columnId),
  onAddTask = (columnId) => console.log("Add task to column:", columnId),
  onTaskClick = (taskId) => console.log("Task clicked:", taskId),
  onTaskMove = (taskId, sourceColumnId, targetColumnId) => console.log("Move task:", taskId, sourceColumnId, targetColumnId),
  onDragStart = (taskId) => console.log("Drag start:", taskId),
  onDragEnd = () => console.log("Drag end"),
  draggedTask = null
}: KanbanBoardProps) {
  return (
    <div className="flex-1 p-6 overflow-x-auto">
      <div className="flex items-center justify-center">
        <div className="flex gap-6 h-full min-h-[calc(100vh-200px)]">
          {/* Render columns */}
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              tasks={column.tasks}
              badgeColor={column.badgeColor}
              onAddTask={() => onAddTask(column.id)}
              onColumnClick={() => onColumnClick(column.id)}
              onTaskClick={onTaskClick}
              onTaskMove={onTaskMove}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              draggedTask={draggedTask}
            />
          ))}

          {/* Add Column Button */}
          <AddColumnButton onClick={onAddColumn} />
        </div>
      </div>
    </div>
  );
}