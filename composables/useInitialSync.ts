/**
 * Composable to perform initial app data sync
 * Called when user first logs in or app starts
 * Waits for all databases to sync before resolving
 */
import useManualSync from "./useManualSync";
import DatabaseNames from "@/constants/DatabaseNames";

const useInitialSync = async () => {
  console.log('Starting initial app data sync...');
  
  const databases = [
    DatabaseNames.DISTRICTS,
    DatabaseNames.MENTEES,
    DatabaseNames.COMPLETED_EVALUTATIONS,
    DatabaseNames.INCOMPLETE_EVALUATIONS,
    DatabaseNames.EVALUATIONS,
    DatabaseNames.USERS,
  ];

  try {
    // Sync all databases in parallel with longer timeout
    const results = await Promise.allSettled(
      databases.map(db => 
        new Promise(async (resolve) => {
          try {
            const result = await useManualSync(db, 'from');
            resolve(result);
          } catch (error) {
            // Even on error, continue with app (data might be cached)
            console.error(`Failed to sync ${db}:`, error);
            resolve({ success: false, databaseName: db });
          }
        })
      )
    );

    const successful = results.filter((r: any) => r.status === 'fulfilled' && r.value?.success).length;
    const failed = results.filter((r: any) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value?.success)).length;

    console.log(`Initial sync complete: ${successful}/${databases.length} databases synced`);

    return {
      successful,
      failed,
      total: databases.length,
      isSuccess: failed === 0 || successful > 0 // Success if at least one db synced
    };
  } catch (error) {
    console.error('Initial sync error:', error);
    return {
      successful: 0,
      failed: databases.length,
      total: databases.length,
      isSuccess: false
    };
  }
};

export default useInitialSync;
