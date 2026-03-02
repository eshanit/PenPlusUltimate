/**
 * useManualSync.ts - Properly structured composable for manual sync
 * Uses reactive state instead of returning Promise directly
 */
import { ref, readonly, shallowRef } from 'vue';
import { syncService } from '@/services/syncService';
import type { SyncResult, SyncOptions } from '@/interfaces/ISync';

/**
 * Composable for manual database synchronization
 * Follows proper Vue composable pattern with reactive state
 */
export function useManualSync() {
  // Reactive state
  const isLoading = shallowRef(false);
  const error = ref<Error | null>(null);
  const lastResult = ref<SyncResult | null>(null);
  const progress = ref<string>('');
  
  /**
   * Sync a single database
   */
  const sync = async (
    databaseName: string, 
    options?: Partial<SyncOptions>
  ): Promise<SyncResult> => {
    isLoading.value = true;
    error.value = null;
    progress.value = `Starting sync for ${databaseName}...`;
    
    try {
      progress.value = `Syncing ${databaseName}...`;
      const result = await syncService.sync(databaseName, options);
      
      lastResult.value = result;
      progress.value = result.success 
        ? `Sync complete for ${databaseName}` 
        : `Sync failed for ${databaseName}`;
        
      return result;
    } catch (e) {
      const err = e as Error;
      error.value = err;
      progress.value = `Error: ${err.message}`;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Sync all databases
   */
  const syncAll = async () => {
    isLoading.value = true;
    error.value = null;
    progress.value = 'Starting sync for all databases...';
    
    try {
      const result = await syncService.syncAll();
      progress.value = result.isSuccess
        ? `Sync complete: ${result.successful}/${result.total} databases`
        : `Sync complete with errors: ${result.successful}/${result.total}`;
        
      return result;
    } catch (e) {
      const err = e as Error;
      error.value = err;
      progress.value = `Error: ${err.message}`;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Reset state
   */
  const reset = () => {
    isLoading.value = false;
    error.value = null;
    lastResult.value = null;
    progress.value = '';
  };
  
  return {
    // Reactive state (readonly for external access)
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastResult: readonly(lastResult),
    progress: readonly(progress),
    
    // Methods
    sync,
    syncAll,
    reset
  };
}

export default useManualSync;
