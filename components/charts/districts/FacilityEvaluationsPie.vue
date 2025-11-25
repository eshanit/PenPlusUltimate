<script setup lang="ts">
import Pie from "@/components/charts/Shared/Pie.vue";

const props = defineProps<{
    evalCounts: Array<number>;
    facilities?: Array<string>;
}>();
</script>
<template>
    <Pie :series="props.evalCounts" :labels="props.facilities" title="% Facility Evaluations" :width="280" />
</template>