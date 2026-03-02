// useEvaluationStats.js
import { computed } from 'vue';
import type IScore from "@/interfaces/IScore";
import type IFinalEvaluation from '@/interfaces/IFinalEvaluation';
import type IEvaluationStats from "~/interfaces/IEvaluationStats";


export function useEvaluationStats(evaluations :IScore[] | IFinalEvaluation[]) : IEvaluationStats {

  // Filter evaluations where at least one session has been completed (has evalItemScores)
  const completedEvaluations = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    return Object.values(sessions).some(session => session && session.evalItemScores && session.evalItemScores.length > 0);
  });

  // Exactly 5 sessions (all five present)
  const completed5Evals = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    if (!sessions) return false;
    return sessions.session_1 && sessions.session_2 && sessions.session_3 && sessions.session_4 && sessions.session_5;
  });

  // Exactly 4 sessions
  const completed4Evals = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    if (!sessions) return false;
    return sessions.session_1 && sessions.session_2 && sessions.session_3 && sessions.session_4 && !sessions.session_5;
  });

  // Exactly 3 sessions
  const completed3Evals = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    if (!sessions) return false;
    return sessions.session_1 && sessions.session_2 && sessions.session_3 && !sessions.session_4 && !sessions.session_5;
  });

  // Exactly 2 sessions
  const completed2Evals = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    if (!sessions) return false;
    return sessions.session_1 && sessions.session_2 && !sessions.session_3 && !sessions.session_4 && !sessions.session_5;
  });

  // Exactly 1 session
  const completed1Evals = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    if (!sessions) return false;
    return sessions.session_1 && !sessions.session_2 && !sessions.session_3 && !sessions.session_4 && !sessions.session_5;
  });

  // Calculate the overall mean score for mentees with 3 completed sessions
  const overallMeanScore = computed(() => {
    let totalScore = 0;
    let totalItems = 0;

    // Iterate through each completed evaluation
    evaluations.forEach((evaluation) => {
      const sessions = evaluation.sessions;

      // Iterate through each session (session_1, session_2, session_3)
      Object.values(sessions).forEach((session) => {
        if (session && session.evalItemScores) {
          // Sum up scores for each evaluation item in the session
          session.evalItemScores.forEach((item) => {
            const score = parseInt(String(item.score), 10);
            if (!isNaN(score)) {
              totalScore += score;
              totalItems++;
            }
          });
        }
      });
    });

    // Calculate the mean score
    return totalItems > 0 ? (totalScore / totalItems).toFixed(2) : 0;
  });

  // Filter evaluations that have at least one score of 0
  const zeroScoreEvals = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    return Object.values(sessions).some(session => 
      session && session.evalItemScores && 
      session.evalItemScores.some(item => item.score === 0)
    );
  });

  // Filter evaluations that have at least one score of 4
  const fourScoreEvals = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    return Object.values(sessions).some(session => 
      session && session.evalItemScores && 
      session.evalItemScores.some(item => item.score === 4)
    );
  });

  // Filter evaluations that have at least one score of 5
  const fiveScoreEvals = evaluations.filter((evaluation) => {
    const sessions = evaluation.sessions;
    return Object.values(sessions).some(session => 
      session && session.evalItemScores && 
      session.evalItemScores.some(item => item.score === 5)
    );
  });

  return {
    overallMeanScore,
    completedEvaluations: completedEvaluations as IFinalEvaluation[],
    completed5Evals: completed5Evals as IFinalEvaluation[],
    completed4Evals: completed4Evals as IFinalEvaluation[],
    completed3Evals: completed3Evals as IFinalEvaluation[],
    completed2Evals: completed2Evals as IFinalEvaluation[],
    completed1Evals: completed1Evals as IFinalEvaluation[],
    zeroScoreEvals: zeroScoreEvals as IFinalEvaluation[],
    fourScoreEvals: fourScoreEvals as IFinalEvaluation[],
    fiveScoreEvals: fiveScoreEvals as IFinalEvaluation[]
  };
}
