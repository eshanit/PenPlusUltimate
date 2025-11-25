import type IEvalScore from "@/interfaces/IEvalScore";
import * as ss from 'simple-statistics';

interface ScoreStatistics {
    [key: string]: string|number|Record<number, number>; // Dynamic keys for score counts
}
export function useScoreSimpleStatistics(scores: IEvalScore[]): ScoreStatistics {

    const numericScores = ref(scores.map(item => Number(item.score)));

    // Calculate mean, median, and mode
    const meanScore = computed(() => ss.mean(numericScores.value).toFixed(2));
    const medianScore = computed(() => ss.median(numericScores.value).toFixed(2));
    const modeScore = computed(() => {
        const mode = ss.mode(numericScores.value);
        return Array.isArray(mode) ? mode.join(', ') : mode;
    });

    // Calculate score distribution
    const scoreDistribution = computed(() => {
        const distribution: Record<number, number> = {};
        numericScores.value.forEach(score => {
            distribution[score] = (distribution[score] || 0) + 1;
        });
        return distribution;
    });

    return {
        meanScore: meanScore.value,
        medianScore: medianScore.value,
        modeScore: modeScore.value,
        scoreDistribution: scoreDistribution.value
    }
}