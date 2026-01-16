import useSyncAll from '@/composables/useSyncAll';
import { Network } from '@capacitor/network';

export default defineNuxtPlugin(() => {
  if (process.client) {
    const startSyncIfOnline = async () => {
      try {
        // Try to use Capacitor Network API (native, more reliable on Android)
        if (typeof Network !== 'undefined') {
          const status = await Network.getStatus();
          if (status.connected) {
            // Await the sync to complete
            await useSyncAll();
          }
        } else {
          // Fallback to navigator.onLine for web
          if (navigator.onLine) {
            // Await the sync to complete
            await useSyncAll();
          }
        }
      } catch (error) {
        // If Capacitor not available, use navigator.onLine
        if (navigator.onLine) {
          // Await the sync to complete
          await useSyncAll();
        }
      }
    };

    // Start sync on mount if online
    startSyncIfOnline();

    // Listen for network status changes (Capacitor)
    try {
      Network.addListener('networkStatusChange', (status) => {
        if (status.connected) {
          // Trigger sync when coming back online
          startSyncIfOnline();
        }
      });
    } catch (error) {
      // If Capacitor not available, listen for browser events
      window.addEventListener('online', startSyncIfOnline);
    }
  }
});