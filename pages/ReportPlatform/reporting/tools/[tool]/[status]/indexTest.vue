<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import DatabaseNames from "@/constants/DatabaseNames";
import { useEvalDataStore } from "@/stores/evaluations";
import useTools from "@/composables/useTools";
import { useEvaluationStats } from "@/composables/useEvaluationStats";

const route = useRoute();
const router = useRouter();
const tool = route.params.tool;
const status = route.params.status;

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

const tools = useTools;
const toolObj = tools.find((el) => el.name == tool);

const toolsEvals = computed(() => {
    const evaluationStats = useEvaluationStats(completedEvals.value);

    let evals;

    if (status == 'completed') {
        evals = evaluationStats.completedEvaluations.filter((el) => el.tool == tool);
    } else if (status == 'twocompleted') {
        evals = evaluationStats.completed2Evals.filter((el) => el.tool == tool);
    } else if (status == 'onecompleted') {
        evals = evaluationStats.completed1Evals.filter((el) => el.tool == tool);
    } else {
        evals = completedEvals.value.filter((el: any) => el.tool == tool);
    }

    return evals;
});

// Get status display information
const statusInfo = computed<{ label: string; color: any; description: string }>(() => {
    switch (status) {
        case 'completed':
            return { label: 'Completed', color: 'green', description: '5 sessions completed' };
        case 'twocompleted':
            return { label: 'Two Sessions', color: 'yellow', description: '2 sessions completed' };
        case 'onecompleted':
            return { label: 'One Session', color: 'red', description: '1 session completed' };
        default:
            return { label: 'All Scenarios', color: 'blue', description: 'All evaluation scenarios' };
    }
});

// Set page metadata
useSeoMeta({
  title: `${toolObj?.label} ${statusInfo.value.label} - PenPlus NCD Monitoring`,
  description: `Evaluation details for ${toolObj?.label} - ${statusInfo.value.description}`
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
              <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ toolObj?.label }} Evaluations</h1>
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
              <h3 class="text-lg font-semibold text-gray-900">Evaluation Overview</h3>
              <p class="text-sm text-gray-600 mt-1">Summary of {{ toolObj?.label }} evaluations</p>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Tool Info -->
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-wrench-screwdriver" class="w-8 h-8 text-blue-600" />
                </div>
                <div class="text-2xl font-bold text-blue-600">{{ toolObj?.label }}</div>
                <div class="text-sm text-gray-600 font-medium">Tool</div>
                <UBadge :color="statusInfo.color" class="mt-2">
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
        <div class="mb-8" v-if="tool !== 'echo'">
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

        <!-- Echo Tool Message -->
        <div v-else class="mb-8">
          <UCard class="bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200">
            <div class="text-center py-8">
              <UIcon name="i-heroicons-information-circle" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-600 mb-2">Data Not Available</h3>
              <p class="text-gray-500">
                Evaluation means data is not available for the ECHO tool at this time.
              </p>
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
            <div class="text-2xl font-bold text-purple-600">{{ toolObj?.label }}</div>
            <div class="text-sm text-purple-600 font-medium">Tool</div>
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
            label="Back to Tools Analysis"
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