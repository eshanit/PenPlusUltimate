import pouchDBConnect from "@/utilities/pouchDbConnect";
import DatabaseNames from "@/constants/DatabaseNames";
import Routes from "@/constants/Routes";
import LocalStorageKeys from "~/constants/LocalStorageKeys";
import type IDistrict from "@/interfaces/IDistrict";

const db = pouchDBConnect(DatabaseNames.DISTRICTS);

export const useDistrictsStore = defineStore("districts", () => {

  const districts = ref();

  const fetchDistricts = async (): Promise<Array<IDistrict> | any> => {

    const dbDistricts = await db.allDocs({ include_docs: true }).then(function (response) {
        let vm = [];
        for (var i = 0; i < response.rows.length; i++) {
          vm.push(response.rows[i].doc);
        }

        let newArray = vm.filter(function (el) {
          return el.district != undefined;
        });

        return newArray;

      })
      .catch(function (err: Error) {
        console.error("fetch districts error", err);
      });

    districts.value = dbDistricts;

    return dbDistricts;

  };

  //
  const saveGoingDistrict = async (): Promise<any> => {

    const districtID:any = localStorage.getItem(LocalStorageKeys.CHECKED_DISTRICT)

    db.get(districtID)
      .then(async (response: any) => {
        const facilities: any[] = [];
//formating for table
        response.facilities.forEach((facility: string) => {
          facilities.push({
            id: facility,
            facility: facility,
          });
        });

        //to be used for editing mentee information
        useProcessLocalStorage().store(LocalStorageKeys.FACILITIES,response.facilities)

        //to be used in facilities table
        useProcessLocalStorage().store(LocalStorageKeys.FACILITIES_FOR_SELECTED_DISTRICT,facilities);
        //useProcessLocalStorage().store(LocalStorageKeys.DISTRICT,response.district);
        localStorage.setItem(LocalStorageKeys.DISTRICT,response.district)
       
        await navigateTo(Routes.FACILITIES.path);
      })
      .catch(function (err: Error) {
        console.error("fetch district ave going error", err);
      });
  };

  return { districts, fetchDistricts, saveGoingDistrict };
});
