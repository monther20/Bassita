import React from "react";
import { useMemo } from "react";

export default function Card({
  width = "200",
  height = "120",
  title = "Card",
  description,
  className = "",
  members,
  lastUpdated,
}: {
  width: string;
  height: string;
  title: string;
  description?: string;
  className?: string;
  members: string[];
  lastUpdated?: string;
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

  return (

    <button
      className={`relative flex flex-col text-left ${width} ${height} rounded-lg pl-2.5 pt-1 bg-background-tertiary font-display ${className}`}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-sm text-text-primary">{title}</h1>
        {description && <p className="text-xs text-text-tertiary">{description}</p>}
        {lastUpdated && <p className="text-xs text-text-tertiary">Last updated {lastUpdated}</p>}
      </div>
      <div className="absolute bottom-2 right-2 flex flex-row gap-1">
        {members.map((member, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full text-[8px] bg-${memberColors[index]} text-text-primary flex items-center justify-center`}
          >
            {member}
          </div>
        ))}
      </div>
    </button>

  );
}
