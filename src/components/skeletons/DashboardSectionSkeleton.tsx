import CardSkeleton from "./CardSkeleton";

export default function DashboardSectionSkeleton({
  hasLabel = false,
  hasInfo = false,
  cardCount = 5,
}: {
  hasLabel?: boolean;
  hasInfo?: boolean;
  cardCount?: number;
}) {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-2 justify-between overflow-hidden">
        <div className="flex flex-col gap-0">
          {/* Label skeleton */}
          {hasLabel && (
            <div className="h-6 rounded w-40 animate-shimmer"></div>
          )}

          {/* Info skeleton */}
          {hasInfo && (
            <div className="flex items-center gap-2 mt-1">
              <div className="h-4  rounded w-20 animate-shimmer"></div>
              <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
              <div className="h-4  rounded w-16 animate-shimmer"></div>
              <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
              <div className="h-4  rounded w-12 animate-shimmer"></div>
            </div>
          )}
        </div>
      </div>

      {/* Cards skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        {Array.from({ length: cardCount }).map((_, index) => (
          <CardSkeleton
            key={index}
            className={`${Math.random() > 0.5
              ? 'rotate-slight'
              : 'rotate-slight-reverse'
              } border-2 border-background-secondary`}
          />
        ))}
      </div>
    </div>
  );
}