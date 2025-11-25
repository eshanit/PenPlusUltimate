import LocalStorageKeys from "@/constants/LocalStorageKeys";
import type ICardiacEval from "@/interfaces/ICardiacEval";

const processEchoScores = () => {

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
        evalItemScores:null,
        cardiacEval: cardiacEval
   }

  

   

    return session
}

export default processEchoScores