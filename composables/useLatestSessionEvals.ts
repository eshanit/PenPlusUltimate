// useLatestSessionEvals.ts
import type IScore from "@/interfaces/IScore";
import type IFinalEvaluation from "@/interfaces/IFinalEvaluation";

interface LatestEvalScore {
  name: string;
  score: number;
}

interface LatestSessionEval {
  tool: string;
  scores: LatestEvalScore[];
}

/**
 * Extracts the latest session evaluation for each evaluation.
 * The latest session is determined by the highest session number (session_5 > session_4 > ... > session_1)
 * that has evalItemScores.
 */
export function useLatestSessionEvals(
  evaluations: IScore[] | IFinalEvaluation[] | any[]
): LatestSessionEval[] {
  const latestEvals: LatestSessionEval[] = [];

  evaluations.forEach((evaluation) => {
    const sessions = evaluation.sessions;
    if (!sessions) return;

    // Find the latest session that has evalItemScores (session_5 is highest, session_1 is lowest)
    const sessionKeys = ['session_5', 'session_4', 'session_3', 'session_2', 'session_1'];
    let latestSession: any = null;
    let latestSessionKey = '';

    for (const key of sessionKeys) {
      const session = (sessions as any)[key];
      if (session && session.evalItemScores && session.evalItemScores.length > 0) {
        latestSession = session;
        latestSessionKey = key;
        break;
      }
    }

    if (latestSession && latestSession.evalItemScores) {
      // Get the tool name from the evaluation
      const tool = evaluation.tool;

      // Extract scores from the latest session
      const scores: LatestEvalScore[] = latestSession.evalItemScores.map((item: any) => ({
        name: item.name,
        score: Number(item.score)
      }));

      latestEvals.push({
        tool: typeof tool === 'string' ? tool : tool?.[0] || '',
        scores
      });
    }
  });

  return latestEvals;
}
