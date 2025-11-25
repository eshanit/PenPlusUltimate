import LocalStorageKeys from "@/constants/LocalStorageKeys";
import type IFinalEvaluation from "@/interfaces/IFinalEvaluation";

export async function useProcessSession(scoreId: string, sessionNumber: string): Promise<boolean> {
    try {
        const evalDataStore = useEvalDataStore()

        const score: IFinalEvaluation | false = await evalDataStore.fetchUserEval(scoreId)

        if (!score) {
            return false;
        }

/**
 *  1. store the score in local storage
 */

useProcessLocalStorage().store(LocalStorageKeys.DATABASE_SCORE, score)

/**
 * 2. retrieve the mentee information and store in local storage
 */

useProcessLocalStorage().store(LocalStorageKeys.EVALUATED_MENTEE,score.mentee)


/**
 * 3. retrieve the evaluator information and score in local storage
 */

useProcessLocalStorage().store(LocalStorageKeys.DATABASE_SCORE_EVALUATOR,score.evaluator)

/** 
 * 4. retrieve the tool information and score in local storage
 */

useProcessLocalStorage().store(LocalStorageKeys.DATABASE_SCORE_TOOL, score.tool)

/**
 * 5. add sessionAdd to local storage so that you can track
 */

useProcessLocalStorage().store(LocalStorageKeys.ADD_SESSION, 'Yes')

/**
 * 6. add sessionNumber to local storage 
 */

useProcessLocalStorage().store(LocalStorageKeys.EVALUATION_SESSION, sessionNumber)

// Now you can redirect to tool and start scoring

return true;

    } catch (error) {
        console.error("Error processing session:", error);
        return false;
    }
}

