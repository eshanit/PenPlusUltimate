import type IEvalScore from "./IEvalScore";
import type ICardiacEval from "./ICardiacEval";

interface Session {
    session_1: {
        evalDate: number,
        evalItemScores?: Array<IEvalScore>|null,
        cardiacEval?: ICardiacEval|null
    }|null,
    session_2: {
        evalDate: number,
        evalItemScores?: Array<IEvalScore>|null,
        cardiacEval?: ICardiacEval|null
    }|null,
    session_3: {
        evalDate: number,
        evalItemScores?: Array<IEvalScore>|null,
        cardiacEval?: ICardiacEval|null
    }|null,
    session_4: {
        evalDate: number,
        evalItemScores?: Array<IEvalScore>|null,
        cardiacEval?: ICardiacEval|null
    }|null,
    session_5: {
        evalDate: number,
        evalItemScores?: Array<IEvalScore>|null,
        cardiacEval?: ICardiacEval|null
    }|null
}

type ISession = Readonly<Session>

export type { ISession as default } 