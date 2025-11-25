<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type IMasterUser from "@/interfaces/IMasterUser";
import {
    AllCommunityModule,
    ModuleRegistry,
} from "ag-grid-community";
type IMentee = Pick<IMasterUser, "_id" | "_rev" | "firstname" | "lastname" | "gender" | "profession">


ModuleRegistry.registerModules([AllCommunityModule]);

const props = defineProps<{
    mentees: Array<IMentee>,
    evaluations: Array<any>
}>()

const tools = useTools

const emit = defineEmits<{
    (event: 'record', id: string): void;
}>();

//
const menteeEvaluations = (menteeId: string) => {
    return props.evaluations?.filter((el: any) => el.mentee._id == menteeId)
}

// Define column definitions
const columnDefs = ref();

columnDefs.value = [
{
        headerName: 'First Name',
        field: 'firstname',
        sortable: true,
        filter: true,
        cellRenderer: (params: { data:IMentee} ) => {
            const span = document.createElement('span');
            span.className = "font-semibold text-sky-700"; // Add the font-semibold class
            span.innerText = params.data.firstname; // Set the text
            return span; // Return the span element
        }
    },
    {
        headerName: "Last Name",
        field: 'lastname',
        sortable: true,
        filter: true
    },
    {
        headerName: "Gender",
        field: 'gender',
        sortable: true,
        filter: true
    },
    {
        headerName: "Profession",
        field: 'profession',
        sortable: true,
        filter: true
    },
    {
        headerName: "View",
        sortable: true,
        filter: true,
        cellRenderer: (params: { data: { _id: string; }; }) => {
            const button = document.createElement('button');
            button.className = "inline-flex items-center justify-center px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-sky-300 border border-transparent rounded-md hover:bg-sky-200 active:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2";
            button.innerText = `${menteeEvaluations(params.data._id)?.length}`;
            button.onclick = () => viewRecord(params.data._id);
            return button;
        },
    }
];

const viewRecord = (id: string) => {
    //router.visit('/items/' + record + '/edit', { method: 'get'});
    navigateTo(`/ReportPlatform/Reporting/Mentees/${id}`)
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
    
    
    <div class="flex justify-between py-5">
        <UButton variant="outline" color="fuchsia" label='Download Mentees' @click="downloadCsv" />
        <div>
            <span class=" text-sky-700">{{ filteredRecordCount }}</span> Records found
        </div>
    </div>
    <div class="rounded-lg grid-container" v-if="props.mentees">
        <ag-grid-vue style="width: 100%; height: 800px;" @grid-ready="onGridReady" :rowData="props.mentees"
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