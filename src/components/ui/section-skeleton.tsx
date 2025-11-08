import { Skeleton } from '@/components/ui/skeleton';

interface SectionSkeletonProps {
  className?: string;
  lines?: number;
}

/**
 * Reusable skeleton loader for sections
 * Provides consistent loading states across the application
 */
export function SectionSkeleton({ className = '', lines = 3 }: SectionSkeletonProps) {
  return (
    <section className={`w-full py-20 bg-background ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}