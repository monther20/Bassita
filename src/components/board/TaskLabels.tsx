"use client";

interface Label {
  id: string;
  name: string;
  color: string;
}

interface TaskLabelsProps {
  labels?: Label[];
  maxVisible?: number;
  className?: string;
}

export default function TaskLabels({ 
  labels = [], 
  maxVisible = 3, 
  className = "" 
}: TaskLabelsProps) {
  if (!labels || labels.length === 0) {
    return null;
  }

  const visibleLabels = labels.slice(0, maxVisible);
  const hiddenCount = labels.length - maxVisible;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visibleLabels.map((label) => (
        <div
          key={label.id}
          className={`${label.color} h-2 min-w-8 rounded-full flex-shrink-0`}
          title={label.name}
        />
      ))}
      {hiddenCount > 0 && (
        <div
          className="bg-gray-400 h-2 min-w-4 rounded-full flex items-center justify-center"
          title={`+${hiddenCount} more labels`}
        >
          <span className="text-white text-xs font-bold">
            +{hiddenCount}
          </span>
        </div>
      )}
    </div>
  );
}