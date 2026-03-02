# Utilities Documentation

This document provides detailed information about all utility functions in the NCD PenPlus application.

## Table of Contents

1. [Database Utilities](#database-utilities)
2. [Data Processing Utilities](#data-processing-utilities)
3. [ID Generation Utilities](#id-generation-utilities)
4. [Storage Utilities](#storage-utilities)

---

## Database Utilities

### pouchDbConnect.ts

**Location**: `utilities/pouchDbConnect.ts`

**Purpose**: Create PouchDB database connections

**Function Signature**:
```typescript
const pouchDBConnect = (dbName: string, options?: any) => PouchDB
```

**Features**:
- Local database connection
- Remote database connection with proxy support
- Capacitor native platform detection
- Custom fetch with authentication headers

**Usage**:
```typescript
import pouchDBConnect from '@/utilities/pouchDbConnect';

const localDB = pouchDBConnect('local_database');
const remoteDB = pouchDBConnect('http://server:5984/remote_db');
```

---

### ensureDatabaseExists.ts

**Location**: `utilities/ensureDatabaseExists.ts`

**Purpose**: Ensure a database exists before operations

**Function Signature**:
```typescript
const ensureDatabaseExists = async (dbName: string): Promise<void>
```

---

### testCouchDBConnection.ts

**Location**: `utilities/testCouchDBConnection.ts`

**Purpose**: Test connectivity to CouchDB server

**Function Signature**:
```typescript
const testCouchDBConnection = async (): Promise<boolean>
```

**Returns**: `true` if connection successful, `false` otherwise

---

## Data Processing Utilities

### processScores.ts

**Location**: `utilities/processScores.ts`

**Purpose**: Process and format evaluation scores for storage

**Function Signature**:
```typescript
const processScores = (tool: string | string[]): ProcessedScoreData
```

**Features**:
- Score calculation
- Data formatting
- Session management

---

### processEchoScores.ts

**Location**: `utilities/processEchoScores.ts`

**Purpose**: Process echocardiography evaluation scores

**Function Signature**:
```typescript
const processEchoScores = (): EchoScoreData
```

**Features**:
- Echo-specific score processing
- Cardiac evaluation data handling

---

## ID Generation Utilities

### generateID.ts

**Location**: `utilities/generateID.ts`

**Purpose**: Generate unique IDs for database documents

**Function Signature**:
```typescript
const generateID = (): string
```

**Returns**: UUID string

---

### generateRandomString.ts

**Location**: `utilities/generateRandomString.ts`

**Purpose**: Generate random strings for various purposes

**Function Signature**:
```typescript
const generateRandomString = (length: number): string
```

**Parameters**:
- `length`: Desired string length

---

## Storage Utilities

### cleanLocalStorage.ts

**Location**: `utilities/cleanLocalStorage.ts`

**Purpose**: Clean localStorage after evaluation completion

**Function Signature**:
```typescript
const cleanLocalStorage = (): void
```

**Features**:
- Removes temporary evaluation data
- Resets session state
- Cleans up local storage keys

---

## Array Utilities

### sumArray.ts

**Location**: `utilities/sumArray.ts`

**Purpose**: Calculate sum of array values

**Function Signature**:
```typescript
const sumArray = (arr: number[]): number
```

**Parameters**:
- `arr`: Array of numbers

**Returns**: Sum of all values

---

## String Utilities

### capitalizeFirstLetter.ts

**Location**: `utilities/capitalizeFirstLetter.ts`

**Purpose**: Capitalize first letter of a string

**Function Signature**:
```typescript
const capitalizeFirstLetter = (str: string): string
```

**Parameters**:
- `str`: Input string

**Returns**: String with first letter capitalized

---

## Usage Examples

### Database Connection

```typescript
import pouchDBConnect from '@/utilities/pouchDbConnect';

// Connect to local database
const db = pouchDBConnect('ncd_pen_scores');

// Query documents
const docs = await db.allDocs({ include_docs: true });
```

### Processing Scores

```typescript
import processScores from '@/utilities/processScores';

const scoreData = processScores('cardiac');
// Returns processed score object ready for storage
```

### ID Generation

```typescript
import generateID from '@/utilities/generateID';

const newId = generateID();
// Returns: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### LocalStorage Cleanup

```typescript
import cleanLocalStorage from '@/utilities/cleanLocalStorage';

// After successful evaluation submission
cleanLocalStorage();
// Removes all temporary evaluation data
```

---

## Constants

### DatabaseNames

**File**: `constants/DatabaseNames.ts`

```typescript
export default {
    DISTRICTS: 'ncd_pen_districts',
    COMENTORS: 'comentors',
    EVALUATIONS: 'ncd_pen_scores',
    INCOMPLETE_EVALUATIONS: 'ncd_pen_scores',
    COMPLETED_EVALUTATIONS: 'ncd_pen_scores',
    MENTEES: 'ncd_pen_providers',
    USERS: 'users',
}
```

### LocalStorageKeys

**File**: `constants/LocalStorageKeys.ts`

```typescript
export default {
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
}
```

### Routes

**File**: `constants/Routes.ts`

All application routes are defined here with path and name properties.

```typescript
export default {
    INDEX: { path: '/', title: 'Home' },
    DASHBOARD: { path: '/dashboard', title: 'Dashboard' },
    // ... more routes
}
```
