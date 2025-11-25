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
    console.log('Component mounted, fetching data...');
    completedEvals.value = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
    console.log('Data fetched:', completedEvals.value);
});

// Watch for route changes
watch(
    () => route.params,
    async (newParams) => {
        console.log('Route params changed:', newParams);
        completedEvals.value = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
        console.log('Data fetched:', completedEvals.value);
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

// Get status display information
const statusInfo = computed(() => {
    switch (status) {
        case 'completed':
            return { label: 'Completed', color: 'green', description: '5 sessions completed' };
        case 'twocompleted':
            return { label: 'Two Sessions', color: 'orange', description: '2 sessions completed' };
        case 'onecompleted':
            return { label: 'One Session', color: 'red', description: '1 session completed' };
        default:
            return { label: 'All Scenarios', color: 'blue', description: 'All evaluation scenarios' };
    }
});

// Set page metadata
useSeoMeta({
  title: `${facility} ${statusInfo.value.label} - PenPlus NCD Monitoring`,
  description: `Evaluation details for ${facility} - ${statusInfo.value.description}`
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <UContainer class="py-4">
        <div class="flex items-center space-x-4">
          <UButton 
            icon="i-heroicons-arrow-left" 
            color="gray" 
            variant="ghost" 
            size="sm"
            @click="goBack"
            class="flex-shrink-0"
          />
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ facility }} Evaluations</h1>
              <p class="text-sm text-gray-600">
                {{ statusInfo.description }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Loading State -->
      <div v-if="!completedEvals || completedEvals.length === 0" class="max-w-4xl mx-auto">
        <UCard>
          <div class="text-center py-12">
            <UIcon name="i-heroicons-clock" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-600 mb-2">Loading Evaluations</h3>
            <p class="text-gray-500">Please wait while we fetch the evaluation data...</p>
          </div>
        </UCard>
      </div>

      <!-- Main Content -->
      <div v-else class="max-w-6xl mx-auto">
        <!-- Overview Stats -->
        <div class="mb-8">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Facility Overview</h3>
              <p class="text-sm text-gray-600 mt-1">Summary of {{ facility }} evaluations</p>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Facility Info -->
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-building-office" class="w-8 h-8 text-blue-600" />
                </div>
                <div class="text-2xl font-bold text-blue-600">{{ facility }}</div>
                <div class="text-sm text-gray-600 font-medium">Facility</div>
                <UBadge :color="(statusInfo.color as any)" class="mt-2">
                  {{ statusInfo.label }}
                </UBadge>
              </div>
              
              <!-- Evaluation Count -->
              <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-clipboard-document-list" class="w-8 h-8 text-green-600" />
                </div>
                <div class="text-2xl font-bold text-green-600">{{ toolsEvals.length }}</div>
                <div class="text-sm text-gray-600 font-medium">Evaluations</div>
              </div>
              
              <!-- Mean Score -->
              <div class="text-center">
                <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-chart-bar" class="w-8 h-8 text-orange-600" />
                </div>
                <div class="text-2xl font-bold text-orange-600">
                  {{ useEvaluationStats(toolsEvals).overallMeanScore }}
                </div>
                <div class="text-sm text-gray-600 font-medium">Mean Score</div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Evaluation Dates Table -->
        <div class="mb-8">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Evaluation Dates</h3>
              <p class="text-sm text-gray-600 mt-1">Complete list of evaluation sessions</p>
            </template>
            
            <div class="bg-white rounded-lg border border-gray-200">
              <TablesSelectedEvaluations :evaluations="toolsEvals" />
            </div>
          </UCard>
        </div>

        <!-- Evaluation Means Table -->
        <div class="mb-8">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Evaluation Performance</h3>
              <p class="text-sm text-gray-600 mt-1">Detailed score analysis and means</p>
            </template>
            
            <div class="bg-white rounded-lg border border-gray-200">
              <TablesSelectedEvaluationMeans :evaluations="toolsEvals" />
            </div>
          </UCard>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <UCard class="text-center bg-blue-50/50">
            <div class="text-2xl font-bold text-blue-600">{{ toolsEvals.length }}</div>
            <div class="text-sm text-blue-600 font-medium">Total</div>
          </UCard>
          
          <UCard class="text-center bg-green-50/50">
            <div class="text-2xl font-bold text-green-600">{{ useEvaluationStats(toolsEvals).overallMeanScore }}</div>
            <div class="text-sm text-green-600 font-medium">Mean Score</div>
          </UCard>
          
          <UCard class="text-center bg-purple-50/50">
            <div class="text-2xl font-bold text-purple-600">{{ facility }}</div>
            <div class="text-sm text-purple-600 font-medium">Facility</div>
          </UCard>
          
          <UCard class="text-center bg-orange-50/50">
            <div class="text-2xl font-bold text-orange-600">{{ statusInfo.label }}</div>
            <div class="text-sm text-orange-600 font-medium">Status</div>
          </UCard>
        </div>

        <!-- Back Button -->
        <div class="flex justify-center">
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="outline"
            label="Back to Facility Reports"
            @click="goBack"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}
</style>