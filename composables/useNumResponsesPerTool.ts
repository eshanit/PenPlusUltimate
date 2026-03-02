import type IFinalEvaluation from "@/interfaces/IFinalEvaluation";
import type IEvalScore from "@/interfaces/IEvalScore";
import { ref } from 'vue';

interface CompetencyScores {
  zeros: number;
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
        // Handle both string and number types, and round to handle floating point precision issues
        const rawScore = item.score;
        const score = typeof rawScore === 'number' ? Math.round(rawScore) : parseInt(String(rawScore), 10);
        const itemName = item.name;

        // Initialize score counts if not already done
        if (!scoreDistribution[itemName]) {
          scoreDistribution[itemName] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        }

        // Get reference to the item scores object (use non-null assertion since we just initialized it above)
        const itemScores: { [key: number]: number } = scoreDistribution[itemName]!;

        // Increment the count for scores 0 through 5
        // Ensure score is an integer in the valid range
        if (Number.isInteger(score) && score >= 0 && score <= 5) {
          itemScores[score]!++;
        } else {
          console.warn(`Unexpected score ${score} (raw: ${rawScore}, type: ${typeof rawScore}) for item ${itemName}`); // Debug info
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
        result[tool][competency] = { zeros: 0, ones: 0, twos: 0, threes: 0, fours: 0, fives: 0 };
      }

      result[tool][competency].zeros += score[0] ?? 0;
      result[tool][competency].ones += score[1] ?? 0;
      result[tool][competency].twos += score[2] ?? 0;
      result[tool][competency].threes += score[3] ?? 0;
      result[tool][competency].fours += score[4] ?? 0;
      result[tool][competency].fives += score[5] ?? 0;
    }
  });

  return result;
}