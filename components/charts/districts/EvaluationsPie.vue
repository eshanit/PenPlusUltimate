<script setup lang="ts">
import type IEvaluationCounts from "@/interfaces/IEvaluationCounts";
import Pie from "@/components/charts/Shared/Pie.vue";

const props = defineProps<{
    evalCounts: IEvaluationCounts;
}>();

const series = [props.evalCounts.oneCompletedCount, props.evalCounts.twoCompletedCount, props.evalCounts.allCompletedCount];
const labels = ['1-session', '2-sessions', '3-sessions'];
</script>
<template>
    <Pie :series="series" :labels="labels" title="% Evaluations" :width="280" />
</template>