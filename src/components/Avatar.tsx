import React from "react";
import Image from "next/image";
import { FiUser } from "react-icons/fi";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-4 h-4",
  sm: "w-5 h-5 md:w-7 md:h-7", 
  md: "w-8 h-8 md:w-10 md:h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16"
};

const iconSizes = {
  xs: "w-2 h-2",
  sm: "w-2.5 h-2.5 md:w-3.5 md:h-3.5",
  md: "w-4 h-4 md:w-5 md:h-5", 
  lg: "w-6 h-6",
  xl: "w-8 h-8"
};

export default function Avatar({ 
  src, 
  name = "User", 
  size = "md", 
  className = "" 
}: AvatarProps) {
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        className={`rounded-lg flex-shrink-0 ${sizeClass} ${className}`}
        width={64}
        height={64}
      />
    );
  }

  return (
    <div className={`rounded-lg bg-gradient-to-br from-spotlight-purple to-spotlight-pink flex items-center justify-center flex-shrink-0 ${sizeClass} ${className}`}>
      <FiUser className={`text-white ${iconSize}`} />
    </div>
  );
}