import useSyncAll from '@/composables/useSyncAll';

export default defineNuxtPlugin(() => {
  if (process.client) {
    const startSyncIfOnline = () => {
      if (navigator.onLine) {
        useSyncAll();
      }
    };

    // Start sync on mount if online
    startSyncIfOnline();

    // Listen for online event
    window.addEventListener('online', startSyncIfOnline);
  }
});