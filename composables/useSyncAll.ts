
import DatabaseNames from "@/constants/DatabaseNames";
import useManualSync from "./useManualSync";

const useSyncAll = async () => {
    const databases = [
        DatabaseNames.DISTRICTS,
        DatabaseNames.MENTEES,
        DatabaseNames.COMPLETED_EVALUTATIONS,
        DatabaseNames.INCOMPLETE_EVALUATIONS,
        DatabaseNames.EVALUATIONS,
        DatabaseNames.USERS,
    ];

    const results = await Promise.allSettled(
        databases.map(db => useManualSync(db, 'from'))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    const errors = results
        .filter(r => r.status === 'rejected')
        .map(r => (r as any).reason?.error || 'Unknown error');

    return {
        successful,
        failed,
        total: databases.length,
        errors,
        isSuccess: failed === 0
    };
};

export default useSyncAll;