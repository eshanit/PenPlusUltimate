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

  return sync
    .on("paused", () => {
      console.log(`Sync paused for ${databaseName}`);
    })
    .on("active", () => {
      console.log(`Sync active for ${databaseName}`);
    })
    .on("denied", (denied) => {
      console.log(`Sync denied for ${databaseName}:`, denied);
    })
    .on("error", (err: any) => {
      console.error(`Sync error for ${databaseName}:`, err);
    });
};

export default useSyncDB;