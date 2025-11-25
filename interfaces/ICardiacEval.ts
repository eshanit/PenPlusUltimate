interface CardiacEval {
    caseNumber: string
    patientInfo:{
        fullName: string,
        gender: string,
        age: number
    },
    echoIndication: Array<string>,
    exam: {
        bp: {
            systolic: number,
            dystolic: number
        },
        cxrLab: Array<string>,
    },
    echoFindings: {
        lvDepressed: {
            checked: string,
            rating?: number
        },
        mitralStenosis: {
            checked: string,
            rating?: number
        },
        rvDilated: {
            checked: string,
            rating?: number
        },
        pericardialEffusion: {
            checked: string,
            rating?: number
        },
        ivcDilated: {
            checked: string,
            rating?: number
        }
    },
    primaryDiagnosis: Array<string>,
    imageQuality: {
        plax:{
            axis: number,
            depth: number,
            gain: number
        },
        psax: {
            axis: number,
            depth: number,
            gain: number
        },
        a4c: {
            axis: number,
            depth: number,
            gain: number
        },
        sc: {
            axis: number,
            depth: number,
            gain: number
        },
        ivc: {
            axis: number,
            depth: number,
            gain: number
        }
    }
}

type ICardiacEval = Readonly<CardiacEval>

export type { ICardiacEval as default}