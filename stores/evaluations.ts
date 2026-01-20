import { useLocalStorage, useStorage, type RemovableRef } from "@vueuse/core";
import type IEvalScore from "@/interfaces/IEvalScore";
import pouchDBConnect from "@/utilities/pouchDbConnect";
import type IFinalEvaluation from "@/interfaces/IFinalEvaluation";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import DatabaseNames from "@/constants/DatabaseNames";
import cleanLocalStorage from "@/utilities/cleanLocalStorage";
import Routes from "@/constants/Routes";
import processScores from "@/utilities/processScores";
import processEchoScores from "@/utilities/processEchoScores";


const dbEvals = pouchDBConnect(DatabaseNames.COMPLETED_EVALUTATIONS);
const dbIncompleteEvals = pouchDBConnect(DatabaseNames.INCOMPLETE_EVALUATIONS);

export const useEvalDataStore = defineStore("evaluations", () => {
  const vm: IEvalScore[] = [];

  let vn: any;

  const vo: any[] = []

  const evaluationScores: RemovableRef<any> = useStorage(LocalStorageKeys.EVALUATION_SCORES, vm);

  const menteeEvalReportData = useStorage(LocalStorageKeys.MENTEE_EVALUATION_REPORT_DATA, vn);

  const allEvaluationScores = ref()


  /**
   * 
   * @param dbName 
   * @returns all evaluation scores in the database
   */

  const fetchEvaluationScores = async (dbName: string): Promise<Array<IFinalEvaluation> | any> => {

    const user: any = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE)

    let db: PouchDB.Database<any>;

    if (dbName === DatabaseNames.COMPLETED_EVALUTATIONS) {

      db = dbEvals;

    } else {
      db = dbIncompleteEvals

    }

    const evals = await db.allDocs({ include_docs: true }).then((response) => {
      let vm: any[] = [];
      for (var i = 0; i < response.rows.length; i++) {
        vm.push(response.rows[i].doc);
      }

      //console.log('vm:',vm);

      let newArray = vm.filter(function (el) {
        // return el.evaluator.searchIndex == user.searchIndex;
        return el.tool !== undefined
      });



      return newArray;

    }).catch((err: Error) => {
      console.error('fetch all scores error', err)
      // return ['Could not fetch evaluation scores, please try again or contact the administrator']
    })

    allEvaluationScores.value = evals

    //console.log('all scores', evals)
    return evals

  }

  /** fetch District Scores */



  /**
   * 
   * @param tool 
   * @returns stores scores
   */

  const storeScores = async (tool: string | string[]) => {
    const scoreData = processScores(tool)

    const storeStatus = await dbEvals.put(scoreData).then(async (response: { ok: boolean }) => {
      if (response.ok) {
        // Attempt to sync in background without blocking submission
        (async () => {
          try {
            const syncResult = await useReplicateToCouchDB(DatabaseNames.COMPLETED_EVALUTATIONS);

            // Check if syncResult is a valid replication object
            if (syncResult && typeof syncResult === 'object') {
              // Set initial sync status to pending
              dbEvals.get(scoreData._id).then((doc: any) => {
                doc.syncStatus = 'pending';
                dbEvals.put(doc);
              });

              // Handle sync completion asynchronously
              // Check if it's a PouchDB replication object
              if (typeof syncResult.on === 'function') {
                syncResult
                  .on("complete", () => {
                    // Update sync status to success
                    dbEvals.get(scoreData._id).then((doc: any) => {
                      doc.syncStatus = 'success';
                      doc.lastSyncedAt = Date.now();
                      dbEvals.put(doc);
                    });
                  })
                  .on("error", (err: any) => {
                    // Update sync status to failed
                    dbEvals.get(scoreData._id).then((doc: any) => {
                      doc.syncStatus = 'failed';
                      dbEvals.put(doc);
                    });
                  });
              } else {
                // If not a PouchDB replication object, assume sync completed
                console.warn('syncResult is not a PouchDB replication object, assuming sync completed');
                dbEvals.get(scoreData._id).then((doc: any) => {
                  doc.syncStatus = 'success';
                  doc.lastSyncedAt = Date.now();
                  dbEvals.put(doc);
                });
              }
            }
          } catch (syncError) {
            console.error('Sync setup failed:', syncError);
            // Set sync status to failed
            dbEvals.get(scoreData._id).then((doc: any) => {
              doc.syncStatus = 'failed';
              dbEvals.put(doc);
            });
          }
        })();

        cleanLocalStorage()
        navigateTo(Routes.SCORE_SUBMIT_SUCCESS)
      }

      return response;
    })
      .catch((error: any) => {
        console.error('Error storing scores:', error);
        throw error;
      });

    return storeStatus
  }

  /**
   * @param
   * @returns {Promise<boolean|String>} 
   * create another session
   */

  const createSessionEval = async (): Promise<Boolean | String> => {
    const databaseScores: any = useProcessLocalStorage().retrieve(LocalStorageKeys.DATABASE_SCORE);
    const currentSession: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATION_SESSION);
    const scores: any = useProcessLocalStorage().retrieve(LocalStorageKeys.SCORES);
    const tool: any = useProcessLocalStorage().retrieve(LocalStorageKeys.DATABASE_SCORE_TOOL);

    const sessionKey = `session_${currentSession}`;
    const echoData = tool === 'echo' ? processEchoScores() : scores;

    databaseScores.sessions[sessionKey] = echoData;

    return await dbEvals.put(databaseScores).then(async (response: { ok: boolean }) => {
      if (response.ok === true) {
        // Attempt to sync in background without blocking submission
        (async () => {
          try {
            const syncResult = await useReplicateToCouchDB(DatabaseNames.COMPLETED_EVALUTATIONS);

            // Check if syncResult is a valid object
            if (syncResult && typeof syncResult === 'object') {
              // Set initial sync status to pending
              dbEvals.get(databaseScores._id).then((doc: any) => {
                doc.syncStatus = 'pending';
                dbEvals.put(doc);
              });

              // Handle sync completion asynchronously
              // Check if it's a PouchDB replication object with .on method
              if (typeof syncResult.on === 'function') {
                syncResult
                  .on("complete", () => {
                    // Update sync status to success
                    dbEvals.get(databaseScores._id).then((doc: any) => {
                      doc.syncStatus = 'success';
                      doc.lastSyncedAt = Date.now();
                      dbEvals.put(doc);
                    });
                  })
                  .on("error", (err: any) => {
                    // Update sync status to failed
                    dbEvals.get(databaseScores._id).then((doc: any) => {
                      doc.syncStatus = 'failed';
                      dbEvals.put(doc);
                    });
                  });
              } else {
                // If not a PouchDB replication object, assume sync completed
                console.warn('syncResult is not a PouchDB replication object, assuming sync completed');
                dbEvals.get(databaseScores._id).then((doc: any) => {
                  doc.syncStatus = 'success';
                  doc.lastSyncedAt = Date.now();
                  dbEvals.put(doc);
                });
              }
            }
          } catch (syncError) {
            console.error('Sync setup failed:', syncError);
            // Set sync status to failed
            dbEvals.get(databaseScores._id).then((doc: any) => {
              doc.syncStatus = 'failed';
              dbEvals.put(doc);
            });
          }
        })();

        cleanLocalStorage()
        navigateTo(Routes.SCORE_SUBMIT_SUCCESS)
      }
      return response.ok;
    }).catch((error: Error) => {
      console.error('Error creating new session scores:', error);
      return error.message
    });
  }


  /**
   * 
   * @param scoreId 
   * @returns evaluations for a particular score
   */

  const fetchUserEval = async (scoreId: string): Promise<any> => {

    return await dbEvals.get(scoreId).then((response) => {
      return response
    }).catch((error: Error) => {
      return false;
    })
  }

  /**
 * 
 * @param district
 * @returns evaluations for a particular district
 */

  const fetchDistrictEvaluations = async (district: string): Promise<any> => {

    return await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS).then((response) => {

      return response.filter(function (el: { mentee: any; }) {
        // return el.evaluator.searchIndex == user.searchIndex;
        return el.mentee.district == district;
      });


    });

  }


  /**
 * 
 * @param facility
 * @returns evaluations for a particular facility
 */

  const fetchFacilityEvaluations = async (facility: string): Promise<any> => {

    return await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS).then((response) => {


      //console.log(response)

      return response.filter(function (el: { mentee: any; }) {
        // return el.evaluator.searchIndex == user.searchIndex;
        return el.mentee.facility == facility;
      });


    });

  }

  /**
* 
* @param menteeId
* @returns evaluations for a particular mentee
*/

  const fetchMenteeEvals = async (menteeId: string): Promise<any> => {

    return await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS).then((response) => {
      //console.log(response)
      return response.filter(function (el: { mentee: any; }) {
        // return el.evaluator.searchIndex == user.searchIndex;
        return el.mentee._id == menteeId;
      });

    });
  }


  /**
   * @param tool
   * 
   * @returns evaluations for a particular tool
   */

  const fetchToolEvals = async (tool: string): Promise<any> => {

    return await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS).then((response) => {
      //console.log(response)
      return response.filter(function (el: { tool: any; }) {
        // return el.evaluator.searchIndex == user.searchIndex;
        return el.tool == tool;
      });

    });
  }

  return { evaluationScores, menteeEvalReportData, allEvaluationScores, fetchToolEvals, fetchMenteeEvals, fetchFacilityEvaluations, fetchDistrictEvaluations, storeScores, fetchEvaluationScores, fetchUserEval, createSessionEval };
});
