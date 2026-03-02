import type IEvaluationStats from "~/interfaces/IEvaluationStats";

export function useCountSessionsCompleted(
  evaluationStats: IEvaluationStats | undefined | null,
  filterFn: (el: any) => boolean
) {
  // Handle undefined or null evaluationStats
  if (!evaluationStats) {
    return {
      allCompletedCount: 0,
      fourCompletedCount: 0,
      threeCompletedCount: 0,
      twoCompletedCount: 0,
      oneCompletedCount: 0,
      totalCompletedCount: 0,
      totalCompletedSessions: 0
    };
  }

  const allCompleted = evaluationStats.completedEvaluations?.filter(filterFn) || [];
  const fiveCompleted = evaluationStats.completed5Evals?.filter(filterFn) || [];
  const fourCompleted = evaluationStats.completed4Evals?.filter(filterFn) || [];
  const threeCompleted = evaluationStats.completed3Evals?.filter(filterFn) || [];
  const twoCompleted = evaluationStats.completed2Evals?.filter(filterFn) || [];
  const oneCompleted = evaluationStats.completed1Evals?.filter(filterFn) || [];

  return {
    allCompletedCount: allCompleted.length,
    fiveCompletedCount: fiveCompleted.length,
    fourCompletedCount: fourCompleted.length,
    threeCompletedCount: threeCompleted.length,
    twoCompletedCount: twoCompleted.length,
    oneCompletedCount: oneCompleted.length,
    // Use allCompleted.length for total count (unique evaluations with at least 1 session)
    // This avoids double counting that occurs when summing overlapping categories
    totalCompletedCount: allCompleted.length,
    totalCompletedSessions: oneCompleted.length + (2 * twoCompleted.length) + (3 * threeCompleted.length) + (4 * fourCompleted.length) + (5 * fiveCompleted.length)
  };
}