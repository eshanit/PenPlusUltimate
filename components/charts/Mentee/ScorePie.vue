<script setup lang="ts">


const props = defineProps<{
    tool: string,
    scoreCounts: {
        "1": number,
        "2": number,
        "3": number
    }
}>()

const chartData = {
    series: Object.values(props.scoreCounts),
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
        labels:["Score of 1", "Score of 2", "Score of 3"],
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