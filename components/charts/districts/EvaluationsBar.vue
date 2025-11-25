<script setup lang="ts">
import type IEvaluationCounts from "@/interfaces/IEvaluationCounts"

const props = defineProps<{
    evalCounts: IEvaluationCounts
}>()

const chartData = computed(() => {
    return {
        options: {
            title: {
                text: 'Number of Evaluations',
                align: 'left',
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontFamily: undefined,
                    color: '#263238'
                },
            },
            chart: {
                id: 'Evaluations'
            },
            xaxis: {
                categories: ['1-session', '2-sessions', '3-sessions']
            }
        },
        series: [{
            name: 'Evaluations',
            data: [props.evalCounts.oneCompletedCount, props.evalCounts.twoCompletedCount, props.evalCounts.allCompletedCount]
        }]
    }
})
</script>
<template>
    <div>
        <apexchart width="" type="bar" :options="chartData.options" :series="chartData.series"></apexchart>
    </div>
</template>