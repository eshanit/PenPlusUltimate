# Pages & Routes Documentation

This document provides detailed information about all pages and routes in the NCD PenPlus application.

## Table of Contents

1. [Root Pages](#root-pages)
2. [Monitoring Platform](#monitoring-platform)
3. [Report Platform](#report-platform)
4. [Scores Module](#scores-module)
5. [Reports Module](#reports-module)

---

## Root Pages

### index.vue

**Path**: `/`

**Description**: Home/Login page - Entry point for the application

**Features**:
- User login
- Navigation to registration

---

### dashboard.vue

**Path**: `/dashboard`

**Description**: Main dashboard after login

**Features**:
- Overview statistics
- Quick navigation
- Recent activity

---

### register.vue

**Path**: `/register`

**Description**: User registration page

**Features**:
- New user registration form
- Terms acceptance

---

### settings.vue

**Path**: `/settings`

**Description**: Application settings

**Features**:
- Configuration options
- User preferences

---

### startEvaluating.vue

**Path**: `/startEvaluating`

**Description**: Start new evaluation workflow

**Features**:
- Select mentee
- Select tool
- Begin evaluation

---

### sync-report.vue

**Path**: `/sync-report`

**Description**: Sync status and report

**Features**:
- Sync progress
- Sync history
- Error reporting

---

### syncing.vue

**Path**: `/syncing`

**Description**: Active synchronization page

**Features**:
- Real-time sync status
- Progress indicators

---

## Monitoring Platform

### Main Dashboard

**Path**: `/MonitoringPlatform/dashboard`

**Description**: Monitoring platform main dashboard

---

### Planning Module

#### Districts List

**Path**: `/MonitoringPlatform/planning/districts/list`

**Description**: List and manage districts

#### Facilities List

**Path**: `/MonitoringPlatform/planning/facilities/list`

**Description**: List and manage facilities

#### Mentees List

**Path**: `/MonitoringPlatform/planning/mentees/list`

**Description**: List and manage mentees/providers

#### Mentee Create

**Path**: `/MonitoringPlatform/planning/mentees/create`

**Description**: Create new mentee

#### Mentee Update

**Path**: `/MonitoringPlatform/planning/mentees/update`

**Description**: Update existing mentee

#### Preview

**Path**: `/MonitoringPlatform/planning/preview`

**Description**: Preview evaluation before submission

---

### Evaluation Module

#### Tool Evaluation

**Path**: `/MonitoringPlatform/evaluation/tool`

**Description**: Main evaluation tool page

**Dynamic Routes**:
- `/MonitoringPlatform/evaluation/[tool]/index` - Tool-specific evaluation
- `/MonitoringPlatform/evaluation/[tool]/cardiac` - Cardiac evaluation
- `/MonitoringPlatform/evaluation/[tool]/echo` - Echo evaluation
- `/MonitoringPlatform/evaluation/[tool]/preview` - Evaluation preview
- `/MonitoringPlatform/evaluation/[tool]/preview_echo` - Echo preview
- `/MonitoringPlatform/evaluation/[tool]/success` - Success page after submission

---

### Syncing

**Path**: `/MonitoringPlatform/syncing`

**Description**: Sync status and management

---

## Report Platform

### Main Dashboard

**Path**: `/ReportPlatform/dashboard`

**Description**: Report platform main dashboard

**Features**:
- Overview statistics
- Quick reports access
- Chart visualizations

---

### Generate Report

**Path**: `/ReportPlatform/generate-report`

**Description**: Generate custom reports

---

### Manage Providers

**Path**: `/ReportPlatform/manage-providers`

**Description**: Manage healthcare providers

---

### Reporting Module

#### Districts Reporting

**Path**: `/ReportPlatform/reporting/districts`

**Description**: District-level reporting

**Dynamic Routes**:
- `/ReportPlatform/reporting/districts/index` - All districts overview
- `/ReportPlatform/reporting/districts/[district]/index` - Single district report
- `/ReportPlatform/reporting/districts/[district]/mentees` - District mentees
- `/ReportPlatform/reporting/districts/[district]/evaluations` - District evaluations
- `/ReportPlatform/reporting/districts/[district]/[facility]/evaluations` - Facility evaluations
- `/ReportPlatform/reporting/districts/[district]/[status]/index` - Status-based report

#### Tools Reporting

**Path**: `/ReportPlatform/reporting/tools`

**Description**: Tool-based reporting

**Dynamic Routes**:
- `/ReportPlatform/reporting/tools/index` - All tools overview
- `/ReportPlatform/reporting/tools/[tool]/[status]/index` - Tool status report

#### Facilities Reporting

**Path**: `/ReportPlatform/reporting/facilities`

**Description**: Facility-level reporting

**Dynamic Routes**:
- `/ReportPlatform/reporting/facilities/index` - All facilities
- `/ReportPlatform/reporting/facilities/[facility]/[status]/index` - Facility status report
- `/ReportPlatform/reporting/facilities/[facility]/[status]/report` - Detailed facility report

#### Mentees Reporting

**Path**: `/ReportPlatform/reporting/mentees`

**Description**: Mentee-level reporting

**Dynamic Routes**:
- `/ReportPlatform/reporting/mentees/index` - All mentees
- `/ReportPlatform/reporting/mentees/[id]` - Single mentee report
- `/ReportPlatform/reporting/mentees/gender/[gender]` - Gender-based report

---

## Scores Module

### Scores List

**Path**: `/scores/list`

**Description**: List all scores/evaluations

---

### Score Detail

**Path**: `/scores/[id]`

**Description**: View detailed score for specific evaluation

**Parameters**:
- `id`: Evaluation ID

---

## Reports Module

### Full Report

**Path**: `/reports/full/[id]`

**Description**: Full evaluation report

**Parameters**:
- `id`: Evaluation ID

---

### Partial Report

**Path**: `/reports/partial/[session]/[id]`

**Description**: Partial/session-based report

**Parameters**:
- `session`: Session number
- `id`: Evaluation ID

---

## Route Summary Table

| Route | Path | Description |
|-------|------|-------------|
| Home | `/` | Login page |
| Dashboard | `/dashboard` | Main dashboard |
| Register | `/register` | Registration |
| Settings | `/settings` | Settings page |
| Start Evaluation | `/startEvaluating` | Begin evaluation |
| Sync Report | `/sync-report` | Sync status |
| Syncing | `/syncing` | Active sync |
| Monitoring Dashboard | `/MonitoringPlatform/dashboard` | Monitoring main |
| Districts | `/MonitoringPlatform/planning/districts/list` | District list |
| Facilities | `/MonitoringPlatform/planning/facilities/list` | Facility list |
| Mentees | `/MonitoringPlatform/planning/mentees/list` | Mentee list |
| Create Mentee | `/MonitoringPlatform/planning/mentees/create` | New mentee |
| Update Mentee | `/MonitoringPlatform/planning/mentees/update` | Edit mentee |
| Preview | `/MonitoringPlatform/planning/preview` | Preview eval |
| Evaluation | `/MonitoringPlatform/evaluation/tool` | Tool eval |
| Report Dashboard | `/ReportPlatform/dashboard` | Report main |
| Generate Report | `/ReportPlatform/generate-report` | Create report |
| Manage Providers | `/ReportPlatform/manage-providers` | Manage providers |
| District Reports | `/ReportPlatform/reporting/districts` | District reports |
| Tool Reports | `/ReportPlatform/reporting/tools` | Tool reports |
| Facility Reports | `/ReportPlatform/reporting/facilities` | Facility reports |
| Mentee Reports | `/ReportPlatform/reporting/mentees` | Mentee reports |
| Scores List | `/scores/list` | All scores |
| Score Detail | `/scores/[id]` | Score detail |
| Full Report | `/reports/full/[id]` | Full report |
| Partial Report | `/reports/partial/[session]/[id]` | Partial report |

---

## Navigation Flow

```
Login (/)
    │
    ▼
Dashboard (/dashboard)
    │
    ├──► Monitoring Platform
    │       ├──► Planning (Districts/Facilities/Mentees)
    │       ├──► Evaluation (Tool Evaluation)
    │       └──► Syncing
    │
    ├──► Report Platform
    │       ├──► Districts Reporting
    │       ├──► Facilities Reporting
    │       ├──► Mentees Reporting
    │       └──► Tools Reporting
    │
    ├──► Scores (/scores)
    │
    └──► Reports (/reports)
```

---

## Route Parameters

### Dynamic Routes

- `[id]` - Generic ID parameter (evaluation, mentee, etc.)
- `[session]` - Session number (1-5)
- `[tool]` - Tool name (cardiac, echo, etc.)
- `[district]` - District identifier
- `[facility]` - Facility identifier
- `[status]` - Status filter (completed, pending, etc.)
- `[gender]` - Gender filter (male, female)
