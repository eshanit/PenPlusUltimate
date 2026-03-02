<script setup lang="ts">

interface PieData {
    [key: string]: number;
}

const props = defineProps<{
    pieData?: PieData;
    series?: number[];
    labels?: string[];
    title?: string;
    width?: string | number;
}>();

// Safe computation with null/undefined guards
const chartOptions = computed(() => {
    // Handle undefined or null pieData
    const pieData = props.pieData || {};
    
    const series = props.series || (Object.keys(pieData).length > 0 ? Object.values(pieData) : []);
    const labels = props.labels || (Object.keys(pieData).length > 0 ? Object.keys(pieData) : []);
    
    // Don't render chart if there's no valid data
    const hasValidData = series.length > 0 && series.some(val => val > 0);

    return {
        series: hasValidData ? series : [],
        hasData: hasValidData,
        options: {
            title: props.title ? {
                text: props.title,
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
            } : undefined,
            chart: {
                width: props.width || '100%',
                type: 'pie',
            },
            labels: hasValidData ? labels : [],
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
    };
});

</script>
<template>
    <div v-if="chartOptions.hasData" class="chart-container">
        <apexchart type="pie" :width="chartOptions.options.chart.width" :options="chartOptions.options" :series="chartOptions.series"></apexchart>
    </div>
    <div v-else class="no-data-message">
        <p class="text-slate-500 text-sm">No data available for chart</p>
    </div>
</template>

<style scoped>
.chart-container {
    width: 100%;
    min-height: 300px;
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