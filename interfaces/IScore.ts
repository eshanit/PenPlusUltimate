import type IMasterUser from "./IMasterUser";
import type ISession from "./ISession";

interface Score {
    _id: string;
    evaluationID: string;
    searchIndex: string;
    evaluator: IMasterUser;
    mentee: IMasterUser;
    tool: string| Array<string>;
    sessions: ISession
}

type IScore = Readonly<Score>

export type { IScore as default }