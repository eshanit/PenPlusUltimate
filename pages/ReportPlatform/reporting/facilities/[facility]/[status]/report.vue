<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import DatabaseNames from "@/constants/DatabaseNames";
import capitalizeFirstLetter from "@/utilities/capitalizeFirstLetter";

const route = useRoute();
const router = useRouter();
const facility = route.params.facility
const status = route.params.status

const showTool = ref(false);
const completedEvals: any = ref([]);

const useEvaluations = useEvalDataStore();

// Fetch data on component mount
onMounted(async () => {
    completedEvals.value = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
});

// Watch for route changes
watch(
    () => route.params,
    async (newParams) => {
        completedEvals.value = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
    },
    { immediate: true }
);

// Handle route updates
onBeforeRouteUpdate(async (to, from, next) => {
    completedEvals.value = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
    next();
});

const goBack = () => {
    router.back();
};

const toolsEvals = computed(() => {
    const evaluationStats = useEvaluationStats(completedEvals.value);
    let evals;

    if (status == 'completed') {
        evals = evaluationStats.completedEvaluations.filter((el) => el.mentee.facility == facility);
    } else if (status == 'twocompleted') {
        evals = evaluationStats.completed2Evals.filter((el) => el.mentee.facility == facility);
    } else if (status == 'onecompleted') {
        evals = evaluationStats.completed1Evals.filter((el) => el.mentee.facility == facility);
    } else {
        evals = completedEvals.value.filter((el: any) => el.mentee.facility == facility);
    }

    return evals;
});

const ImprovementsToolCount = computed(() => {
    const dataArray = useImprovementsPerTool(toolsEvals.value);
    return dataArray.reduce((acc: { [key: string]: number }, item) => {
        if (item.improvement == true) {
            acc[item.tool] = (acc[item.tool] || 0) + 1;
        }
        return acc;
    }, {} as { [key: string]: number });
});

const useMentees = useMenteeStore();
const countMentees = await useMentees.fetchAllMentees(facility)

const showAggregateTable: Ref<Boolean> = ref(true)

const overallStats = computed(() => {
    return useEvaluationStats(toolsEvals.value);
});
</script>

