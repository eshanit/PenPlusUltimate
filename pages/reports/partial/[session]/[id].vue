<script setup lang="ts">
import { format } from 'date-fns'
import Routes from "@/constants/Routes";

const route = useRoute()
const evalId: any = route.params.id
const sessionIndex: any = route.params.session

const useEvaluationStore = useEvalDataStore()
const evaluation = await useEvaluationStore.fetchUserEval(evalId)
const tool = evaluation.tool

const averageScore = (a: number, b: number, c: number) => {
    const averageScore = (a + b + c) / 3
    return averageScore.toFixed(2)
}

const router = useRouter();
const goBack = () => {
    router.back();
};

type ScoreCount = {
    [key: string]: number;
};

const scoreList = evaluation.sessions[`session_${sessionIndex}`].evalItemScores
const scoreCounts: any = useScoreCount(scoreList)
const scoreStatistics = useScoreSimpleStatistics(scoreList)

// Set page metadata
useSeoMeta({
  title: `Evaluation Report - ${evaluation.mentee.firstname} ${evaluation.mentee.lastname}`,
  description: `Session ${sessionIndex} evaluation report for ${tool}`
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50/30">
    <!-- Header - Mobile First -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div class="px-4 py-3 sm:py-4">
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
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-clipboard-document" class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div class="min-w-0 flex-1">
              <h1 class="text-lg sm:text-xl font-bold text-gray-900 truncate">Evaluation Report</h1>
              <p class="text-xs sm:text-sm text-gray-600 truncate">
                Session {{ sessionIndex }} • {{ evaluation.evaluationID }} • {{ evaluation.tool }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 py-6 sm:py-8">
      <!-- Participant Information - Stack on mobile, side-by-side on large screens -->
      <div class="max-w-6xl mx-auto mb-6 sm:mb-8">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <!-- Evaluator Details -->
          <UCard class="w-full">
            <template #header>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Evaluator Details</h3>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">Person conducting the evaluation</p>
            </template>
            
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-user-circle" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs sm:text-sm text-gray-500">Full Name</div>
                  <div class="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {{ evaluation.evaluator.firstname }} {{ evaluation.evaluator.lastname }}
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Mentee Details -->
          <UCard class="w-full">
            <template #header>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Mentee Details</h3>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">Provider being evaluated</p>
            </template>
            
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-user" class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs sm:text-sm text-gray-500">Full Name</div>
                  <div class="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {{ evaluation.mentee.firstname }} {{ evaluation.mentee.lastname }}
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-identification" class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs sm:text-sm text-gray-500">Gender</div>
                  <div class="font-semibold text-gray-900 text-sm sm:text-base">{{ evaluation.mentee.gender }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-building-office" class="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs sm:text-sm text-gray-500">Facility</div>
                  <div class="font-semibold text-gray-900 text-sm sm:text-base truncate">{{ evaluation.mentee.facility }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-briefcase" class="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs sm:text-sm text-gray-500">Profession</div>
                  <div class="font-semibold text-gray-900 text-sm sm:text-base">{{ evaluation.mentee.profession }}</div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Session Header -->
      <div class="max-w-6xl mx-auto mb-4 sm:mb-6">
        <UCard class="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-4 sm:p-6">
          <div class="text-center">
            <h3 class="text-lg sm:text-xl font-bold text-blue-600">Session {{ sessionIndex }}</h3>
            <p class="text-xs sm:text-sm text-blue-600 mt-1">
              {{ format(evaluation.sessions[`session_${sessionIndex}`].evalDate, 'yyyy-MM-dd') }}
            </p>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats - 2 columns on mobile, 4 on medium+ -->
      <div class="max-w-6xl mx-auto grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 sm:grid-cols-4">
        <UCard class="text-center bg-blue-50/50 p-3 sm:p-4">
          <div class="text-xl sm:text-2xl font-bold text-blue-600">{{ sessionIndex }}</div>
          <div class="text-xs sm:text-sm text-blue-600 font-medium">Session</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50 p-3 sm:p-4">
          <div class="text-xl sm:text-2xl font-bold text-green-600">{{ scoreStatistics.meanScore }}</div>
          <div class="text-xs sm:text-sm text-green-600 font-medium">Mean Score</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50 p-3 sm:p-4">
          <div class="text-xl sm:text-2xl font-bold text-purple-600">{{ evaluation.tool.toUpperCase() }}</div>
          <div class="text-xs sm:text-sm text-purple-600 font-medium">Tool</div>
        </UCard>
        
        <UCard class="text-center bg-orange-50/50 p-3 sm:p-4">
          <div class="text-xl sm:text-2xl font-bold text-orange-600 text-sm sm:text-base">{{ evaluation.mentee.facility }}</div>
          <div class="text-xs sm:text-sm text-orange-600 font-medium">Facility</div>
        </UCard>
      </div>

      <!-- Tool-Specific Content -->
      <div class="max-w-6xl mx-auto">
        <!-- ECHO Tool Content -->
        <div v-if="evaluation.tool === 'echo'" class="space-y-4 sm:space-y-6">
          <!-- Patient Information -->
          <UCard>
            <template #header>
              <h4 class="text-base sm:text-lg font-semibold text-gray-900">Patient Information</h4>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">Patient details for this session</p>
            </template>
            
            <div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <div class="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-700 text-sm sm:text-base">Case Number</span>
                <span class="text-gray-900 text-sm sm:text-base">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.caseNumber }}</span>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-700 text-sm sm:text-base">Full Name</span>
                <span class="text-gray-900 text-sm sm:text-base truncate">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.patientFullName }}</span>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-700 text-sm sm:text-base">Gender</span>
                <span class="text-gray-900 text-sm sm:text-base">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.gender }}</span>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-700 text-sm sm:text-base">Age</span>
                <span class="text-gray-900 text-sm sm:text-base">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.age }}</span>
              </div>
            </div>
          </UCard>

          <!-- Continue with other ECHO sections... -->
        </div>

        <!-- Standard Tool Content -->
        <div v-else class="max-w-6xl mx-auto">
          <!-- Session Scores Card -->
          <UCard>
            <template #header>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Session Scores</h3>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">
                Complete score breakdown for Session {{ sessionIndex }} of {{ evaluation.tool.toUpperCase() }}
              </p>
            </template>
            
            <div class="bg-white rounded-lg overflow-x-auto">
              <div class="min-w-[600px] sm:min-w-0">
                <CardsCompetantScores 
                  :tool="evaluation.tool" 
                  :session-index="sessionIndex" 
                  :score-counts="scoreCounts"
                  :evaluation="evaluation" 
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Performance Statistics -->
      <div class="max-w-6xl mx-auto my-6 sm:my-8">
        <UCard>
          <template #header>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Performance Statistics</h3>
            <p class="text-xs sm:text-sm text-gray-600 mt-1">Session score analysis and insights</p>
          </template>
          
          <div class="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
            <!-- Mean Score -->
            <UCard class="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-4">
              <div class="text-center">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div class="text-xl sm:text-2xl font-bold text-blue-600">{{ scoreStatistics.meanScore }}</div>
                <div class="text-sm font-medium text-blue-700 mb-1 sm:mb-2">Mean Score</div>
                <div class="text-xs text-blue-600 leading-tight">
                  Average competency score across all evaluation items
                </div>
              </div>
            </UCard>

            <!-- Median Score -->
            <UCard class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4">
              <div class="text-center">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <UIcon name="i-heroicons-chart-pie" class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div class="text-xl sm:text-2xl font-bold text-green-600">{{ scoreStatistics.medianScore }}</div>
                <div class="text-sm font-medium text-green-700 mb-1 sm:mb-2">Median Score</div>
                <div class="text-xs text-green-600 leading-tight">
                  Middle score when all scores are sorted
                </div>
              </div>
            </UCard>

            <!-- Mode Score -->
            <UCard class="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 p-4">
              <div class="text-center">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <UIcon name="i-heroicons-chart-bar-square" class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div class="text-xl sm:text-2xl font-bold text-purple-600">{{ scoreStatistics.modeScore }}</div>
                <div class="text-sm font-medium text-purple-700 mb-1 sm:mb-2">Mode Score</div>
                <div class="text-xs text-purple-600 leading-tight">
                  Most frequently occurring score(s)
                </div>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>

      <!-- Action Buttons - Stack on mobile, row on small+ -->
      <div class="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Evaluation"
          @click="goBack"
          class="w-full sm:w-auto flex-1 sm:flex-none"
          size="sm"
        />
        
        <UButton
          icon="i-heroicons-home"
          color="orange"
          variant="solid"
          label="Exit to Dashboard"
          :to="Routes.DASHBOARD.path"
          class="w-full sm:w-auto flex-1 sm:flex-none"
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

/* Ensure horizontal scrolling for tables on mobile */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>