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

  const completed4Evals = evaluations.filter((evaluation) => {

    const sessions = evaluation.sessions;
    return sessions.session_1 && sessions.session_2 && sessions.session_3  && sessions.session_4  && sessions.session_5 == null;
   
  });


  const completed3Evals = evaluations.filter((evaluation) => {

    const sessions = evaluation.sessions;
    return sessions.session_1 && sessions.session_2 && sessions.session_3 && sessions.session_4 == null && sessions.session_5 == null;
   
  });


  const completed2Evals = evaluations.filter((evaluation) => {

    const sessions = evaluation.sessions;
    return sessions.session_1 && sessions.session_2 && sessions.session_3 == null && sessions.session_4 == null && sessions.session_5 == null;
   
  });

  const completed1Evals = evaluations.filter((evaluation) => {

    const sessions = evaluation.sessions;
    return sessions.session_1 && sessions.session_2 == null && sessions.session_3 == null && sessions.session_4 == null && sessions.session_5 == null;
   
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

  return {
    overallMeanScore,
    completedEvaluations: completedEvaluations as IFinalEvaluation[],
    completed4Evals: completed4Evals as IFinalEvaluation[],
    completed3Evals: completed3Evals as IFinalEvaluation[],
    completed2Evals: completed2Evals as IFinalEvaluation[],
    completed1Evals: completed1Evals as IFinalEvaluation[]
  };
}