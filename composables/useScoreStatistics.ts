// useScoreStatistics.ts
import type IEvalScore from "@/interfaces/IEvalScore";

export function useScoreStatistics(data: IEvalScore[]) {
    const totalScore = ref(0);
    const meanScore = ref(0);

    // Function to calculate total and mean scores
    const calculateScores = () => {
        const scores = data.map(item => parseFloat(item.score)); // Convert scores to numbers
        totalScore.value = scores.reduce((acc, score) => acc + score, 0);
        meanScore.value = scores.length > 0 ? totalScore.value / scores.length : 0; // Avoid division by zero
    };

    // Call the function to initialize calculations
    calculateScores();

    return {
        total: totalScore,
        mean: meanScore.value.toFixed(2)
    };
}