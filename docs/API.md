# API & Composables Documentation

This document provides detailed information about all Composables (Vue hooks) in the NCD PenPlus application.

## Table of Contents

1. [Database & Sync Composables](#database--sync-composables)
2. [Authentication Composables](#authentication-composables)
3. [Network Composables](#network-composables)
4. [Evaluation Composables](#evaluation-composables)
5. [Statistics Composables](#statistics-composables)
6. [Session Tracking Composables](#session-tracking-composables)
7. [Utility Composables](#utility-composables)

---

## Database & Sync Composables

### useReplicateDB.ts

**Location**: `composables/useReplicateDB.ts`

**Purpose**: Core database replication functionality between local PouchDB and remote CouchDB

**Parameters**:
- `databaseName` (string): Name of the database to sync
- `direction` ('from' | 'to'): Sync direction

**Returns**: Replication object with event handlers

**Key Features**:
- Prevents concurrent syncs on same database
- Configurable retry logic
- Event handlers for complete, denied, error, and change events

```typescript
const replication = await useReplicateDB('ncd_pen_scores', 'from');
```

---

### useReplicateFromCouchDB.ts

**Location**: `composables/useReplicateFromCouchDB.ts`

**Purpose**: Pull data from remote CouchDB to local PouchDB

---

### useReplicateToCouchDB.ts

**Location**: `composables/useReplicateToCouchDB.ts`

**Purpose**: Push data from local PouchDB to remote CouchDB

---

### useInitialSync.ts

**Location**: `composables/useInitialSync.ts`

**Purpose**: Perform initial synchronization when app starts

**Key Features**:
- Syncs all databases
- Handles multiple database sync
- Error handling

---

### useManualSync.ts

**Location**: `composables/useManualSync.ts`

**Purpose**: Manual sync trigger from UI

**Features**:
- User-initiated sync
- Progress tracking
- Status feedback

---

### useSyncAll.ts

**Location**: `composables/useSyncAll.ts`

**Purpose**: Sync all databases at once

---

### useSyncDB.ts

**Location**: `composables/useSyncDB.ts`

**Purpose**: Sync individual database

---

## Authentication Composables

### useUserDetails.ts

**Location**: `composables/useUserDetails.ts`

**Purpose**: Get current authenticated user details

**Returns**: User profile object

```typescript
const user = useUserDetails();
// Returns: { id, firstname, lastname, username, searchIndex }
```

---

## Network Composables

### useNetworkStatus.ts

**Location**: `composables/useNetworkStatus.ts`

**Purpose**: Monitor network connectivity

**Returns**:
- `isOnline` (boolean): Current network status
- `networkStatus` (ref): Reactive network status

**Features**:
- Real-time network monitoring
- Capacitor Network plugin integration

---

## Evaluation Composables

### useEvaluation.ts

**Location**: `composables/useEvaluation.ts`

**Purpose**: Manage evaluation data

---

### useScoreCount.ts

**Location**: `composables/useScoreCount.ts`

**Purpose**: Count and calculate scores

**Returns**: Score counts by category

---

### useScoreStatistics.ts

**Location**: `composables/useScoreStatistics.ts`

**Purpose**: Calculate basic score statistics

---

### useScoreSimpleStatistics.ts

**Location**: `composables/useScoreSimpleStatistics.ts`

**Purpose**: Simple statistical calculations

---

### useSessionMeanScore.ts

**Location**: `composables/useSessionMeanScore.ts`

**Purpose**: Calculate mean score for sessions

---

### useMostRecentToolItemData.ts

**Location**: `composables/useMostRecentToolItemData.ts`

**Purpose**: Get most recent evaluation data for a tool

---

### useProcessSession.ts

**Location**: `composables/useProcessSession.ts`

**Purpose**: Process session evaluation data

---

## Statistics Composables

### useEvaluationStats.ts

**Location**: `composables/useEvaluationStats.ts`

**Purpose**: Calculate evaluation statistics

**Returns**: Various statistics about evaluations

---

### useDashboardStats.ts

**Location**: `composables/useDashboardStats.ts`

**Purpose**: Calculate dashboard statistics

**Returns**: Summary statistics for dashboard display

---

### useReportAnalysis.ts

**Location**: `composables/useReportAnalysis.ts`

**Purpose**: Analyze and generate reports

**Returns**: Report data and analysis

---

### useFacilityMeans.ts

**Location**: `composables/useFacilityMeans.ts`

**Purpose**: Calculate facility average scores

---

### useNumResponsesPerTool.ts

**Location**: `composables/useNumResponsesPerTool.ts`

**Purpose**: Count responses per tool

---

### useImprovementsPerTool.ts

**Location**: `composables/useImprovementsPerTool.ts`

**Purpose**: Track improvement metrics per tool

---

## Session Tracking Composables

### useCountSessionsCompleted.ts

**Location**: `composables/useCountSessionsCompleted.ts`

**Purpose**: Count completed sessions

---

### useCountToolSessionsCompleted.ts

**Location**: `composables/useCountToolSessionsCompleted.ts`

**Purpose**: Count completed sessions per tool

---

### useCountDistrictSessionsCompleted.ts

**Location**: `composables/useCountDistrictSessionsCompleted.ts`

**Purpose**: Count completed sessions per district

---

### useCountFacilitySessionsCompleted.ts

**Location**: `composables/useCountFacilitySessionsCompleted.ts`

**Purpose**: Count completed sessions per facility

---

### useCountFacilityToolSessionsCompleted.ts

**Location**: `composables/useCountFacilityToolSessionsCompleted.ts`

**Purpose**: Count sessions for facility and tool combination

---

### useGenderSessionsCompleted.ts

**Location**: `composables/useGenderSessionsCompleted.ts`

**Purpose**: Count sessions by gender

---

## Utility Composables

### useHash.ts

**Location**: `composables/useHash.ts`

**Purpose**: Password hashing using bcrypt

**Function**: `bcryptHash(password: string)`

```typescript
const hashedPassword = await useHash('password123');
```

---

### useIconUrl.ts

**Location**: `composables/useIconUrl.ts`

**Purpose**: Generate icon URLs for tools

---

### useTools.ts

**Location**: `composables/useTools.ts`

**Purpose**: Get tool definitions and metadata

---

### useServerConfig.ts

**Location**: `composables/useServerConfig.ts`

**Purpose**: Get server configuration

---

### useProcessLocalStorage.ts

**Location**: `composables/useProcessLocalStorage.ts`

**Purpose**: Handle localStorage operations

**Methods**:
- `store(key, value)` - Store data
- `retrieve(key)` - Get data
- `remove(key)` - Remove data

---

### useDownloadEvaluations.ts

**Location**: `composables/useDownloadEvaluations.ts`

**Purpose**: Download evaluations as files

---

## Store API

### Auth Store (stores/auth.ts)

```typescript
const authStore = useAuthStore();

// State
authStore.user          // Current user
authStore.isLoggedIn    // Login status
authStore.isRegistered  // Registration status
authStore.isAuthenticated // Auth status

// Actions
authStore.registerUser(userData)
authStore.signIn(credentials)
authStore.signOut()
```

### Mentee Store (stores/mentees.ts)

```typescript
const menteeStore = useMenteeStore();

// State
menteeStore.mentees  // List of mentees

// Actions
menteeStore.fetchMentees()
menteeStore.fetchAllMentees(facility)
menteeStore.fetchDistrictMentees(district)
menteeStore.createMentee(data)
menteeStore.updateMentee(data)
menteeStore.deleteMentee(id, rev)
menteeStore.fetchMentee(id)
menteeStore.saveEvalMentee()
```

### Evaluations Store (stores/evaluations.ts)

```typescript
const evalStore = useEvalDataStore();

// State
evalStore.evaluationScores       // Current scores
evalStore.menteeEvalReportData   // Report data
evalStore.allEvaluationScores    // All evaluations

// Actions
evalStore.fetchEvaluationScores(dbName)
evalStore.storeScores(tool)
evalStore.createSessionEval()
evalStore.fetchUserEval(id)
evalStore.fetchDistrictEvaluations(district)
evalStore.fetchFacilityEvaluations(facility)
evalStore.fetchMenteeEvals(menteeId)
evalStore.fetchToolEvals(tool)
```

### Districts Store (stores/districts.ts)

```typescript
const districtStore = useDistrictStore();

// Actions
districtStore.fetchDistricts()
```

### Facilities Store (stores/facilities.ts)

```typescript
const facilityStore = useFacilityStore();

// Simple facility management
```
