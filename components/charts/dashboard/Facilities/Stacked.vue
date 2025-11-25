<script setup lang="ts">

const props = defineProps<{
    evaluationStats: any,
    facilities: Array<string>,
}>()

const countToolSessions = computed(()=> {
    const arr: any[] = []
    props.facilities.forEach( (facility)=> {
        const countSessions = useCountFacilitySessionsCompleted(facility, props.evaluationStats)
       arr.push({
        name: facility,
        fiveCompleted: countSessions.allCompletedCount,
        fourCompleted: countSessions.fourCompletedCount,
        threeCompleted: countSessions.threeCompletedCount,
        twoCompleted: countSessions.twoCompletedCount,
        oneCompleted: countSessions.oneCompletedCount,
        totalCompleted: countSessions.totalCompletedCount
       })
    });

    return arr
})

const facilitiesArr = countToolSessions.value.map(r => r.name)
const oneCompletedCount = countToolSessions.value.map(r => r.oneCompleted)
const twoCompletedCount = countToolSessions.value.map(r => r.twoCompleted)
const threeCompletedCount = countToolSessions.value.map(r => r.threeCompleted)
const fourCompletedCount = countToolSessions.value.map(r => r.fourCompleted)
const fiveCompletedCount = countToolSessions.value.map(r => r.fiveCompleted)

const chartData = computed(() => {
    return {
        options: {
            title: {
                text: 'Number of Evaluations per Facility',
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
            },
            xaxis: {
                categories: facilitiesArr
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