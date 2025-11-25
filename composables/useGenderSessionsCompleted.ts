


import { useCountSessionsCompleted } from "./useCountSessionsCompleted";

export function useGenderSessionsCompleted(gender: string, evaluationStats: any) {
    return useCountSessionsCompleted(evaluationStats, (el: any) => el.mentee.gender == gender);
}