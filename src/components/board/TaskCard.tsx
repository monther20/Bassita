"use client";

import React from "react";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";

interface TaskCardProps {
  title: string;
  description?: string;
  emoji?: string;
  assignee?: {
    name: string;
    color: string;
  };
  className?: string;
  onClick?: () => void;
}

export default function TaskCard({
  title,
  description,
  emoji,
  assignee,
  className = "",
  onClick = () => {}
}: TaskCardProps) {
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
    if (!cardRef.current) return;

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
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
    };
  }, []);

  return (
    <button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative flex flex-col text-left w-full rounded-xl p-4 bg-background-tertiary font-display transition-all duration-200 hover:scale-[1.02] ${className} overflow-hidden cursor-pointer`}
      style={{
        background: isHovered
          ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${hoverBackgroundColor} 0%, transparent 70%), 
             linear-gradient(135deg, ${hoverBackgroundColor} 0%, transparent 50%, ${hoverBackgroundColor} 100%),
             var(--color-background-tertiary)`
          : undefined,
        transition: isHovered ? 'none' : 'background 0.3s ease-out',
      }}
    >
      {/* Animated overlay for flowing effect */}
      {isHovered && (
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
        {/* Task header with emoji and title */}
        <div className="flex items-start gap-2">
          {emoji && (
            <span className="text-lg flex-shrink-0">{emoji}</span>
          )}
          <div className="flex-1">
            <h3 className="text-text-primary font-medium text-sm leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Assignee avatar */}
        {assignee && (
          <div className="flex justify-end">
            <div
              className={`w-6 h-6 rounded-full bg-${assignee.color} text-text-primary text-xs font-medium flex items-center justify-center`}
              title={assignee.name}
            >
              {assignee.name}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}