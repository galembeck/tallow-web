import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="mt-6 mb-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <Skeleton className="h-96 w-full" />
              <div className="flex gap-2 p-4">
                <Skeleton className="h-20 w-20 rounded" />
                <Skeleton className="h-20 w-20 rounded" />
                <Skeleton className="h-20 w-20 rounded" />
                <Skeleton className="h-20 w-20 rounded" />
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-md">
              <Skeleton className="h-6 w-64" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-64" />
            </div>

            <Skeleton className="h-px w-full" />

            <div className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 p-6">
              <Skeleton className="mb-2 h-12 w-32" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-10 w-16 rounded" />
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </div>

            <div className="flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm">
              <Skeleton className="h-6 w-48" />
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
                <Skeleton className="h-10 w-16 rounded" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="grid md:grid-cols-2">
            <Skeleton className="h-64 w-full md:h-auto" />
            <div className="p-8">
              <Skeleton className="mb-4 h-8 w-64" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
