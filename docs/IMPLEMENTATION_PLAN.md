# Implementation Plan: NCD PenPlus Code Review Fixes

This document provides a comprehensive step-by-step implementation plan to address all issues identified in the code review.

---

## Phase 1: Foundation & Critical Fixes (Week 1-2)

### 1.1 TypeScript Strict Mode Configuration

**Priority**: P0 - Critical
**Estimated Effort**: 2 hours
**Risk Level**: Low
**Dependencies**: None

**Files to Modify**:
- [`tsconfig.json`](tsconfig.json)

**Implementation Steps**:
1. Update tsconfig.json with strict mode settings:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Testing**: Run `npm run build` to identify all type errors, fix incrementally

---

### 1.2 Security: Remove Hardcoded Credentials

**Priority**: P0 - Critical
**Estimated Effort**: 1 hour
**Risk Level**: Medium
**Dependencies**: None

**Files to Modify**:
- [`stores/auth.ts`](stores/auth.ts:62) - Line 62 contains `if (userData.password === "123356")`

**Implementation Steps**:
1. Add to `.env`:
```env
VITE_MASTER_PASSWORD=123356
```

2. Update `stores/auth.ts`:
```typescript
const MASTER_PASSWORD = import.meta.env.VITE_MASTER_PASSWORD;

if (userData.password === MASTER_PASSWORD) {
  // Master login logic
}
```

**Testing**: Verify master login still works with environment variable

---

### 1.3 Create Core Interfaces

**Priority**: P0 - Critical
**Estimated Effort**: 3 hours
**Risk Level**: Low
**Dependencies**: 1.1 (TypeScript config)

**Files to Create**:
- New: `interfaces/IEvaluation.ts`
- New: `interfaces/IFacility.ts`

**Files to Modify**:
- Update all files using `any` type

**Implementation Steps**:
1. Create `interfaces/IEvaluation.ts`:
```typescript
export interface Mentee {
  _id: string;
  firstname: string;
  lastname: string;
  facility: string;
  district?: string;
  gender?: 'male' | 'female' | 'other';
  profession?: string;
  searchIndex?: string;
}

export interface EvaluationData {
  _id: string;
  evaluationID: string;
  evaluator: IMasterUser;
  mentee: Mentee;
  tool: string | string[];
  sessions: ISession;
  syncStatus: SyncStatus;
  lastSyncedAt?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SyncStatus = 'pending' | 'success' | 'failed';
```

2. Create `interfaces/IFacility.ts`:
```typescript
export interface Facility {
  _id: string;
  name: string;
  district: string;
  facilities?: string[];
}

export interface District {
  _id: string;
  name: string;
  facilities: string[];
}
```

3. Update [`stores/mentees.ts`](stores/mentees.ts):
```typescript
// Line 82: Change from any[]
const facilityFiltered: Mentee[] = [];
```

**Testing**: TypeScript build should pass with stricter types

---

### 1.4 Centralized Error Handling

**Priority**: P1 - High
**Estimated Effort**: 2 hours
**Risk Level**: Low
**Dependencies**: 1.1

**Files to Create**:
- `utils/errorHandler.ts`

**Implementation Steps**:
1. Create `utils/errorHandler.ts`:
```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, context: string): AppError => {
  if (error instanceof AppError) {
    console.error(`[${context}] ${error.code}:`, error.message);
    return error;
  }
  
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[${context}] Unexpected error:`, message);
  return new AppError(message, 'UNKNOWN_ERROR', 500);
};

