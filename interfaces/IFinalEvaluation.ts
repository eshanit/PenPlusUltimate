import type IMasterUser from "./IMasterUser";
import type ISession from "./ISession";


interface FinalEvaluation {
    _id: string;
    evaluator: IMasterUser;
    evaluationID: string;
    mentee: IMasterUser;
    searchIndex: string;
    dateSaved: number;
    status: string;
    tool: string;
    sessions: ISession;
}

type IFinalEvaluation  = Readonly<FinalEvaluation>

export type { IFinalEvaluation  as default}