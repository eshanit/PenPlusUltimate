<script setup lang="ts">
import Pie from "@/components/charts/Shared/Pie.vue";

const props = defineProps<{
    evalCounts: Array<number>;
    facilities?: Array<string>;
}>();

// Safe computation with null/undefined guards
const series = computed(() => props.evalCounts || []);
const facilities = computed(() => props.facilities || []);

// Show all facilities even if they have 0 evaluations - don't filter out zero values
const hasValidData = computed(() => series.value.length > 0);
</script>
<template>
    <div v-if="hasValidData">
        <Pie :series="series" :labels="facilities" title="% Facility Evaluations" :width="'100%'" />
    </div>
    <div v-else class="no-data-message">
        <p class="text-slate-500 text-sm">No facility evaluation data available</p>
    </div>
</template>

<style scoped>
.no-data-message {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    background: #f8fafc;
    border-radius: 8px;
}
</style>