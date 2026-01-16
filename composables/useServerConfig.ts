/**
 * Manages server configuration for remote access
 * Allows setting a custom server URL for when accessing from Android tablets or other devices
 */

export const useServerConfig = () => {
  // Set the server URL to be used for proxy connections
  // Call this when you know the actual server address (e.g., from Android tablet)
  const setServerUrl = (url: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('NUXT_SERVER_URL', url.replace(/\/$/, '')); // Remove trailing slash
      console.log('[useServerConfig] Server URL set to:', url);
    }
  };

  // Get the current server URL
  const getServerUrl = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('NUXT_SERVER_URL');
    }
    return null;
  };

  // Clear the custom server URL
  const clearServerUrl = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('NUXT_SERVER_URL');
      console.log('[useServerConfig] Server URL cleared');
    }
  };

  return {
    setServerUrl,
    getServerUrl,
    clearServerUrl,
  };
};
