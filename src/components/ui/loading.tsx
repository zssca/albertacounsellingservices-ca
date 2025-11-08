"use client";

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ServiceCardSkeleton() {
  return (
    <Card className="shadow-none">
      <div className="relative aspect-[3/2]">
        <Skeleton className="w-full h-full rounded-t-lg" />
      </div>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export function TestimonialSkeleton() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-8 md:p-12">
        <div className="flex justify-center mb-6">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-4/5 mb-2 mx-auto" />
        <Skeleton className="h-6 w-3/5 mb-8 mx-auto" />
        <div className="flex justify-center items-center space-x-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-5 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-6 w-32 mx-auto" />
      </CardContent>
    </Card>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="text-center space-y-6 mb-16">
      <Skeleton className="h-8 w-32 mx-auto" />
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-2/3 mx-auto" />
    </div>
  );
}