
import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
    <Skeleton className="h-[200px] w-full" />
    <div className="p-6 space-y-4">
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-7 w-[90%]" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-5 w-[40%]" />
        <Skeleton className="h-5 w-[30%]" />
      </div>
    </div>
  </div>
);

export default PostSkeleton;
