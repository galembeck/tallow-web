import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 pb-5 pt-6 text-center">
              <Skeleton className="h-20 w-20 rounded-full" />

              <div className="flex w-full flex-col items-center gap-2">
                <Skeleton className="h-6 w-3/4 max-w-45" />
                <Skeleton className="h-4 w-full max-w-55" />
              </div>

              <Skeleton className="mt-1 h-5 w-24 rounded-full" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 p-2">
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
            </CardContent>
          </Card>
        </aside>

        <main className="flex flex-col gap-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>

          <Skeleton className="h-75 w-full rounded-xl" />
        </main>
      </div>
    </div>
  );
}
