import Link from 'next/link';

/**
 * Skip to main content link for keyboard navigation
 * Improves accessibility for screen reader users
 */
export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded-md"
    >
      Skip to main content
    </Link>
  );
}