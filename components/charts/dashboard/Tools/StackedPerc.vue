<script setup lang="ts">

const props = defineProps<{
    countToolSessions: Array<{
        label: string,
        oneCompleted: number,
        twoCompleted: number,
        threeCompleted: number,
        fourCompleted: number,
        fiveCompleted: number
    }>
}>()


const tools = props.countToolSessions.map(tool => tool.label)
const oneCompletedCount = props.countToolSessions.map(r => r.oneCompleted)
const twoCompletedCount = props.countToolSessions.map(r => r.twoCompleted)
const threeCompletedCount = props.countToolSessions.map(r => r.threeCompleted)
const fourCompletedCount = props.countToolSessions.map(r => r.fourCompleted)
const fiveCompletedCount = props.countToolSessions.map(r => r.fiveCompleted)

const chartData = computed(() => {
    return {
        options: {
            title: {
                text: '% of Evaluations per Disease',
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
                id: 'Evaluations',
                stacked: true,
                stackType: '100%'
            },
            xaxis: {
                categories: tools
            },
          
    },
        series: [
            {
                name: '1 Completed',
                data: oneCompletedCount
            },
            {
                name: '2 Completed',
                data: twoCompletedCount
            },
            {
                name: '3 Completed',
                data: threeCompletedCount
            },
            {
                name: '4 Completed',
                data: fourCompletedCount
            },
            {
                name: '5 Completed',
                data: fiveCompletedCount
            }
        ]
}
})
</script>
<template>
    <div>
        <!-- <pre>
            {{ countToolSessions }}
            {{ tools }}
            {{ oneCompletedCount }}
            {{ twoCompletedCount }}
            {{ threeCompletedCount }}
        </pre> -->
        <div>
            <apexchart width="" type="bar" :options="chartData.options" :series="chartData.series"></apexchart>
        </div>
    </div>
</template>