<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import DatabaseNames from "@/constants/DatabaseNames";
import capitalizeFirstLetter from "@/utilities/capitalizeFirstLetter";

const route = useRoute();
const router = useRouter();
const district = route.params.district
const status = route.params.status

const showTool = ref(false);
const completedEvals: any = ref([]);

const useEvaluations = useEvalDataStore();

// Fetch data on component mount
onMounted(async () => {
    console.log('Component mounted, fetching data...');
    completedEvals.value = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
});

// Watch for route changes
watch(
    () => route.params,
    async (newParams) => {
        console.log('Route params changed:', newParams);
        completedEvals.value = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
    },
    { immediate: true }
);

// Handle route updates
onBeforeRouteUpdate(async (to, from, next) => {
    console.log('Route updated, fetching data...');
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
        evals = evaluationStats.completedEvaluations.filter((el) => el.mentee.district == district);
    } else if (status == 'fourcompleted') {
        evals = evaluationStats.completed4Evals.filter((el) => el.mentee.district == district);
    } else if (status == 'threecompleted') {
        evals = evaluationStats.completed3Evals.filter((el) => el.mentee.district == district);
    } else if (status == 'twocompleted') {
        evals = evaluationStats.completed2Evals.filter((el) => el.mentee.district == district);
    } else if (status == 'onecompleted') {
        evals = evaluationStats.completed1Evals.filter((el) => el.mentee.district == district);
    } else {
        evals = completedEvals.value.filter((el: any) => el.mentee.district == district);
    }

    return evals;
});

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
                            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-white" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <h1 class="text-lg font-bold text-gray-900 truncate">{{ district }}</h1>
                            <p class="text-xs text-gray-600 truncate">
                                <span v-if="status == 'completed'">Completed Evaluations</span>
                                <span v-else-if="status == 'fourcompleted'">Four Sessions Completed</span>
                                <span v-else-if="status == 'threecompleted'">Three Sessions Completed</span>
                                <span v-else-if="status == 'twocompleted'">Two Sessions Completed</span>
                                <span v-else-if="status == 'onecompleted'">One Session Completed</span>
                                <span v-else>All Evaluations</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="completedEvals && completedEvals.length > 0" class="px-4 py-6">
            <!-- District Stats - Stack on mobile, side by side on larger screens -->
            <div class="max-w-6xl mx-auto mb-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- District Info -->
                    <UCard class="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                        <div class="text-center">
                            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 class="text-lg font-bold text-blue-600 capitalize">{{ district }}</h3>
                            <div class="mt-1">
                                <UBadge 
                                    v-if="status == 'completed'" 
                                    color="green" 
                                    size="sm"
                                >
                                    Completed
                                </UBadge>
                                <UBadge 
                                    v-else-if="status == 'fourcompleted'" 
                                    color="lime" 
                                    size="sm"
                                >
                                    Four Sessions
                                </UBadge>
                                <UBadge 
                                    v-else-if="status == 'threecompleted'" 
                                    color="yellow" 
                                    size="sm"
                                >
                                    Three Sessions
                                </UBadge>
                                <UBadge 
                                    v-else-if="status == 'twocompleted'" 
                                    color="orange" 
                                    size="sm"
                                >
                                    Two Sessions
                                </UBadge>
                                <UBadge 
                                    v-else-if="status == 'onecompleted'" 
                                    color="red" 
                                    size="sm"
                                >
                                    One Session
                                </UBadge>
                                <UBadge 
                                    v-else 
                                    color="sky" 
                                    size="sm"
                                >
                                    All Scenarios
                                </UBadge>
                            </div>
                        </div>
                    </UCard>

                    <!-- Mean Score -->
                    <UCard class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                        <div class="text-center">
                            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-green-600" />
                            </div>
                            <div class="text-2xl font-bold text-green-600">{{ overallStats.overallMeanScore }}</div>
                            <div class="text-sm font-medium text-green-700">Overall Mean Score</div>
                            <div class="text-xs text-green-600 mt-1">
                                {{ toolsEvals.length }} evaluation{{ toolsEvals.length !== 1 ? 's' : '' }}
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>

            <!-- Quick Stats - 4 columns on medium+, 2 on mobile -->
            <div class="max-w-6xl mx-auto grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
                <UCard class="text-center bg-blue-50/50 p-3">
                    <div class="text-xl font-bold text-blue-600">{{ toolsEvals.length }}</div>
                    <div class="text-xs text-blue-600 font-medium">Evaluations</div>
                </UCard>
                
                <UCard class="text-center bg-purple-50/50 p-3">
                    <div class="text-xl font-bold text-purple-600">{{ overallStats.completedEvaluations.length }}</div>
                    <div class="text-xs text-purple-600 font-medium">Completed</div>
                </UCard>
                
                <UCard class="text-center bg-orange-50/50 p-3">
                    <div class="text-xl font-bold text-orange-600">{{ new Set(toolsEvals.map((e: any) => e.mentee.facility)).size }}</div>
                    <div class="text-xs text-orange-600 font-medium">Facilities</div>
                </UCard>
                
                <UCard class="text-center bg-rose-50/50 p-3">
                    <div class="text-xl font-bold text-rose-600">{{ new Set(toolsEvals.map((e: any) => e.mentee.profession)).size }}</div>
                    <div class="text-xs text-rose-600 font-medium">Professions</div>
                </UCard>
            </div>

            <!-- Evaluation Dates -->
            <div class="max-w-6xl mx-auto mb-6">
                <UCard>
                    <template #header>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900">Evaluation Dates</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">All evaluations in {{ district }}</p>
                    </template>
                    
                    <div class="overflow-x-auto">
                        <div class="min-w-[600px] sm:min-w-0">
                            <TablesSelectedEvaluations :evaluations="toolsEvals" />
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- Evaluation Means -->
            <div class="max-w-6xl mx-auto mb-6">
                <UCard>
                    <template #header>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900">Evaluation Means</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">Performance statistics by tool</p>
                    </template>
                    
                    <div class="overflow-x-auto">
                        <div class="min-w-[600px] sm:min-w-0">
                            <TablesSelectedEvaluationMeans :evaluations="toolsEvals" />
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
        </div>

        <!-- Loading State -->
        <div v-else class="flex items-center justify-center min-h-[200px] px-4">
            <div class="text-center">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                <p class="text-gray-600 text-sm">Loading evaluation data...</p>
            </div>
        </div>

        <div class="pb-8 sm:pb-10" />
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