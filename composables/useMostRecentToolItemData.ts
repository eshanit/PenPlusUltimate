import { format } from 'date-fns';
import type IFinalEvaluation from '~/interfaces/IFinalEvaluation';
import type IEvalScore from '~/interfaces/IEvalScore';

interface RecentScore {
  name: string;
  score: number;
  date: number;
  session: string;
  notes: string;
  evaluationId: string;
}

export const useMostRecentToolItemData = (evaluations: IFinalEvaluation[]): RecentScore[] => {
  console.log('useMostRecentToolItemData evaluations:', evaluations);
  if (!evaluations || evaluations.length === 0) {
    return [];
  }

  const allScores: RecentScore[] = [];

  // Flatten all scores from all evaluations and sessions
  evaluations.forEach((evaluation) => {
    console.log('evaluation.sessions:', evaluation.sessions);
    Object.entries(evaluation.sessions || {}).forEach(([sessionKey, session]: [string, any]) => {
      console.log('sessionKey:', sessionKey, 'session:', session);
      if (session && session.evalItemScores) {
        const sessionDate = session.evalDate;
        console.log('session.evalItemScores:', session.evalItemScores);

        session.evalItemScores.forEach((score: IEvalScore) => {
          allScores.push({
            name: score.name,
            score: Number(score.score),
            date: sessionDate,
            session: sessionKey.replace('session_', ''),
            notes: score.notes || '',
            evaluationId: evaluation._id
          });
        });
      }
    });
  });
  console.log('allScores:', allScores);

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