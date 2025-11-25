import useReplicateDB from "./useReplicateDB";

const useReplicateToCouchDB = async (databaseName: string): Promise<any> => {
  return useReplicateDB(databaseName, 'to');
};

export default useReplicateToCouchDB;