export const withErrorHandling = <T>(
  context: string,
  fn: () => Promise<T>
): Promise<T> => {
  return fn().catch(error => {
    throw handleError(error, context);
  });
};
```

2. Update stores to use error handling:
- [`stores/districts.ts`](stores/districts.ts:28-30)
- [`stores/mentees.ts`](stores/mentees.ts:67-69)
- [`stores/evaluations.ts`](stores/evaluations.ts:150-152)

**Testing**: Verify errors are properly caught and logged

---

## Phase 2: Architecture & Services (Week 3-4)

### 2.1 Database Service

**Priority**: P1 - High
**Estimated Effort**: 4 hours
**Risk Level**: Medium
**Dependencies**: Phase 1 complete

**Files to Create**:
- `services/database.ts`

**Files to Modify**:
- [`stores/auth.ts`](stores/auth.ts:23-24)
- [`stores/mentees.ts`](stores/mentees.ts:9)
- [`stores/evaluations.ts`](stores/evaluations.ts:14-15)
- [`stores/districts.ts`](stores/districts.ts:7)

**Implementation Steps**:
1. Create `services/database.ts`:
```typescript
import PouchDB from "pouchdb";

class DatabaseService {
  private static instances = new Map<string, PouchDB.Database>();
  
  static getDatabase(name: string): PouchDB.Database {
    if (!DatabaseService.instances.has(name)) {
      DatabaseService.instances.set(name, new PouchDB(name));
    }
    return DatabaseService.instances.get(name)!;
  }
  
  static getAllDatabases(): string[] {
    return Array.from(DatabaseService.instances.keys());
  }
  
  static clearCache(): void {
    DatabaseService.instances.clear();
  }
}

export const db = {
  get: (name: string) => DatabaseService.getDatabase(name),
};
```

2. Update stores:
```typescript
// stores/mentees.ts - Replace line 9
import { db } from '@/services/database';

const menteeDb = db.get(DatabaseNames.MENTEES);
```

**Testing**: 
- Verify all CRUD operations work
- Check for connection leaks
- Test in both web and Capacitor environments

---

### 2.2 Unified Sync Service

**Priority**: P1 - High
**Estimated Effort**: 6 hours
**Risk Level**: High
**Dependencies**: 2.1 (Database Service)

**Files to Create**:
- `services/syncService.ts`

**Files to Modify**:
- [`composables/useReplicateDB.ts`](composables/useReplicateDB.ts)
- [`composables/useManualSync.ts`](composables/useManualSync.ts)
- [`composables/useInitialSync.ts`](composables/useInitialSync.ts)
- [`stores/mentees.ts`](stores/mentees.ts:18-47)
- [`stores/evaluations.ts`](stores/evaluations.ts:21-50)

**Implementation Steps**:
1. Create `services/syncService.ts`:
```typescript
import { db } from './database';
import type { SyncResult, SyncDirection } from '@/interfaces/ISync';

interface SyncOptions {
  direction: SyncDirection;
  retry?: boolean;
  batchSize?: number;
}

class SyncService {
  private static instance: SyncService;
  private activeSyncs = new Map<string, Promise<SyncResult>>();
  private config = useRuntimeConfig();

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async sync(databaseName: string, options: SyncOptions): Promise<SyncResult> {
    if (this.activeSyncs.has(databaseName)) {
      console.log(`Sync already in progress for ${databaseName}`);
      return this.activeSyncs.get(databaseName)!;
    }

    const { direction, retry = true, batchSize = 50 } = options;
    const localDb = db.get(databaseName);
    const remoteUrl = `${this.config.public.couchDBUrl}/${databaseName}`;
    const remoteDb = db.get(remoteUrl);

    const syncPromise = this.performSync(localDb, remoteDb, {
      direction,
      retry,
      batchSize,
      create_target: false
    });

    this.activeSyncs.set(databaseName, syncPromise);

    try {
      return await syncPromise;
    } finally {
      this.activeSyncs.delete(databaseName);
    }
  }

  private async performSync(
    localDb: PouchDB.Database,
    remoteDb: PouchDB.Database,
    options: any
  ): Promise<SyncResult> {
    const stats = { pulled: 0, pushed: 0, conflicts: 0 };
    
    // Phase 1: Pull from remote
    if (options.direction === 'from' || options.direction === 'both') {
      await this.replicate(localDb, remoteDb, 'pull', options, stats);
    }
    
    // Phase 2: Push to remote
    if (options.direction === 'to' || options.direction === 'both') {
      await this.replicate(remoteDb, localDb, 'push', options, stats);
    }

    return { success: true, stats };
  }

