<script setup lang="ts">
import Routes from "@/constants/Routes";
import { format } from 'date-fns'
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { useScoreCount } from "@/composables/useScoreCount";
import { useScoreStatistics } from "@/composables/useScoreStatistics";
import type { ScoreCount } from "@/composables/useScoreCount";
import { useEvalDataStore } from "@/stores/evaluations";
import { useEvaluation } from "@/composables/useEvaluation";
import { useProcessLocalStorage } from "@/composables/useProcessLocalStorage";

// State and data
const route = useRoute()
const tool = route.params.tool
const isLoading = ref(false)
const showSummary = ref(false)

// Evaluation data
const menteeData = ref<any>(null)
const scoreMarks = ref<any>(null)
const scoreCounts = ref<ScoreCount>({
  one: 0,
  two: 0,
  three: 0,
  four: 0,
  five: 0
})
const scoreStats = ref<any>({})
const evalSession = ref<any>(null)
const formattedDate = ref('')

// Store
const evaluationStore = useEvalDataStore()

// Get evaluation items
const evalData = useEvaluation()
const evalItems = computed(() => {
  return evalData.find((e) => e.tool === tool)
})
const totalItems = computed(() => evalItems.value?.numItems || 0)
const scoredItems = computed(() => {
  return scoreMarks.value?.evalItemScores?.filter((s: any) => s.score !== undefined).length || 0
})
const completionRate = computed(() => {
  if (totalItems.value === 0) return 0
  return Math.round((scoredItems.value / totalItems.value) * 100)
})

// Initialize data
onMounted(() => {
  menteeData.value = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATED_MENTEE)
  scoreMarks.value = useProcessLocalStorage().retrieve(LocalStorageKeys.SCORES)
  evalSession.value = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATION_SESSION)

  const now = new Date(Date.now());
  formattedDate.value = format(now, 'MMMM dd, yyyy');

  if (scoreMarks.value?.evalItemScores) {
    scoreCounts.value = useScoreCount(scoreMarks.value.evalItemScores)
    scoreStats.value = useScoreStatistics(scoreMarks.value.evalItemScores)
  }
})

// Navigation
const goBack = () => {
  navigateTo({
    name: Routes.EVALUATION_TOOL.name,
    params: { tool: tool }
  });
};

const submitScores = async () => {
  isLoading.value = true;
  try {
    if (evalSession.value == '1') {
      await evaluationStore.storeScores(tool)
    } else {
      await evaluationStore.createSessionEval()
    }
  } catch (error) {
    console.error('Failed to submit scores:', error);
  } finally {
    isLoading.value = false;
  }
}

