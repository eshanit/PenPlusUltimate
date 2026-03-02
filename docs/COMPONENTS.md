# Components Documentation

This document provides detailed information about all Vue components in the NCD PenPlus application.

## Table of Contents

1. [Cards Components](#cards-components)
2. [Charts Components](#charts-components)
3. [Form Components](#form-components)
4. [Shared Components](#shared-components)
5. [Table Components](#table-components)
6. [Report Components](#report-components)

---

## Cards Components

### CompetantScores.vue

**Location**: `components/cards/CompetantScores.vue`

**Purpose**: Displays competent scores for mentee evaluations

**Key Features**:
- Shows score cards for different categories
- Displays competence levels
- Color-coded indicators

---

## Charts Components

### Dashboard Charts

#### Facilities/Stacked.vue
**Location**: `components/charts/dashboard/Facilities/Stacked.vue`

**Purpose**: Stacked bar chart showing facility evaluations

#### Facilities/StackedPerc.vue
**Location**: `components/charts/dashboard/Facilities/StackedPerc.vue`

**Purpose**: Percentage stacked chart for facility comparisons

#### Tools/Stacked.vue
**Location**: `components/charts/dashboard/Tools/Stacked.vue`

**Purpose**: Stacked bar chart for tool evaluations

#### Tools/StackedPerc.vue
**Location**: `components/charts/dashboard/Tools/StackedPerc.vue`

**Purpose**: Percentage stacked chart for tool comparisons

---

### District Charts

#### EvaluationsBar.vue
**Location**: `components/charts/districts/EvaluationsBar.vue`

**Purpose**: Bar chart showing district evaluations

#### EvaluationsPie.vue
**Location**: `components/charts/districts/EvaluationsPie.vue`

**Purpose**: Pie chart showing evaluation distribution

#### FacilityEvaluations.vue
**Location**: `components/charts/districts/FacilityEvaluations.vue`

**Purpose**: Compares evaluations across facilities

#### FacilitySessions.vue
**Location**: `components/charts/districts/FacilitySessions.vue`

**Purpose**: Shows session data by facility

#### FacilityEvaluationsPie.vue
**Location**: `components/charts/districts/FacilityEvaluationsPie.vue`

**Purpose**: Pie chart for facility evaluations

#### FacilitySessionsPie.vue
**Location**: `components/charts/districts/FacilitySessionsPie.vue`

**Purpose**: Pie chart for facility sessions

---

### Mentee Charts

#### ScorePie.vue
**Location**: `components/charts/Mentee/ScorePie.vue`

**Purpose**: Displays score distribution for a mentee

---

### Shared Charts

#### Pie.vue
**Location**: `components/charts/Shared/Pie.vue`

**Purpose**: Reusable pie chart component

---

## Form Components

### Authentication Forms

#### Login.vue
**Location**: `components/forms/Login.vue`

**Purpose**: User login form

**Fields**:
- Username
- Password

#### Register.vue
**Location**: `components/forms/Register.vue`

**Purpose**: User registration form

**Fields**:
- First name
- Last name
- Username
- Password
- Terms acceptance

---

### Mentee Forms

#### CreateMentee.vue
**Location**: `components/forms/CreateMentee.vue`

**Purpose**: Create new mentee/provider

**Fields**:
- First name
- Last name
- Gender
- Facility
- Profession

#### UpdateMentee.vue
**Location**: `components/forms/UpdateMentee.vue`

**Purpose**: Update existing mentee information

---

### Evaluation Forms

#### MainEvaluation.vue
**Location**: `components/forms/MainEvaluation.vue`

**Purpose**: Main evaluation form with all tool options

**Features**:
- Tool selection
- Category navigation
- Score input
- Session management

#### EvaluationItem.vue
**Location**: `components/forms/EvaluationItem.vue`

**Purpose**: Individual evaluation item component

**Features**:
- Single item evaluation
- Score input
- Notes field

#### EvaluationSummary.vue
**Location**: `components/forms/EvaluationSummary.vue`

**Purpose**: Summary view of evaluation results

---

### Cardiac Evaluation Forms

#### PatientInformation.vue
**Location**: `components/forms/cardiac/PatientInformation.vue`

**Purpose**: Capture patient information for cardiac evaluation

#### EchoIndication.vue
**Location**: `components/forms/cardiac/EchoIndication.vue`

**Purpose**: Record echo indication details

#### Exam.vue
**Location**: `components/forms/cardiac/Exam.vue`

**Purpose**: Cardiac examination form

#### ImageQuality.vue
**Location**: `components/forms/cardiac/ImageQuality.vue`

**Purpose**: Image quality assessment

#### EchoFindings.vue
**Location**: `components/forms/cardiac/EchoFindings.vue`

**Purpose**: Echo findings documentation

#### PrimaryDiagnosis.vue
**Location**: `components/forms/cardiac/PrimaryDiagnosis.vue`

**Purpose**: Primary diagnosis recording

---

## Shared Components

### Navigation

#### NavBar.vue
**Location**: `components/shared/NavBar.vue`

**Purpose**: Main navigation bar

**Features**:
- User info display
- Navigation links
- Responsive design

#### BorderedNavBar.vue
**Location**: `components/shared/BorderedNavBar.vue`

**Purpose**: Navigation bar with border styling

---

### Status Indicators

#### OnlineStatus.vue
**Location**: `components/shared/OnlineStatus.vue`

**Purpose**: Network connectivity indicator

**Features**:
- Shows online/offline status
- Real-time updates

---

### UI Elements

#### PrintButton.vue
**Location**: `components/shared/PrintButton.vue`

**Purpose**: Print functionality trigger

#### ScoreCards.vue
**Location**: `components/shared/ScoreCards.vue`

**Purpose**: Display scores in card format

#### TwCard.vue
**Location**: `components/shared/TwCard.vue`

**Purpose**: Tailwind CSS card wrapper

#### TwCardWithHeader.vue
**Location**: `components/shared/TwCardWithHeader.vue`

**Purpose**: Card with header and content

---

## Table Components

### Standard Tables

#### mentees.vue
**Location**: `components/tables/mentees.vue`

**Purpose**: Display mentees in table format

#### evaluations.vue
**Location**: `components/tables/evaluations.vue`

**Purpose**: Display evaluations in table format

#### districts.vue
**Location**: `components/tables/districts.vue`

**Purpose**: Display districts in table format

#### facilities.vue
**Location**: `components/tables/facilities.vue`

**Purpose**: Display facilities in table format

---

### Specialized Tables

#### toolScoreCounts.vue
**Location**: `components/tables/toolScoreCounts.vue`

**Purpose**: Show score counts by tool

#### aggregateToolScoreCounts.vue
**Location**: `components/tables/aggregateToolScoreCounts.vue`

**Purpose**: Aggregated tool score statistics

#### selectedEvaluationMeans.vue
**Location**: `components/tables/selectedEvaluationMeans.vue`

**Purpose**: Selected evaluations with mean scores

#### selectedEvaluations.vue
**Location**: `components/tables/selectedEvaluations.vue`

**Purpose**: Display selected evaluations

#### selectedMentees.vue
**Location**: `components/tables/selectedMentees.vue`

**Purpose**: Display selected mentees

---

### AG Grid Tables

AG Grid components for advanced data tables:

#### Dashboard Tables

- `components/tables/AGtables/Dashboard/FacilityEvaluations.vue`
- `components/tables/AGtables/Dashboard/ToolEvaluations.vue`

#### District Tables

- `components/tables/AGtables/Districts/FSessionEvals.vue`
- `components/tables/AGtables/Districts/ToolScores.vue`

#### Mentee Tables

- `components/tables/AGtables/Mentees/AllList.vue`
- `components/tables/AGtables/Mentees/List.vue`

---

## Report Components

### MenteeEvals.vue
**Location**: `components/Report/MenteeEvals.vue`

**Purpose**: Generate reports for mentee evaluations

**Features**:
- Comprehensive evaluation data
- Print-friendly format
- Statistics summary
