interface EvalScore {
  name: string;
  score: number;
  notes?: string;
}

type IEvalScore  = Readonly<EvalScore>

export type { IEvalScore  as default}