<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import DatabaseNames from "@/constants/DatabaseNames";
import { useEvalDataStore } from "@/stores/evaluations";
import useTools from "@/composables/useTools";
import { useEvaluationStats } from "@/composables/useEvaluationStats";

const route = useRoute();
const router = useRouter();
const tool = route.params['tool'] as string;
const status = route.params['status'] as string;

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
    evals = evaluationStats.completed5Evals.filter((el) => el.tool == tool);
  } else if (status == 'fourcompleted') {
    evals = evaluationStats.completed4Evals.filter((el) => el.tool == tool);
  } else if (status == 'threecompleted') {
    evals = evaluationStats.completed3Evals.filter((el) => el.tool == tool);
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
  <div class="min-h-screen bg-slate-50">
    <!-- Header with glass effect -->
    <div class="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UButton
              icon="i-heroicons-arrow-left-20-solid"
              color="gray"
              variant="ghost"
              size="md"
              @click="goBack"
              class="rounded-full"
            />
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-semibold text-slate-800">{{ toolObj?.label }} Evaluations</h1>
                <p class="text-sm text-slate-500">{{ statusInfo.description }}</p>
              </div>
            </div>
          </div>
          <UBadge :color="statusInfo.color" size="md" class="px-3 py-1">
            {{ statusInfo.label }}
          </UBadge>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="!completedEvals || completedEvals.length === 0" class="max-w-4xl mx-auto">
        <UCard class="border-0 shadow-lg rounded-2xl">
          <div class="text-center py-12">
            <UIcon name="i-heroicons-clock" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-slate-600 mb-2">Loading Evaluations</h3>
            <p class="text-slate-500">Please wait while we fetch the evaluation data...</p>
          </div>
        </UCard>
      </div>

      <!-- Main Content -->
      <div v-else class="max-w-6xl mx-auto space-y-8">
        <!-- Overview Stats -->
        <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-slate-800">Evaluation Overview</h3>
              <span class="text-xs font-medium px-3 py-1 bg-teal-100 text-teal-700 rounded-full">Live</span>
            </div>
            <p class="text-sm text-slate-500 mt-1">Summary of {{ toolObj?.label }} evaluations</p>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
            <!-- Tool Info -->
            <div class="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50/70 rounded-xl border border-blue-200">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-blue-700 font-medium">Tool</p>
                <p class="text-xl font-bold text-blue-800">{{ toolObj?.label }}</p>
              </div>
            </div>

            <!-- Evaluation Count -->
            <div class="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50/70 rounded-xl border border-green-200">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
                <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p class="text-sm text-green-700 font-medium">Evaluations</p>
                <p class="text-xl font-bold text-green-800">{{ toolsEvals.length }}</p>
              </div>
            </div>

            <!-- Mean Score -->
            <div class="flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50/70 rounded-xl border border-orange-200">
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm">
                <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p class="text-sm text-orange-700 font-medium">Mean Score</p>
                <p class="text-xl font-bold text-orange-800">{{ useEvaluationStats(toolsEvals).overallMeanScore }}</p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Evaluation Dates Table -->
        <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <h3 class="text-lg font-medium text-slate-800">Evaluation Dates</h3>
            <p class="text-sm text-slate-500 mt-1">Complete list of evaluation sessions</p>
          </template>

          <div class="bg-white rounded-xl p-2 border border-slate-200">
            <TablesSelectedEvaluations :evaluations="toolsEvals" />
          </div>
        </UCard>

        <!-- Evaluation Means Table (if not echo) -->
        <UCard v-if="tool !== 'echo'" class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <h3 class="text-lg font-medium text-slate-800">Evaluation Performance</h3>
            <p class="text-sm text-slate-500 mt-1">Detailed score analysis and means</p>
          </template>

          <div class="bg-white rounded-xl p-2 border border-slate-200">
            <TablesSelectedEvaluationMeans :evaluations="toolsEvals" />
          </div>
        </UCard>

        <!-- Echo Tool Message -->
        <UCard v-else class="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div class="text-center py-12">
            <UIcon name="i-heroicons-information-circle" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-slate-600 mb-2">Data Not Available</h3>
            <p class="text-slate-500">Evaluation means data is not available for the ECHO tool at this time.</p>
          </div>
        </UCard>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
            <div class="text-xl font-semibold text-slate-700">{{ toolsEvals.length }}</div>
            <div class="text-xs text-slate-500">Total</div>
          </UCard>
          <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
            <div class="text-xl font-semibold text-slate-700">{{ useEvaluationStats(toolsEvals).overallMeanScore }}</div>
            <div class="text-xs text-slate-500">Mean Score</div>
          </UCard>
          <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
            <div class="text-xl font-semibold text-slate-700">{{ toolObj?.label }}</div>
            <div class="text-xs text-slate-500">Tool</div>
          </UCard>
          <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
            <div class="text-xl font-semibold text-slate-700">{{ statusInfo.label }}</div>
            <div class="text-xs text-slate-500">Status</div>
          </UCard>
        </div>

        <!-- Back Button -->
        <div class="flex justify-center pt-4">
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="outline"
            label="Back to Tools Analysis"
            @click="goBack"
            class="rounded-full px-6"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}
</style>
