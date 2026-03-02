<script setup lang="ts">

const props = defineProps<{
    sessionCounts: Array<number>,
        facilities?: Array<string>
}>()

// Safe computation with null/undefined guards
const chartData = computed(() => {
    const sessionCounts = props.sessionCounts || [];
    const facilities = props.facilities || [];
    
    // Show all facilities even if they have 0 sessions - don't filter out zero values
    const hasValidData = sessionCounts.length > 0;

    return {
        series: hasValidData ? sessionCounts : [],
        hasData: hasValidData,
        options: {
            title: {
                text: '% Facility Sessions',
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
                width: '100%',
                type: 'pie',
            },
            labels: facilities,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: '100%'
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
        <p class="text-slate-500 text-sm">No session data available</p>
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