<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type IMasterUser from "@/interfaces/IMasterUser";
import {
    AllCommunityModule,
    ModuleRegistry,
} from "ag-grid-community";
type IMentee = Pick<IMasterUser, "_id" | "_rev" | "firstname" | "lastname" | "gender" | "profession">


ModuleRegistry.registerModules([AllCommunityModule]);

const props = defineProps<{
    mentees: Array<IMentee>
}>()



const emit = defineEmits<{
    (event: 'record', id: string): void;
}>();

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
    }
];

// Transform statistics into row data
const rowData = ref([]);

const agGrid = ref();

// Responsive height calculation
const gridHeight = computed(() => {
    if (!props.mentees || props.mentees.length === 0) {
        return '200px'; // Minimum height when no data
    }
    
    // Calculate height based on number of rows
    const rowCount = props.mentees.length;
    const headerHeight = 56; // Header height in pixels
    const rowHeight = 42; // Approximate row height in pixels
    const paginationHeight = 60; // Pagination controls height
    
    // Calculate total height
    let calculatedHeight = headerHeight + (rowCount * rowHeight) + paginationHeight;
    
    // Set maximum and minimum heights
    const minHeight = 200; // Minimum height
    const maxHeight = 600; // Maximum height to prevent taking too much space
    
    if (calculatedHeight < minHeight) {
        return `${minHeight}px`;
    } else if (calculatedHeight > maxHeight) {
        return `${maxHeight}px`;
    } else {
        return `${calculatedHeight}px`;
    }
});

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

// Watch for changes in mentees data to update height
watch(() => props.mentees, () => {
    // Height will automatically update through the computed property
}, { deep: true });
</script>
<template>
    
    <div class="flex justify-between py-5">
        <UButton variant="outline" color="fuchsia" label='Download Mentees' @click="downloadCsv" />
        <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Showing</span>
            <span class="font-semibold text-sky-700">{{ filteredRecordCount }}</span>
            <span class="text-sm text-gray-600">mentees</span>
        </div>
    </div>
    
    <div class="rounded-lg grid-container" v-if="props.mentees">
        <ag-grid-vue 
            :style="{ width: '100%', height: gridHeight }" 
            @grid-ready="onGridReady" 
            :rowData="props.mentees"
            :columnDefs="columnDefs" 
            :defaultColDef="{ flex: 1, minWidth: 100 }"
            :pagination="true" 
            :paginationPageSize="paginationPageSize"
            :paginationPageSizeSelector="paginationPageSizeSelector"
            class="ag-theme-quartz-responsive"
        ></ag-grid-vue>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center py-8 text-gray-500">
        <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p>No mentees data available</p>
    </div>
</template>
<style scoped>
.ag-theme-quartz-responsive {
    width: 100%;
    /* Height is set dynamically via the style binding */
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .flex.justify-between {
        flex-direction: column;
        gap: 1rem;
    }
    
    .flex.justify-between > div {
        text-align: center;
    }
}
</style>

<style>
/* Additional AG Grid theme adjustments for better responsiveness */
.ag-theme-quartz-responsive .ag-header {
    border-bottom: 1px solid #e5e7eb;
}

.ag-theme-quartz-responsive .ag-row {
    border-bottom: 1px solid #f3f4f6;
}

.ag-theme-quartz-responsive .ag-row:hover {
    background-color: #f8fafc;
}

.ag-theme-quartz-responsive .ag-cell {
    padding: 8px 12px;
    display: flex;
    align-items: center;
}

.ag-theme-quartz-responsive .ag-header-cell {
    font-weight: 600;
    color: #374151;
    background-color: #f9fafb;
}

.ag-theme-quartz-responsive .ag-paging-panel {
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
    padding: 12px;
}
</style>