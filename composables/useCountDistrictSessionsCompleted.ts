
import type IEvaluationStats from "~/interfaces/IEvaluationStats";
import { useCountSessionsCompleted } from "./useCountSessionsCompleted";

export function useCountDistrictSessionsCompleted(district: string, evaluationStats: IEvaluationStats, districtFacilities?: string[]) {
    return useCountSessionsCompleted(evaluationStats, (el: any) => {
        const menteeFacility = el.mentee?.facility;
        if (!menteeFacility) return false;
        
        // If districtFacilities is provided, check if mentee's facility belongs to this district
        if (districtFacilities && districtFacilities.length > 0) {
            return districtFacilities.some(f => 
                f.toLowerCase().trim() === menteeFacility.toLowerCase().trim()
            );
        }
        
        // Fallback: case-insensitive district name comparison
        // This handles cases where mentee might have district stored directly
        const menteeDistrict = el.mentee?.district;
        if (menteeDistrict) {
            return menteeDistrict.toLowerCase().trim() === district.toLowerCase().trim();
        }
        
        return false;
    });
}