<script setup lang="ts">
import type IEvaluationCounts from "@/interfaces/IEvaluationCounts";
import Pie from "@/components/charts/Shared/Pie.vue";

const props = defineProps<{
    evalCounts: IEvaluationCounts;
}>();

// Session options for selection (up to 5 sessions)
const sessionOptions = [
    { label: '1 Session', value: 1 },
    { label: '2 Sessions', value: 2 },
    { label: '3 Sessions', value: 3 },
    { label: '4 Sessions', value: 4 },
    { label: '5 Sessions', value: 5 },
]

// Default to showing all 5 sessions
const selectedSessions = ref<number[]>([1, 2, 3, 4, 5])

// Get count for a specific session number
const getSessionCount = (session: number): number => {
    const counts = props.evalCounts
    switch (session) {
        case 1: return counts.oneCompletedCount || 0
        case 2: return counts.twoCompletedCount || 0
        case 3: return counts.threeCompletedCount || 0
        case 4: return counts.fourCompletedCount || 0
        case 5: return counts.allCompletedCount || 0
        default: return 0
    }
}

// Safe computation with null/undefined guards for selected sessions only
const series = computed(() => {
    const counts = props.evalCounts;
    if (!counts) return [];
    return selectedSessions.value.map(s => getSessionCount(s));
});

const labels = computed(() => {
    return selectedSessions.value.map(s => `${s}-session${s > 1 ? 's' : ''}`);
});

// Check if there's valid data
const hasValidData = computed(() => series.value.some(val => val > 0));

// Watch for session selection changes to update chart
const toggleSession = (session: number) => {
    const index = selectedSessions.value.indexOf(session)
    if (index > -1) {
        // Don't allow deselecting if only 1 session is selected
        if (selectedSessions.value.length > 1) {
            selectedSessions.value = selectedSessions.value.filter(s => s !== session)
        }
    } else {
        selectedSessions.value = [...selectedSessions.value, session].sort((a, b) => a - b)
    }
}
</script>
<template>
    <div>
        <!-- Session Selection Controls -->
        <div class="mb-4 flex flex-wrap gap-2">
            <span class="text-sm font-medium text-gray-700 mr-2 self-center">Show sessions:</span>
            <UButton
                v-for="session in sessionOptions"
                :key="session.value"
                :variant="selectedSessions.includes(session.value) ? 'solid' : 'outline'"
                :color="selectedSessions.includes(session.value) ? 'blue' : 'gray'"
                size="sm"
                @click="toggleSession(session.value)"
                class="transition-all duration-200"
            >
                {{ session.label }}
            </UButton>
        </div>
        
        <!-- Pie Chart -->
        <div v-if="hasValidData" class="pie-chart-wrapper">
            <Pie :series="series" :labels="labels" title="% Evaluations" :width="'100%'" />
        </div>
        <div v-else class="no-data-message">
            <p class="text-slate-500 text-sm">No evaluation data available</p>
        </div>
    </div>
</template>

<style scoped>
.pie-chart-wrapper {
    width: 100%;
    min-height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.no-data-message {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    background: #f8fafc;
    border-radius: 8px;
}
</style>
