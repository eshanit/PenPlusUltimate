<script setup lang="ts">
import { format } from 'date-fns'
import Routes from "@/constants/Routes";

const route = useRoute()
const evalId: any = route.params.id

const useEvaluationStore = useEvalDataStore()
const evaluation = await useEvaluationStore.fetchUserEval(evalId)

const averageScore = (a: number, b: number, c: number) => {
    const averageScore = (a + b + c) / 3
    return averageScore.toFixed(2)
}

const router = useRouter();
const goBack = () => {
  router.back();
};

// Set page metadata
useSeoMeta({
  title: `Evaluation Report - ${evaluation.mentee.firstname} ${evaluation.mentee.lastname}`,
  description: `Complete evaluation report for ${evaluation.tool}`
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
              <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Complete Evaluation Report</h1>
              <p class="text-sm text-gray-600">
                {{ evaluation.evaluationID }} • {{ evaluation.tool }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Participant Information -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Evaluator Details -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Evaluator Details</h3>
              <p class="text-sm text-gray-600 mt-1">Person conducting the evaluation</p>
            </template>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Full Name</div>
                  <div class="font-semibold text-gray-900">
                    {{ evaluation.evaluator.firstname }} {{ evaluation.evaluator.lastname }}
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Mentee Details -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Mentee Details</h3>
              <p class="text-sm text-gray-600 mt-1">Provider being evaluated</p>
            </template>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-user" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Full Name</div>
                  <div class="font-semibold text-gray-900">
                    {{ evaluation.mentee.firstname }} {{ evaluation.mentee.lastname }}
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-identification" class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Gender</div>
                  <div class="font-semibold text-gray-900">{{ evaluation.mentee.gender }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Facility</div>
                  <div class="font-semibold text-gray-900">{{ evaluation.mentee.facility }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-briefcase" class="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Profession</div>
                  <div class="font-semibold text-gray-900">{{ evaluation.mentee.profession }}</div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Tool-Specific Content -->
      <div class="max-w-6xl mx-auto">
        <!-- ECHO Tool Content -->
        <div v-if="evaluation.tool === 'echo'" class="space-y-8">
          <div v-for="sessionIndex in [1, 2, 3]" :key="sessionIndex" class="space-y-6">
            <!-- Session Header -->
            <UCard class="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
              <div class="text-center">
                <h3 class="text-xl font-bold text-blue-600">Session {{ sessionIndex }}</h3>
                <p class="text-sm text-blue-600">
                  {{ format(evaluation.sessions[`session_${sessionIndex}`].evalDate, 'yyyy-MM-dd') }}
                </p>
              </div>
            </UCard>

            <!-- Patient Information -->
            <UCard>
              <template #header>
                <h4 class="text-lg font-semibold text-gray-900">Patient Information</h4>
                <p class="text-sm text-gray-600 mt-1">Patient details for this session</p>
              </template>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-700">Case Number</span>
                  <span class="text-gray-900">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.caseNumber }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-700">Full Name</span>
                  <span class="text-gray-900">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.patientFullName }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-700">Gender</span>
                  <span class="text-gray-900">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.gender }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-700">Age</span>
                  <span class="text-gray-900">{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.age }}</span>
                </div>
              </div>
            </UCard>

            <!-- Echo Indication -->
            <UCard>
              <template #header>
                <h4 class="text-lg font-semibold text-gray-900">Echo Indication</h4>
                <p class="text-sm text-gray-600 mt-1">Indications for echocardiography</p>
              </template>
              
              <div class="space-y-2">
                <div 
                  v-for="(indication, index) in evaluation.sessions[`session_${sessionIndex}`].cardiacEval.echoIndication.echoIndication" 
                  :key="index"
                  class="flex items-center space-x-3 py-1"
                >
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span class="text-gray-700">{{ indication }}</span>
                </div>
              </div>
            </UCard>

            <!-- Additional ECHO sections would follow the same pattern -->
            <!-- Exam, CXR, Lab -->
            <UCard>
              <template #header>
                <h4 class="text-lg font-semibold text-gray-900">Exam, CXR, Lab</h4>
                <p class="text-sm text-gray-600 mt-1">Clinical examination findings</p>
              </template>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-700">Blood Pressure</span>
                  <span class="text-gray-900 font-mono">
                    {{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.exam.bpSystolic }} / 
                    {{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.exam.bpDiastolic }} mmHg
                  </span>
                </div>
                
                <div class="space-y-2">
                  <div 
                    v-for="(exam, index) in evaluation.sessions[`session_${sessionIndex}`].cardiacEval.exam.cxrLab" 
                    :key="index"
                    class="flex items-center space-x-3 py-1"
                  >
                    <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span class="text-gray-700">{{ exam }}</span>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Continue with other ECHO sections following the same pattern -->
            <!-- Echo Findings, Primary Cardiac Diagnosis, Image Quality, etc. -->

          </div>
        </div>

        <!-- Standard Tool Content -->
        <div v-else class="max-w-6xl mx-auto">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Session Scores</h3>
              <p class="text-sm text-gray-600 mt-1">
                Complete score breakdown across all sessions for {{ evaluation.tool.toUpperCase() }}
              </p>
            </template>
            
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr class="bg-gradient-to-r from-blue-50 to-cyan-50 text-gray-600 uppercase text-sm leading-normal">
                    <th class="py-4 px-6 text-left font-semibold">Evaluation Item</th>
                    <th class="py-4 px-6 text-center font-semibold">
                      <div>Session 1</div>
                      <div class="text-blue-600 text-xs font-normal">
                        {{ format(evaluation.sessions.session_1.evalDate, 'yyyy-MM-dd') }}
                      </div>
                    </th>
                    <th class="py-4 px-6 text-center font-semibold">
                      <div>Session 2</div>
                      <div class="text-green-600 text-xs font-normal">
                        {{ format(evaluation.sessions.session_2.evalDate, 'yyyy-MM-dd') }}
                      </div>
                    </th>
                    <th class="py-4 px-6 text-center font-semibold">
                      <div>Session 3</div>
                      <div class="text-purple-600 text-xs font-normal">
                        {{ format(evaluation.sessions.session_3.evalDate, 'yyyy-MM-dd') }}
                      </div>
                    </th>
                    <th class="py-4 px-6 text-center font-semibold">Average Score</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                  <tr 
                    v-for="(score, index) in evaluation.sessions.session_1.evalItemScores" 
                    :key="index"
                    class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td class="py-4 px-6">
                      <span class="font-medium text-gray-700">{{ score.name }}</span>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <UBadge 
                        :color="parseInt(evaluation.sessions.session_1.evalItemScores[index].score) === 3 ? 'green' : 
                                parseInt(evaluation.sessions.session_1.evalItemScores[index].score) === 2 ? 'yellow' : 'red'"
                        variant="subtle"
                      >
                        {{ evaluation.sessions.session_1.evalItemScores[index].score }}
                      </UBadge>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <UBadge 
                        :color="parseInt(evaluation.sessions.session_2.evalItemScores[index].score) === 3 ? 'green' : 
                                parseInt(evaluation.sessions.session_2.evalItemScores[index].score) === 2 ? 'yellow' : 'red'"
                        variant="subtle"
                      >
                        {{ evaluation.sessions.session_2.evalItemScores[index].score }}
                      </UBadge>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <UBadge 
                        :color="parseInt(evaluation.sessions.session_3.evalItemScores[index].score) === 3 ? 'green' : 
                                parseInt(evaluation.sessions.session_3.evalItemScores[index].score) === 2 ? 'yellow' : 'red'"
                        variant="subtle"
                      >
                        {{ evaluation.sessions.session_3.evalItemScores[index].score }}
                      </UBadge>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <UBadge 
                        color="blue" 
                        variant="solid"
                        class="font-semibold"
                      >
                        {{
                          averageScore(
                            parseInt(evaluation.sessions.session_1.evalItemScores[index].score),
                            parseInt(evaluation.sessions.session_2.evalItemScores[index].score),
                            parseInt(evaluation.sessions.session_3.evalItemScores[index].score)
                          )
                        }}
                      </UBadge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Legend -->
            <template #footer>
              <div class="flex flex-wrap gap-4 justify-center text-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span class="text-gray-600">Score 1 - Needs Improvement</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span class="text-gray-600">Score 2 - Developing</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span class="text-gray-600">Score 3 - Proficient</span>
                </div>
              </div>
            </template>
          </UCard>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ evaluation.tool.toUpperCase() }}</div>
          <div class="text-sm text-blue-600 font-medium">Tool</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">3</div>
          <div class="text-sm text-green-600 font-medium">Sessions</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">{{ evaluation.mentee.facility }}</div>
          <div class="text-sm text-purple-600 font-medium">Facility</div>
        </UCard>
        
        <UCard class="text-center bg-orange-50/50">
          <div class="text-2xl font-bold text-orange-600">{{ evaluation.evaluationID }}</div>
          <div class="text-sm text-orange-600 font-medium">Evaluation ID</div>
        </UCard>
      </div>

      <!-- Action Buttons -->
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Evaluation"
          @click="goBack"
          class="flex-1 sm:flex-none"
        />
        
        <UButton
          icon="i-heroicons-home"
          color="orange"
          variant="solid"
          label="Exit to Dashboard"
          :to="Routes.DASHBOARD.path"
          class="flex-1 sm:flex-none"
        />
      </div>

      <div class="pb-10" />
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}

/* Custom table styles */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  border-bottom: 1px solid #e5e7eb;
}

tr:last-child td {
  border-bottom: none;
}
</style>