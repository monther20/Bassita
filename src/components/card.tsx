"use client";


import React from "react";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";

export default function Card({
  width = "200",
  height = "120",
  title = "Card",
  membersSize = "w-6 h-6",
  description,
  className = "",
  members,
  icon,
  lastUpdated,
  onClick,
}: {
  width: string;
  height: string;
  title: string;
  membersSize?: string;
  description?: string;
  className?: string;
  members: string[];
  icon?: string;
  lastUpdated?: string;
  onClick?: () => void;
}) {
  const spotlightColors = [
    "spotlight-purple",
    "spotlight-pink",
    "spotlight-blue",
    "spotlight-green",
    "spotlight-yellow",
    "spotlight-red",
  ];

  const memberColors = useMemo(() => {
    const getRandomColor = () => {
      return spotlightColors[
        Math.floor(Math.random() * spotlightColors.length)
      ];
    };
    return members.map(() => getRandomColor());
  }, [members]);

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
      className={`relative flex flex-col text-left ${width} ${height} rounded-lg pl-2.5 pt-1 bg-background-tertiary font-display ${className} overflow-hidden`}
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

      <div className="flex flex-col gap-1 relative z-10">
        <h1 className="text-sm text-text-primary">{title}</h1>
        {description && <p className="text-xs text-text-tertiary">{description}</p>}
        {lastUpdated && <p className="text-xs text-text-tertiary">Last updated {lastUpdated}</p>}
      </div>
      <div className="absolute bottom-2 right-2 flex flex-row gap-1 z-10">
        {members.map((member, index) => (
          <div
            key={index}
            className={`${membersSize} rounded-full text-[10px] bg-${memberColors[index]} text-text-primary flex items-center justify-center`}
          >
            {member}
          </div>
        ))}
      </div>

      {icon && (
        <div className="absolute bottom-2 left-2 flex flex-row gap-1 z-10">
          <div className="w-5 h-5 rounded-full flex items-center justify-center p2">
            {icon}
          </div>
        </div>
      )}
    </button>

  );
}
