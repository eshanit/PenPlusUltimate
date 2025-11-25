<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import {
    AllCommunityModule,
    ModuleRegistry,
} from "ag-grid-community";
import { format } from 'date-fns';
import type IToolEvaluation from '@/interfaces/IToolEvaluation';


ModuleRegistry.registerModules([AllCommunityModule]);

const props = defineProps<{
    evaluationStats: any
}>()

const tools = useTools

const emit = defineEmits<{
    (event: 'record', id: string): void;
}>();

const countToolSessions = computed(()=> {
    const arr: any[] = []
    tools.forEach( (tool)=> {
        const countSessions = useCountToolSessionsCompleted(tool.name, props.evaluationStats)
       arr.push({
        label: tool.label,
        name: tool.name,
        fiveCompleted: countSessions.allCompletedCount,
        fourCompleted: countSessions.fourCompleted,
        threeCompleted: countSessions.threeCompleted,
        twoCompleted: countSessions.twoCompletedCount,
        oneCompleted: countSessions.oneCompletedCount,
        totalCompleted: countSessions.totalCompletedCount
       })
    });

    return arr
})

// Define column definitions
const columnDefs = ref();

columnDefs.value = [
{
        headerName: 'Tool',
        field: 'label',
        sortable: true,
        filter: true,
        cellRenderer: (params: { data:IToolEvaluation}) => {
            const span = document.createElement('span');
            span.className = "font-extrabold"; // Add the font-semibold class
            span.innerText = params.data.label; // Set the text
            return span; // Return the span element
        }
    },
    {
        headerName: "Completed Evaluations",
        sortable: true,
        filter: true,
        valueGetter: (params: { data: IToolEvaluation }) => params.data.fiveCompleted,
        cellRenderer: (params: { data: IToolEvaluation }) => {
            const button = document.createElement('button');
            button.className = "inline-flex items-center justify-center px-4 py-1 text-xs font-semibold tracking-widest text-black uppercase transition duration-150 ease-in-out bg-gray-100 border border-transparent rounded-md hover:bg-gray-300 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2";
            button.innerText = `${params.data.fiveCompleted}`;
            button.onclick = () => viewRecord(params.data.name, 'completed');
            return button;
        }
    },
    {
        headerName: "four Evaluations",
        sortable: true,
        filter: true,
        valueGetter: (params: { data: IToolEvaluation }) => params.data.fourCompleted,
        cellRenderer: (params: { data: IToolEvaluation }) => {
            const button = document.createElement('button');
            button.className = "inline-flex items-center justify-center px-4 py-1 text-xs font-semibold tracking-widest text-black uppercase transition duration-150 ease-in-out bg-gray-100 border border-transparent rounded-md hover:bg-gray-300 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2";
            button.innerText = `${params.data.fourCompleted}`;
            button.onclick = () => viewRecord(params.data.name, 'fourcompleted');
            return button;
        }
    },
    {
        headerName: "three Evaluations",
        sortable: true,
        filter: true,
        valueGetter: (params: { data: IToolEvaluation }) => params.data.threeCompleted,
        cellRenderer: (params: { data: IToolEvaluation }) => {
            const button = document.createElement('button');
            button.className = "inline-flex items-center justify-center px-4 py-1 text-xs font-semibold tracking-widest text-black uppercase transition duration-150 ease-in-out bg-gray-100 border border-transparent rounded-md hover:bg-gray-300 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2";
            button.innerText = `${params.data.threeCompleted}`;
            button.onclick = () => viewRecord(params.data.name, 'threecompleted');
            return button;
        }
    },
    {
        headerName: "Two Complete",
        sortable: true,
        filter: true,
        valueGetter: (params: { data: IToolEvaluation }) => params.data.twoCompleted,
        cellRenderer: (params: { data: IToolEvaluation }) => {
            const button = document.createElement('button');
            button.className = "inline-flex items-center justify-center px-4 py-1 text-xs font-semibold tracking-widest text-black uppercase transition duration-150 ease-in-out bg-gray-100 border border-transparent rounded-md hover:bg-gray-300 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2";
            button.innerText = `${params.data.twoCompleted}`;
            button.onclick = () => viewRecord(params.data.name, 'twocompleted');
            return button;
        }
    },
    {
        headerName: "One Complete",
        sortable: true,
        filter: true,
        valueGetter: (params: { data: IToolEvaluation }) => params.data.oneCompleted,
        cellRenderer: (params: { data: IToolEvaluation }) => {
            const button = document.createElement('button');
            button.className = "inline-flex items-center justify-center px-4 py-1 text-xs font-semibold tracking-widest text-black uppercase transition duration-150 ease-in-out bg-gray-100 border border-transparent rounded-md hover:bg-gray-300 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2";
            button.innerText = `${params.data.oneCompleted}`;
            button.onclick = () => viewRecord(params.data.name, 'onecompleted');;
            return button;
        }
    },
    {
        headerName: "Total",
        sortable: true,
        filter: true,
        valueGetter: (params: { data: IToolEvaluation }) => params.data.totalCompleted,
        cellRenderer: (params: { data: IToolEvaluation }) => {
            const button = document.createElement('button');
            button.className = "inline-flex items-center justify-center px-4 py-1 text-xs font-semibold tracking-widest text-sky-600 uppercase transition duration-150 ease-in-out bg-sky-100 border border-transparent rounded-md hover:bg-sky-300 active:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2";
            button.innerText = `${params.data.totalCompleted}`;
            button.onclick = () => viewRecord(params.data.name, 'all');;
            return button;
        }
    }
];

const viewRecord = (tool: string, completionLevel: string) => {
    //router.visit('/items/' + record + '/edit', { method: 'get'});
  navigateTo(`/ReportPlatform/reporting/tools/${tool}/${completionLevel}/indexTest`)
};


// Transform statistics into row data
const rowData = ref([]);

const agGrid = ref();
// Method to handle grid ready event
const onGridReady = (params: any) => {
    agGrid.value = params.api; // Store the grid API
    params.api.sizeColumnsToFit(); // Adjust column sizes
    updateFilteredRecordCount();

    // Listen for filter changes
    params.api.addEventListener('filterChanged', updateFilteredRecordCount);
};

const filteredRecordCount = ref(0);

const updateFilteredRecordCount = () => {
    console.log('agrid', agGrid.value)
    if (agGrid.value) {
        filteredRecordCount.value = agGrid.value.getDisplayedRowCount();
    }
};

const downloadCsv = () => {

    const gridApi = agGrid.value;
    console.log('AG Grid reference:', agGrid.value);
    if (gridApi) {
        gridApi.exportDataAsCsv();
    } else {
        console.error("AG Grid API is not available.");
    }
};

onMounted(() => {
    // rowData.value = Object.entries(props.students).map(([recordId, stats]) => ({
    //     recordId,
    //     ...stats,
    // }));
});

const paginationPageSize = ref(25);
const paginationPageSizeSelector = ref<number[] | boolean>([10, 25, 50]);

</script>
<template>
    <!-- <pre>
        {{ countToolSessions }}
    </pre> -->
    <div class="rounded-lg grid-container" v-if="countToolSessions">
        <ag-grid-vue style="width: 100%; height: 500px;" @grid-ready="onGridReady" :rowData="countToolSessions"
            :columnDefs="columnDefs" :defaultColDef="{ flex: 1, minWidth: 100 }"
            :pagination="true" :paginationPageSize="paginationPageSize"
            :paginationPageSizeSelector="paginationPageSizeSelector"></ag-grid-vue>

    </div>
</template>
<style scoped>

.ag-theme-quartz {
    height: auto;
    width: 100%;
}
</style>