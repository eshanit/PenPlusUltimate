<script setup lang="ts">

interface PieData {
    [key: string]: number;
}

const props = defineProps<{
    pieData?: PieData;
    series?: number[];
    labels?: string[];
    title?: string;
    width?: number;
}>();

const chartOptions = computed(() => {
    const series = props.series || (props.pieData ? Object.values(props.pieData) : []);
    const labels = props.labels || (props.pieData ? Object.keys(props.pieData) : []);

    return {
        series,
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
                width: props.width || 380,
                type: 'pie',
            },
            labels,
            responsive: [{
                breakpoint: 480,
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
    };
});

</script>
<template>
    <apexchart type="pie" :width="chartOptions.options.chart.width" :options="chartOptions.options" :series="chartOptions.series"></apexchart>
</template>