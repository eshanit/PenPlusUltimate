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
    facilityData: any
}>()

const tools = useTools

const emit = defineEmits<{
    (event: 'record', id: string): void;
}>();


// Define column definitions
const columnDefs = ref();

columnDefs.value = [
{
        headerName: 'Facility',
        field: 'facility',
        sortable: true,
        filter: true,
        cellRenderer: (params: { data:{ facility: string }}) => {
            const span = document.createElement('span');
            span.className = "font-extrabold"; // Add the font-semibold class
            span.innerText = params.data.facility; // Set the text
            return span; // Return the span element
        }
    },
    {
        headerName: "Evaluations",
        field: 'total',
        sortable: true,
        filter: true
    },
    {
        headerName: "Sessions",
        field: 'totalSessions',
        sortable: true,
        filter: true
    }
];

// const viewRecord = (tool: string, completionLevel: string) => {
//     //router.visit('/items/' + record + '/edit', { method: 'get'});
//   navigateTo(`/Reporting/${tool}/${completionLevel}/indexTest`)
// };


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
    <div class="rounded-lg grid-container" v-if="facilityData">
        <ag-grid-vue style="width: 100%; height: 500px;" @grid-ready="onGridReady" :rowData="facilityData"
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