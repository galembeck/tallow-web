import { Skeleton } from "@/components/ui/skeleton";

export function RegisteredAddressSkeleton() {
  return (
    <div className="bg-white border border-amber-900/10 p-4 rounded-lg animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32 bg-gray-200" />
        <Skeleton className="h-9 w-9 rounded-md bg-gray-200" />
      </div>

      <article className="flex flex-col gap-3 mt-4">
        <Skeleton className="h-4 w-3/4 bg-gray-200" />

        <Skeleton className="h-4 w-full bg-gray-200" />

        <Skeleton className="h-4 w-1/2 bg-gray-200" />

        <Skeleton className="h-4 w-2/3 bg-gray-200" />
      </article>

      <div className="flex justify-end mt-4">
        <Skeleton className="h-10 w-24 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}
