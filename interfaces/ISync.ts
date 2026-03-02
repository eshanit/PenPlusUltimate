/**
 * Sync-related types for database synchronization
 */

export type SyncDirection = 'from' | 'to' | 'both';
export type SyncStatus = 'pending' | 'success' | 'failed';

export interface SyncStats {
  pulled: number;
  pushed: number;
  conflicts: number;
}

export interface SyncResult {
  success: boolean;
  databaseName: string;
  stats: SyncStats;
  error?: string;
}

export interface SyncOptions {
  direction: SyncDirection;
  retry?: boolean;
  batchSize?: number;
  createTarget?: boolean;
}

export interface SyncProgress {
  status: 'idle' | 'syncing' | 'complete' | 'error';
  message: string;
  progress?: number;
  databaseName?: string;
}

export interface InitialSyncResult {
  successful: number;
  failed: number;
  total: number;
  isSuccess: boolean;
  results?: Array<{
    database: string;
    success: boolean;
    error?: string;
  }>;
}
