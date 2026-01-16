import pouchDBConnect from "@/utilities/pouchDbConnect";

const useSyncDB = async (databaseName: string): Promise<any> => {
  const config = useRuntimeConfig();
  const couchDBUsername = config.public.couchDBUsername;
  const couchDBPassword = config.public.couchDBPassword;

  // setup
  const localDB = pouchDBConnect(databaseName);
  const remoteDB = pouchDBConnect(`http://${couchDBUsername}:${couchDBPassword}@${config.public.couchDBUrl.replace('http://', '')}/` + databaseName, {
    skip_setup: true,
  });

  // bidirectional sync
  const sync = localDB.sync(remoteDB, { live: true, retry: true });

  return new Promise((resolve, reject) => {
    sync
      .on("paused", (info) => {
        console.log(`Sync paused for ${databaseName}:`, info);
        // Only resolve if sync completed successfully (docs_read > 0 or no pending changes)
        if (info?.ok || info?.docs_read > 0) {
          resolve({ success: true, databaseName });
        }
      })
      .on("active", () => {
        console.log(`Sync active for ${databaseName}`);
      })
      .on("denied", (denied) => {
        console.error(`Sync denied for ${databaseName}:`, denied);
        reject({ success: false, databaseName, error: 'Sync denied' });
      })
      .on("error", (err: any) => {
        console.error(`Sync error for ${databaseName}:`, err);
        reject({ success: false, databaseName, error: err.message || 'Sync error' });
      });

    // Set a timeout for sync completion (30 seconds)
    setTimeout(() => {
      resolve({ success: true, databaseName });
    }, 30000);
  });
};

export default useSyncDB;
