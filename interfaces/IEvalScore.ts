interface EvalScore {
  name: string;
  score: string;
  notes?: string;
}

type IEvalScore  = Readonly<EvalScore>

export type { IEvalScore  as default}