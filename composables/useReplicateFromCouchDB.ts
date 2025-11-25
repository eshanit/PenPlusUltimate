import useReplicateDB from "./useReplicateDB";

const useReplicateFromCouchDB = async (databaseName: string): Promise<any> => {
  return useReplicateDB(databaseName, 'from');
};

export default useReplicateFromCouchDB;