# NCD PenPlus - Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Configuration](#configuration)
5. [Database Architecture](#database-architecture)
6. [Core Features](#core-features)
7. [API & Routes](#api--routes)
8. [Components](#components)
9. [Composables](#composables)
10. [State Management](#state-management)
11. [Data Models](#data-models)
12. [Testing](#testing)
13. [Mobile App Configuration](#mobile-app-configuration)
14. [Development Guide](#development-guide)

---

## Project Overview

**NCD PenPlus** is a comprehensive healthcare evaluation and monitoring platform built with Nuxt.js 3 and Vue.js 3. The application is designed for healthcare workers to evaluate mentees (healthcare providers) on various medical tools and competencies, particularly in the context of Non-Communicable Diseases (NCD) healthcare delivery.

### Key Capabilities

- **Offline-First Architecture**: Uses PouchDB for local storage with CouchDB synchronization
- **Multi-Tool Evaluation**: Supports multiple evaluation tools (Cardiac, Echo, etc.)
- **Multi-Session Support**: Up to 5 evaluation sessions per mentee
- **Dashboard & Reporting**: Comprehensive analytics and reporting features
- **Mobile-Ready**: Can be packaged as Android/iOS app via Capacitor

---

## Technology Stack

### Core Framework

- **Nuxt.js 3** - Vue.js framework with SSR disabled (SPA mode)
- **Vue.js 3** - Composition API with TypeScript
- **TypeScript** - Type-safe JavaScript

### State Management

- **Pinia** - Vue.js store (via `@pinia/nuxt`)

### Database

- **PouchDB** - Local browser database
- **CouchDB** - Remote database for synchronization
- **pouchdb-find** - Query plugin for PouchDB
- **pouchdb-authentication** - User authentication

### UI & Components

- **@nuxt/ui** - UI component library (v2.19.2)
- **VueUse** - Composition utilities (@vueuse/core)
- **AG Grid** - Data tables (ag-grid-community, ag-grid-vue3)
- **ApexCharts** - Charts (vue3-apexcharts)

### Form & Validation

- **VeeValidate** - Form validation (@vee-validate/nuxt)
- **Yup** - Schema validation

### Mobile

- **Capacitor** - Native mobile app wrapper (@capacitor/core, @capacitor/android, @capacitor/ios)
- **@capacitor/network** - Network status detection

### Utilities

- **date-fns** - Date manipulation
- **simple-statistics** - Statistical calculations
- **hash-wasm** - Password hashing (bcrypt)
- **uuid** - Unique ID generation

---

## Project Structure

```
PenPlusUltimate/
├── android/                    # Android native app files
├── assets/                    # Static assets (images, icons, CSS)
├── components/                # Vue components
│   ├── cards/                 # Card components
│   ├── charts/                # Chart components
│   ├── forms/                 # Form components
│   ├── Report/                # Report components
│   ├── shared/                # Shared/common components
│   └── tables/                # Table components
├── composables/               # Vue composables (hooks)
├── constants/                  # Application constants
├── data/                      # Static data files
├── docs/                      # Documentation
├── interfaces/                # TypeScript interfaces
├── layouts/                   # Nuxt layouts (currently empty)
├── pages/                     # Nuxt pages (routes)
│   ├── MonitoringPlatform/    # Main monitoring platform
│   ├── ReportPlatform/        # Reporting platform
│   └── scores/                # Score management
├── plugins/                   # Nuxt plugins
├── public/                    # Public static files
├── server/                    # Server-side files
├── stores/                    # Pinia stores
├── test/                     # Test files
├── tests/                    # Additional test files
├── types/                    # TypeScript type definitions
├── utilities/                # Utility functions
├── .env                      # Environment variables
├── capacitor.config.ts       # Capacitor configuration
├── nuxt.config.ts            # Nuxt configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

---

## Configuration

### Environment Variables (.env)

```env
DATA_BASE_URL=http://penplus-monitoring.solidarmed.net:5984
DATA_BASE_USERNAME=admin
DATA_BASE_PSWD=1234
```

### Nuxt Configuration (nuxt.config.ts)

Key configurations:
- **SSR**: Disabled (SPA mode)
- **Modules**: Pinia, Nuxt UI, VeeValidate, Nuxt Icons, Nuxt Image
- **Proxy**: CouchDB proxy configured for API communication
- **Dev Server**: Host 0.0.0.0, Port 3000

### Capacitor Configuration (capacitor.config.ts)

```typescript
{
  appId: 'net.solidarmed.app',
  appName: 'NCD PenPlus',
  webDir: '.output/public',
  server: {
    androidScheme: 'http',
    cleartext: true
  }
}
```

---

## Database Architecture

### Database Names

Defined in [`constants/DatabaseNames.ts`](constants/DatabaseNames.ts):

| Database | Purpose |
|----------|---------|
| `ncd_pen_districts` | District information |
| `comentors` | Mentors/comentors data |
| `ncd_pen_scores` | Evaluation scores |
| `ncd_pen_providers` | Mentee/provider information |
| `users` | User accounts |

### Sync Strategy

- **Local**: PouchDB (browser/local storage)
- **Remote**: CouchDB server
- **Direction**: Bidirectional replication (from/to)
- **Conflict Resolution**: Last-write-wins with retry logic

---

## Core Features

### 1. Authentication

- User login
- Master registration and password support (123356)
- Password hashing with bcrypt
- Session management via cookies

### 2. Evaluation System

- Multiple evaluation tools:
  - Cardiac evaluation
  - Echo evaluation
  - General tool evaluations
- 5 session slots per evaluation
- Score calculation and statistics

### 3. Planning Module

- District management
- Facility management
- Mentee (provider) management
- Create, update, delete operations

### 4. Reporting & Analytics

- District-level reporting
- Facility-level reporting
- Mentee-level reporting
- Tool-based statistics
- Interactive charts

### 5. Synchronization

- Manual sync trigger
- Background sync with debouncing
- Sync status tracking (pending/success/failed)
- Offline support

---

## API & Routes

### Application Routes

Defined in [`constants/Routes.ts`](constants/Routes.ts):

| Route | Path | Description |
|-------|------|-------------|
| INDEX | `/` | Home/Login page |
| DASHBOARD | `/dashboard` | Main dashboard |
| START_EVALUATION | `/startEvaluating` | Start evaluation |
| DISTRICTS | `/MonitoringPlatform/planning/districts/list` | District list |
| FACILITIES | `/MonitoringPlatform/planning/facilities/list` | Facility list |
| MENTEES | `/MonitoringPlatform/planning/mentees/list` | Mentee list |
| PREVIEW | `/MonitoringPlatform/planning/preview` | Evaluation preview |
| EVALUATION_TOOL | `/MonitoringPlatform/evaluation/tool` | Tool evaluation |
| SCORES | `/scores/list` | Score list |
| MONITORING_PLATFORM | `/MonitoringPlatform/dashboard` | Monitoring dashboard |
| REPORT_PLATFORM | `/ReportPlatform/dashboard` | Report dashboard |

### LocalStorage Keys

Defined in [`constants/LocalStorageKeys.ts`](constants/LocalStorageKeys.ts):

- `PROFILE` - User profile data
- `EVALUATION_SCORES` - Current evaluation scores
- `MENTEE_EVALUATION_REPORT_DATA` - Report data
- `EVALUATED_MENTEE` - Selected mentee
- `DISTRICT` - Selected district
- `SELECTED_FACILITY` - Selected facility
- `TOOL` - Selected tool
- `EVALUATION_SESSION` - Current session number
- `DATABASE_SCORE` - Database score document

---

## Components

### Cards Components

- [`components/cards/CompetantScores.vue`](components/cards/CompetantScores.vue) - Displays competent scores

### Charts Components

- **Dashboard Charts** (`components/charts/dashboard/`)
  - `Facilities/Stacked.vue` - Stacked facility chart
  - `Facilities/StackedPerc.vue` - Percentage stacked chart
  - `Tools/Stacked.vue` - Tool evaluation stacked chart
  
- **District Charts** (`components/charts/districts/`)
  - `EvaluationsBar.vue` - Bar chart
  - `EvaluationsPie.vue` - Pie chart
  - `FacilityEvaluations.vue` - Facility comparison
  - `FacilitySessions.vue` - Session data

- **Mentee Charts** (`components/charts/Mentee/`)
  - `ScorePie.vue` - Score distribution

### Form Components

- [`components/forms/CreateMentee.vue`](components/forms/CreateMentee.vue) - Create mentee form
- [`components/forms/UpdateMentee.vue`](components/forms/UpdateMentee.vue) - Update mentee form
- [`components/forms/Login.vue`](components/forms/Login.vue) - Login form
- [`components/forms/Register.vue`](components/forms/Register.vue) - Registration form
- [`components/forms/MainEvaluation.vue`](components/forms/MainEvaluation.vue) - Main evaluation form
- [`components/forms/EvaluationItem.vue`](components/forms/EvaluationItem.vue) - Single evaluation item
- [`components/forms/EvaluationSummary.vue`](components/forms/EvaluationSummary.vue) - Evaluation summary

- **Cardiac Forms** (`components/forms/cardiac/`)
  - `EchoFindings.vue` - Echo findings form
  - `EchoIndication.vue` - Echo indication form
  - `Exam.vue` - Examination form
  - `ImageQuality.vue` - Image quality form
  - `PatientInformation.vue` - Patient info form
  - `PrimaryDiagnosis.vue` - Diagnosis form

### Table Components

- [`components/tables/mentees.vue`](components/tables/mentees.vue) - Mentee table
- [`components/tables/evaluations.vue`](components/tables/evaluations.vue) - Evaluations table
- [`components/tables/districts.vue`](components/tables/districts.vue) - Districts table
- [`components/tables/facilities.vue`](components/tables/facilities.vue) - Facilities table
- [`components/tables/toolScoreCounts.vue`](components/tables/toolScoreCounts.vue) - Tool scores

- **AG Grid Tables** (`components/tables/AGtables/`)
  - `Dashboard/FacilityEvaluations.vue`
  - `Dashboard/ToolEvaluations.vue`
  - `Districts/FSessionEvals.vue`
  - `Districts/ToolScores.vue`
  - `Mentees/AllList.vue`
  - `Mentees/List.vue`

### Shared Components

- [`components/shared/NavBar.vue`](components/shared/NavBar.vue) - Navigation bar
- [`components/shared/BorderedNavBar.vue`](components/shared/BorderedNavBar.vue) - Bordered navbar
- [`components/shared/OnlineStatus.vue`](components/shared/OnlineStatus.vue) - Network status indicator
- [`components/shared/PrintButton.vue`](components/shared/PrintButton.vue) - Print button
- [`components/shared/ScoreCards.vue`](components/shared/ScoreCards.vue) - Score display cards
- [`components/shared/TwCard.vue`](components/shared/TwCard.vue) - Tailwind card wrapper

### Report Components

- [`components/Report/MenteeEvals.vue`](components/Report/MenteeEvals.vue) - Mentee evaluation report

---

## Composables

### Authentication & User

- [`composables/useUserDetails.ts`](composables/useUserDetails.ts) - Get current user details

### Database & Sync

- [`composables/useReplicateDB.ts`](composables/useReplicateDB.ts) - Core replication logic
- [`composables/useReplicateFromCouchDB.ts`](composables/useReplicateFromCouchDB.ts) - Pull from remote
- [`composables/useReplicateToCouchDB.ts`](composables/useReplicateToCouchDB.ts) - Push to remote
- [`composables/useInitialSync.ts`](composables/useInitialSync.ts) - Initial database sync
- [`composables/useManualSync.ts`](composables/useManualSync.ts) - Manual sync trigger
- [`composables/useSyncAll.ts`](composables/useSyncAll.ts) - Sync all databases
- [`composables/useSyncDB.ts`](composables/useSyncDB.ts) - Individual DB sync

### Network

- [`composables/useNetworkStatus.ts`](composables/useNetworkStatus.ts) - Network connectivity

### Evaluation & Scoring

- [`composables/useEvaluation.ts`](composables/useEvaluation.ts) - Evaluation data
- [`composables/useScoreCount.ts`](composables/useScoreCount.ts) - Score counting
- [`composables/useScoreStatistics.ts`](composables/useScoreStatistics.ts) - Basic statistics
- [`composables/useScoreSimpleStatistics.ts`](composables/useScoreSimpleStatistics.ts) - Simple stats
- [`composables/useSessionMeanScore.ts`](composables/useSessionMeanScore.ts) - Session average
- [`composables/useMostRecentToolItemData.ts`](composables/useMostRecentToolItemData.ts) - Recent tool data
- [`composables/useProcessSession.ts`](composables/useProcessSession.ts) - Process session data

### Statistics & Analysis

- [`composables/useEvaluationStats.ts`](composables/useEvaluationStats.ts) - Evaluation statistics
- [`composables/useDashboardStats.ts`](composables/useDashboardStats.ts) - Dashboard statistics
- [`composables/useReportAnalysis.ts`](composables/useReportAnalysis.ts) - Report analysis
- [`composables/useFacilityMeans.ts`](composables/useFacilityMeans.ts) - Facility averages
- [`composables/useNumResponsesPerTool.ts`](composables/useNumResponsesPerTool.ts) - Response counts
- [`composables/useImprovementsPerTool.ts`](composables/useImprovementsPerTool.ts) - Improvement tracking

### Session & Count Tracking

- [`composables/useCountSessionsCompleted.ts`](composables/useCountSessionsCompleted.ts) - Completed sessions
- [`composables/useCountToolSessionsCompleted.ts`](composables/useCountToolSessionsCompleted.ts) - Tool sessions
- [`composables/useCountDistrictSessionsCompleted.ts`](composables/useCountDistrictSessionsCompleted.ts) - District sessions
- [`composables/useCountFacilitySessionsCompleted.ts`](composables/useCountFacilitySessionsCompleted.ts) - Facility sessions
- [`composables/useCountFacilityToolSessionsCompleted.ts`](composables/useCountFacilityToolSessionsCompleted.ts) - Facility tool sessions
- [`composables/useGenderSessionsCompleted.ts`](composables/useGenderSessionsCompleted.ts) - Gender-based sessions

### Utilities

- [`composables/useHash.ts`](composables/useHash.ts) - Password hashing
- [`composables/useIconUrl.ts`](composables/useIconUrl.ts) - Icon URL generation
- [`composables/useTools.ts`](composables/useTools.ts) - Tool definitions
- [`composables/useServerConfig.ts`](composables/useServerConfig.ts) - Server configuration
- [`composables/useProcessLocalStorage.ts`](composables/useProcessLocalStorage.ts) - LocalStorage operations
- [`composables/useDownloadEvaluations.ts`](composables/useDownloadEvaluations.ts) - Download evaluations
- [`composables/useCachedData.ts`](composables/useCachedData.ts) - TTL-based data caching
- [`composables/useLocalStorage.ts`](composables/useLocalStorage.ts) - Type-safe localStorage
- [`composables/useSanitization.ts`](composables/useSanitization.ts) - Input sanitization (XSS prevention)

### Services

- [`services/database.ts`](services/database.ts) - Singleton database service with connection pooling
- [`services/syncService.ts`](services/syncService.ts) - Unified bidirectional sync service

### Utilities (Non-Composables)

- [`utils/errorHandler.ts`](utils/errorHandler.ts) - Centralized error handling

---

## State Management

### Pinia Stores

#### [`stores/auth.ts`](stores/auth.ts)

Authentication store managing user sessions:
- `user` - Current user object
- `isLoggedIn` - Login status
- `isRegistered` - Registration status
- `isAuthenticated` - Authentication status
- `registerUser()` - Register new user
- `signIn()` - User login
- `signOut()` - User logout

#### [`stores/mentees.ts`](stores/mentees.ts)

Mentee (provider) management:
- `mentees` - Mentee list
- `fetchMentees()` - Get all mentees
- `fetchAllMentees()` - Get mentees by facility
- `fetchDistrictMentees()` - Get mentees by district
- `createMentee()` - Create new mentee
- `updateMentee()` - Update existing mentee
- `deleteMentee()` - Delete mentee
- `saveEvalMentee()` - Save selected mentee for evaluation

#### [`stores/evaluations.ts`](stores/evaluations.ts)

Evaluation and scoring:
- `evaluationScores` - Current evaluation scores
- `menteeEvalReportData` - Report data
- `allEvaluationScores` - All stored evaluations
- `fetchEvaluationScores()` - Get evaluations
- `storeScores()` - Save new evaluation
- `createSessionEval()` - Add session evaluation
- `fetchUserEval()` - Get single evaluation
- `fetchDistrictEvaluations()` - Filter by district
- `fetchFacilityEvaluations()` - Filter by facility
- `fetchMenteeEvals()` - Filter by mentee
- `fetchToolEvals()` - Filter by tool

#### [`stores/districts.ts`](stores/districts.ts)

District management:
- `fetchDistricts()` - Get all districts

#### [`stores/facilities.ts`](stores/facilities.ts)

Facility management:
- Simple facility store

---

## Data Models

### TypeScript Interfaces

#### [`interfaces/IScore.ts`](interfaces/IScore.ts)

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

#### [`interfaces/IFinalEvaluation.ts`](interfaces/IFinalEvaluation.ts)

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

#### [`interfaces/ISession.ts`](interfaces/ISession.ts)

```typescript
interface Session {
    session_1: { evalDate: number, evalItemScores?: Array<IEvalScore> | null, cardiacEval?: ICardiacEval | null } | null;
    session_2: { evalDate: number, evalItemScores?: Array<IEvalScore> | null, cardiacEval?: ICardiacEval | null } | null;
    session_3: { evalDate: number, evalItemScores?: Array<IEvalScore> | null, cardiacEval?: ICardiacEval | null } | null;
    session_4: { evalDate: number, evalItemScores?: Array<IEvalScore> | null, cardiacEval?: ICardiacEval | null } | null;
    session_5: { evalDate: number, evalItemScores?: Array<IEvalScore> | null, cardiacEval?: ICardiacEval | null } | null;
}
```

#### [`interfaces/IEvalScore.ts`](interfaces/IEvalScore.ts)

```typescript
interface EvalScore {
    name: string;
    score: number;
    category?: string;
    item?: string;
    notes?: string;
}
```

#### [`interfaces/ITools.ts`](interfaces/ITools.ts)

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

## Testing

### Test Framework

The project uses **Vitest** for unit testing with **jsdom** for DOM testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test

# Run tests once
npm run test:run
```

### Test Files

Test files are located in the `tests/` directory:

| Test File | Description |
|-----------|-------------|
| `tests/composables/useSanitization.test.ts` | Tests for input sanitization composable |
| `tests/composables/useCachedData.test.ts` | Tests for data caching composable |
| `tests/composables/useLocalStorage.test.ts` | Tests for localStorage composable |
| `tests/utils/errorHandler.test.ts` | Tests for error handling utility |

### Test Coverage

The project includes **31 passing tests** covering:

- Input sanitization (XSS prevention)
- Data caching with TTL
- LocalStorage operations
- Error handling

---

## Mobile App Configuration

### Android Setup

The project includes full Android configuration:

- **App ID**: `net.solidarmed.app`
- **App Name**: `NCD PenPlus`
- **Web Directory**: `.output/public`

### Building for Android

```bash
# Build the Nuxt app
npm run build

# Add Android platform
npx cap add android

# Sync with Android
npx cap sync

# Open in Android Studio
npx cap open android
```

---

## Development Guide

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development Server

```bash
# Start development server
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
# Build for production
npm run build
# or
yarn build
```

### Running Tests

```bash
# Run tests
npm run test

# Run tests once
npm run test:run
```

### Environment Setup

1. Copy `.env` file and configure:
   - `DATA_BASE_URL` - CouchDB server URL
   - `DATA_BASE_USERNAME` - Database username
   - `DATA_BASE_PSWD` - Database password

2. Ensure CouchDB is accessible and databases are created

---

## Additional Resources

- [Nuxt.js Documentation](https://nuxt.com/docs)
- [Vue.js Documentation](https://vuejs.org/guide/)
- [PouchDB Documentation](https://pouchdb.com/docs/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

## License

This project is proprietary software developed by Solidarmed for the NCD PenPlus healthcare monitoring program.
