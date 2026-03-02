interface EvaluationCounts {
    allCompletedCount: number;
    fourCompletedCount: number;
    threeCompletedCount: number;
    twoCompletedCount: number;
    oneCompletedCount: number;
    totalCompletedCount: number;
}

type IEvaluationCounts = Readonly<EvaluationCounts>;

export type { IEvaluationCounts as default }