// Set page metadata
useSeoMeta({
  title: 'Evaluation Summary - PenPlus NCD Monitoring',
  description: 'Review and submit evaluation scores'
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <UContainer class="py-4">
        <div class="flex items-center space-x-4">
          <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" @click="goBack"
            class="flex-shrink-0" />
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-document-check" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Evaluation Summary</h1>
              <p class="text-sm text-gray-600">
                Review scores before submission
                <span class="text-blue-600 font-medium"> • {{ tool }}</span>
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-6 px-4">
      <!-- Progress Indicator -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Evaluation Progress</span>
          <span class="text-sm text-gray-500">Final Review</span>
        </div>
        <UProgress :value="90" size="sm" color="green" />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Setup</span>
          <span>Evaluation</span>
          <span class="font-medium text-green-600">Review</span>
          <span>Submit</span>
        </div>
      </div>

      <!-- Completion Banner -->
      <UCard class="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-xl font-bold mb-2">Evaluation Complete!</h2>
            <p class="text-green-100 opacity-90">
              Review all scores below and submit when ready. This completes session {{ evalSession }} of the evaluation.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
            <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UIcon name="i-heroicons-check-badge" class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Evaluation Information -->
      <UCard class="mb-6 shadow-lg border-0">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Evaluation Details</h3>
            <UBadge color="blue" variant="subtle">
              Session {{ evalSession }}
            </UBadge>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-600">Healthcare Provider</div>
              <div class="font-semibold text-gray-900" v-if="menteeData">
                {{ menteeData.firstname }} {{ menteeData.lastname }}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-600">Evaluation Date</div>
              <div class="font-semibold text-gray-900">{{ formattedDate }}</div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-600">Evaluation Tool</div>
              <div class="font-semibold text-gray-900 capitalize">{{ tool }}</div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-600">Items Completed</div>
              <div class="font-semibold text-gray-900">
                {{ totalItems }} items
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Score Distribution -->
      <!-- Score Distribution -->
      <UCard class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Score Distribution</h3>
        </template>

        <div class="space-y-4">
           <!-- Score 5 - Outstanding -->
           <div
             class="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
             <div class="flex items-center space-x-3">
               <div class="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                 <span class="text-white font-bold text-lg">5</span>
               </div>
               <div>
                 <div class="font-semibold text-gray-900">Outstanding</div>
                 <div class="text-sm text-gray-600">Exceptional performance</div>
               </div>
             </div>
             <div class="text-right">
               <div class="text-3xl font-bold text-teal-600">
                 {{ scoreCounts.five }}
               </div>
               <div class="text-sm text-gray-600">items</div>
             </div>
           </div>

           <!-- Score 4 - Highly Competent -->
           <div
             class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
             <div class="flex items-center space-x-3">
               <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                 <span class="text-white font-bold text-lg">4</span>
               </div>
               <div>
                 <div class="font-semibold text-gray-900">Highly Competent</div>
                 <div class="text-sm text-gray-600">Strong performance</div>
               </div>
             </div>
             <div class="text-right">
               <div class="text-3xl font-bold text-green-600">
                 {{ scoreCounts.four }}
               </div>
               <div class="text-sm text-gray-600">items</div>
             </div>
           </div>

           <!-- Score 3 - Competent -->
           <div
             class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200">
             <div class="flex items-center space-x-3">
               <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                 <span class="text-white font-bold text-lg">3</span>
               </div>
               <div>
                 <div class="font-semibold text-gray-900">Competent</div>
                 <div class="text-sm text-gray-600">Skill demonstrated adequately</div>
               </div>
             </div>
             <div class="text-right">
               <div class="text-3xl font-bold text-blue-600">
                 {{ scoreCounts.three }}
               </div>
               <div class="text-sm text-gray-600">items</div>
             </div>
           </div>

           <!-- Score 2 - Needs Improvement -->
           <div
             class="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
             <div class="flex items-center space-x-3">
               <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                 <span class="text-white font-bold text-lg">2</span>
               </div>
               <div>
                 <div class="font-semibold text-gray-900">Needs Improvement</div>
                 <div class="text-sm text-gray-600">Basic understanding shown</div>
               </div>
             </div>
             <div class="text-right">
               <div class="text-3xl font-bold text-orange-600">
                 {{ scoreCounts.two }}
               </div>
               <div class="text-sm text-gray-600">items</div>
             </div>
           </div>

           <!-- Score 1 - Not Good -->
           <div
             class="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-200">
             <div class="flex items-center space-x-3">
               <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                 <span class="text-white font-bold text-lg">1</span>
               </div>
               <div>
                 <div class="font-semibold text-gray-900">Not Good</div>
                 <div class="text-sm text-gray-600">Skill not demonstrated</div>
               </div>
             </div>
             <div class="text-right">
               <div class="text-3xl font-bold text-red-600">
                 {{ scoreCounts.one }}
               </div>
               <div class="text-sm text-gray-600">items</div>
             </div>
           </div>
         </div>
      </UCard>

      <!-- Performance Summary -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Mean Score -->
        <UCard class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
          <template #header>
            <h4 class="font-semibold text-gray-900">Overall Performance</h4>
          </template>
          <div class="text-center">
            <div class="text-4xl font-bold text-purple-600 mb-2">
              {{ scoreStats.mean || '0.00' }}
            </div>
            <div class="text-sm text-gray-600">Mean Score</div>
            <div class="mt-3">
              <UProgress :value="((scoreStats.mean || 0) / 5) * 100" size="md" color="purple" class="mb-2" />
              <div class="text-xs text-gray-500 text-center">
                {{ ((scoreStats.mean || 0) / 5 * 100).toFixed(1) }}% of maximum score
              </div>
            </div>
          </div>
        </UCard>

        <!-- Performance Insights -->
        <UCard class="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
          <template #header>
            <h4 class="font-semibold text-gray-900">Performance Insights</h4>
          </template>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Items:</span>
              <span class="font-semibold text-gray-900">{{ totalItems }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Items Scored:</span>
              <span class="font-semibold text-gray-900">{{ scoredItems }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Outstanding Items:</span>
              <span class="font-semibold text-teal-600">{{ scoreCounts.five }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Highly Competent Items:</span>
              <span class="font-semibold text-green-600">{{ scoreCounts.four }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Competent Items:</span>
              <span class="font-semibold text-blue-600">{{ scoreCounts.three }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Completion Rate:</span>
              <span class="font-semibold text-purple-600">{{ completionRate }}%</span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white rounded-lg border border-gray-200">
        <div class="text-sm text-gray-600 text-center sm:text-left">
          Ready to submit evaluation scores for session {{ evalSession }}
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <UButton icon="i-heroicons-arrow-left" color="gray" variant="outline" label="Back to Evaluation"
            @click="goBack" class="flex-1 sm:flex-none" />
          <UButton icon="i-heroicons-check" color="green" variant="solid" label="Submit Evaluation" :loading="isLoading"
            @click="submitScores" class="flex-1 sm:flex-none" />
        </div>
      </div>

      <!-- Help Section -->
      <UCard class="mt-6 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">About Evaluation Submission</h3>
          </div>
        </template>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Review all scores carefully before submission</p>
          <p>• Once submitted, scores cannot be modified for this session</p>
          <p>• You can start a new session for the same provider if needed</p>
          <p>• Submitted evaluations will be available in reports and analytics</p>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}
</style>