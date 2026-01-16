import pouchDBConnect from "@/utilities/pouchDbConnect";

const config = useRuntimeConfig();
const couchDBUsername = config.public.couchDBUsername;
const couchDBPassword = config.public.couchDBPassword;

const useReplicateDB = async (databaseName: string, direction: 'from' | 'to'): Promise<any> => {
  console.log('couch:', couchDBUsername, couchDBPassword, config.public.couchDBUrl);

  // setup
  const localDB = pouchDBConnect(databaseName);
  const remoteDB = pouchDBConnect(`${config.public.couchDBUrl}/${databaseName}`, {
    skip_setup: true,
  });

  // sync
  const replication = direction === 'from'
    ? localDB.replicate.from(remoteDB, { live: true, retry: true })
    : localDB.replicate.to(remoteDB, { live: true, retry: true });

  return replication
    .on("paused", () => {
      console.log("complete: ", config.public.couchDBUrl, remoteDB, localDB);
      if (databaseName === 'scores') {
        console.log(`You have successfully synced ${databaseName}`);
      }
      return true;
    })
    .on("denied", (denied) => {
      console.log(databaseName, denied);
      console.log(`Syncing ${databaseName} has been denied`);
    })
    .on("error", (err: any) => {
      console.error(databaseName, err);
      console.log(`Syncing ${databaseName} has an error, please contact admin`);
    });
};

export default useReplicateDB;