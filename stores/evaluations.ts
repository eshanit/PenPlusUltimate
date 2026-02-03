import { useLocalStorage, useStorage, type RemovableRef } from "@vueuse/core";
import { navigateTo } from '#app'; // Add this import
import type IEvalScore from "@/interfaces/IEvalScore";
import pouchDBConnect from "@/utilities/pouchDbConnect";
import type IFinalEvaluation from "@/interfaces/IFinalEvaluation";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import DatabaseNames from "@/constants/DatabaseNames";
import cleanLocalStorage from "@/utilities/cleanLocalStorage";
import Routes from "@/constants/Routes";
import processScores from "@/utilities/processScores";
import processEchoScores from "@/utilities/processEchoScores";
import useReplicateToCouchDB from "@/composables/useReplicateToCouchDB";

const dbEvals = pouchDBConnect(DatabaseNames.COMPLETED_EVALUTATIONS);
const dbIncompleteEvals = pouchDBConnect(DatabaseNames.INCOMPLETE_EVALUATIONS);

// Track sync status
let isSyncing = false;
const pendingSyncDocs = new Set<string>();

const syncEvaluationsToServer = async () => {
  if (isSyncing) {
    console.log('Evaluations sync already in progress, skipping...');
    return null;
  }
  isSyncing = true;
  try {
    const result = await useReplicateToCouchDB(DatabaseNames.COMPLETED_EVALUTATIONS);
    if (result && typeof result.on === 'function') {
      return new Promise<void>((resolve) => {
        result.on("complete", () => {
          console.log('Evaluations synced successfully');
          isSyncing = false;
          resolve();
        });
        result.on("error", (err: any) => {
          console.error('Evaluations sync error:', err);
          isSyncing = false;
          resolve();
        });
      });
    }
    isSyncing = false;
    return null;
  } catch (error) {
    console.error('Evaluations sync failed:', error);
    isSyncing = false;
    return null;
  }
};

// Improved updateDocSyncStatus with retry logic
const updateDocSyncStatus = async (docId: string, status: 'pending' | 'success' | 'failed', retryCount = 0): Promise<void> => {
  const maxRetries = 3;
  
  try {
    const doc = await dbEvals.get(docId);
    const updatedDoc = {
      ...doc,
      syncStatus: status,
      ...(status === 'success' ? { lastSyncedAt: Date.now() } : {})
    };
    
    await dbEvals.put(updatedDoc);
  } catch (err: any) {
    console.error(`Failed to update sync status for ${docId}:`, err);
    
    // Retry on conflict
    if (err.status === 409 && retryCount < maxRetries) {
      console.log(`Retrying sync status update for ${docId} (attempt ${retryCount + 1})`);
      await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
      return updateDocSyncStatus(docId, status, retryCount + 1);
    }
  }
};

// Helper function for background sync
const triggerBackgroundSync = async (docId: string): Promise<void> => {
  try {
    // Mark as pending first
    await updateDocSyncStatus(docId, 'pending');
    
    // Add to pending set
    pendingSyncDocs.add(docId);
    
    // Debounced sync - wait a bit before syncing to batch multiple updates
    setTimeout(async () => {
      if (pendingSyncDocs.has(docId)) {
        try {
          const syncResult = await syncEvaluationsToServer();
          if (syncResult) {
            await syncResult;
            await updateDocSyncStatus(docId, 'success');
          } else {
            // Try direct replication as fallback
            const result = await useReplicateToCouchDB(DatabaseNames.COMPLETED_EVALUTATIONS);
            if (result && typeof result.on === 'function') {
              result.on("complete", () => updateDocSyncStatus(docId, 'success'));
              result.on("error", () => updateDocSyncStatus(docId, 'failed'));
            } else {
              await updateDocSyncStatus(docId, 'success');
            }
          }
        } catch (syncError) {
          console.error('Background sync error:', syncError);
          await updateDocSyncStatus(docId, 'failed');
        } finally {
          pendingSyncDocs.delete(docId);
        }
      }
    }, 1000); // 1 second debounce
  } catch (error) {
    console.error('Error triggering background sync:', error);
  }
};

