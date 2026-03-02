<script setup lang="ts">


const props = defineProps<{
    tool: string,
    scoreCounts: {
        "1": number,
        "2": number,
        "3": number
    }
}>()

// Safe computation with null/undefined guards
const chartData = computed(() => {
    const scoreCounts = props.scoreCounts || { "1": 0, "2": 0, "3": 0 };
    const series = Object.values(scoreCounts);
    const labels = ["Score of 1", "Score of 2", "Score of 3"];
    
    // Don't render chart if there's no valid data
    const hasValidData = series.length > 0 && series.some(val => val > 0);

    return {
        series: hasValidData ? series : [],
        hasData: hasValidData,
        options: {
            title: {
                text: '% Score Ratings for ' + props.tool,
                align: 'left',
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize:  '18px',
                    fontWeight:  'bold',
                    fontFamily:  undefined,
                    color:  '#263238'
                },
            },
            chart: {
                width: 280,
                type: 'pie',
            },
            labels,
            responsive: [{
                breakpoint: 280,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    }
})


</script>
<template>
    <div v-if="chartData.hasData">
        <apexchart width="" type="pie" :options="chartData.options" :series="chartData.series"></apexchart>
    </div>
    <div v-else class="no-data-message">
        <p class="text-slate-500 text-sm">No score data available</p>
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