import pouchDBConnect from "@/utilities/pouchDbConnect";
import generateID from "@/utilities/generateID";
import type IMasterUser from "@/interfaces/IMasterUser";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import DatabaseNames from "@/constants/DatabaseNames";
import Routes from "@/constants/Routes";

const db = pouchDBConnect(DatabaseNames.MENTEES);
const facility = localStorage.getItem(LocalStorageKeys.SELECTED_FACILITY);

type ICreateMentee = Omit<IMasterUser, "_rev" | "searchIndex" | "updatedAt" | "updatedBy"| "terms" | "password" | "username">
type IUpdateMentee = Omit<IMasterUser,  "searchIndex"| "terms" | "password" | "username">

export const useMenteeStore = defineStore("mentees", () => {
  const mentees = ref();

  //fetch all mentes

  const fetchMentees = async (): Promise<Array<Object> | void> => {
    const dbMentees = await db.allDocs({ include_docs: true }).then(function (response) {
        let vm = [];
        for (var i = 0; i < response.rows.length; i++) {
          vm.push(response.rows[i].doc);
        }

        let newArray = vm.filter(function (el) {
          return el.firstname != undefined;
        });

        return newArray;
      })
      .catch(function (err: Error) {
        console.error("fetch mentees error", err);
      });

    mentees.value = dbMentees;

    return mentees.value;
  };

  const fetchAllMentees = async (facility2: any) => {

    return await db
      .allDocs({ include_docs: true })
      .then(async (response) => {
        let vm: any[] = [];
        let facilityFiltered: any[] = [];

        for (var i = 0; i < response.rows.length; i++) {
          vm.push(response.rows[i].doc);
        }

        facilityFiltered = vm.filter(function (value) {
          return value.facility === facility2;
        });

        mentees.value = facilityFiltered;

        return mentees.value;

      })
      .catch((error: Error) => {
        console.error("fetch mentees error:", error);
      });
  };

  //
  const fetchDistrictMentees = async (district: any) => {

    return await db
      .allDocs({ include_docs: true })
      .then(async (response) => {
        let vm: any[] = [];
        let districtFiltered: any[] = [];

        for (var i = 0; i < response.rows.length; i++) {
          vm.push(response.rows[i].doc);
        }

        districtFiltered = vm.filter(function (value) {
          return value.district === district;
        });

        mentees.value = districtFiltered;

        return mentees.value;

      })
      .catch((error: Error) => {
        console.error("fetch mentees error:", error);
      });
  };
  //

  //Create new Mentee
  const createMentee = async (menteeData: ICreateMentee): Promise<any> => {
    const menteeObject = {
      _id: generateID(),
      firstname: menteeData.firstname,
      lastname: menteeData.lastname,
      gender: menteeData.gender,
      facility: facility,
      profession: menteeData.profession,
    };

    const createStatus = await db
      .put(menteeObject)
      .then((response: { ok: boolean }) => {
        // console.log("Create Mentee", response);
          useReplicateToCouchDB(DatabaseNames.MENTEES);
        return response;
      })
      .catch((error: any) => {
        // Error creating Mentee
      });

    return createStatus;
  };

  /**
   * 
   * @param updatedMenteeData 
   * @returns {Promise}
   */
  const updateMentee = async (updatedMenteeData: IUpdateMentee): Promise<Boolean|String> => {

    const updatedMentee = {
      _id: updatedMenteeData._id,
      _rev: updatedMenteeData._rev,
      firstname: updatedMenteeData.firstname,
      lastname: updatedMenteeData.lastname,
      facility: updatedMenteeData.facility,
      gender: updatedMenteeData.gender,
      profession: updatedMenteeData.profession,
      updatedAt:  Date.now()
    }

   return await db.put(updatedMentee).then((response:{ ok: boolean })=>{
      if (response.ok === true) {
        useReplicateToCouchDB(DatabaseNames.MENTEES);
      }
      return response.ok;

    }).catch((error: Error) => {
      // Error creating Mentee
      
      return error.message
    });

  }

  //save mentee being interviewed
  const saveEvalMentee = async () => {

    const selectedId = localStorage.getItem(LocalStorageKeys.CHECKED_MENTEE)

    const result = mentees.value.find(
      (mentee: { _id: any }) => mentee._id === selectedId
    );

    useProcessLocalStorage().store(LocalStorageKeys.EVALUATED_MENTEE, result)

     await navigateTo(Routes.PREVIEW.path)
  };

  //delette Mentee
  const deleteMentee = async (menteeID: string, menteeRev: string) => {
    return await db.remove(menteeID, menteeRev).then(async (resp) => {
      useReplicateToCouchDB(DatabaseNames.MENTEES);
      if (resp.ok === true) {
        await navigateTo(Routes.MENTEES);
      }
      return resp.ok;
    });
  };

  const fetchMentee = async (menteeId: string) => {
    return await   db.get(menteeId).then((response) => {
      return response
    }).catch((error: Error) => {
      return false;
    })
  }

  return { mentees, fetchMentee, fetchMentees, fetchAllMentees,fetchDistrictMentees, createMentee, updateMentee, saveEvalMentee, deleteMentee};
});
