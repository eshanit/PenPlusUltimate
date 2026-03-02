/**
 * LocalStorage Composable - Type-safe wrapper for VueUse useStorage
 * Provides reactive localStorage with type safety
 */

import { useStorage, type RemovableRef } from '@vueuse/core';

/**
 * Create a typed localStorage ref
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): RemovableRef<T> {
  return useStorage<T>(key, defaultValue);
}

/**
 * LocalStorage keys from constants
 */
export const STORAGE_KEYS = {
  PROFILE: 'profile',
  EVALUATION_SCORES: 'evaluationScores',
  MENTEE_EVALUATION_REPORT_DATA: 'menteeEvalReportData',
  EVALUATED_MENTEE: 'mentee',
  DISTRICT: 'district',
  EVALUATOR: 'evaluator',
  SEARCH_INDEX: 'searchIndex',
  SELECTED_FACILITY: 'goingToFacility',
  FACILITIES: 'facilities',
  FACILITIES_FOR_SELECTED_DISTRICT: 'districtFacilities',
  UPDATE_MENTEE: 'updateMentee',
  CHECKED_DISTRICT: 'checkedDistrict',
  CHECKED_MENTEE: 'checkedMentee',
  CHECKED_COMENTORS: 'checkedComentors',
  TOOL: 'Tool',
  SCORES: 'Scores',
  CARDIAC_CASE_NUMBER: 'cardiacCaseNumber',
  CARDIAC_PATIENT_INFORMATION: 'patientCardiacInformation',
  CARDIAC_ECHO_INDICATION: 'cardiacEchoIndication',
  CARDIAC_EXAM_CXR_LAB: 'cardiacExamCxrLab',
  CARDIAC_ECHO_FINDINGS: 'cardiacEchoFindings',
  CARDIAC_PRIMARY_DIAGNOSIS: 'cardiacPrimaryDiagnosis',
  CARDIAC_IMAGE_QUALITY: 'cardiacImageQuality',
  EVALUATION_SESSION: 'evaluationSession',
  DATABASE_SCORE: 'databaseScores',
  DATABASE_SCORE_MENTEE: 'databaseScoreMentee',
  DATABASE_SCORE_EVALUATOR: 'databaseScoreEvaluator',
  DATABASE_SCORE_TOOL: 'databaseScoreTool',
  ADD_SESSION: 'addSession'
} as const;

/**
 * Process LocalStorage - Helper class for storage operations
 */
class LocalStorageProcessor {
  /**
   * Store data in localStorage
   */
  store<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`[LocalStorage] Error storing ${key}:`, error);
    }
  }

  /**
   * Retrieve data from localStorage
   */
  retrieve<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[LocalStorage] Error retrieving ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[LocalStorage] Error removing ${key}:`, error);
    }
  }

  /**
   * Clear all app-related localStorage
   */
  clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('[LocalStorage] Cleared all storage');
    } catch (error) {
      console.error('[LocalStorage] Error clearing storage:', error);
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Object.values(STORAGE_KEYS);
  }
}

// Singleton instance
let processorInstance: LocalStorageProcessor | null = null;

/**
 * Get LocalStorage processor instance
 */
export function useProcessLocalStorage(): LocalStorageProcessor {
  if (!processorInstance) {
    processorInstance = new LocalStorageProcessor();
  }
  return processorInstance;
}

/**
 * Type-safe profile storage
 */
export function useProfileStorage() {
  interface Profile {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    searchIndex?: string;
  }

  const profile = useLocalStorage<Profile | null>(STORAGE_KEYS.PROFILE, null);

  return {
    profile: readonly(profile),
    setProfile: (value: Profile) => {
      profile.value = value;
    },
    clearProfile: () => {
      profile.value = null;
    }
  };
}

/**
 * Type-safe evaluation session storage
 */
export function useEvaluationSessionStorage() {
  const evaluationSession = useLocalStorage<number>(STORAGE_KEYS.EVALUATION_SESSION, 1);
  const scores = useLocalStorage<unknown>(STORAGE_KEYS.SCORES, null);
  const databaseScore = useLocalStorage<unknown>(STORAGE_KEYS.DATABASE_SCORE, null);
  const databaseScoreTool = useLocalStorage<string>(STORAGE_KEYS.DATABASE_SCORE_TOOL, '');

  return {
    evaluationSession: readonly(evaluationSession),
    scores: readonly(scores),
    databaseScore: readonly(databaseScore),
    databaseScoreTool: readonly(databaseScoreTool),
    setSession: (session: number) => {
      evaluationSession.value = session;
    },
    setScores: (value: unknown) => {
      scores.value = value;
    },
    setDatabaseScore: (value: unknown) => {
      databaseScore.value = value;
    },
    setTool: (tool: string) => {
      databaseScoreTool.value = tool;
    }
  };
}

export default useLocalStorage;
