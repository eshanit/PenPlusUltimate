import pouchDBConnect from "@/utilities/pouchDbConnect";

const config = useRuntimeConfig();
const couchDBUsername = config.public.couchDBUsername;
const couchDBPassword = config.public.couchDBPassword;

// Track active replications to prevent concurrent syncs on the same database
const activeReplications: Record<string, boolean> = {};

const useReplicateDB = async (databaseName: string, direction: 'from' | 'to'): Promise<any> => {
  console.log('couch:', couchDBUsername, couchDBPassword, config.public.couchDBUrl);

  // Prevent concurrent syncs on the same database
  if (activeReplications[databaseName]) {
    console.log(`Sync already in progress for ${databaseName}, skipping...`);
    return null;
  }

  // Mark sync as active
  activeReplications[databaseName] = true;

  // setup
  const localDB = pouchDBConnect(databaseName);
  const remoteDB = pouchDBConnect(`${config.public.couchDBUrl}/${databaseName}`, {
    skip_setup: true,
  });

  // Sync options with better handling
  const syncOptions = {
    live: false,
    retry: true,
    // Back off gradually to prevent rapid re-syncs
    back_off: 1000,
    // Don't create target automatically for 'to' direction
    create_target: direction === 'from',
  };

  // sync
  const replication = direction === 'from'
    ? localDB.replicate.from(remoteDB, syncOptions)
    : localDB.replicate.to(remoteDB, syncOptions);

  return replication
    .on("complete", () => {
      console.log("complete: ", config.public.couchDBUrl, remoteDB, localDB);
      if (databaseName === 'scores') {
        console.log(`You have successfully synced ${databaseName}`);
      }
      // Mark sync as complete
      activeReplications[databaseName] = false;
      return true;
    })
    .on("denied", (denied: any) => {
      console.log(databaseName, denied);
      console.log(`Syncing ${databaseName} has been denied`);
      activeReplications[databaseName] = false;
    })
    .on("error", (err: any) => {
      console.error(databaseName, err);
      console.log(`Syncing ${databaseName} has an error, please contact admin`);
      activeReplications[databaseName] = false;
    })
    .on("change", (change: any) => {
      console.log(`${databaseName} sync change:`, change.docs?.length ?? 0, "docs");
    });
};

export default useReplicateDB;