import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import PouchAuth from "pouchdb-authentication";
import PouchHTTP from "pouchdb-adapter-http";
import { Capacitor } from '@capacitor/core';

PouchDB.plugin(PouchAuth);
PouchDB.plugin(PouchHTTP);
PouchDB.plugin(PouchDBFind);

// Ensure global Promise is available for pouchdb-authentication
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Promise = Promise;
} else if (typeof window !== 'undefined') {
  (window as any).Promise = Promise;
}

const pouchDBConnect = (dbName: string, options?: any) => {
  // If dbName is a full URL (remote connection), convert to proxy URL for client-side
  if (dbName.startsWith('http://') || dbName.startsWith('https://')) {
    // On client side, route through the proxy to avoid CORS issues, but not in Capacitor
    if (typeof window !== 'undefined' && !Capacitor.isNativePlatform()) {
      // Extract database name from URL
      const dbPath = dbName.split('/').pop() || dbName;

      // Determine the proxy base URL
      let proxyBaseUrl: string;

      // Check if we have a custom server URL in localStorage (for mobile/remote access)
      const customServerUrl = localStorage.getItem('NUXT_SERVER_URL');
      if (customServerUrl) {
        proxyBaseUrl = customServerUrl;
      } else {
        // Use the current origin (works for local development)
        proxyBaseUrl = window.location.origin;
      }

      const proxyUrl = `${proxyBaseUrl}/couchdb/${dbPath}`;
      console.log(`[pouchDbConnect] Routing ${dbPath} through proxy: ${proxyUrl}`);
      return new PouchDB<any>(proxyUrl, { ...options, fetch: customFetch });
    } else {
      // On server side or in Capacitor, use direct connection
      console.log(`[pouchDbConnect] Using direct connection for ${dbName}`);
      return new PouchDB<any>(dbName, { ...options, fetch: customFetch });
    }
  }

  // Local database
  return new PouchDB<any>(dbName, options);
};

// Custom fetch wrapper to add authentication headers (only for direct connections)
const customFetch = (url: string, opts: any) => {
  const config = useRuntimeConfig();
  
  if (!opts.headers) {
    opts.headers = {};
  }
  
  // Only add auth headers for direct CouchDB connections (not proxy)
  // Proxy URLs (/couchdb/*) are authenticated server-side
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const couchDBUsername = config.public.couchDBUsername;
    const couchDBPassword = config.public.couchDBPassword;
    const credentials = btoa(`${couchDBUsername}:${couchDBPassword}`);
    opts.headers['Authorization'] = `Basic ${credentials}`;
  }
  
  return fetch(url, opts);
};

export default pouchDBConnect;