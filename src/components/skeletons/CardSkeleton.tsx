export default function CardSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col w-full h-30 rounded-lg bg-background-tertiary animate-pulse overflow-hidden ${className}`}
    >
      {/* Content area */}
      <div className="flex flex-col gap-1 pl-2.5 pt-1">
        {/* Title skeleton */}
        <div className="h-4 bg-background-secondary rounded w-3/4 animate-shimmer"></div>

        {/* Description skeleton */}
        <div className="h-3 bg-background-secondary rounded w-1/2 mt-1 animate-shimmer"></div>

        {/* Last updated skeleton */}
        <div className="h-3 bg-background-secondary rounded w-2/3 mt-1 animate-shimmer"></div>
      </div>

      {/* Member avatars skeleton */}
      <div className="absolute bottom-2 right-2 flex flex-row gap-1">
        <div className="w-5 h-5 rounded-full bg-background-secondary animate-shimmer"></div>
        <div className="w-5 h-5 rounded-full bg-background-secondary animate-shimmer"></div>
      </div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer-slide"></div>
    </div>
  );
}