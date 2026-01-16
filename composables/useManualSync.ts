import pouchDBConnect from "@/utilities/pouchDbConnect";

/**
 * Composable for performing a one-time manual sync operation
 * Completes after sync is done (not live)
 * Waits for both 'complete' event and document transfer confirmation
 */
const useManualSync = async (databaseName: string, direction: 'from' | 'to' = 'from'): Promise<{ success: boolean; databaseName: string; error?: string; docs_written?: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = useRuntimeConfig();
      const couchDBUsername = config.public.couchDBUsername;
      const couchDBPassword = config.public.couchDBPassword;

      console.log(`Starting ${direction} sync for: ${databaseName}`);
      
      const localDB = pouchDBConnect(databaseName);
      
      // Get info about local DB
      const localInfo = await localDB.info();
      console.log(`Local DB info (${databaseName}):`, localInfo);

      const remoteDB = pouchDBConnect(
        `${config.public.couchDBUrl}/${databaseName}`,
        { skip_setup: true }
      );

      // Log remote DB info for debugging
      try {
        const remoteInfo = await remoteDB.info();
        console.log(`Remote DB info (${databaseName}):`, remoteInfo);
      } catch (infoError) {
        console.warn(`Could not fetch remote DB info for ${databaseName}:`, infoError);
      }

      let resolved = false;
      let docsWritten = 0;

      // One-time sync with options for better performance
      const replication = direction === 'from'
        ? localDB.replicate.from(remoteDB, {
            live: false,
            retry: false,
            batch_size: 100,
            batches_limit: 10
          })
        : localDB.replicate.to(remoteDB, {
            live: false,
            retry: false,
            batch_size: 100,
            batches_limit: 10
          });

      replication
        .on('change', (info: any) => {
          console.log(`Sync change for ${databaseName}:`, {
            docs: info.docs?.length || 0,
            docs_written: info.docs_written || 0,
            docs_read: info.docs_read || 0,
            pending: info.pending,
            full: info
          });
          docsWritten += (info.docs_written || 0);
        })
        .on('active', () => {
          console.log(`Sync active for ${databaseName} - replication started`);
        })
        .on('paused', (err: any) => {
          console.log(`Sync paused for ${databaseName}`, { error: err, docs_written: docsWritten });
          // Don't resolve on paused - only on complete
        })
        .on('complete', (info: any) => {
          console.log(`Sync completed for ${databaseName}:`, { 
            info,
            total_docs_written: docsWritten 
          });
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            resolve({ 
              success: true, 
              databaseName, 
              docs_written: docsWritten 
            });
          }
        })
        .on('error', (err: any) => {
          console.error(`Sync error for ${databaseName}:`, err);
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            reject({ 
              success: false, 
              databaseName, 
              error: err.message || 'Sync error' 
            });
          }
        });

      // Set a longer timeout (5 minutes for large datasets)
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log(`Sync timeout for ${databaseName} after 5 minutes, force stopping`);
          replication.cancel(); // Cancel the replication
          resolve({ 
            success: false, 
            databaseName, 
            error: 'Sync timeout after 5 minutes',
            docs_written: docsWritten
          });
        }
      }, 300000); // 5 minutes

    } catch (error) {
      console.error(`Setup error for ${databaseName}:`, error);
      reject({ 
        success: false, 
        databaseName, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
};

export default useManualSync;
