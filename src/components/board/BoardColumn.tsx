"use client";

import { FiPlus } from "react-icons/fi";
import Card from "../card";

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

interface BoardColumnProps {
  title: string;
  tasks: Task[];
  badgeColor?: string;
  onAddTask?: () => void;
  onTaskClick?: (taskId: string) => void;
}

export default function BoardColumn({
  title,
  tasks,
  badgeColor = "bg-spotlight-purple",
  onAddTask = () => console.log("Add task clicked"),
  onTaskClick = (taskId) => console.log("Task clicked:", taskId)
}: BoardColumnProps) {

  const spotlightColors = [
    "border-spotlight-purple",
    "border-spotlight-pink",
    "border-spotlight-blue",
    "border-spotlight-green",
  ];

  const getRandomColor = () => {
    return spotlightColors[Math.floor(Math.random() * spotlightColors.length)];
  }

  return (
    <div className="flex flex-col h-fit min-w-[280px] w-80">
      {/* Column Header */}
      <div className="relative flex w-full items-center justify-center gap-2 mb-2 bg-background-secondary p-1 rounded-lg">
        <h2 className="text-text-primary font-display font-medium text-base">
          {title}
        </h2>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-spotlight-purple/20 p-1 rounded-full cursor-pointer text-text-tertiary hover:bg-spotlight-purple hover:text-text-primary transition-all duration-200" onClick={onAddTask}>
          <FiPlus />
        </button>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 space-y-3 pr-1 pt-2">
        {tasks.map((task, index) => (
          <Card
            key={index}
            title={task.title}
            description={task?.description}
            members={task.assignee?.name ? [task.assignee.name] : []}
            icon={task.emoji}
            width="w-full"
            height="h-30"
            membersSize="w-8 h-8"
            onClick={() => onTaskClick(task.id)}
            className={`bg-background-secondary ${Math.random() > 0.5 ? 'rotate-slight hover:rotate-1' : 'rotate-slight-reverse hover:-rotate-1'} cursor-pointer transition-transform duration-200  border-2 ${getRandomColor()} `}
          />
        ))}
      </div>

      {/* Add Task Button */}
      <div className="mt-6">
        <button
          onClick={onAddTask}
          className="w-full p-1 rounded-xl bg-background-secondary/50 hover:bg-background-secondary border-2 border-dashed border-text-tertiary hover:border-spotlight-purple text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer font-display font-medium text-sm flex items-center justify-center gap-2"
        >
          <FiPlus size={16} />
          Add Task
        </button>
      </div>
    </div>
  );
}