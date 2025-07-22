"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import * as Icons from "react-icons/fi";
import TaskLabels from "./TaskLabels";

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
  assignees?: Array<{ name: string; color: string }>;
  labels?: Label[];
}

interface TaskCardProps {
  task: Task;
  columnId: string;
  className?: string;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent, task: Task, sourceColumnId: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

export default function TaskCard({
  task,
  columnId,
  className = "",
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false
}: TaskCardProps) {
  const [isCurrentlyDragging, setIsCurrentlyDragging] = useState(false);

  // Extract border color and create hover background color
  const hoverBackgroundColor = useMemo(() => {
    const borderColorMap: { [key: string]: string } = {
      'border-spotlight-purple': 'rgba(124, 58, 237, 0.15)',
      'border-spotlight-pink': 'rgba(236, 72, 153, 0.15)',
      'border-spotlight-blue': 'rgba(88, 101, 242, 0.15)',
      'border-spotlight-green': 'rgba(16, 185, 129, 0.15)',
      'border-spotlight-yellow': 'rgba(245, 158, 11, 0.15)',
      'border-spotlight-red': 'rgba(239, 68, 68, 0.15)',
    };

    const borderColorClass = className.split(' ').find(cls => cls.startsWith('border-spotlight-'));
    return borderColorClass ? borderColorMap[borderColorClass] : 'rgba(124, 58, 237, 0.15)';
  }, [className]);

  // Mouse tracking state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  // Throttling for performance
  const throttleRef = useRef<number | null>(null);

  // Mouse tracking handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || isCurrentlyDragging) return;

    // Throttle mouse move events for better performance
    if (throttleRef.current) {
      cancelAnimationFrame(throttleRef.current);
    }

    throttleRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
    });
  }, [isCurrentlyDragging]);

  const handleMouseEnter = useCallback(() => {
    if (!isCurrentlyDragging) {
      setIsHovered(true);
    }
  }, [isCurrentlyDragging]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    setIsCurrentlyDragging(true);
    setIsHovered(false);

    // Set drag data
    e.dataTransfer.setData("application/json", JSON.stringify({
      taskId: task.id,
      sourceColumnId: columnId,
      task: task
    }));
    e.dataTransfer.effectAllowed = "move";

    if (onDragStart) {
      onDragStart(e, task, columnId);
    }
  };

  const handleDragEnd = () => {
    setIsCurrentlyDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  // Sync local drag state with prop changes
  useEffect(() => {
    if (!isDragging && isCurrentlyDragging) {
      setIsCurrentlyDragging(false);
    }
  }, [isDragging, isCurrentlyDragging]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
    };
  }, []);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`${(isCurrentlyDragging || isDragging) ? 'opacity-50 scale-95' : ''
        } transition-all duration-200`}
    >
      <button
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={`relative flex flex-col text-left w-full rounded-xl p-4 bg-background-tertiary font-display transition-all duration-200 hover:scale-[1.02] ${className} overflow-hidden ${isCurrentlyDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        style={{
          background: isHovered && !isCurrentlyDragging
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${hoverBackgroundColor} 0%, transparent 70%), 
               linear-gradient(135deg, ${hoverBackgroundColor} 0%, transparent, ${hoverBackgroundColor} 100%),
               var(--color-background-tertiary)`
            : undefined,
          transition: isHovered && !isCurrentlyDragging ? 'none' : 'background 0.3s ease-out',
        }}
      >
        {/* Animated overlay for flowing effect */}
        {isHovered && !isCurrentlyDragging && (
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `conic-gradient(from 0deg at ${mousePosition.x}% ${mousePosition.y}%, 
                ${hoverBackgroundColor} 0deg, 
                transparent 90deg, 
                ${hoverBackgroundColor} 180deg, 
                transparent 270deg, 
                ${hoverBackgroundColor} 360deg)`,
              animation: 'card-pulse 2s ease-in-out infinite',
            }}
          />
        )}

        <div className="flex flex-col gap-3 relative z-10">
          {/* Task labels */}
          {task.labels && task.labels.length > 0 && (
            <TaskLabels labels={task.labels} maxVisible={3} />
          )}

          {/* Task header with icon and title */}
          <div className="flex items-start gap-2">
            {task.icon && (() => {
              const IconComponent = (Icons as any)[task.icon];
              return IconComponent ? (
                <IconComponent className="text-lg flex-shrink-0 text-text-secondary" />
              ) : null;
            })()}
            <div className="flex-1">
              <h3 className="text-text-primary font-medium text-sm leading-tight">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Assignee avatar(s) */}
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex justify-end gap-1">
              {task.assignees.slice(0, 3).map((assignee) => (
                <div
                  key={assignee.name}
                  className={`w-6 h-6 rounded-full bg-${assignee.color} text-text-primary text-xs font-medium flex items-center justify-center`}
                  title={assignee.name}
                >
                  {assignee.name}
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-background-secondary text-text-secondary text-xs font-medium flex items-center justify-center">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          ) : task.assignee && (
            <div className="flex justify-end">
              <div
                className={`w-6 h-6 rounded-full bg-${task.assignee.color} text-text-primary text-xs font-medium flex items-center justify-center`}
                title={task.assignee.name}
              >
                {task.assignee.name}
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}