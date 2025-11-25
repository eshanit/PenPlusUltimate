import type IEvaluationStats from "~/interfaces/IEvaluationStats";

export function useCountSessionsCompleted(
  evaluationStats: IEvaluationStats,
  filterFn: (el: any) => boolean
) {
  const allCompleted = evaluationStats.completedEvaluations.filter(filterFn);
  const fourCompleted = evaluationStats.completed4Evals.filter(filterFn);
  const threeCompleted = evaluationStats.completed3Evals.filter(filterFn);
  const twoCompleted = evaluationStats.completed2Evals.filter(filterFn);
  const oneCompleted = evaluationStats.completed1Evals.filter(filterFn);

  return {
    allCompletedCount: allCompleted.length,
    fourCompletedCount: fourCompleted.length,
    threeCompletedCount: threeCompleted.length,
    twoCompletedCount: twoCompleted.length,
    oneCompletedCount: oneCompleted.length,
    totalCompletedCount: oneCompleted.length + twoCompleted.length + threeCompleted.length + fourCompleted.length + allCompleted.length,
    totalCompletedSessions: oneCompleted.length + (2 * twoCompleted.length) + (3 * threeCompleted.length) + (4 * fourCompleted.length) + (5 * allCompleted.length)
  };
}