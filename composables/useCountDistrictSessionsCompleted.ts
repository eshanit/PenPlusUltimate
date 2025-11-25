
import type IEvaluationStats from "~/interfaces/IEvaluationStats";
import { useCountSessionsCompleted } from "./useCountSessionsCompleted";

export function useCountDistrictSessionsCompleted(district: string, evaluationStats: IEvaluationStats) {
    return useCountSessionsCompleted(evaluationStats, (el: any) => el.mentee.district == district);
}