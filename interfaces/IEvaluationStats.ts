import type IFinalEvaluation from "./IFinalEvaluation";
import type { ComputedRef } from 'vue';

interface EvaluationStats {
    overallMeanScore: ComputedRef<string | number>;
    completedEvaluations: IFinalEvaluation[];
    completed4Evals: IFinalEvaluation[];
    completed3Evals: IFinalEvaluation[];
    completed2Evals: IFinalEvaluation[];
    completed1Evals: IFinalEvaluation[];
}

type IEvaluationStats = Readonly<EvaluationStats>;

export type { IEvaluationStats as default };