  private async replicate(
    source: PouchDB.Database,
    target: PouchDB.Database,
    direction: 'pull' | 'push',
    options: any,
    stats: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const repl = source.replicate[direction](target, {
        live: false,
        retry: options.retry,
        batch_size: options.batchSize,
        batches_limit: 5,
        create_target: false
      });

      repl.on('change', (info: any) => {
        if (direction === 'pull') stats.pulled += info.docs_written;
        else stats.pushed += info.docs_written;
      });

      repl.on('complete', () => resolve());
      repl.on('error', (err: any) => reject(err));
    });
  }
}

export const syncService = SyncService.getInstance();
```

2. Update composables to use service:
```typescript
// composables/useManualSync.ts - Replace entire file
import { syncService } from '@/services/syncService';

export function useManualSync() {
  const sync = async (databaseName: string) => {
    return await syncService.sync(databaseName, { direction: 'both' });
  };
  
  return { sync };
}
```

**Testing**:
- Test sync in online/offline scenarios
- Verify conflict resolution
- Check data integrity after sync

---

### 2.3 State Management Refactoring

**Priority**: P1 - High
**Estimated Effort**: 4 hours
**Risk Level**: Medium
**Dependencies**: 2.1, 2.2

**Files to Modify**:
- [`stores/facilities.ts`](stores/facilities.ts)
- All stores using localStorage directly

**Implementation Steps**:
1. Create `composables/useLocalStorage.ts`:
```typescript
import { useStorage } from '@vueuse/core';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  return useStorage<T>(key, defaultValue);
}
```

2. Refactor [`stores/facilities.ts`](stores/facilities.ts):
```typescript
import { defineStore } from 'pinia';
import LocalStorageKeys from '@/constants/LocalStorageKeys';

export const useFacilitiesStore = defineStore('facilities', () => {
  const facilities = useLocalStorage<string[]>(
    LocalStorageKeys.FACILITIES_FOR_SELECTED_DISTRICT, 
    []
  );
  
  const selectedFacility = useLocalStorage<string>(
    LocalStorageKeys.SELECTED_FACILITY, 
    ''
  );

  const setFacilities = (facilityList: string[]) => {
    facilities.value = facilityList;
  };

  const setSelectedFacility = (facility: string) => {
    selectedFacility.value = facility;
  };

  return {
    facilities: readonly(facilities),
    selectedFacility: readonly(selectedFacility),
    setFacilities,
    setSelectedFacility
  };
});
```

**Testing**: Verify localStorage persistence works correctly

---

## Phase 3: Code Quality Improvements (Week 5-6)

### 3.1 Component Refactoring

**Priority**: P2 - Medium
**Estimated Effort**: 8 hours
**Risk Level**: Medium
**Dependencies**: Phase 2 complete

**Files to Modify**:
- [`components/forms/MainEvaluation.vue`](components/forms/MainEvaluation.vue) - 500+ lines

**Implementation Steps**:
1. Create new component structure:
```
components/forms/evaluation/
├── EvaluationContainer.vue      # Parent component (new)
├── EvaluationDatePicker.vue    # Extracted date picker
├── EvaluationItem.vue          # Extracted item component
├── ScoreSelector.vue           # Extracted score selector
├── PreviousScoreDisplay.vue    # Extracted previous score display
└── ProgressSummary.vue         # Extracted summary
```

2. Extract `components/forms/evaluation/ScoreSelector.vue`:
```vue
<script setup lang="ts">
interface Props {
  modelValue: number | undefined;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined];
}>();

const scoringOptions = [
  { description: '0 - The competency cannot be evaluated', score: 0, color: 'gray' },
  { description: '1 - Does not demonstrate competency', score: 1, color: 'red' },
  // ... rest of options
];

