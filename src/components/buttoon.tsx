"use client";

export const Button = ({
  label,
  onclick,
  backgroundColor = "",
  borderColor = "",
  textColor = "",
  textSize = "",
  hover = "",
  icon,
  width = "360px",
  height = "60px",
  className,
}: {
  label: string;
  onclick: () => void;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textSize?: string;
  hover?: string;
  icon?: React.ReactNode;
  width?: string;
  height?: string;
  className: string;
}) => {
  return (
    <button
      onClick={onclick}
      style={{ width, height }}
      className={`relative  ${className} ${backgroundColor} ${borderColor} ${textColor} ${textSize} ${hover} rounded-full p-2 flex items-center justify-center cursor-pointer`}
    >
      <div className="flex flex-row items-center justify-center font-display font-semibold italic">
        {label}
      </div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 translate-x-6">
        {icon}
      </div>
    </button>
  );
};
