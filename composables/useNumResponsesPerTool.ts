import type ISession from "@/interfaces/ISession";
import type IFinalEvaluation from "@/interfaces/IFinalEvaluation";
import type IEvalScore from "@/interfaces/IEvalScore";
import { ref } from 'vue';

interface CompetencyScores {
  ones: number;
  twos: number;
  threes: number;
  fours: number;
  fives: number;
}

interface ToolResult {
  [tool: string]: {
    [competency: string]: CompetencyScores;
  };
}

export function useNumResponsesPerTool(toolsEvals: IFinalEvaluation[]) {
  const scoreCounts = ref<{ tool: string; scores: { [key: string]: { [key: number]: number } } }[]>([]);

  toolsEvals.forEach((evaluation: IFinalEvaluation) => {
    const tool = evaluation.tool;
    const sessions = evaluation.sessions;

    // Determine the final session
    const sessionKeys = ['session_5', 'session_4', 'session_3', 'session_2', 'session_1'];
    const finalSessionKey = sessionKeys.find(key => (sessions as any)[key]) ?? 'session_1';
    const finalSession = (sessions as any)[finalSessionKey];

    if (finalSession && finalSession.evalItemScores) {
      const scoreDistribution: { [key: string]: { [key: number]: number } } = {};

      finalSession.evalItemScores.forEach((item: IEvalScore) => {
        const score = item.score; // score is already a number
        const itemName = item.name;

        // Initialize score counts if not already done
        if (!scoreDistribution[itemName]) {
          scoreDistribution[itemName] = { 1: 0, 2: 0, 3: 0, 4: 0 , 5: 0  };
        }

        // Increment the count for scores 1 through 5
        if (score >= 1 && score <= 5) {
          scoreDistribution[itemName][score]++;
        } else {
          console.warn(`Unexpected score ${item.score} for item ${itemName}`); // Debug info
        }
      });

      // Store the results for the tool
      scoreCounts.value.push({ tool, scores: scoreDistribution });
    }
  });

  const result: ToolResult = {}; // Define the type for the result object

  scoreCounts.value.forEach(({ tool, scores }) => {
    if (!result[tool]) {
      result[tool] = {};
    }

    for (const [competency, score] of Object.entries(scores)) {
      if (!result[tool][competency]) {
        result[tool][competency] = { ones: 0, twos: 0, threes: 0 , fours: 0 , fives: 0  };
      }

      result[tool][competency].ones += score[1] ?? 0;
      result[tool][competency].twos += score[2] ?? 0;
      result[tool][competency].threes += score[3] ?? 0;
      result[tool][competency].fours += score[4] ?? 0;
      result[tool][competency].fives += score[5] ?? 0;
    }
  });

  return result;
}