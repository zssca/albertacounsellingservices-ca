'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

/**
 * Service Worker Provider Component
 * Handles registration, updates, and offline functionality
 */
export function ServiceWorkerProvider() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        registrationRef.current = reg;

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });

        // Check for updates every hour
        setInterval(() => {
          reg.update();
        }, 3600000);

      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    registerServiceWorker();

    // Handle controller change
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    // Cleanup
    return () => {
      registrationRef.current?.unregister();
    };
  }, []);

  const handleUpdate = () => {
    if (!registrationRef.current?.waiting) return;

    // Tell the waiting service worker to take control
    registrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-none border-primary">
        <CardContent className="flex items-center gap-4 p-4">
          <RefreshCw className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Update available</p>
            <p className="text-xs text-muted-foreground">
              A new version is ready to install
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleUpdate}
            className="shadow-none"
          >
            Update
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to check online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}