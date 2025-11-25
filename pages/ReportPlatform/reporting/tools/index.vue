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
            fourCompleted: countSessions.fourCompleted,
            threeCompleted: countSessions.threeCompleted,
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
              <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Tools Analysis</h1>
              <p class="text-sm text-gray-600">
                Comprehensive evaluation tools and disease tracking
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Evaluation Sessions Overview -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Evaluations by NCD Tool/Disease</h3>
            <p class="text-sm text-gray-600 mt-1">
              Session breakdown showing evaluations with 1-5 sessions. A completed evaluation has 5 sessions.
            </p>
          </template>
          
          <div class="space-y-6">
            <!-- Chart Toggle -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div>
                <h4 class="font-medium text-blue-900">Chart View</h4>
                <p class="text-sm text-blue-700">Toggle between counts and percentages</p>
              </div>
              <div class="flex gap-2">
                <UButton
                  :variant="!showToolChartPerc ? 'solid' : 'outline'"
                  color="blue"
                  @click="showToolChartPerc = false"
                  class="transition-all duration-200"
                  :class="!showToolChartPerc ? 'shadow-md' : ''"
                >
                  View Counts
                </UButton>
                <UButton
                  :variant="showToolChartPerc ? 'solid' : 'outline'"
                  color="green"
                  @click="showToolChartPerc = true"
                  class="transition-all duration-200"
                  :class="showToolChartPerc ? 'shadow-md' : ''"
                >
                  View Percentages
                </UButton>
              </div>
            </div>

            <!-- Chart Display -->
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div v-if="showToolChartPerc">
                <ChartsDashboardToolsStackedPerc :count-tool-sessions="countToolSessions" />
              </div>
              <div v-else>
                <ChartsDashboardToolsStacked :count-tool-sessions="countToolSessions" />
              </div>
            </div>

            <!-- Evaluation Statistics Table -->
            <div class="mt-6">
              <TablesAGtablesDashboardToolEvaluations :evaluation-stats="evaluationStats" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Competency Response Count -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Competency Response Analysis</h3>
            <p class="text-sm text-gray-600 mt-1">Detailed breakdown of scores across all evaluation tools</p>
          </template>
          
          <div class="space-y-6">
            <!-- View Toggle -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
              <div>
                <h4 class="font-medium text-purple-900">Data View</h4>
                <p class="text-sm text-purple-700">
                  {{ showAggregateTable ? 'Summarized overview' : 'Detailed item breakdown' }}
                </p>
              </div>
              <div>
                <UButton
                  :variant="showAggregateTable ? 'solid' : 'outline'"
                  color="purple"
                  @click="showAggregateTable = !showAggregateTable"
                  class="transition-all duration-200 hover:scale-105"
                  :class="showAggregateTable ? 'shadow-md' : ''"
                >
                  {{ showAggregateTable ? 'View Itemized Details' : 'View Summarized Overview' }}
                </UButton>
              </div>
            </div>

            <!-- Content Description -->
            <div class="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-4 border border-gray-200">
              <p class="text-gray-700 text-center">
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
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ tools.length }}</div>
          <div class="text-sm text-blue-600 font-medium">Total Tools</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">{{ completedEvals?.length }}</div>
          <div class="text-sm text-green-600 font-medium">Evaluations</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">
            {{ countToolSessions.reduce((sum, tool) => sum + tool.totalCompleted, 0) }}
          </div>
          <div class="text-sm text-purple-600 font-medium">Total Sessions</div>
        </UCard>
        
        <UCard class="text-center bg-orange-50/50">
          <div class="text-2xl font-bold text-orange-600">
            {{ countToolSessions.filter(tool => tool.fiveCompleted > 0).length }}
          </div>
          <div class="text-sm text-orange-600 font-medium">Completed Tools</div>
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
        />
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}

/* Custom animations for toggle buttons */
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