const updateScore = (value: number) => {
  emit('update:modelValue', value);
};
</script>
```

3. Update MainEvaluation.vue to use extracted components:
```vue
<script setup lang="ts">
// Import extracted components
import ScoreSelector from './evaluation/ScoreSelector.vue';
import PreviousScoreDisplay from './evaluation/PreviousScoreDisplay.vue';
</script>
```

**Testing**: 
- Verify all evaluation workflows still work
- Test score selection and persistence
- Check responsive behavior

---

### 3.2 Composable Pattern Fix

**Priority**: P2 - Medium
**Estimated Effort**: 3 hours
**Risk Level**: Low
**Dependencies**: 1.1

**Files to Modify**:
- [`composables/useManualSync.ts`](composables/useManualSync.ts:16)
- [`composables/useReplicateDB.ts`](composables/useReplicateDB.ts)

**Implementation Steps**:
1. Fix [`composables/useManualSync.ts`](composables/useManualSync.ts):
```typescript
// OLD: Returns Promise directly (wrong)
// NEW: Returns reactive composable

import { ref, readonly } from 'vue';

export function useManualSync() {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const lastResult = ref<SyncResult | null>(null);
  const syncProgress = ref<string>('');

  const sync = async (databaseName: string): Promise<SyncResult> => {
    isLoading.value = true;
    error.value = null;
    syncProgress.value = 'Starting sync...';
    
    try {
      syncProgress.value = 'Connecting to databases...';
      const result = await performSync(databaseName);
      lastResult.value = result;
      syncProgress.value = 'Sync complete';
      return result;
    } catch (e) {
      error.value = e as Error;
      syncProgress.value = 'Sync failed';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastResult: readonly(lastResult),
    syncProgress: readonly(syncProgress),
    sync
  };
}
```

**Testing**: Verify reactive state updates correctly

---

### 3.3 Route Handling Standardization

**Priority**: P2 - Medium
**Estimated Effort**: 2 hours
**Risk Level**: Low
**Dependencies**: None

**Files to Modify**:
- [`pages/dashboard.vue`](pages/dashboard.vue:11) - `navigateTo('/MonitoringPlatform/dashboard')`
- [`pages/MonitoringPlatform/dashboard.vue`](pages/MonitoringPlatform/dashboard.vue:17) - Uses Routes but inconsistent

**Implementation Steps**:
1. Audit all navigateTo calls:
```bash
grep -rn "navigateTo('" pages/
```

2. Replace hardcoded routes:
```typescript
// Instead of
navigateTo('/MonitoringPlatform/dashboard');

// Use
navigateTo(Routes.MONITORING_PLATFORM.path);
```

**Testing**: Verify all navigation works correctly

---

## Phase 4: Performance Optimization (Week 7-8)

### 4.1 Implement Data Caching

**Priority**: P2 - Medium
**Estimated Effort**: 4 hours
**Risk Level**: Low
**Dependencies**: Phase 2 complete

**Files to Create**:
- `composables/useCachedData.ts`

**Files to Modify**:
- All pages fetching data in onMounted

**Implementation Steps**:
1. Create caching composable:
```typescript
import { ref, readonly } from 'vue';

interface CacheOptions {
  ttl?: number;  // Time to live in milliseconds
  key?: string;  // Optional cache key
}

export function useCachedData<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const { ttl = 60000, key = 'default' } = options;
  
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const lastFetched = ref<number>(0);
  
  const isStale = () => Date.now() - lastFetched.value > ttl;
  
  const fetch = async (force = false) => {
    if (!force && data.value && !isStale()) {
      return data.value;
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      data.value = await fetcher();
      lastFetched.value = Date.now();
      return data.value;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };
  
  const invalidate = () => {
    data.value = null;
    lastFetched.value = 0;
  };
  
  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetch,
    invalidate
  };
}
```

2. Update pages to use caching:
```typescript
// pages/dashboard.vue
const { data: evaluations, isLoading, fetch: loadEvaluations } = useCachedData(
  () => useEvalData.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS),
  { ttl: 30000 }
);

