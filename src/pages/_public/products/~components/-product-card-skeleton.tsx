import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Skeleton className="h-80 w-full" />
      </div>

      <div className="p-6">
        <div className="mb-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="mb-4 flex items-baseline gap-2">
          <Skeleton className="h-8 w-24" />
        </div>

        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  );
}
