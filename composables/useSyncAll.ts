
import DatabaseNames from "@/constants/DatabaseNames";
import useSyncDB from "./useSyncDB";

const useSyncAll = () => {
    useSyncDB(DatabaseNames.DISTRICTS);
    useSyncDB(DatabaseNames.MENTEES);
    useSyncDB(DatabaseNames.COMPLETED_EVALUTATIONS);
    useSyncDB(DatabaseNames.INCOMPLETE_EVALUATIONS);
    useSyncDB(DatabaseNames.EVALUATIONS);
    useSyncDB(DatabaseNames.USERS);
    // Add others if needed
};

export default useSyncAll;