onMounted(() => {
  loadEvaluations();
});
```

**Testing**: 
- Verify cache hits work correctly
- Test force refresh
- Check TTL expiration

---

### 4.2 Lazy Loading Implementation

**Priority**: P2 - Medium
**Estimated Effort**: 3 hours
**Risk Level**: Low
**Dependencies**: None

**Files to Modify**:
- `nuxt.config.ts`
- Route definitions

**Implementation Steps**:
1. Add to [`nuxt.config.ts`](nuxt.config.ts):
```typescript
export default defineNuxtConfig({
  routeRules: {
    // Static generation for public pages
    '/': { prerender: true },
    '/dashboard': { ssr: false },
    
    // Lazy load heavy routes
    '/ReportPlatform/**': { lazy: true },
    '/MonitoringPlatform/**': { lazy: true },
  },
  
  experimental: {
    payloadExtraction: true,
  }
})
```

2. Add component lazy loading:
```typescript
// In components
const HeavyChart = defineAsyncComponent(() => 
  import('@/components/charts/dashboard/Tools/Stacked.vue')
);
```

**Testing**: Verify chunks load correctly

---

### 4.3 Web Worker for Heavy Computations

**Priority**: P3 - Low
**Estimated Effort**: 6 hours
**Risk Level**: Medium
**Dependencies**: 1.1

**Files to Create**:
- `workers/reportAnalyzer.worker.ts`

**Files to Modify**:
- [`composables/useReportAnalysis.ts`](composables/useReportAnalysis.ts:328-362)

**Implementation Steps**:
1. Create web worker:
```typescript
// workers/reportAnalyzer.worker.ts
self.onmessage = (e: MessageEvent) => {
  const { scores, sessions } = e.data;
  
  const result = {
    scoreDistribution: calculateScoreDistribution(scores),
    categoryPerformance: calculateCategoryPerformance(scores),
    meanScore: calculateMeanScore(scores),
    trendAnalysis: sessions ? analyzeTrends(sessions) : null,
  };
  
  self.postMessage(result);
};

