/**
 * Database Service - Singleton pattern for PouchDB connections
 * Provides centralized database access with caching
 */

import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import PouchAuth from "pouchdb-authentication";
import PouchHTTP from "pouchdb-adapter-http";
import { Capacitor } from '@capacitor/core';

// Install plugins
PouchDB.plugin(PouchAuth);
PouchDB.plugin(PouchHTTP);
PouchDB.plugin(PouchDBFind);

// Ensure global Promise is available
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as Record<string, unknown>)['Promise'] = Promise;
}

/**
 * Document type for PouchDB
 */
export interface PouchDocument {
  _id?: string;
  _rev?: string;
  [key: string]: unknown;
}

/**
 * Database information
 */
export interface DatabaseInfo {
  db_name: string;
  doc_count: number;
  update_seq: number;
}

/**
 * Query result type
 */
export interface QueryResult<T> {
  docs: T[];
  total_rows: number;
}

/**
 * Interface for runtime config that works both in and outside Nuxt context
 */
interface RuntimeConfig {
  public: {
    couchDBUrl: string;
    couchDBUsername: string;
    couchDBPassword: string;
    masterPassword: string;
  };
}

/**
 * Safely get runtime config with fallback to environment variables
 * This function can be called outside of Nuxt context
 */
const getRuntimeConfig = (): RuntimeConfig => {
  // Try to get config from Nuxt (works in Vue setup, plugins, middleware)
  if (import.meta.server || typeof window !== 'undefined') {
    try {
      // Dynamic import to avoid issues when not in Nuxt context
      const { useRuntimeConfig } = require('#imports');
      const config = useRuntimeConfig();
      if (config && config.public) {
        return config as RuntimeConfig;
      }
    } catch (e) {
      // Not in Nuxt context, fall back to env variables
      console.log('[DatabaseService] Not in Nuxt context, using environment variables');
    }
  }
  
  // Fallback to environment variables
  return {
    public: {
      couchDBUrl: process.env['DATA_BASE_URL'] || 'http://localhost:5984',
      couchDBUsername: process.env['DATA_BASE_USERNAME'] || 'admin',
      couchDBPassword: process.env['DATA_BASE_PSWD'] || 'password',
      masterPassword: process.env['VITE_MASTER_PASSWORD'] || '123356',
    }
  };
};

/**
 * Custom fetch wrapper with authentication
 * Creates the fetch function that will get config at execution time
 */
const createAuthenticatedFetch = (): ((url: string | URL | Request, opts?: RequestInit) => Promise<Response>) => {
  return (urlInput: string | URL | Request, opts: RequestInit = {}): Promise<Response> => {
    const urlStr = typeof urlInput === 'string' 
      ? urlInput 
      : urlInput instanceof URL 
        ? urlInput.toString() 
        : urlInput.url;
    
    // Only add auth headers for direct CouchDB connections
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
      // Get config at execution time (not at module load time)
      const config = getRuntimeConfig();
      const username = config.public.couchDBUsername;
      const password = config.public.couchDBPassword;
      const credentials = btoa(`${username}:${password}`);
      
      opts.headers = {
        ...opts.headers,
        'Authorization': `Basic ${credentials}`
      };
    }
    
    return fetch(urlInput, opts);
  };
};

/**
 * Create a PouchDB instance with proper configuration
 */
const createPouchDB = <T extends PouchDocument = PouchDocument>(
  dbName: string,
  options?: PouchDB.Configuration.DatabaseConfiguration
): PouchDB.Database<T> => {
  const fetchFn = createAuthenticatedFetch();
  return new PouchDB<T>(dbName, { ...options, fetch: fetchFn });
};

/**
 * Database Service Singleton
 */
class DatabaseService {
  private static instance: DatabaseService;
  private databases = new Map<string, PouchDB.Database>();
  private _config: RuntimeConfig | null = null;

  private constructor() {}

