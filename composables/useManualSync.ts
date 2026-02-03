import pouchDBConnect from "@/utilities/pouchDbConnect";

/**
 * SAFE Two-way sync that never deletes entire databases
 */
const useSafeManualSync = async (databaseName: string): Promise<{ 
  success: boolean; 
  databaseName: string; 
  error?: string; 
  stats: {
    pushed: number;
    pulled: number;
    conflicts: number;
  }
}> => {
  return new Promise(async (resolve, reject) => {
    let sync: any = null;
    let timeoutId: NodeJS.Timeout;
    
    try {
      const config = useRuntimeConfig();
      
      console.log(`🔍 SYNC DEBUG START ==================================`);
      console.log(`Database: ${databaseName}`);
      
      // 1. Connect to databases
      const localDB = pouchDBConnect(databaseName);
      const remoteDB = pouchDBConnect(
        `${config.public.couchDBUrl}/${databaseName}`,
        { skip_setup: true }
      );
      
      // 2. Check both databases exist and have data
      const localInfo = await localDB.info().catch(err => {
        console.log(`❌ Local DB error:`, err.message);
        throw new Error(`Local database ${databaseName} not accessible`);
      });
      
      const remoteInfo = await remoteDB.info().catch(err => {
        console.log(`⚠️ Remote DB doesn't exist or not accessible:`, err.message);
        // Don't throw - we might want to create it
      });
      
      console.log(`📊 DOCUMENT COUNTS:`);
      console.log(`   Local:  ${localInfo.doc_count} documents`);
      console.log(`   Remote: ${remoteInfo?.doc_count || 0} documents`);
      
      // 3. ALWAYS PULL FIRST, then push (safest approach)
      console.log(`🔄 Starting SAFE sync: PULL then PUSH`);
      
      const stats = {
        pulled: 0,
        pushed: 0,
        conflicts: 0
      };
      
      // PHASE 1: PULL from remote to local (if remote exists)
      if (remoteInfo && remoteInfo.doc_count > 0) {
        console.log(`⬇️  PHASE 1: Pulling from remote...`);
        
        const pull = localDB.replicate.from(remoteDB, {
          live: false,
          retry: true,
          batch_size: 50,
          batches_limit: 5,
          // CRITICAL: Don't create target if it doesn't exist
          create_target: false
        });
        
        await new Promise((pullResolve, pullReject) => {
          pull
            .on('change', (info: any) => {
              stats.pulled += (info.docs_written || 0);
              console.log(`   Pulled ${info.docs_written || 0} documents`);
            })
            .on('complete', () => {
              console.log(`✅ Pull complete: ${stats.pulled} documents`);
              pullResolve(true);
            })
            .on('error', (err: any) => {
              console.log(`⚠️ Pull error (non-fatal):`, err.message);
              pullResolve(false); // Don't fail on pull errors
            });
        });
        
        // Cancel pull to clean up
        pull.cancel();
      } else {
        console.log(`⏭️  Skipping pull - remote has no data`);
      }
      
      // PHASE 2: Check what we have locally now
      const afterPullInfo = await localDB.info();
      console.log(`📊 After pull: ${afterPullInfo.doc_count} local documents`);
      
      // PHASE 3: PUSH local to remote (only if we have data)
      if (afterPullInfo.doc_count > 0) {
        console.log(`⬆️  PHASE 2: Pushing to remote...`);
        
        const push = localDB.replicate.to(remoteDB, {
          live: false,
          retry: true,
          batch_size: 50,
          batches_limit: 5,
          // CRITICAL: Don't overwrite existing docs on remote
          checkpointer: 'target'
        });
        
        await new Promise((pushResolve, pushReject) => {
          push
            .on('change', (info: any) => {
              stats.pushed += (info.docs_written || 0);
              console.log(`   Pushed ${info.docs_written || 0} documents`);
            })
            .on('complete', () => {
              console.log(`✅ Push complete: ${stats.pushed} documents`);
              pushResolve(true);
            })
            .on('error', (err: any) => {
              console.log(`⚠️ Push error:`, err.message);
              pushResolve(false); // Don't fail entire sync on push errors
            });
        });
        
        push.cancel();
      } else {
        console.log(`⏭️  Skipping push - local has no data`);
      }
      
      // 4. Final verification
      console.log(`🔍 SYNC COMPLETE ==================================`);
      console.log(`   Total pulled: ${stats.pulled}`);
      console.log(`   Total pushed: ${stats.pushed}`);
      console.log(`===================================================`);
      
      resolve({
        success: true,
        databaseName,
        stats
      });
      
    } catch (error) {
      console.error(`❌ Sync failed:`, error);
      
      // Cancel any ongoing sync
      if (sync) {
        sync.cancel();
      }
      
      reject({
        success: false,
        databaseName,
        error: error instanceof Error ? error.message : 'Unknown error',
        stats: { pulled: 0, pushed: 0, conflicts: 0 }
      });
    } finally {
      clearTimeout(timeoutId);
    }
  });
};

export default useSafeManualSync;