export const useEvalDataStore = defineStore("evaluations", () => {
  const vm: IEvalScore[] = [];
  let vn: any;
  const vo: any[] = [];
  
  const evaluationScores: RemovableRef<any> = useStorage(LocalStorageKeys.EVALUATION_SCORES, vm);
  const menteeEvalReportData = useStorage(LocalStorageKeys.MENTEE_EVALUATION_REPORT_DATA, vn);
  const allEvaluationScores = ref();

  const fetchEvaluationScores = async (dbName: string): Promise<Array<IFinalEvaluation> | any> => {
    const user: any = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE);
    let db: PouchDB.Database<any>;

    if (dbName === DatabaseNames.COMPLETED_EVALUTATIONS) {
      db = dbEvals;
    } else {
      db = dbIncompleteEvals;
    }

    try {
      const response = await db.allDocs({ include_docs: true });
      let vm: any[] = [];
      for (var i = 0; i < response.rows.length; i++) {
        vm.push(response.rows[i].doc);
      }

      let newArray = vm.filter(function (el) {
        return el.tool !== undefined;
      });

      allEvaluationScores.value = newArray;
      return newArray;
    } catch (err: unknown) {
      console.error('fetch all scores error', err);
      return [];
    }
  };

  const storeScores = async (tool: string | string[]): Promise<any> => {
    try {
      const scoreData = processScores(tool);
      
      // Create document with timestamps
      const docToStore = {
        ...scoreData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending' as const
      };
      
      // Store in database
      const response = await dbEvals.put(docToStore);
      
      if (response.ok) {
        // Trigger background sync
        await triggerBackgroundSync(docToStore._id);
        
        // Clean up and navigate
        cleanLocalStorage();
        navigateTo(Routes.SCORE_SUBMIT_SUCCESS);
        return response;
      }
    } catch (error: any) {
      console.error('Error storing scores:', error);
      
      // Handle conflict - generate new ID
      if (error.status === 409) {
        const scoreData = processScores(tool);
        const newDoc = {
          ...scoreData,
          _id: `${scoreData._id}_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          syncStatus: 'pending' as const,
          wasConflicted: true // Flag for debugging
        };
        
        const response = await dbEvals.put(newDoc);
        if (response.ok) {
          await triggerBackgroundSync(newDoc._id);
          cleanLocalStorage();
          navigateTo(Routes.SCORE_SUBMIT_SUCCESS);
          return response;
        }
      }
      
      throw error;
    }
  };

  const createSessionEval = async (): Promise<boolean | string> => {
    try {
      const currentSession: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATION_SESSION);
      const scores: any = useProcessLocalStorage().retrieve(LocalStorageKeys.SCORES);
      const tool: any = useProcessLocalStorage().retrieve(LocalStorageKeys.DATABASE_SCORE_TOOL);
      
      // Get the document ID from localStorage
      const databaseScoresFromStorage: any = useProcessLocalStorage().retrieve(LocalStorageKeys.DATABASE_SCORE);
      const docId = databaseScoresFromStorage._id;
      
      if (!docId) {
        throw new Error('No document ID found in localStorage');
      }
      
      const sessionKey = `session_${currentSession}`;
      const echoData = tool === 'echo' ? processEchoScores() : scores;
      
      // Fetch the LATEST version from the database
      let doc: any;
      try {
        doc = await dbEvals.get(docId);
      } catch (error: any) {
        if (error.status === 404) {
          console.error('Document not found, recreating from localStorage');
          doc = databaseScoresFromStorage;
        } else {
          throw error;
        }
      }
      
      // Update the document with the new session
      doc.sessions = doc.sessions || {};
      doc.sessions[sessionKey] = echoData;
      doc.updatedAt = new Date().toISOString();
      
      // Remove any _conflicts array to prevent issues
      if (doc._conflicts) {
        delete doc._conflicts;
      }
      
      // Use retry mechanism for conflicts
      const maxRetries = 3;
      
      for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
        try {
          const response = await dbEvals.put(doc);
          
          if (response.ok) {
            // Trigger background sync
            await triggerBackgroundSync(doc._id);
            
            cleanLocalStorage();
            navigateTo(Routes.SCORE_SUBMIT_SUCCESS);
            return true;
          }
        } catch (error: any) {
          if (error.status === 409 && retryCount < maxRetries - 1) {
            console.log(`Conflict detected, retry ${retryCount + 1}/${maxRetries}`);
            
            // Fetch latest version and merge
            try {
              const latestDoc = await dbEvals.get(docId);
              
              // Merge sessions
              latestDoc.sessions = latestDoc.sessions || {};
              latestDoc.sessions[sessionKey] = echoData;
              latestDoc.updatedAt = new Date().toISOString();
              
              // Remove conflicts
              if (latestDoc._conflicts) {
                delete latestDoc._conflicts;
              }
              
              doc = latestDoc;
              
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
            } catch (fetchError) {
              console.error('Error fetching latest document for retry:', fetchError);
              break;
            }
          } else {
            // Not a conflict or max retries reached
            console.error('Error creating new session scores:', error);
            return error?.message || 'Failed to create session';
          }
        }
      }
      
      return 'Failed to create session after retries';
      
    } catch (error: any) {
      console.error('Error in createSessionEval:', error);
      return error.message || 'Unknown error';
    }
  };

  // Other functions remain the same...
  const fetchUserEval = async (scoreId: string): Promise<any> => {
    return await dbEvals.get(scoreId).then((response) => {
      return response;
    }).catch((error: Error) => {
      console.error('Error fetching user eval:', error);
      return false;
    });
  };

  const fetchDistrictEvaluations = async (district: string): Promise<any> => {
    return await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS).then((response) => {
      return response.filter(function (el: { mentee: any; }) {
        return el.mentee.district == district;
      });
    });
  };

  const fetchFacilityEvaluations = async (facility: string): Promise<any> => {
    return await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS).then((response) => {
      return response.filter(function (el: { mentee: any; }) {
        return el.mentee.facility == facility;
      });
    });
  };

  const fetchMenteeEvals = async (menteeId: string): Promise<any> => {
    return await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS).then((response) => {
      return response.filter(function (el: { mentee: any; }) {
        return el.mentee._id == menteeId;
      });
    });
  };

  const fetchToolEvals = async (tool: string): Promise<any> => {
    return await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS).then((response) => {
      return response.filter(function (el: { tool: any; }) {
        return el.tool == tool;
      });
    });
  };

  return { 
    evaluationScores, 
    menteeEvalReportData, 
    allEvaluationScores, 
    fetchToolEvals, 
    fetchMenteeEvals, 
    fetchFacilityEvaluations, 
    fetchDistrictEvaluations, 
    storeScores, 
    fetchEvaluationScores, 
    fetchUserEval, 
    createSessionEval 
  };
});