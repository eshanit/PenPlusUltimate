interface ToolEvaluation {
    label: string,
    name: string,
    fiveCompleted: number,
    fourCompleted: number,
    threeCompleted: number,
    twoCompleted: number,
    oneCompleted: number,
    totalCompleted: number
}

type IToolEvaluation = Readonly<ToolEvaluation>

export type { IToolEvaluation as default }