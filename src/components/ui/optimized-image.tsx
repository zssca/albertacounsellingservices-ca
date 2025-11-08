'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedImageProps extends ImageProps {
  fadeIn?: boolean;
  lazyLoad?: boolean;
  aspectRatio?: number;
}

/**
 * Optimized Image component with lazy loading and fade-in effects
 * Provides better performance and user experience
 */
export function OptimizedImage({
  fadeIn = true,
  lazyLoad = true,
  aspectRatio,
  className,
  alt,
  style,
  priority,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const shouldLoad = !lazyLoad || isIntersecting;

  // Determine loading strategy
  // If priority is true, don't set loading (Next.js will handle it)
  // If priority is false/undefined and lazyLoad is true, use lazy loading
  const imageLoading = priority ? undefined : (lazyLoad ? 'lazy' : 'eager');

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={{
        ...style,
        ...(aspectRatio && {
          aspectRatio: String(aspectRatio),
        }),
      }}
    >
      {shouldLoad && (
        <Image
          {...props}
          alt={alt}
          priority={priority}
          className={cn(
            'object-cover',
            fadeIn && 'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
          loading={imageLoading}
          quality={95}
        />
      )}
      {/* Loading skeleton */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
}