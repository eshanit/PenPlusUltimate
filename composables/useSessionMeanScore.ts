import sumArray from "@/utilities/sumArray";
import type IEvalScore from "@/interfaces/IEvalScore";

export const useSessionMeanScore = (scoresArr: IEvalScore[]) => {
    
    const avgScore = sumArray(scoresArr, 'score') / scoresArr?.length

    return avgScore.toFixed(2)
}