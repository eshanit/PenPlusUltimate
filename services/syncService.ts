/**
 * Sync Service - Unified bidirectional synchronization
 * Handles database replication between local PouchDB and remote CouchDB
 */

import { ref, readonly } from 'vue';
import { databaseService } from './database';
import { handleError } from '@/utils/errorHandler';
import type { 
  SyncResult, 
  SyncOptions, 
  SyncProgress, 
  SyncStats,
  InitialSyncResult 
} from '@/interfaces/ISync';
import DatabaseNames from '@/constants/DatabaseNames';

/**
 * Default sync options
 */
const DEFAULT_SYNC_OPTIONS: SyncOptions = {
  direction: 'both',
  retry: true,
  batchSize: 50,
  createTarget: false
};

/**
 * Sync Service Singleton
 */
class SyncService {
  private static instance: SyncService;
  private activeSyncs = new Map<string, Promise<SyncResult>>();

  // Reactive state for UI updates
  private _progress = ref<SyncProgress>({
    status: 'idle',
    message: ''
  });
  
  private _lastSyncResults = ref<Map<string, SyncResult>>(new Map());

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * Get reactive progress state
   */
  public get progress() {
    return readonly(this._progress.value);
  }

  /**
   * Get reactive last sync results
   */
  public get lastSyncResults() {
    return readonly(this._lastSyncResults.value);
  }

  /**
   * Sync a single database
   */
  public async sync(
    databaseName: string, 
    options: Partial<SyncOptions> = {}
  ): Promise<SyncResult> {
    const opts: SyncOptions = { ...DEFAULT_SYNC_OPTIONS, ...options };
    
    // Check if already syncing
    if (this.activeSyncs.has(databaseName)) {
      console.log(`[SyncService] Sync already in progress for ${databaseName}`);
      return this.activeSyncs.get(databaseName)!;
    }

    this.updateProgress({
      status: 'syncing',
      message: `Syncing ${databaseName}...`,
      databaseName
    });

    const syncPromise = this.performSync(databaseName, opts);
    this.activeSyncs.set(databaseName, syncPromise);

    try {
      const result = await syncPromise;
      this._lastSyncResults.value.set(databaseName, result);
      this.updateProgress({
        status: 'complete',
        message: `Sync complete for ${databaseName}`,
        progress: 100,
        databaseName
      });
      return result;
    } catch (error) {
      const appError = handleError(error, `SyncService.sync(${databaseName})`);
      this.updateProgress({
        status: 'error',
        message: `Sync failed for ${databaseName}: ${appError.message}`,
        databaseName
      });
      throw appError;
    } finally {
      this.activeSyncs.delete(databaseName);
    }
  }

  /**
   * Perform the actual sync operation
   */
  private async performSync(
    databaseName: string, 
    options: SyncOptions
  ): Promise<SyncResult> {
    const stats: SyncStats = { pulled: 0, pushed: 0, conflicts: 0 };
    
    try {
      // Get local and remote databases
      const localDb = databaseService.getDatabase(databaseName);
      const remoteDb = databaseService.getRemoteDatabase(databaseName);

      // Phase 1: Pull from remote
      if (options.direction === 'from' || options.direction === 'both') {
        this.updateProgress({
          status: 'syncing',
          message: `Pulling from remote: ${databaseName}`,
          progress: 25,
          databaseName
        });
        
        await this.replicate(
          remoteDb, 
          localDb, 
          'pull', 
          { retry: options.retry ?? true, batchSize: options.batchSize ?? 50 },
          stats
        );
      }

      // Phase 2: Push to remote
      if (options.direction === 'to' || options.direction === 'both') {
        this.updateProgress({
          status: 'syncing',
          message: `Pushing to remote: ${databaseName}`,
          progress: 75,
          databaseName
        });
        
        await this.replicate(
          localDb, 
          remoteDb, 
          'push', 
          { retry: options.retry ?? true, batchSize: options.batchSize ?? 50 },
          stats
        );
      }

      return {
        success: true,
        databaseName,
        stats
      };

    } catch (error) {
      console.error(`[SyncService] Sync failed for ${databaseName}:`, error);
      return {
        success: false,
        databaseName,
        stats,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Perform replication between databases
   */
  private async replicate(
    source: PouchDB.Database,
    target: PouchDB.Database,
    direction: 'pull' | 'push',
    options: { retry: boolean; batchSize: number },
    stats: SyncStats
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // PouchDB uses 'to' and 'from' methods, not 'push' and 'pull'
      // 'push' direction means replicate.to() (local -> remote)
      // 'pull' direction means replicate.from() (remote -> local)
      const replicateMethod = direction === 'push' ? 'to' : 'from';
      const replOptions = {
        live: false,
        retry: options.retry,
        batch_size: options.batchSize,
        batches_limit: 5
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const repl = (source.replicate as any)[replicateMethod](target, replOptions);

      repl.on('change', (info: { docs_written?: number }) => {
        if (direction === 'pull') {
          stats.pulled += info.docs_written || 0;
        } else {
          stats.pushed += info.docs_written || 0;
        }
        console.log(`[SyncService] ${direction}: ${info.docs_written || 0} docs`);
      });

      repl.on('complete', () => {
        console.log(`[SyncService] ${direction} complete`);
        resolve();
      });

      repl.on('error', (err: {} | Error) => {
        console.error(`[SyncService] ${direction} error:`, err);
        reject(err instanceof Error ? err : new Error(String(err)));
      });
    });
  }

  /**
   * Sync all databases
   */
  public async syncAll(): Promise<InitialSyncResult> {
    const databases = [
      DatabaseNames.DISTRICTS,
      DatabaseNames.MENTEES,
      DatabaseNames.COMPLETED_EVALUTATIONS,
      DatabaseNames.INCOMPLETE_EVALUATIONS,
      DatabaseNames.EVALUATIONS,
      DatabaseNames.USERS,
    ];

    const results: Array<{ database: string; success: boolean; error?: string }> = [];

    for (const db of databases) {
      try {
        const result = await this.sync(db);
        results.push({ 
          database: db, 
          success: result.success,
          error: result.error 
        });
      } catch (error) {
        results.push({ 
          database: db, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      successful,
      failed,
      total: databases.length,
      isSuccess: failed === 0 || successful > 0,
      results
    };
  }

  /**
   * Check if currently syncing
   */
  public isSyncing(databaseName?: string): boolean {
    if (databaseName) {
      return this.activeSyncs.has(databaseName);
    }
    return this.activeSyncs.size > 0;
  }

  /**
   * Update progress state
   */
  private updateProgress(progress: Partial<SyncProgress>): void {
    this._progress.value = {
      ...this._progress.value,
      ...progress
    };
  }

  /**
   * Reset progress state
   */
  public resetProgress(): void {
    this._progress.value = {
      status: 'idle',
      message: ''
    };
  }
}

// Export singleton accessor
export const syncService = SyncService.getInstance();

// Export composable-style function
export function useSyncService() {
  return {
    sync: (databaseName: string, options?: Partial<SyncOptions>) => 
      syncService.sync(databaseName, options),
    syncAll: () => syncService.syncAll(),
    isSyncing: (databaseName?: string) => syncService.isSyncing(databaseName),
    progress: syncService.progress,
    lastSyncResults: syncService.lastSyncResults,
    resetProgress: () => syncService.resetProgress()
  };
}

export default syncService;
