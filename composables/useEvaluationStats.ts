// useEvaluationStats.js
import { computed } from 'vue';
import type IScore from "@/interfaces/IScore";
import type IFinalEvaluation from '@/interfaces/IFinalEvaluation';


export function useEvaluationStats(evaluations :IScore[] | IFinalEvaluation[]) {
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
            const score = parseInt(item.score, 10);
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
    completedEvaluations, // Optional: Return filtered evaluations for debugging or further use
    completed4Evals,
    completed3Evals,
    completed2Evals,
    completed1Evals
  };
}