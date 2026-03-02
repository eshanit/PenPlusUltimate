import pouchDBConnect from "@/utilities/pouchDbConnect";
import generateID from "@/utilities/generateID";
import type IMasterUser from "@/interfaces/IMasterUser";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import DatabaseNames from "@/constants/DatabaseNames";
import Routes from "@/constants/Routes";
import useReplicateToCouchDB from "@/composables/useReplicateToCouchDB";
import { useProcessLocalStorage } from "@/composables/useLocalStorage";

const db = pouchDBConnect(DatabaseNames.MENTEES);
const facility = localStorage.getItem(LocalStorageKeys.SELECTED_FACILITY);

type ICreateMentee = Omit<IMasterUser, "_rev" | "searchIndex" | "updatedAt" | "updatedBy"| "terms" | "password" | "username">;
type IUpdateMentee = Omit<IMasterUser,  "searchIndex"| "terms" | "password" | "username">;

// Track sync status to prevent redundant syncs
let isSyncing = false;

const syncToServer = async () => {
  if (isSyncing) {
    console.log('Mentees sync already in progress, skipping...');
    return;
  }
  isSyncing = true;
  try {
    const result = await useReplicateToCouchDB(DatabaseNames.MENTEES);
    if (result) {
      // Set up handlers if it's a replication object
      if (typeof result.on === 'function') {
        result.on("complete", () => {
          console.log('Mentees synced successfully');
          isSyncing = false;
        });
        result.on("error", (err: any) => {
          console.error('Mentees sync error:', err);
          isSyncing = false;
        });
      } else {
        isSyncing = false;
      }
    } else {
      isSyncing = false;
    }
  } catch (error) {
    console.error('Mentees sync failed:', error);
    isSyncing = false;
  }
};


export const useMenteeStore = defineStore("mentees", () => {
  const mentees = ref<IMasterUser[]>();

  //fetch all mentes

  const fetchMentees = async (): Promise<IMasterUser[] | void> => {
    const dbMentees = await db.allDocs({ include_docs: true }).then(function (response): IMasterUser[] {
        let vm: IMasterUser[] = [];
        for (var i = 0; i < response.rows.length; i++) {
          const row = response.rows[i];
          if (row?.doc) {
            vm.push(row.doc as IMasterUser);
          }
        }

        let newArray = vm.filter(function (el) {
          return el.firstname !== undefined;
        });

        return newArray;
      })
      .catch(function (err: Error) {
        console.error("fetch mentees error", err);
        return [];
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
          const row = response.rows[i];
          if (row?.doc) {
            vm.push(row.doc);
          }
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
          const row = response.rows[i];
          if (row?.doc) {
            vm.push(row.doc);
          }
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
        // Sync to server (fire and forget with proper tracking)
        syncToServer();
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
        syncToServer();
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

    if (!selectedId || !mentees.value) {
      console.error('No mentee selected or mentees not loaded');
      return;
    }

    const result = mentees.value.find(
      (mentee: IMasterUser) => mentee._id === selectedId
    );

    useProcessLocalStorage().store(LocalStorageKeys.EVALUATED_MENTEE, result)

     await navigateTo(Routes.PREVIEW.path)
  };

  //delette Mentee
  const deleteMentee = async (menteeID: string, menteeRev: string) => {
    return await db.remove(menteeID, menteeRev).then(async (resp) => {
      syncToServer();
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
