<script setup lang="ts">
import type IEvaluationCounts from "@/interfaces/IEvaluationCounts"

const props = defineProps<{
    evalCounts: IEvaluationCounts
}>()

// Session options for selection (up to 5 sessions)
const sessionOptions = [
    { label: '1 Session', value: 1 },
    { label: '2 Sessions', value: 2 },
    { label: '3 Sessions', value: 3 },
    { label: '4 Sessions', value: 4 },
    { label: '5 Sessions', value: 5 },
]

// Default to showing all 5 sessions
const selectedSessions = ref<number[]>([1, 2, 3, 4, 5])

// Get count for a specific session number
const getSessionCount = (session: number): number => {
    const counts = props.evalCounts
    switch (session) {
        case 1: return counts.oneCompletedCount || 0
        case 2: return counts.twoCompletedCount || 0
        case 3: return counts.threeCompletedCount || 0
        case 4: return counts.fourCompletedCount || 0
        case 5: return counts.allCompletedCount || 0
        default: return 0
    }
}

const chartData = computed(() => {
    const categories = selectedSessions.value.map(s => `${s}-session${s > 1 ? 's' : ''}`)
    const data = selectedSessions.value.map(s => getSessionCount(s))
    
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
                id: 'Evaluations',
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    }
                }
            },
            xaxis: {
                categories: categories
            },
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
            plotOptions: {
                bar: {
                    columnWidth: '60%',
                    borderRadius: 4,
                    dataLabels: {
                        position: 'top'
                    }
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#374151']
                }
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    plotOptions: {
                        bar: {
                            horizontal: false
                        }
                    }
                }
            }]
        },
        series: [{
            name: 'Evaluations',
            data: data
        }]
    }
})

// Watch for session selection changes to update chart
const toggleSession = (session: number) => {
    const index = selectedSessions.value.indexOf(session)
    if (index > -1) {
        // Don't allow deselecting if only 1 session is selected
        if (selectedSessions.value.length > 1) {
            selectedSessions.value = selectedSessions.value.filter(s => s !== session)
        }
    } else {
        selectedSessions.value = [...selectedSessions.value, session].sort((a, b) => a - b)
    }
}
</script>
<template>
    <div>
        <!-- Session Selection Controls -->
        <div class="mb-4 flex flex-wrap gap-2">
            <span class="text-sm font-medium text-gray-700 mr-2 self-center">Show sessions:</span>
            <UButton
                v-for="session in sessionOptions"
                :key="session.value"
                :variant="selectedSessions.includes(session.value) ? 'solid' : 'outline'"
                :color="selectedSessions.includes(session.value) ? 'blue' : 'gray'"
                size="sm"
                @click="toggleSession(session.value)"
                class="transition-all duration-200"
            >
                {{ session.label }}
            </UButton>
        </div>
        
        <!-- Bar Chart -->
        <apexchart 
            width="100%" 
            type="bar" 
            :options="chartData.options" 
            :series="chartData.series"
            class="w-full"
        ></apexchart>
    </div>
</template>