function calculateMeanScore(scores: number[]): number {
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// ... other computation functions
```

2. Update composable:
```typescript
import ReportWorker from '@/workers/reportAnalyzer.worker?worker';

export function useReportAnalysis() {
  const isComputing = ref(false);
  const worker = new ReportWorker();
  
  const generateReportAnalysis = async (
    scores: IEvalScore[],
    sessions?: SessionData[]
  ): Promise<ReportAnalysis> => {
    isComputing.value = true;
    
    return new Promise((resolve) => {
      worker.onmessage = (e) => {
        isComputing.value = false;
        resolve(e.data);
      };
      
      worker.onerror = (error) => {
        isComputing.value = false;
        console.error('Worker error:', error);
        // Fallback to main thread
        resolve(computeInMainThread(scores, sessions));
      };
      
      worker.postMessage({ scores, sessions });
    });
  };
  
  return { generateReportAnalysis, isComputing: readonly(isComputing) };
}
```

**Testing**: 
- Verify worker loads correctly
- Test fallback to main thread on error
- Check performance improvement

---

## Phase 5: Testing & Polish (Week 9-10)

### 5.1 Add Input Validation

**Priority**: P2 - Medium
**Estimated Effort**: 3 hours
**Risk Level**: Low
**Dependencies**: Phase 1 complete

**Files to Create**:
- `utils/sanitization.ts`

**Files to Modify**:
- Form components

**Implementation Steps**:
1. Create sanitization utility:
```typescript
// Install: npm i dompurify
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};
```

2. Apply to form components:
```typescript
const handleSubmit = () => {
  const sanitizedData = {
    ...formData,
    firstname: sanitizeInput(formData.firstname),
    notes: sanitizeHtml(formData.notes)
  };
};
```

**Testing**: Verify sanitization works correctly

---

### 5.2 Add Unit Tests

**Priority**: P2 - Medium
**Estimated Effort**: 8 hours
**Risk Level**: Low
**Dependencies**: Phase 1-3 complete

**Files to Create**:
- `__tests__/stores/*.spec.ts`
- `__tests__/composables/*.spec.ts`
- `__tests__/utils/*.spec.ts`

**Implementation Steps**:
1. Create test setup:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['__tests__/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

2. Create store tests:
```typescript
// __tests__/stores/mentees.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMenteeStore } from '@/stores/mentees';

describe('useMenteeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });
  
  it('should create a new mentee', async () => {
    const store = useMenteeStore();
    
    const result = await store.createMentee({
      firstname: 'John',
      lastname: 'Doe',
      gender: 'male',
      facility: 'Test Facility',
      profession: 'Nurse'
    });
    
    expect(result.ok).toBe(true);
  });
});
```

3. Create composable tests:
```typescript
// __tests__/composables/useReportAnalysis.spec.ts
import { describe, it, expect } from 'vitest';
import { useReportAnalysis } from '@/composables/useReportAnalysis';

describe('useReportAnalysis', () => {
  it('should calculate mean score correctly', () => {
    const { generateReportAnalysis } = useReportAnalysis();
    
    const scores = [
      { name: 'Item 1', score: 4 },
      { name: 'Item 2', score: 5 },
      { name: 'Item 3', score: 3 },
    ];
    
    const result = generateReportAnalysis(scores);
    
    expect(result.passFail.score).toBe(4);
  });
});
```

**Testing**: Run `npm run test` and achieve >70% coverage

---

## Priority Summary Table

| Priority | Issue | Effort | Risk | Dependencies |
|----------|-------|--------|------|--------------|
| P0 | TypeScript Strict Mode | 2h | Low | None |
| P0 | Hardcoded Credentials | 1h | Medium | None |
| P0 | Create Core Interfaces | 3h | Low | P0-1 |
| P1 | Centralized Error Handling | 2h | Low | P0-1 |
| P1 | Database Service | 4h | Medium | Phase 1 |
| P1 | Unified Sync Service | 6h | High | P1-2 |
| P1 | State Management Refactor | 4h | Medium | P1-2 |
| P2 | Component Refactoring | 8h | Medium | Phase 2 |
| P2 | Composable Pattern Fix | 3h | Low | P0-1 |
| P2 | Route Standardization | 2h | Low | None |
| P2 | Data Caching | 4h | Low | Phase 2 |
| P2 | Lazy Loading | 3h | Low | None |
| P3 | Web Worker | 6h | Medium | P0-1 |
| P2 | Input Validation | 3h | Low | Phase 1 |
| P2 | Unit Tests | 8h | Low | Phase 1-3 |

---

## Implementation Dependencies

```
Phase 1 (Week 1-2)
├── 1.1 TypeScript Config
├── 1.2 Security Fixes
└── 1.3 Core Interfaces

Phase 2 (Week 3-4)
├── 2.1 Database Service ← Requires Phase 1
└── 2.2 Sync Service ← Requires 2.1

Phase 3 (Week 5-6)
├── 3.1 Component Refactoring ← Requires Phase 2
├── 3.2 Composable Fix ← Requires Phase 1
└── 3.3 Route Standardization

Phase 4 (Week 7-8)
├── 4.1 Data Caching ← Requires Phase 2
└── 4.2 Lazy Loading

Phase 5 (Week 9-10)
├── 5.1 Input Validation ← Requires Phase 1
└── 5.2 Unit Tests ← Requires Phase 1-3
```

---

## Total Effort Estimate

| Phase | Hours |
|-------|-------|
| Phase 1: Foundation | 8h |
| Phase 2: Architecture | 18h |
| Phase 3: Code Quality | 13h |
| Phase 4: Performance | 13h |
| Phase 5: Testing | 11h |
| **Total** | **63h |

---

## Risk Mitigation Strategies

1. **High Risk Items (Sync Service)**: 
   - Implement feature flag for gradual rollout
   - Maintain backward compatibility during transition
   - Extensive testing in staging environment

2. **Database Service**:
   - Test thoroughly in both web and Capacitor environments
   - Ensure proper cleanup on app exit

3. **Web Worker**:
   - Provide fallback to main thread computation
   - Test on various device configurations