  /**
   * Get runtime config (lazy loaded)
   */
  private get config(): RuntimeConfig {
    if (!this._config) {
      this._config = getRuntimeConfig();
    }
    return this._config;
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Get or create a database connection
   */
  public getDatabase<T extends PouchDocument = PouchDocument>(
    dbName: string,
    options?: PouchDB.Configuration.DatabaseConfiguration
  ): PouchDB.Database<T> {
    if (!this.databases.has(dbName)) {
      const db = this.createDatabase<T>(dbName, options);
      this.databases.set(dbName, db);
      console.log(`[DatabaseService] Created new database connection: ${dbName}`);
    }
    
    return this.databases.get(dbName) as PouchDB.Database<T>;
  }

  /**
   * Create a new database instance with proper configuration
   */
  private createDatabase<T extends PouchDocument = PouchDocument>(
    dbName: string,
    options?: PouchDB.Configuration.DatabaseConfiguration
  ): PouchDB.Database<T> {
    // If dbName is a full URL (remote connection), handle proxy routing
    if (dbName.startsWith('http://') || dbName.startsWith('https://')) {
      if (typeof window !== 'undefined' && !Capacitor.isNativePlatform()) {
        // Client-side: route through proxy
        const dbPath = dbName.split('/').pop() || dbName;
        const customServerUrl = localStorage.getItem('NUXT_SERVER_URL');
        const proxyBaseUrl = customServerUrl || (typeof window !== 'undefined' ? window.location.origin : '');
        const proxyUrl = `${proxyBaseUrl}/couchdb/${dbPath}`;
        
        console.log(`[DatabaseService] Routing ${dbPath} through proxy: ${proxyUrl}`);
        return createPouchDB<T>(proxyUrl, options);
      }
      // Capacitor or server: direct connection
      console.log(`[DatabaseService] Using direct connection for ${dbName}`);
      return createPouchDB<T>(dbName, { ...options, skip_setup: true });
    }

    // Local database
    return createPouchDB<T>(dbName, options);
  }

  /**
   * Get remote database connection
   */
  public getRemoteDatabase<T extends PouchDocument = PouchDocument>(
    dbName: string
  ): PouchDB.Database<T> {
    const remoteUrl = `${this.config.public.couchDBUrl}/${dbName}`;
    return this.getDatabase<T>(remoteUrl, { skip_setup: true });
  }

  /**
   * Get all registered database names
   */
  public getRegisteredDatabases(): string[] {
    return Array.from(this.databases.keys());
  }

  /**
   * Check if a database is registered
   */
  public hasDatabase(dbName: string): boolean {
    return this.databases.has(dbName);
  }

  /**
   * Remove a database connection
   */
  public removeDatabase(dbName: string): void {
    const db = this.databases.get(dbName);
    if (db) {
      db.close();
      this.databases.delete(dbName);
      console.log(`[DatabaseService] Closed database connection: ${dbName}`);
    }
  }

  /**
   * Clear all database connections
   */
  public clearAll(): void {
    for (const [name, db] of this.databases) {
      db.close();
      console.log(`[DatabaseService] Closed database connection: ${name}`);
    }
    this.databases.clear();
    console.log('[DatabaseService] All database connections closed');
  }

  /**
   * Get database info
   */
  public async getInfo(dbName: string): Promise<DatabaseInfo | null> {
    try {
      const db = this.getDatabase(dbName);
      return await db.info() as unknown as DatabaseInfo;
    } catch (error) {
      console.error(`[DatabaseService] Error getting info for ${dbName}:`, error);
      return null;
    }
  }
}

// Export singleton accessor
export const databaseService = DatabaseService.getInstance();

// Export convenience function
export const getDb = <T extends PouchDocument = PouchDocument>(
  name: string,
  options?: PouchDB.Configuration.DatabaseConfiguration
): PouchDB.Database<T> => {
  return databaseService.getDatabase<T>(name, options);
};

export const getRemoteDb = <T extends PouchDocument = PouchDocument>(
  name: string
): PouchDB.Database<T> => {
  return databaseService.getRemoteDatabase<T>(name);
};

export default databaseService;
