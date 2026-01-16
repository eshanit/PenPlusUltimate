import { ref, onMounted, onUnmounted } from 'vue';
import { Network } from '@capacitor/network';

/**
 * Composable to track network connectivity status
 * On Android/iOS, uses Capacitor's Network plugin for reliable detection
 * Falls back to navigator.onLine for web
 */
export const useNetworkStatus = () => {
  const isOnline = ref(true);

  const updateNetworkStatus = async () => {
    try {
      // Try to use Capacitor Network API (native, more reliable)
      if (typeof Network !== 'undefined') {
        const status = await Network.getStatus();
        isOnline.value = status.connected;
      } else {
        // Fallback to navigator.onLine for web
        isOnline.value = navigator.onLine;
      }
    } catch (error) {
      // If Capacitor not available, use navigator.onLine
      isOnline.value = navigator.onLine;
    }
  };

  onMounted(async () => {
    // Initial check
    await updateNetworkStatus();

    // Listen for Capacitor network changes
    try {
      const unsubscribe = await Network.addListener('networkStatusChange', (status) => {
        isOnline.value = status.connected;
      });

      // Also listen for standard browser events as fallback
      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);

      onUnmounted(() => {
        unsubscribe?.remove?.();
        window.removeEventListener('online', updateNetworkStatus);
        window.removeEventListener('offline', updateNetworkStatus);
      });
    } catch (error) {
      // If Capacitor Network not available, just use browser events
      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);

      onUnmounted(() => {
        window.removeEventListener('online', updateNetworkStatus);
        window.removeEventListener('offline', updateNetworkStatus);
      });
    }
  });

  return {
    isOnline,
    updateNetworkStatus,
  };
};
