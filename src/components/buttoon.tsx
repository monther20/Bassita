"use client";

import { ReactNode } from "react";

type ButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  label: string;
  onClick: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  textColor?: string;
  fullWidth?: boolean;
  mobileSize?: ButtonSize;
  height?: string;
  backgroundColor?: string;
  hover?: string;
}

const sizeClasses = {
  xs: "h-8 px-3 text-xs touch-target",
  sm: "h-9 px-4 text-sm touch-target",
  md: "h-10 px-6 text-sm touch-target",
  lg: "h-12 px-8 text-base touch-target"
};



export const Button = ({
  label,
  onClick,
  size = "md",
  variant = "primary",
  icon,
  height = "h-8 md:h-10",
  iconPosition = "left",
  className = "",
  backgroundColor = "bg-gradient-to-r from-spotlight-purple to-spotlight-pink",
  textColor = "text-text-primary",
  disabled = false,
  fullWidth = false,
  mobileSize,
  hover = "hover:shadow-glow-purple",
}: ButtonProps) => {

  const variantClasses = {
    primary: `${backgroundColor} ${textColor} ${hover}`,
    secondary: "bg-background-secondary text-text-primary hover:bg-background-tertiary border border-background-tertiary",
    outline: "border border-spotlight-purple text-spotlight-purple hover:bg-spotlight-purple hover:text-text-primary",
    ghost: "text-text-primary hover:bg-background-secondary"
  };

  const baseClasses = `relative rounded-full font-display cursor-pointer font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${height}`;

  const currentSize = mobileSize ? `${sizeClasses[mobileSize]} md:${sizeClasses[size].replace('touch-target', '')}` : sizeClasses[size];
  const widthClass = fullWidth ? "w-full" : "";

  const combinedClasses = `${baseClasses} ${currentSize} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      <div className="flex items-center justify-center responsive-gap-xs">
        {icon && iconPosition === "left" && (
          <span className="icon-sm">{icon}</span>
        )}
        <span>{label}</span>
        {icon && iconPosition === "right" && (
          <span className="icon-sm">{icon}</span>
        )}
      </div>
    </button>
  );
};
