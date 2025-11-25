import LocalStorageKeys from "@/constants/LocalStorageKeys"

const cleanLocalStorage = () => {

    localStorage.removeItem(LocalStorageKeys.FACILITIES)
    localStorage.removeItem(LocalStorageKeys.FACILITIES_FOR_SELECTED_DISTRICT)
    localStorage.removeItem(LocalStorageKeys.MENTEE_EVALUATION_REPORT_DATA)
    localStorage.removeItem(LocalStorageKeys.DISTRICT)
    localStorage.removeItem(LocalStorageKeys.EVALUATED_MENTEE)
    localStorage.removeItem(LocalStorageKeys.EVALUATION_SCORES)
    localStorage.removeItem(LocalStorageKeys.SELECTED_FACILITY)
    //
    localStorage.removeItem(LocalStorageKeys.FACILITIES)
    localStorage.removeItem(LocalStorageKeys.CHECKED_COMENTORS)
    localStorage.removeItem(LocalStorageKeys.CHECKED_DISTRICT)
    localStorage.removeItem(LocalStorageKeys.CHECKED_MENTEE)
    localStorage.removeItem(LocalStorageKeys.UPDATE_MENTEE)

    //
    localStorage.removeItem(LocalStorageKeys.TOOL)
    localStorage.removeItem(LocalStorageKeys.SCORES)

    //cardiac
    localStorage.removeItem(LocalStorageKeys.CARDIAC_PATIENT_INFORMATION)
    localStorage.removeItem(LocalStorageKeys.CARDIAC_ECHO_INDICATION)
    localStorage.removeItem(LocalStorageKeys.CARDIAC_EXAM_CXR_LAB)
    localStorage.removeItem(LocalStorageKeys.CARDIAC_ECHO_FINDINGS)
    localStorage.removeItem(LocalStorageKeys.CARDIAC_PRIMARY_DIAGNOSIS)
    localStorage.removeItem(LocalStorageKeys.CARDIAC_IMAGE_QUALITY)

    //
    localStorage.removeItem(LocalStorageKeys.DATABASE_SCORE)
    localStorage.removeItem(LocalStorageKeys.DATABASE_SCORE_EVALUATOR)
    localStorage.removeItem(LocalStorageKeys.DATABASE_SCORE_MENTEE)
    localStorage.removeItem(LocalStorageKeys.DATABASE_SCORE_TOOL)
    localStorage.removeItem(LocalStorageKeys.EVALUATION_SESSION)
    localStorage.removeItem(LocalStorageKeys.ADD_SESSION)
    
    
    
    

}


export default cleanLocalStorage;