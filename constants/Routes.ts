import { Title } from "#build/components"

const INDEX = {
    path: '/',
    title: 'Home'
}

const LOGIN = {
    path: '/login',
    name: 'login',
    title: 'Login'
}

const REGISTRATION = {
    path: '/register',
    name: 'register',
    title: 'Register'
}

const DASHBOARD = {
    path: '/dashboard',
    name: 'dashboard',
    title: 'Dashboard'
}

const START_EVALUATION = {
    path: '/startEvaluating',
    name: 'startEvaluating',
    title: 'Start Evaluation'
}

// const DISTRICTS = {
//     path: 'ReportPlatform/planning/districts/list',
//     name: 'ReportPlatform-planning-districts-list',
//     title: 'Planning Districts'
// }



// const FACILITIES = {
//     path: 'ReportPlatform/planning/facilities/list',
//     name: 'planning-facilities-list',
//     title: 'Planning_Facilities'
// }

const DISTRICTS = {
    path: '/MonitoringPlatform/planning/districts/list',
    name: 'MonitoringPlatform-planning-districts-list',
    title: 'Planning Districts'
}



const FACILITIES = {
    path: '/MonitoringPlatform/planning/facilities/list',
    name: 'MonitoringPlatform-planning-facilities-list',
    title: 'Planning_Facilities'
}

const MENTEES = {
    path: '/MonitoringPlatform/planning/mentees/list',
    name: 'MonitoringPlatform-planning-mentees-list',
    title: 'Planning Mentees'
}




const PREVIEW = {
    path: '/MonitoringPlatform/planning/preview',
    name: 'planning-preview-index',
    title: 'Preview'
}

const UPDATE_MENTEE = {
    path: '/MonitoringPlatform/planning/mentees/update',
    name: 'MonitoringPlatform-planning-mentees-update',
    title: 'Update Mentee'
}

const CREATE_MENTEE = {
    path: '/MonitoringPlatform/planning/mentees/create',
    name: 'MonitoringPlatform-planning-mentees-create',
    title: 'Create Mentee'
}


const EVALUATION_TOOL = {
    path: '/MonitoringPlatform/evaluation/tool',
    name: 'MonitoringPlatform-evaluation-tool',
    title: 'Evaluation Tool'
}

const EVALUATION_SUMMARY = {
    path: '/MonitoringPlatform/evaluation/tool/preview',
    name: 'MonitoringPlatform-evaluation-tool-preview',
    title: 'Evaluation Tool Preview'
}

const EVALUATION_ECHO_SUMMARY = {
    path: '/MonitoringPlatform/evaluation/tool/preview_echo',
    name: 'MonitoringPlatform-evaluation-tool-preview_echo',
    title: 'Evaluation Tool Echo Preview'
}

const SCORE_SUBMIT_SUCCESS = {
    path: '/MonitoringPlatform/evaluation/tool/success',
    name: 'MonitoringPlatform-evaluation-tool-success',
    title: 'Evaluation Tool Preview'
}

const CARDIAC_PRAC_EVALUATION = {
    path: '/MonitoringPlatform/evaluation/tool/cardiac',
    name: 'MonitoringPlatform-evaluation-tool-cardiac',
    title: 'Evaluation Tool Cardiac'
}


const ECHO_PRAC_EVALUATION = {
    path: '/MonitoringPlatform/evaluation/tool/echo',
    name: 'MonitoringPlatform-evaluation-tool-echo',
    title: 'Evaluation Tool Echo'
}

const SCORE = {
    path: '/scores/id',
    name: 'scores-id',
    title: 'Evaluation Score'
}



const EVALUATIONS = {
    path: '/scores/list',
    name: 'scores-list',
    title: 'Evaluation Scores'
}


const FULL_EVALUATION_REPORT = {
    path: '/reports/full/id',
    name: 'reports-full-id',
    title: 'Evaluation Full Report'
}

//Repoting
const MENTEES_REPORTING = {
    path: 'Reporting/mentees',
    name: 'reporting-mentees',
    title: 'mentees'
}

const TOOLS_REPORTING = {
    path: 'Reporting/tools',
    name: 'reporting-tools',
    title: 'Reporting Tools'
}

const DISTRICTS_REPORTING = {
    path: 'Reporting/districts',
    name: 'reporting-districts',
    title: 'districts'
}

const DISTRICT_MENTEES_REPORTING = {
    path: 'Reporting/districts/district/mentees',
    name: 'reporting-districts-distrct-mentees',
    title: 'district mentees'
}

const DISTRICT_ANALYSIS  =  {
    path: 'Reporting/districts/district',
    name: 'reporting-districts-district',
    title: 'district '
}


const FACILITIES_REPORTING = {
    path: 'Reporting/facilities',
    name: 'reporting-facilities',
    title: 'reports facilities'
}

const REPORTING_TOOL_STATUS = {
    path: '/reporting/tool/status/indexTest',
    name: 'reporting-tool-status-indexTest',
    title: 'Evaluation Tool Status'
}

const REPORTING_FACILITY_STATUS = {
    path: '/ReportPlatform/reporting/facilities/facility/status',
    name: 'ReportPlatform-reporting-facilities-facility-status',
    title: 'Evaluation Facility Status'
}

const REPORTING_FACILITY_STATUS_REPORT = {
    path: '/ReportPlatform/reporting/facilities/facility/status/report',
    name: 'ReportPlatform-reporting-facilities-facility-status-report',
    title: 'Evaluation Facility Status Report'
}

const MONITORING_PLATFORM = {
    path: '/MonitoringPlatform/dashboard',
    name: 'MonitoringPlatform-dashboard',
    title: 'Monitoring Platform Dashboard'
}

const SYNCING = {
    path: '/MonitoringPlatform/syncing',
    name: 'MonitoringPlatform-syncing',
    title: 'Syncing'
}

const GENERATE_REPORT = {
    path: '/ReportPlatform/generate-report',
    name: 'ReportPlatform-generate-report',
    title: 'Generate Report'
}

const MANAGE_PROVIDERS = {
    path: '/ReportPlatform/manage-providers',
    name: 'ReportPlatform-manage-providers',
    title: 'Manage Providers'
}

const SETTINGS = {
    path: '/settings',
    name: 'settings',
    title: 'Settings'
}

export default {
    INDEX,
    LOGIN,
    REGISTRATION,
    DASHBOARD,
    DISTRICTS,
    FACILITIES,
    MENTEES,
    PREVIEW,
    CREATE_MENTEE,
    UPDATE_MENTEE,
    EVALUATION_TOOL,
    EVALUATION_SUMMARY,
    SCORE_SUBMIT_SUCCESS,
    CARDIAC_PRAC_EVALUATION,
    SCORE,
    EVALUATIONS,
    START_EVALUATION,
    ECHO_PRAC_EVALUATION,
    EVALUATION_ECHO_SUMMARY,
    FULL_EVALUATION_REPORT,
    // reporting
    DISTRICTS_REPORTING,
    DISTRICT_MENTEES_REPORTING,
    DISTRICT_ANALYSIS,
    FACILITIES_REPORTING,
    REPORTING_TOOL_STATUS,
    REPORTING_FACILITY_STATUS,
    MENTEES_REPORTING,
    TOOLS_REPORTING,
    REPORTING_FACILITY_STATUS_REPORT,
    MONITORING_PLATFORM,
    SYNCING,
    GENERATE_REPORT,
    MANAGE_PROVIDERS,
    SETTINGS
}