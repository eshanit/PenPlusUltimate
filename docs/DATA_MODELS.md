# Data Models & Interfaces

This document provides detailed information about all TypeScript interfaces and data models in the NCD PenPlus application.

## Table of Contents

1. [Core Interfaces](#core-interfaces)
2. [User & Authentication](#user--authentication)
3. [Evaluation Data](#evaluation-data)
4. [Cardiac Evaluation](#cardiac-evaluation)
5. [Statistics Interfaces](#statistics-interfaces)
6. [Utility Interfaces](#utility-interfaces)

---

## Core Interfaces

### IScore

**File**: `interfaces/IScore.ts`

Represents an evaluation score document in the database.

```typescript
interface Score {
    _id: string;
    evaluationID: string;
    searchIndex: string;
    evaluator: IMasterUser;
    mentee: IMasterUser;
    tool: string | Array<string>;
    sessions: ISession;
    syncStatus?: 'pending' | 'success' | 'failed';
    lastSyncedAt?: number;
    createdAt?: string;
    updatedAt?: string;
}
```

**Fields**:
- `_id`: Unique document identifier
- `evaluationID`: Reference to evaluation
- `searchIndex`: Indexed search field
- `evaluator`: User who performed evaluation
- `mentee`: User being evaluated
- `tool`: Evaluation tool(s) used
- `sessions`: Session data (up to 5 sessions)
- `syncStatus`: Sync status with remote DB
- `lastSyncedAt`: Timestamp of last sync
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

---

### IFinalEvaluation

**File**: `interfaces/IFinalEvaluation.ts`

Represents a completed evaluation.

```typescript
interface FinalEvaluation {
    _id: string;
    evaluator: IMasterUser;
    evaluationID: string;
    mentee: IMasterUser;
    searchIndex: string;
    dateSaved: number;
    status: string;
    tool: string;
    sessions: ISession;
}
```

---

### ISession

**File**: `interfaces/ISession.ts`

Represents evaluation session data (up to 5 sessions per evaluation).

```typescript
interface Session {
    session_1: {
        evalDate: number;
        evalItemScores?: Array<IEvalScore> | null;
        cardiacEval?: ICardiacEval | null;
    } | null;
    session_2: { ... } | null;
    session_3: { ... } | null;
    session_4: { ... } | null;
    session_5: { ... } | null;
}
```

---

## User & Authentication

### IMasterUser

**File**: `interfaces/IMasterUser.ts`

Represents a user (evaluator or mentee).

```typescript
interface MasterUser {
    _id: string;
    _rev?: string;
    firstname: string;
    lastname: string;
    username?: string;
    password?: string;
    gender?: string;
    facility?: string;
    district?: string;
    profession?: string;
    searchIndex?: string;
    terms?: boolean;
    updatedAt?: number;
    updatedBy?: string;
}
```

---

## Evaluation Data

### IEvalScore

**File**: `interfaces/IEvalScore.ts`

Represents a single evaluation score.

```typescript
interface EvalScore {
    name: string;
    score: number;
    category?: string;
    item?: string;
    notes?: string;
}
```

**Fields**:
- `name`: Name of the evaluation item
- `score`: Numeric score value
- `category`: Category of the item
- `item`: Specific item evaluated
- `notes`: Additional notes

---

### ITools

**File**: `interfaces/ITools.ts`

Represents an evaluation tool.

```typescript
interface Tools {
    label: string;
    name: string;
    svg_path: string;
    description?: string;
    color?: string;
    category?: string;
}
```

---

### IToolEvaluation

**File**: `interfaces/IToolEvaluation.ts`

Represents tool evaluation metadata.

```typescript
interface ToolEvaluation {
    // Tool evaluation structure
}
```

---

## Cardiac Evaluation

### ICardiacEval

**File**: `interfaces/ICardiacEval.ts`

Represents cardiac evaluation data.

```typescript
interface CardiacEval {
    patientInfo?: {
        // Patient information
    };
    echoIndication?: {
        // Echo indication data
    };
    exam?: {
        // Examination results
    };
    imageQuality?: {
        // Image quality assessment
    };
    echoFindings?: {
        // Echo findings
    };
    primaryDiagnosis?: {
        // Diagnosis
    };
}
```

---

## Statistics Interfaces

### IEvaluationStats

**File**: `interfaces/IEvaluationStats.ts`

Represents evaluation statistics.

```typescript
interface EvaluationStats {
    totalEvaluations: number;
    completedSessions: number;
    averageScore: number;
    // Additional statistics
}
```

---

### IEvaluationCounts

**File**: `interfaces/IEvaluationCounts.ts`

Represents evaluation count data.

```typescript
interface EvaluationCounts {
    total: number;
    pending: number;
    completed: number;
    // Additional counts
}
```

---

## Utility Interfaces

### IDistrict

**File**: `interfaces/IDistrict.ts`

Represents a district.

```typescript
interface District {
    _id: string;
    name: string;
    // Additional district data
}
```

---

### ILocalStorage

**File**: `interfaces/ILocalStorage.ts`

Represents local storage data structure.

```typescript
interface LocalStorage {
    key: string;
    value: any;
}
```

---

## Database Documents

### Document Structure Example

```json
{
    "_id": "unique-id",
    "_rev": "revision-hash",
    "evaluator": {
        "_id": "user-id",
        "firstname": "John",
        "lastname": "Doe",
        "username": "johndoe"
    },
    "mentee": {
        "_id": "mentee-id",
        "firstname": "Jane",
        "lastname": "Smith",
        "facility": "Hospital A",
        "district": "District 1"
    },
    "tool": "cardiac",
    "sessions": {
        "session_1": {
            "evalDate": 1699900000000,
            "evalItemScores": [
                {
                    "name": "Item 1",
                    "score": 85,
                    "category": "Category A"
                }
            ]
        }
    },
    "syncStatus": "success",
    "lastSyncedAt": 1699900000000,
    "createdAt": "2023-11-01T00:00:00.000Z",
    "updatedAt": "2023-11-01T00:00:00.000Z"
}
```

---

## Sync Status Values

| Status | Description |
|--------|-------------|
| `pending` | Document created locally, not yet synced |
| `success` | Successfully synced to remote |
| `failed` | Sync failed, needs retry |

---

## Evaluation Session Structure

Each evaluation can have up to 5 sessions:

```
sessions
├── session_1 (required)
│   ├── evalDate: number
│   ├── evalItemScores: IEvalScore[] | null
│   └── cardiacEval: ICardiacEval | null
├── session_2 (optional)
├── session_3 (optional)
├── session_4 (optional)
└── session_5 (optional)
```

---

## LocalStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `profile` | object | Current user profile |
| `evaluationScores` | array | Current evaluation scores |
| `menteeEvalReportData` | object | Report generation data |
| `mentee` | object | Selected mentee |
| `district` | string | Selected district |
| `goingToFacility` | string | Selected facility |
| `Tool` | string | Selected tool |
| `Scores` | array | Scores data |
| `evaluationSession` | number | Current session number |
| `databaseScores` | object | Database score document |
