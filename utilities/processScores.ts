import LocalStorageKeys from "@/constants/LocalStorageKeys";
import generateID from "./generateID";
import generateRandomString from "./generateRandomString";
import type IScore from "@/interfaces/IScore";
import type ISession from "@/interfaces/ISession";
import type ICardiacEval from "@/interfaces/ICardiacEval";

const processScores = (tool: string|string[]) => {

    const user:any = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE)
    //every tool
    const scoreData: any = useProcessLocalStorage().retrieve(LocalStorageKeys.SCORES)

    //
    const mentee: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATED_MENTEE)

    //cardiac tool  only

    const caseNumber: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_CASE_NUMBER)
    const patientInfo: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_PATIENT_INFORMATION)
    const echoIndication: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_ECHO_INDICATION)
    const exams: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_EXAM_CXR_LAB)
    const echoFindings: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_ECHO_FINDINGS)
    const primaryDiagnosis: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_PRIMARY_DIAGNOSIS)
    const imageQuality: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_IMAGE_QUALITY)

    //evaluation session

    const evaluationSession: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATION_SESSION)

    const cardiacEval: ICardiacEval = {
        caseNumber: caseNumber,
        patientInfo: patientInfo,
        echoIndication: echoIndication,
        exam: exams,
        echoFindings: echoFindings,
        primaryDiagnosis: primaryDiagnosis,
        imageQuality: imageQuality
    }

    const session = {
        evalDate: Date.now(),
        evalItemScores:tool!=='echo'?scoreData.evalItemScores:null,
        cardiacEval: tool==='echo'?cardiacEval:null
   }

    const sessions: ISession = {
        session_1: evaluationSession === 1?session:null,
        session_2: evaluationSession === 2?session:null,
        session_3: evaluationSession === 3?session:null,
        session_4: null,
        session_5: null,
    }

    // const evaluationData = {
    //     _id: generateID(),
    //     searchIndex: user.searchIndex,
    //     evaluator:user,
    //     scores: scoreData,
    //     cardiacEvaluation: tool==='cardiac'?cardiacEval:null,
    //     createdAt: Date.now()
    // }

    const evaluationData: IScore = {
        _id: generateID(),
        evaluationID: generateRandomString(),
        searchIndex: user.searchIndex,
        evaluator:user,
        mentee: mentee,
        tool:tool,
        sessions: sessions
    }

    return evaluationData
}

export default processScores