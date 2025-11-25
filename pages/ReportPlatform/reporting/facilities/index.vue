<script setup lang="ts">
import type IDistrict from "@/interfaces/IDistrict";
import Routes from '@/constants/Routes';
import DatabaseNames from "@/constants/DatabaseNames";
import { computedAsync } from "@vueuse/core";

const router = useRouter();

const goBack = () => {
    router.back();
};

const facilities: Ref<Array<string>> = ref([])

// Districts
const useDistricts = useDistrictsStore();
const districts: Array<IDistrict> = await useDistricts.fetchDistricts();

districts?.forEach((d: any) => {
    facilities.value.push(d.facilities);
})

// Stats
const facilityMenteeCounts: Ref<Array<any>> = ref([])
const facilityEvalCounts: Ref<Array<any>> = ref([])

// Mentees
const useMentees = useMenteeStore()

const facilityMentees = async (facility: string) => {
    return await useMentees.fetchAllMentees(facility)
}

// Evaluations
const useEvaluations = useEvalDataStore();
const completedEvals = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
const evaluationStats = useEvaluationStats(completedEvals)

const countSessionsFacility = (facility: string) => {
    const allCompleted = evaluationStats.completedEvaluations.filter((el) => {
        return el.mentee.facility == facility
    })

    const twoCompleted = evaluationStats.completed2Evals.filter((el) => {
        return el.mentee.facility == facility
    })

    const oneCompleted = evaluationStats.completed1Evals.filter((el) => {
        return el.mentee.facility == facility
    })

    const allEvaluations = completedEvals.filter((el: any) => {
        return (el.mentee.facility == facility)
    })

    // Means
    let allScores = [];
    allScores = allEvaluations.map((el: any) => {
        return el.sessions
    })

    let allSessions = [];
    allSessions = allScores.map((el: any) => {
        return [
            el.session_1?.evalItemScores,
            el.session_2?.evalItemScores,
            el.session_3?.evalItemScores
        ].flat(2).filter(item => item != null)
    })

    // Flatten the array and map scores to numbers
    const flattenedScores = allSessions.flat().map((item: any) => parseFloat(item.score));
    const totalScore = flattenedScores.reduce((sum: any, score: any) => sum + score, 0);
    const count = flattenedScores.length;
    const meanScore = count > 0 ? (totalScore / count).toFixed(2) : "0.00";

    return {
        allCompletedCount: allCompleted.length,
        twoCompletedCount: twoCompleted.length,
        oneCompletedCount: oneCompleted.length,
        allCompletedMean: meanScore
    }
}

// Compute facility data
computedAsync(() => {
    const allPromises: any[] = [];
    facilities.value.flat().forEach((f: any) => allPromises.push(
        facilityMentees(f).then((mentees) => {
            facilityMenteeCounts.value.push({
                facility: f,
                mentees: mentees?.length
            })

            facilityEvalCounts.value.push({
                facility: f,
                completedEvals: countSessionsFacility(f).allCompletedCount,
                twoCompletedEvals: countSessionsFacility(f).twoCompletedCount,
                oneCompletedEvals: countSessionsFacility(f).oneCompletedCount,
                totalEvals: countSessionsFacility(f).allCompletedCount +
                    countSessionsFacility(f).twoCompletedCount +
                    countSessionsFacility(f).oneCompletedCount
            })
        })
    ))
    Promise.all(allPromises)
})

