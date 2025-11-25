
import DatabaseNames from "@/constants/DatabaseNames";
const useSyncAll = () => {
    useReplicateFromCouchDB(DatabaseNames.DISTRICTS)
    useReplicateFromCouchDB(DatabaseNames.MENTEES)
    useReplicateFromCouchDB(DatabaseNames.COMPLETED_EVALUTATIONS)
}

export default useSyncAll