
<script setup lang="ts">
import { format } from 'date-fns'
import Routes from "@/constants/Routes";

const route = useRoute()
const evalId: any = route.params['id']
const sessionIndex: any = route.params['session']

const useEvaluationStore = useEvalDataStore()
const evaluation = await useEvaluationStore.fetchUserEval(evalId)
const tool = evaluation.tool

const router = useRouter();
const goBack = () => {
    router.back();
};

const scoreList = evaluation.sessions[`session_${sessionIndex}`].evalItemScores
const scoreCounts = useScoreCount(scoreList)

// Transform scoreCounts to match CardsCompetantScores component's expected format (numeric string keys)
const scoreCountsNumericKeys = computed(() => ({
    "0": scoreCounts.zero,
    "1": scoreCounts.one,
    "2": scoreCounts.two,
    "3": scoreCounts.three,
    "4": scoreCounts.four,
    "5": scoreCounts.five
}))

const scoreStatistics = useScoreSimpleStatistics(scoreList)

// Set page metadata
useSeoMeta({
  title: `Evaluation Report - ${evaluation.mentee.firstname} ${evaluation.mentee.lastname}`,
  description: `Session ${sessionIndex} evaluation report for ${tool}`
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
                <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-semibold text-slate-800">Evaluation Report</h1>
                <p class="text-sm text-slate-500">
                  Session {{ sessionIndex }} • {{ evaluation.evaluationID }} • {{ evaluation.tool }}
                </p>
              </div>
            </div>
          </div>
          <UBadge color="blue" size="md" class="px-3 py-1">
            Session {{ sessionIndex }}
          </UBadge>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4 sm:px-6 lg:px-8">
      <!-- Evaluator & Mentee Details -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Evaluator Details -->
          <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
            <template #header>
              <div class="flex items-center gap-2">
                <div class="w-1 h-6 bg-teal-500 rounded-full"></div>
                <h3 class="text-lg font-medium text-slate-800">Evaluator Details</h3>
              </div>
              <p class="text-sm text-slate-500 mt-1">Person conducting the evaluation</p>
            </template>
            <div class="flex items-center gap-4 p-2">
              <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shadow-sm">
                <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p class="text-sm text-slate-500">Full Name</p>
                <p class="text-lg font-semibold text-slate-800">
                  {{ evaluation.evaluator.firstname }} {{ evaluation.evaluator.lastname }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Mentee Details -->
          <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
            <template #header>
              <div class="flex items-center gap-2">
                <div class="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 class="text-lg font-medium text-slate-800">Mentee Details</h3>
              </div>
              <p class="text-sm text-slate-500 mt-1">Provider being evaluated</p>
            </template>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-user" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="text-xs text-slate-500">Full Name</p>
                  <p class="font-semibold text-slate-800 truncate max-w-[150px]">
                    {{ evaluation.mentee.firstname }} {{ evaluation.mentee.lastname }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-identification" class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p class="text-xs text-slate-500">Gender</p>
                  <p class="font-semibold text-slate-800">{{ evaluation.mentee.gender }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p class="text-xs text-slate-500">Facility</p>
                  <p class="font-semibold text-slate-800 truncate max-w-[150px]">{{ evaluation.mentee.facility }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-briefcase" class="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p class="text-xs text-slate-500">Profession</p>
                  <p class="font-semibold text-slate-800">{{ evaluation.mentee.profession }}</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Session Header & Quick Stats -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Session Card -->
          <UCard class="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70">
            <div class="flex items-center gap-4 p-2">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-numbered-list" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-blue-700 font-medium">Session</p>
                <p class="text-2xl font-bold text-blue-800">{{ sessionIndex }}</p>
                <p class="text-xs text-blue-600">{{ format(evaluation.sessions[`session_${sessionIndex}`].evalDate, 'yyyy-MM-dd') }}</p>
              </div>
            </div>
          </UCard>

          <!-- Mean Score -->
          <UCard class="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50/70">
            <div class="flex items-center gap-4 p-2">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p class="text-sm text-green-700 font-medium">Mean Score</p>
                <p class="text-2xl font-bold text-green-800">{{ scoreStatistics.meanScore }}</p>
              </div>
            </div>
          </UCard>

          <!-- Tool -->
          <UCard class="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50/70">
            <div class="flex items-center gap-4 p-2">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p class="text-sm text-purple-700 font-medium">Tool</p>
                <p class="text-2xl font-bold text-purple-800 uppercase">{{ evaluation.tool }}</p>
              </div>
            </div>
          </UCard>

          <!-- Facility -->
          <UCard class="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/70">
            <div class="flex items-center gap-4 p-2">
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p class="text-sm text-orange-700 font-medium">Facility</p>
                <p class="text-lg font-bold text-orange-800 truncate max-w-[150px]">{{ evaluation.mentee.facility }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Tool-Specific Content -->
      <div class="max-w-6xl mx-auto mb-8">
        <!-- ECHO Tool Content -->
        <div v-if="evaluation.tool === 'echo'" class="space-y-6">
          <!-- Patient Information -->
          <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
            <template #header>
              <div class="flex items-center gap-2">
                <div class="w-1 h-6 bg-teal-500 rounded-full"></div>
                <h3 class="text-lg font-medium text-slate-800">Patient Information</h3>
              </div>
              <p class="text-sm text-slate-500 mt-1">Patient details for this session</p>
            </template>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="font-medium text-slate-600">Case Number</span>
                <span class="text-slate-800">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.caseNumber }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="font-medium text-slate-600">Full Name</span>
                <span class="text-slate-800 truncate max-w-[200px]">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.patientFullName }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="font-medium text-slate-600">Gender</span>
                <span class="text-slate-800">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.gender }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="font-medium text-slate-600">Age</span>
                <span class="text-slate-800">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.age }}</span>
              </div>
            </div>
          </UCard>
          <!-- Continue with other ECHO sections... (they would follow the same card pattern) -->
        </div>

        <!-- Standard Tool Content -->
        <div v-else>
          <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
            <template #header>
              <div class="flex items-center gap-2">
                <div class="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 class="text-lg font-medium text-slate-800">Session Scores</h3>
              </div>
              <p class="text-sm text-slate-500 mt-1">
                Complete score breakdown for Session {{ sessionIndex }} of {{ evaluation.tool.toUpperCase() }}
              </p>
            </template>
            <div class="bg-white rounded-xl p-2 border border-slate-200 overflow-x-auto">
              <CardsCompetantScores 
                :tool="evaluation.tool" 
                :session-index="sessionIndex" 
                :score-counts="scoreCountsNumericKeys"
                :evaluation="evaluation" 
              />
            </div>
          </UCard>
        </div>
      </div>

      <!-- Performance Statistics -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <div class="flex items-center gap-2">
              <div class="w-1 h-6 bg-indigo-500 rounded-full"></div>
              <h3 class="text-lg font-medium text-slate-800">Performance Statistics</h3>
            </div>
            <p class="text-sm text-slate-500 mt-1">Session score analysis and insights</p>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2">
            <!-- Mean Score -->
            <UCard class="border-0 bg-gradient-to-br from-blue-50 to-indigo-50/70 rounded-xl p-4">
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-blue-600" />
                </div>
                <p class="text-2xl font-bold text-blue-800">{{ scoreStatistics.meanScore }}</p>
                <p class="text-sm font-medium text-blue-700">Mean Score</p>
                <p class="text-xs text-blue-600 mt-1">Average competency score</p>
              </div>
            </UCard>

            <!-- Median Score -->
            <UCard class="border-0 bg-gradient-to-br from-green-50 to-emerald-50/70 rounded-xl p-4">
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-chart-pie" class="w-6 h-6 text-green-600" />
                </div>
                <p class="text-2xl font-bold text-green-800">{{ scoreStatistics.medianScore }}</p>
                <p class="text-sm font-medium text-green-700">Median Score</p>
                <p class="text-xs text-green-600 mt-1">Middle score when sorted</p>
              </div>
            </UCard>

            <!-- Mode Score -->
            <UCard class="border-0 bg-gradient-to-br from-purple-50 to-violet-50/70 rounded-xl p-4">
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-chart-bar-square" class="w-6 h-6 text-purple-600" />
                </div>
                <p class="text-2xl font-bold text-purple-800">{{ scoreStatistics.modeScore }}</p>
                <p class="text-sm font-medium text-purple-700">Mode Score</p>
                <p class="text-xs text-purple-600 mt-1">Most frequent score(s)</p>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>

      <!-- Action Buttons -->
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Evaluation"
          @click="goBack"
          class="rounded-full px-6"
        />
        <UButton
          icon="i-heroicons-home"
          color="orange"
          variant="solid"
          label="Exit to Dashboard"
          :to="Routes.DASHBOARD.path"
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

/* Ensure horizontal scrolling for tables on mobile */
:deep(.overflow-x-auto) {
  -webkit-overflow-scrolling: touch;
}
</style>
