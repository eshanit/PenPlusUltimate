interface EvalScore {
  name: string;
  score: number;
  category?: string;
  item?: string;
  notes?: string;
}

type IEvalScore  = Readonly<EvalScore>

export type { IEvalScore  as default}