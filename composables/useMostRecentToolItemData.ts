import { format } from 'date-fns';
import type IFinalEvaluation from '~/interfaces/IFinalEvaluation';
import type IEvalScore from '~/interfaces/IEvalScore';

interface RecentScore {
  name: string;
  score: string;
  date: number;
  session: string;
  notes: string;
  evaluationId: string;
}

export const useMostRecentToolItemData = (evaluations: IFinalEvaluation[]): RecentScore[] => {
  if (!evaluations || evaluations.length === 0) {
    return [];
  }

  const allScores: RecentScore[] = [];

  // Flatten all scores from all evaluations and sessions
  evaluations.forEach((evaluation) => {
    Object.entries(evaluation.sessions || {}).forEach(([sessionKey, session]: [string, any]) => {
      if (session && session.evalItemScores) {
        const sessionDate = session.evalDate;

        session.evalItemScores.forEach((score: IEvalScore) => {
          allScores.push({
            name: score.name,
            score: score.score,
            date: sessionDate,
            session: sessionKey.replace('session_', ''),
            notes: score.notes || '',
            evaluationId: evaluation._id
          });
        });
      }
    });
  });

  // Sort by date (most recent first)
  allScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get the most recent score for each item
  const mostRecentScores: RecentScore[] = [];
  const seenItems = new Set();

  allScores.forEach(score => {
    if (!seenItems.has(score.name)) {
      seenItems.add(score.name);
      mostRecentScores.push(score);
    }
  });

  return mostRecentScores;
};