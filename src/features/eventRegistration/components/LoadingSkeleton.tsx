import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <div className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
    <Skeleton className="h-10 w-1/3 mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  </div>
);