<script setup lang="ts">
import type IEvaluationCounts from "@/interfaces/IEvaluationCounts"

const props = defineProps<{
    sessionCounts: Array<number>,
    evalCounts: Array<number>,
    facilities?: Array<string>
}>()

const chartData = computed(() => {
    return {
        options: {
            title: {
                text: 'Number Sessions per Facility',
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
                height: '350',
                type: 'line',
            },
            stroke: {
                width: [0, 2]
            },
            yaxis: [{
                title: {
                    text: 'Sessions',
                },

            }],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [1]
            },
            labels: props.facilities
        },
        series: [
        
        {
            name: 'Sessions',
            type: 'column',
            data: props.sessionCounts
        } ]
    }
})
</script>
<template>
    <div>
        <apexchart width="" type="line" :options="chartData.options" :series="chartData.series"></apexchart>
    </div>
</template>