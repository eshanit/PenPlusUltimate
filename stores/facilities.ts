import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";

export const useFacilitiesStore = defineStore('facilities', () => {

    const districtFacilities = localStorage.getItem(LocalStorageKeys.FACILITIES_FOR_SELECTED_DISTRICT);

    const facilities = ref('');
    
    if(districtFacilities){
        facilities.value = districtFacilities;
    }


   
    return { facilities }

})