<template>
    <div :key="route.fullPath" class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50/30">
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
                            <h1 class="text-lg font-bold text-gray-900 truncate capitalize">{{ facility }}</h1>
                            <p class="text-xs text-gray-600 truncate">
                                <span v-if="status == 'completed'">Completed Evaluations</span>
                                <span v-else-if="status == 'twocompleted'">Two Sessions</span>
                                <span v-else-if="status == 'onecompleted'">One Session</span>
                                <span v-else>All Evaluations</span>
                                • {{ toolsEvals.length }} total
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="completedEvals && completedEvals.length > 0" class="px-4 py-6">
            <!-- Quick Stats -->
            <div class="max-w-6xl mx-auto grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
                <UCard class="text-center bg-blue-50/50 p-3">
                    <div class="text-xl font-bold text-blue-600">{{ toolsEvals.length }}</div>
                    <div class="text-xs text-blue-600 font-medium">Evaluations</div>
                </UCard>
                
                <UCard class="text-center bg-green-50/50 p-3">
                    <div class="text-xl font-bold text-green-600">{{ countMentees.length }}</div>
                    <div class="text-xs text-green-600 font-medium">Mentees</div>
                </UCard>
                
                <UCard class="text-center bg-purple-50/50 p-3">
                    <div class="text-xl font-bold text-purple-600">{{ Object.keys(ImprovementsToolCount).length }}</div>
                    <div class="text-xs text-purple-600 font-medium">Tools Improved</div>
                </UCard>
                
                <UCard class="text-center bg-orange-50/50 p-3">
                    <div class="text-xl font-bold text-orange-600">{{ overallStats.overallMeanScore }}</div>
                    <div class="text-xs text-orange-600 font-medium">Mean Score</div>
                </UCard>
            </div>

            <!-- Knowledge Improvement Section -->
            <div class="max-w-6xl mx-auto mb-6">
                <UCard>
                    <template #header>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900">Knowledge Improvement</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            Performance improvements across evaluation tools
                        </p>
                    </template>

                    <div class="space-y-4">
                        <!-- Improvement Summary -->
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                            <p class="text-sm text-gray-700 text-center">
                                <span class="font-bold text-green-600">{{ Object.keys(ImprovementsToolCount).length }}</span> 
                                tools showing improvement at 
                                <span class="font-bold text-blue-600 capitalize">{{ facility }}</span>
                            </p>
                        </div>

                        <!-- Tools Breakdown - Stack on mobile, grid on larger screens -->
                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <div 
                                v-for="tool in Object.keys(ImprovementsToolCount)" 
                                :key="tool"
                                class="bg-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3"
                            >
                                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-blue-600" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="font-semibold text-gray-900 text-sm capitalize">
                                        {{ capitalizeFirstLetter(tool) }}
                                    </div>
                                    <div class="text-xs text-gray-600">
                                        {{ ImprovementsToolCount[tool] }} 
                                        improvement{{ ImprovementsToolCount[tool] !== 1 ? 's' : '' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Improvement Status Table -->
                        <div class="mt-4">
                            <h4 class="text-sm font-semibold text-gray-900 mb-3">Improvement Status by Tool</h4>
                            <div class="overflow-x-auto">
                                <div class="min-w-[600px] sm:min-w-0">
                                    <!-- Mobile Card View -->
                                    <div class="sm:hidden space-y-3">
                                        <div 
                                            v-for="statusItem in useImprovementsPerTool(toolsEvals)" 
                                            :key="`${statusItem.tool}-${statusItem.mentee}`"
                                            class="bg-white border border-gray-200 rounded-lg p-4 space-y-2"
                                        >
                                            <div class="flex justify-between items-center">
                                                <span class="font-semibold text-gray-900 text-sm capitalize">
                                                    {{ capitalizeFirstLetter(statusItem.tool) }}
                                                </span>
                                                <UBadge 
                                                    :color="statusItem.improvement == true ? 'green' : 
                                                            statusItem.improvement == false ? 'red' : 
                                                            statusItem.improvement == 'Max Score' ? 'emerald' : 'gray'"
                                                    size="sm"
                                                >
                                                    <span v-if="statusItem.improvement == true">Improved</span>
                                                    <span v-else-if="statusItem.improvement == false">Regressed</span>
                                                    <span v-else-if="statusItem.improvement == 'Max Score'">Maximum Score</span>
                                                    <span v-else>N/A</span>
                                                </UBadge>
                                            </div>
                                            <div class="text-xs text-gray-600 truncate">
                                                {{ statusItem.mentee }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Desktop Table View -->
                                    <div class="hidden sm:block">
                                        <div class="grid grid-cols-3 gap-4 bg-gray-50 py-3 px-4 rounded-lg font-semibold text-gray-700 text-sm">
                                            <div>Tool</div>
                                            <div>Mentee</div>
                                            <div>Status</div>
                                        </div>
                                        <div 
                                            v-for="statusItem in useImprovementsPerTool(toolsEvals)" 
                                            :key="`${statusItem.tool}-${statusItem.mentee}`"
                                            class="grid grid-cols-3 gap-4 py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <div class="font-medium text-gray-900 text-sm capitalize">
                                                {{ capitalizeFirstLetter(statusItem.tool) }}
                                            </div>
                                            <div class="text-gray-700 text-sm">
                                                {{ statusItem.mentee }}
                                            </div>
                                            <div>
                                                <UBadge 
                                                    :color="statusItem.improvement == true ? 'green' : 
                                                            statusItem.improvement == false ? 'red' : 
                                                            statusItem.improvement == 'Max Score' ? 'emerald' : 'gray'"
                                                    variant="subtle"
                                                    size="sm"
                                                >
                                                    <span v-if="statusItem.improvement == true">Improved</span>
                                                    <span v-else-if="statusItem.improvement == false">Regressed</span>
                                                    <span v-else-if="statusItem.improvement == 'Max Score'">Maximum Score</span>
                                                    <span v-else>N/A</span>
                                                </UBadge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- Competency Response Count -->
            <div class="max-w-6xl mx-auto mb-6">
                <UCard>
                    <template #header>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900">Competency Response Count</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            Score breakdown and performance analysis
                        </p>
                    </template>

                    <div class="space-y-4">
                        <!-- View Toggle -->
                        <div class="flex flex-col sm:flex-row gap-3 justify-between items-center bg-gray-50 rounded-lg p-4">
                            <p class="text-sm text-gray-700 text-center sm:text-left">
                                <span v-if="showAggregateTable">
                                    Summarized breakdown by disease area
                                </span>
                                <span v-else>
                                    Detailed breakdown by evaluation item
                                </span>
                            </p>
                            <UButton 
                                :label="showAggregateTable ? 'View Itemized Details' : 'View Summarized View'" 
                                :color="showAggregateTable ? 'blue' : 'sky'"
                                @click="showAggregateTable = !showAggregateTable"
                                size="sm"
                            />
                        </div>

                        <!-- Table Content -->
                        <div class="overflow-x-auto">
                            <div class="min-w-[600px] sm:min-w-0">
                                <TablesAggregateToolScoreCounts 
                                    v-if="showAggregateTable"
                                    :tool-evals="toolsEvals" 
                                    :mentees="countMentees.length" 
                                />
                                <TablesToolScoreCounts 
                                    v-else
                                    :tool-evals="toolsEvals" 
                                    :mentees="countMentees.length" 
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
                    label="Back to Facilities"
                    @click="goBack"
                    class="w-full sm:w-auto"
                    size="sm"
                />
            </div>

            <div class="pb-8 sm:pb-10" />
        </div>

        <!-- Loading State -->
        <div v-else class="flex items-center justify-center min-h-[200px] px-4">
            <div class="text-center">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                <p class="text-gray-600 text-sm">Loading facility data...</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}

/* Ensure horizontal scrolling for tables on mobile */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>