import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-col gap-8">
        <Skeleton className="h-7 w-48" />

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-8">
        <div className="py-6">
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-44" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-44" />
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex flex-col md:flex-row items-center gap-6"
                >
                  <Skeleton className="h-16 w-16 rounded-md shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full max-w-62.5" />
                  </div>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-900/5 rounded-lg p-4 flex flex-col gap-4 border border-amber-900/10 h-fit">
              <Skeleton className="h-5 w-32" />
              <Separator />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
