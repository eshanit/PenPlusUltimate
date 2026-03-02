# Code Cleanup Report: NCD PenPlus

## Overview

This document provides a comprehensive list of redundant files, unused code, duplicate pages, dead code, unnecessary dependencies, and cleanup opportunities identified in the NCD PenPlus codebase.

---

## 1. Files Recommended for Deletion

### 1.1 Backup/Copy Files

| File Path | Reason | Action |
|-----------|--------|--------|
| `composables/useManualSync copy.ts` | Duplicate backup file | **DELETE** |
| `pages/MonitoringPlatform/planning/preview/index copy.vue` | Backup copy | **DELETE** |
| `data/evaluationItemData_og.js` | Original backup file | **DELETE** |

### 1.2 Unused Directories

| Directory | Reason | Action |
|-----------|--------|--------|
| `192.168.1.241/` | Network config, not used in project | **DELETE** |
| `host/` | Unknown purpose, appears unused | **Investigate then DELETE** |
| `test/` | Old test directory (use `tests/` instead) | **DELETE** |

### 1.3 Duplicate Test Setup Files

| File | Issue | Action |
|------|-------|--------|
| `tests/setup.ts` | Duplicate of root setup | Consolidate |

---

## 2. Duplicate Pages (Investigate & Consolidate)

### 2.1 Report Pages

| Primary Location | Duplicate Location | Recommendation |
|-----------------|-------------------|----------------|
| `pages/ReportPlatform/reporting/districts/` | `pages/reports/` | Consolidate to one location |
| `pages/ReportPlatform/reporting/mentees/` | `pages/reports/` | Consolidate to one location |
| `pages/ReportPlatform/reporting/facilities/` | `pages/reports/` | Consolidate to one location |

### 2.2 Score Pages

| Primary Location | Duplicate Location | Recommendation |
|-----------------|-------------------|----------------|
| `pages/MonitoringPlatform/scores/list.vue` | `pages/scores/list.vue` | Consolidate |
| `pages/MonitoringPlatform/scores/[id].vue` | `pages/scores/[id].vue` | Consolidate |

---

## 3. Similar Components (Consider Consolidation)

### 3.1 Chart Components

| Component | Similar To | Recommendation |
|-----------|------------|----------------|
| `components/charts/dashboard/Facilities/Stacked.vue` | `StackedPerc.vue` | Combine with prop |
| `components/charts/dashboard/Tools/Stacked.vue` | `StackedPerc.vue` | Combine with prop |
| `components/charts/districts/EvaluationsSessionMixedCopy.vue` | Others | Rename or DELETE |
| `components/charts/districts/FacilitySessions.vue` | `FacilitySessionsPie.vue` | OK (different types) |
| `components/charts/districts/FacilityEvaluations.vue` | `FacilityEvaluationsPie.vue` | OK (different types) |

### 3.2 Shared Chart Components

| Component | Status |
|-----------|--------|
| `components/charts/Shared/Pie.vue` | May be reusable - keep |

---

## 4. Unused or Underutilized Composables

### 4.1 Sync Composables (Potential Consolidation)

| Composable | Current Status | Recommendation |
|------------|----------------|----------------|
| `useReplicateFromCouchDB.ts` | May duplicate service | Keep for now |
| `useReplicateToCouchDB.ts` | May duplicate service | Keep for now |
| `useSyncAll.ts` | May duplicate service | Keep for now |
| `useSyncDB.ts` | May duplicate service | Keep for now |

### 4.2 Statistics Composables (Consider Combining)

| Composable | Similar To | Recommendation |
|------------|-----------|----------------|
| `useScoreStatistics.ts` | `useScoreSimpleStatistics.ts` | May combine |
| `useScoreCount.ts` | `useScoreSimpleStatistics.ts` | May overlap |

---

## 5. Unused Utilities

### 5.1 Utilities Directory vs Utils

The project has both `utilities/` and `utils/` directories. Consider consolidating:

| File | Location | Status |
|------|----------|--------|
| `utilities/capitalizeFirstLetter.ts` | utilities/ | Check if used |
| `utilities/cleanLocalStorage.ts` | utilities/ | Check if used |
| `utilities/ensureDatabaseExists.ts` | utilities/ | Check if used |
| `utilities/generateID.ts` | utilities/ | Check if used |
| `utilities/generateRandomString.ts` | utilities/ | Check if used |
| `utilities/pouchDbConnect.ts` | utilities/ | Check if used |
| `utilities/processEchoScores.ts` | utilities/ | Check if used |
| `utilities/processScores.ts` | utilities/ | Check if used |
| `utilities/sumArray.ts` | utilities/ | Check if used |
| `utilities/testCouchDBConnection.ts` | utilities/ | Check if used |
| `utils/errorHandler.ts` | utils/ | Keep (new) |

---

## 6. Unnecessary Dependencies

### 6.1 Check Package Usage

Run to find unused dependencies:

```bash
npm install -g depcheck
depcheck
```

### 6.2 Dependencies to Review

| Package | Notes |
|---------|-------|
| `hash-wasm` | Check if using for bcrypt |
| `ag-grid-community` | Large - check if all features used |
| `pouchdb-authentication` | Check if auth is used |

---

## 7. Dead Code Patterns to Remove

### 7.1 Comments

Search for and remove:
- Old commented-out code blocks
- TODO comments that are resolved
- `#if 0` or `#ifdef` style blocks

### 7.2 Unused Imports

Check files for:
- Imported but never used functions
- Imported components not rendered
- Imported types not used

---

## 8. iOS Build Artifacts

### 8.1 Files to Ignore/Delete

The `ios/` directory contains build artifacts:

```
ios/App/App/public/_nuxt/
```

These are generated files and should not be in version control. Add to `.gitignore`:

```
ios/App/App/public/_nuxt/
ios/App/App/public/cordova.js
ios/App/App/public/cordova_plugins.js
```

---

## 9. Cleanup Action Items

### High Priority (Safe to Delete Now)

```bash
# Delete backup files
rm composables/useManualSync\ copy.ts
rm pages/MonitoringPlatform/planning/preview/index\ copy.vue
rm data/evaluationItemData_og.js

# Delete unused directories
rm -rf 192.168.1.241/
rm -rf host/
rm -rf test/
```

### Medium Priority (Investigate First)

1. Review duplicate pages in `pages/reports/` vs `pages/ReportPlatform/reporting/`
2. Check if `utilities/` files are used, then consolidate to `utils/`
3. Run `depcheck` to find unused dependencies

### Low Priority (Nice to Have)

1. Consolidate similar chart components
2. Add iOS build artifacts to `.gitignore`
3. Remove unused imports with ESLint

---

## 10. Summary Statistics

| Category | Count |
|----------|-------|
| Files recommended for deletion | 7 |
| Duplicate page sets | 3 |
| Component pairs to evaluate | 5 |
| Directories to consolidate | 2 |

---

*Generated as part of NCD PenPlus codebase analysis*
