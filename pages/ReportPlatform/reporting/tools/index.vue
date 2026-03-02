<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import DatabaseNames from "@/constants/DatabaseNames";

const router = useRouter();

const goBack = () => {
    router.back();
};

const showToolChartPerc: Ref<Boolean> = ref(false)

// Evaluations
const useEvaluations = useEvalDataStore();
const completedEvals = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
const evaluationStats = useEvaluationStats(completedEvals)

// Progress tracking
const tools = useTools

const countToolSessions = computed(() => {
    const arr: any[] = []
    tools.forEach((tool) => {
        const countSessions = useCountToolSessionsCompleted(tool.name, evaluationStats)
        arr.push({
            label: tool.label,
            name: tool.name,
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

// Score counts
const scoreCounts = computedAsync(async () => {
    const evalArr = await Promise.all(
        tools.map(async (tool) => {
            const toolEvals = await useEvaluations.fetchToolEvals(tool.name);
            return {
                name: tool.label,
                counts: useNumResponsesPerTool(toolEvals)
            };
        })
    );
    return evalArr;
});

const showAggregateTable: Ref<Boolean> = ref(true)

// Set page metadata
useSeoMeta({
  title: 'Tools Analysis - PenPlus NCD Monitoring',
  description: 'Comprehensive analysis of evaluation tools and disease tracking'
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
                <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-semibold text-slate-800">Tools Analysis</h1>
                <p class="text-sm text-slate-500">Evaluation tools and disease tracking</p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4 sm:px-6 lg:px-8">
      <!-- Evaluation Sessions Overview -->
      <div class="max-w-6xl mx-auto mb-10">
        <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-slate-800">Evaluations by NCD Tool/Disease</h3>
              <span class="text-xs font-medium px-3 py-1 bg-teal-100 text-teal-700 rounded-full">Live</span>
            </div>
            <p class="text-sm text-slate-500 mt-1">
              Session breakdown showing evaluations with 1‑5 sessions. A completed evaluation has 5 sessions.
            </p>
          </template>

          <div class="space-y-6 p-2">
            <!-- Chart Toggle -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div>
                <h4 class="font-medium text-blue-800">Chart View</h4>
                <p class="text-sm text-blue-600">Toggle between counts and percentages</p>
              </div>
              <div class="flex gap-3">
                <UButton
                  :variant="!showToolChartPerc ? 'solid' : 'outline'"
                  color="blue"
                  @click="showToolChartPerc = false"
                  class="rounded-lg transition-all duration-200"
                  :class="!showToolChartPerc ? 'shadow-md' : ''"
                >
                  View Counts
                </UButton>
                <UButton
                  :variant="showToolChartPerc ? 'solid' : 'outline'"
                  color="blue"
                  @click="showToolChartPerc = true"
                  class="rounded-lg transition-all duration-200"
                  :class="showToolChartPerc ? 'shadow-md' : ''"
                >
                  View Percentages
                </UButton>
              </div>
            </div>

            <!-- Chart Display -->
            <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div v-if="showToolChartPerc">
                <ChartsDashboardToolsStackedPerc :count-tool-sessions="countToolSessions" />
              </div>
              <div v-else>
                <ChartsDashboardToolsStacked :count-tool-sessions="countToolSessions" />
              </div>
            </div>

            <!-- Evaluation Statistics Table -->
            <div class="mt-4">
              <TablesAGtablesDashboardToolEvaluations :evaluation-stats="evaluationStats" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Competency Response Count -->
      <div class="max-w-6xl mx-auto mb-10">
        <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <h3 class="text-lg font-medium text-slate-800">Competency Response Analysis</h3>
            <p class="text-sm text-slate-500 mt-1">Detailed breakdown of scores across all evaluation tools</p>
          </template>

          <div class="space-y-6 p-2">
            <!-- View Toggle -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <div>
                <h4 class="font-medium text-purple-800">Data View</h4>
                <p class="text-sm text-purple-600">
                  {{ showAggregateTable ? 'Summarized overview' : 'Detailed item breakdown' }}
                </p>
              </div>
              <div>
                <UButton
                  :variant="showAggregateTable ? 'solid' : 'outline'"
                  color="purple"
                  @click="showAggregateTable = !showAggregateTable"
                  class="rounded-lg transition-all duration-200 hover:scale-105"
                  :class="showAggregateTable ? 'shadow-md' : ''"
                >
                  {{ showAggregateTable ? 'View Itemized Details' : 'View Summarized Overview' }}
                </UButton>
              </div>
            </div>

            <!-- Content Description -->
            <div class="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl p-4 border border-slate-200">
              <p class="text-slate-700 text-center">
                <span v-if="showAggregateTable">
                  The table below shows the <span class="font-semibold text-blue-600">summarized</span> number of scores per disease evaluated.
                </span>
                <span v-else>
                  The table below shows the <span class="font-semibold text-purple-600">detailed itemized breakdown</span> by each evaluation item.
                </span>
              </p>
            </div>

            <!-- Table Display -->
            <div class="mt-4">
              <div v-if="showAggregateTable">
                <TablesAggregateToolScoreCounts :tool-evals="completedEvals" />
              </div>
              <div v-else>
                <TablesToolScoreCounts :tool-evals="completedEvals" />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ tools.length }}</div>
          <div class="text-xs text-slate-500">Total Tools</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ completedEvals?.length }}</div>
          <div class="text-xs text-slate-500">Evaluations</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">
            {{ countToolSessions.reduce((sum, tool) => sum + tool.totalCompleted, 0) }}
          </div>
          <div class="text-xs text-slate-500">Total Sessions</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">
            {{ countToolSessions.filter(tool => tool.fiveCompleted > 0).length }}
          </div>
          <div class="text-xs text-slate-500">Completed Tools</div>
        </UCard>
      </div>

      <!-- Back Button -->
      <div class="max-w-6xl mx-auto flex justify-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Reports"
          @click="goBack"
          class="rounded-full px-6"
        />
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Custom animations for toggle buttons (if needed) */
.toggle-enter-active,
.toggle-leave-active {
  transition: all 0.3s ease;
}

.toggle-enter-from,
.toggle-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
