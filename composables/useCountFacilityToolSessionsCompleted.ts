
import type IEvaluationStats from "~/interfaces/IEvaluationStats";
import { useCountSessionsCompleted } from "./useCountSessionsCompleted";

export function useCountFacilityToolSessionsCompleted(facility: string, tool: string, evaluationStats: IEvaluationStats) {
    return useCountSessionsCompleted(evaluationStats, (el: any) => el.mentee.facility == facility && el.tool == tool);
}