const showFacilityChartPerc: Ref<Boolean> = ref(false)
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50/30">
        <!-- Header - Mobile First -->
        <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div class="px-4 py-3">
                <div class="flex items-center space-x-3">
                    <UButton 
                        icon="i-heroicons-arrow-left" 
                        color="gray" 
                        variant="ghost" 
                        size="sm"
                        @click="goBack"
                        class="flex-shrink-0"
                    />
                    <div class="flex items-center space-x-2 min-w-0 flex-1">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <UIcon name="i-heroicons-building-office" class="w-4 h-4 text-white" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <h1 class="text-lg font-bold text-gray-900">Facilities Analysis</h1>
                            <p class="text-xs text-gray-600 truncate">
                                {{ facilities.flat().length }} facilities • Performance overview
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-4 py-6">
            <!-- Quick Stats -->
            <div class="max-w-6xl mx-auto grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
                <UCard class="text-center bg-blue-50/50 p-3">
                    <div class="text-xl font-bold text-blue-600">{{ facilities.flat().length }}</div>
                    <div class="text-xs text-blue-600 font-medium">Facilities</div>
                </UCard>
                
                <UCard class="text-center bg-green-50/50 p-3">
                    <div class="text-xl font-bold text-green-600">
                        {{ facilityMenteeCounts.reduce((acc, curr) => acc + curr.mentees, 0) }}
                    </div>
                    <div class="text-xs text-green-600 font-medium">Total Mentees</div>
                </UCard>
                
                <UCard class="text-center bg-purple-50/50 p-3">
                    <div class="text-xl font-bold text-purple-600">
                        {{ evaluationStats.completedEvaluations.length }}
                    </div>
                    <div class="text-xs text-purple-600 font-medium">Completed Evals</div>
                </UCard>
                
                <UCard class="text-center bg-orange-50/50 p-3">
                    <div class="text-xl font-bold text-orange-600">
                        {{ completedEvals.length }}
                    </div>
                    <div class="text-xs text-orange-600 font-medium">Total Sessions</div>
                </UCard>
            </div>

            <!-- Mentees by Facility -->
            <div class="max-w-6xl mx-auto mb-6">
                <UCard>
                    <template #header>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900">Mentees by Facility</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            Providers and their evaluation performance per facility
                        </p>
                    </template>
                    
                    <div class="space-y-4">
                        <!-- Mobile Card View -->
                        <div class="sm:hidden space-y-4">
                            <div 
                                v-for="facility in facilityMenteeCounts" 
                                :key="facility.facility"
                                class="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                            >
                                <div class="flex justify-between items-start">
                                    <h4 class="font-semibold text-gray-900 text-sm">{{ facility.facility }}</h4>
                                    <UBadge 
                                        :color="parseFloat(countSessionsFacility(facility.facility).allCompletedMean) < 2.5 ? 'red' : 'green'"
                                        size="sm"
                                    >
                                        {{ countSessionsFacility(facility.facility).allCompletedMean }}
                                    </UBadge>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-3 text-xs">
                                    <div class="text-center">
                                        <div class="font-medium text-gray-500">Mentees</div>
                                        <NuxtLink 
                                            :to="{
                                                name: Routes.REPORTING_FACILITY_STATUS.name,
                                                params: { facility: facility.facility, status: 'all' }
                                            }"
                                        >
                                            <UButton variant="soft" size="xs" color="gray" class="w-full">
                                                {{ facility.mentees }}
                                            </UButton>
                                        </NuxtLink>
                                    </div>
                                    <div class="text-center">
                                        <div class="font-medium text-gray-500">Actions</div>
                                        <NuxtLink 
                                            :to="{
                                                name: Routes.REPORTING_FACILITY_STATUS_REPORT.name,
                                                params: { facility: facility.facility, status: 'all' }
                                            }"
                                        >
                                            <UButton variant="soft" size="xs" color="orange" class="w-full">
                                                Report
                                            </UButton>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Desktop Table View -->
                        <div class="hidden sm:block overflow-x-auto">
                            <div class="min-w-[600px]">
                                <!-- Table Header -->
                                <div class="grid grid-cols-4 gap-4 bg-gray-50 py-3 px-4 rounded-lg font-semibold text-gray-700 text-sm">
                                    <div>Facility</div>
                                    <div class="text-center">Mentees</div>
                                    <div class="text-center">Mean Score</div>
                                    <div class="text-center">Actions</div>
                                </div>
                                
                                <!-- Table Rows -->
                                <div 
                                    v-for="facility in facilityMenteeCounts" 
                                    :key="facility.facility"
                                    class="grid grid-cols-4 gap-4 py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <div class="font-medium text-gray-900 text-sm">
                                        {{ facility.facility }}
                                    </div>
                                    <div class="text-center">
                                        <NuxtLink 
                                            :to="{
                                                name: Routes.REPORTING_FACILITY_STATUS.name,
                                                params: { facility: facility.facility, status: 'all' }
                                            }"
                                        >
                                            <UButton variant="soft" size="sm" color="gray">
                                                {{ facility.mentees }}
                                            </UButton>
                                        </NuxtLink>
                                    </div>
                                    <div class="text-center">
                                        <UBadge 
                                            :color="parseFloat(countSessionsFacility(facility.facility).allCompletedMean) < 2.5 ? 'red' : 'green'"
                                            variant="subtle"
                                        >
                                            {{ countSessionsFacility(facility.facility).allCompletedMean }}
                                        </UBadge>
                                    </div>
                                    <div class="flex justify-center">
                                        <NuxtLink 
                                            :to="{
                                                name: Routes.REPORTING_FACILITY_STATUS_REPORT.name,
                                                params: { facility: facility.facility, status: 'all' }
                                            }"
                                        >
                                            <UButton variant="soft" size="sm" color="orange">
                                                Report
                                            </UButton>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- Progress Tracking -->
            <div class="max-w-6xl mx-auto mb-6">
                <UCard class="bg-gradient-to-br from-blue-50 to-cyan-50/30 border border-blue-200">
                    <template #header>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900">Progress Tracking</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            Evaluation sessions breakdown by facility
                        </p>
                    </template>
                    
                    <div class="space-y-4">
                        <!-- Chart Toggle -->
                        <div class="flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <p class="text-sm text-gray-700 text-center sm:text-left">
                                Number of evaluation sessions per facility, broken down by completion status
                            </p>
                            <UButton
                                @click="showFacilityChartPerc = !showFacilityChartPerc"
                                :label="showFacilityChartPerc ? 'View Counts' : 'View Percentages'"
                                color="blue"
                                size="sm"
                                variant="outline"
                            />
                        </div>

                        <!-- Charts -->
                        <div class="bg-white rounded-lg p-4 border border-gray-200">
                            <div v-if="showFacilityChartPerc" class="overflow-x-auto">
                                <div class="min-w-[600px]">
                                    <ChartsDashboardFacilitiesStackedPerc 
                                        :evaluation-stats="evaluationStats"
                                        :facilities="facilities?.flat()" 
                                    />
                                </div>
                            </div>
                            <div v-else class="overflow-x-auto">
                                <div class="min-w-[600px]">
                                    <ChartsDashboardFacilitiesStacked 
                                        :evaluation-stats="evaluationStats"
                                        :facilities="facilities?.flat()" 
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Facility Evaluations Table -->
                        <div class="overflow-x-auto">
                            <div class="min-w-[600px]">
                                <TablesAGtablesDashboardFacilityEvaluations 
                                    :evaluation-stats="evaluationStats"
                                    :facilities="facilities?.flat()" 
                                />
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- Back Button -->
            <div class="max-w-6xl mx-auto flex justify-center">
                <UButton
                    icon="i-heroicons-arrow-left"
                    color="gray"
                    variant="outline"
                    label="Back to Dashboard"
                    @click="goBack"
                    class="w-full sm:w-auto"
                    size="sm"
                />
            </div>

            <div class="pb-8 sm:pb-10" />
        </div>
    </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}

/* Ensure horizontal scrolling for charts and tables on mobile */
.chart-container,
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>