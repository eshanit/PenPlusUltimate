<script setup lang="ts">

const props = defineProps<{
    sessionCounts: Array<number>,
        facilities?: Array<string>
}>()

const chartData = {
    series: props.sessionCounts,
    options: {
        title: {
    text: '% Facility Sessions',
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
        labels:props.facilities,
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


</script>
<template>
    <div>
        <apexchart width="" type="pie" :options="chartData.options" :series="chartData.series"></apexchart>
    </div>
</template>