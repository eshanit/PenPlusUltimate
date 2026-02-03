<script setup lang="ts">
import { format, differenceInDays } from 'date-fns'
import Routes from "@/constants/Routes";
import type IEvalScore from "@/interfaces/IEvalScore";

const route = useRoute()
const evalId: any = route.params.id

const useEvaluationStore = useEvalDataStore()
const evaluation = await useEvaluationStore.fetchUserEval(evalId)

// Calculate session dates for timeline
const sessionDates = computed(() => {
  if (!evaluation?.sessions) return [];
  
  return [1, 2, 3, 4, 5].map(sessionNum => {
    const session = evaluation.sessions[`session_${sessionNum}`];
    return session ? format(session.evalDate, 'MMM dd, yyyy') : 'Not recorded';
  });
});

// Calculate overall progress
const progressMetrics = computed(() => {
  if (!evaluation?.sessions) return null;
  
  const sessions = [1, 2, 3, 4, 5];
  let totalScores = 0;
  let totalPossible = 0;
  let improvementRate = 0;
  let validSessionCount = 0;
  
  // Get scores for each session
  const sessionAverages = sessions.map(sessionNum => {
    const session = evaluation.sessions[`session_${sessionNum}`];
    if (!session || !session.evalItemScores) return 0;
    
    const validScores = session.evalItemScores
      .filter((item: IEvalScore) => !isNaN(Number(item.score)))
      .map((item: IEvalScore) => Number(item.score));
    
    if (validScores.length === 0) return 0;
    
    const sum = validScores.reduce((a: number, b: number) => a + b, 0);
    const avg = sum / validScores.length;
    totalScores += sum;
    totalPossible += validScores.length * 5; // Max score per item
    validSessionCount++;
    
    return avg;
  });
  
  // Calculate improvement rate
  if (sessionAverages[0] > 0 && sessionAverages[4] > 0) {
    improvementRate = ((sessionAverages[4] - sessionAverages[0]) / sessionAverages[0]) * 100;
  }
  
  const overallAverage = validSessionCount > 0 ? (totalScores / validSessionCount) / 5 : 0; // Average per session divided by max score (5)
  const completionRate = totalPossible > 0 ? (totalScores / totalPossible) * 100 : 0;
  
  return {
    overallAverage: overallAverage.toFixed(2),
    completionRate: completionRate.toFixed(1),
    improvementRate: improvementRate.toFixed(1),
    sessionAverages,
    trend: sessionAverages[4] > sessionAverages[0] ? 'improving' : 
           sessionAverages[4] < sessionAverages[0] ? 'declining' : 'stable'
  };
});

// Identify strengths and weaknesses
type CompetencyAnalysisResult = {
  items: Record<number, { name: string; scores: number[]; average: number }>;
  strengths: { name: string; scores: number[]; average: number }[];
  weaknesses: { name: string; scores: number[]; average: number }[];
};
const competencyAnalysis = computed<CompetencyAnalysisResult>(() => {
  if (!evaluation?.sessions?.session_1?.evalItemScores) {
    return { items: {}, strengths: [], weaknesses: [] };
  }
  
  const itemScores: Record<number, { name: string; scores: number[]; average: number }> = {};
  
  // Aggregate scores for each item across all sessions
  for (let sessionNum = 1; sessionNum <= 5; sessionNum++) {
    const session = evaluation.sessions[`session_${sessionNum}`];
    if (!session?.evalItemScores) continue;
    
    session.evalItemScores.forEach((item: IEvalScore, index: number) => {
      const score = typeof item.score === 'number' ? item.score : parseFloat(item.score);
      if (!itemScores[index]) {
        itemScores[index] = {
          name: item.name,
          scores: [],
          average: 0
        };
      }
      itemScores[index].scores.push(score);
    });
  }
  
  // Calculate averages
  Object.keys(itemScores).forEach((key: string) => {
    const item = itemScores[parseInt(key)];
    const validScores = item.scores.filter(score => !isNaN(score));
    item.average = validScores.length > 0 
      ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
      : 0;
  });
  
  // Sort by average
  const sortedItems = Object.values(itemScores).sort((a, b) => b.average - a.average);
  
  return {
    items: itemScores,
    strengths: sortedItems.filter(item => item.average >= 3).slice(0, 3),
    weaknesses: sortedItems.filter(item => item.average < 2 && item.average > 0).slice(0, 3)
  };
});

// Get competency item by index for template access
const getCompetencyItem = (index: number) => {
  return competencyAnalysis.value?.items?.[index] || null;
};

// Calculate score distribution
const scoreDistribution = computed(() => {
  const distribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  if (!evaluation?.sessions) return distribution;
  
  for (let sessionNum = 1; sessionNum <= 5; sessionNum++) {
    const session = evaluation.sessions[`session_${sessionNum}`];
    if (!session?.evalItemScores) continue;
    
    session.evalItemScores.forEach((item: IEvalScore) => {
      const score = typeof item.score === 'number' ? item.score : parseFloat(item.score);
      distribution[score] = (distribution[score] || 0) + 1;
    });
  }
  
  return distribution;
});

// Get rating color
const getScoreColor = (score: number) => {
  if (score === 0) return 'text-gray-400';
  if (score === 1) return 'text-red-500';
  if (score === 2) return 'text-yellow-500';
  if (score === 3) return 'text-green-500';
  if (score === 4) return 'text-blue-500';
  return 'text-purple-500';
};

// Get rating label
const getScoreLabel = (score: number) => {
  const labels = {
    0: 'Not Observed',
    1: 'Needs Improvement',
    2: 'Developing',
    3: 'Competent',
    4: 'Proficient',
    5: 'Excellent'
  };
  return labels[score as keyof typeof labels] || 'Not Rated';
};

const router = useRouter();
const goBack = () => {
  router.back();
};

// Print report
const printReport = () => {
  window.print();
};

// Export report as JSON
const exportReport = () => {
  const reportData = {
    evaluation: {
      evaluationID: evaluation.evaluationID,
      tool: evaluation.tool,
      mentee: evaluation.mentee,
      evaluator: evaluation.evaluator,
      facility: evaluation.facility,
      date: evaluation.date
    },
    progressMetrics: progressMetrics.value,
    competencyAnalysis: competencyAnalysis.value,
    scoreDistribution: scoreDistribution.value,
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `evaluation-report-${evaluation.evaluationID}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Set page metadata
useSeoMeta({
  title: `Evaluation Report - ${evaluation.mentee.firstname} ${evaluation.mentee.lastname}`,
  description: `Complete evaluation report for ${evaluation.tool}`
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50/30 to-cyan-50/20">
    <!-- Header -->
    <div class="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <UContainer class="py-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Evaluation Report</h1>
                <p class="text-sm text-gray-600">
                  {{ evaluation.tool }} • {{ evaluation.mentee.firstname }} {{ evaluation.mentee.lastname }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <UBadge color="blue" variant="subtle" class="px-3 py-1">
              ID: {{ evaluation.evaluationID }}
            </UBadge>
            <UBadge :color="progressMetrics?.trend === 'improving' ? 'green' : progressMetrics?.trend === 'declining' ? 'red' : 'gray'" 
                   variant="subtle" class="px-3 py-1">
              {{ progressMetrics?.trend?.toUpperCase() }}
            </UBadge>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Summary Cards -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Overall Performance -->
          <UCard class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-blue-700 mb-1">Overall Average</p>
                <div class="flex items-baseline space-x-2">
                  <span class="text-3xl font-bold text-blue-900">{{ progressMetrics?.overallAverage }}</span>
                  <span class="text-sm text-blue-600">/ 5.0</span>
                </div>
                <p class="text-xs text-blue-600 mt-2">{{ getScoreLabel(Math.round(parseFloat(progressMetrics?.overallAverage || '0'))) }}</p>
              </div>
              <UIcon name="i-heroicons-chart-bar" class="w-8 h-8 text-blue-500" />
            </div>
          </UCard>

          <!-- Improvement Rate -->
          <UCard class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-green-700 mb-1">Improvement</p>
                <div class="flex items-baseline space-x-2">
                  <span class="text-3xl font-bold text-green-900">{{ progressMetrics?.improvementRate }}%</span>
                  <UIcon :name="progressMetrics?.trend === 'improving' ? 'i-heroicons-arrow-trending-up' : 
                               progressMetrics?.trend === 'declining' ? 'i-heroicons-arrow-trending-down' : 'i-heroicons-minus'"
                         class="w-5 h-5" :class="progressMetrics?.trend === 'improving' ? 'text-green-600' : 
                                progressMetrics?.trend === 'declining' ? 'text-red-600' : 'text-gray-600'" />
                </div>
                <p class="text-xs text-green-600 mt-2">From first to last session</p>
              </div>
              <UIcon name="i-heroicons-trending-up" class="w-8 h-8 text-green-500" />
            </div>
          </UCard>

          <!-- Completion Rate -->
          <UCard class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-purple-700 mb-1">Completion</p>
                <div class="flex items-baseline space-x-2">
                  <span class="text-3xl font-bold text-purple-900">{{ progressMetrics?.completionRate }}%</span>
                  <span class="text-sm text-purple-600">of max score</span>
                </div>
                <p class="text-xs text-purple-600 mt-2">Based on 5-point scale</p>
              </div>
              <UIcon name="i-heroicons-check-circle" class="w-8 h-8 text-purple-500" />
            </div>
          </UCard>

          <!-- Sessions Completed -->
          <UCard class="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-orange-700 mb-1">Sessions</p>
                <div class="flex items-baseline space-x-2">
                  <span class="text-3xl font-bold text-orange-900">5</span>
                  <span class="text-sm text-orange-600">completed</span>
                </div>
                <p class="text-xs text-orange-600 mt-2">{{ sessionDates[0] }} to {{ sessionDates[4] }}</p>
              </div>
              <UIcon name="i-heroicons-calendar-days" class="w-8 h-8 text-orange-500" />
            </div>
          </UCard>
        </div>
      </div>

      <!-- Timeline -->
      <div class="max-w-7xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Session Timeline</h3>
            <p class="text-sm text-gray-600 mt-1">Progress across evaluation sessions</p>
          </template>
          
          <div class="relative">
            <!-- Progress line -->
            <div class="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
            
            <div class="flex justify-between relative">
              <div v-for="(date, index) in sessionDates" :key="index" class="flex flex-col items-center z-10">
                <!-- Session point -->
                <div class="w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-2"
                     :class="(progressMetrics?.sessionAverages?.[index] ?? 0) >= 3 ? 'bg-green-500' : 
                             (progressMetrics?.sessionAverages?.[index] ?? 0) >= 2 ? 'bg-yellow-500' : 'bg-red-500'">
                  <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
                </div>
                
                <!-- Score indicator -->
                <div class="text-center mb-1">
                  <span class="text-sm font-semibold" :class="getScoreColor(Math.round(progressMetrics?.sessionAverages?.[index] ?? 0))">
                    {{ (progressMetrics?.sessionAverages?.[index] ?? 0).toFixed(1) }}
                  </span>
                </div>
                
                <!-- Date -->
                <div class="text-xs text-gray-600 text-center">{{ date }}</div>
                
                <!-- Connecting line (except last) -->
                <div v-if="index < 4" 
                     class="absolute top-6 left-1/2 w-full h-0.5"
                     :class="(progressMetrics?.sessionAverages?.[index + 1] ?? 0) > (progressMetrics?.sessionAverages?.[index] ?? 0) ? 'bg-green-300' : 
                             (progressMetrics?.sessionAverages?.[index + 1] ?? 0) < (progressMetrics?.sessionAverages?.[index] ?? 0) ? 'bg-red-300' : 'bg-gray-300'">
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Competency Analysis -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Strengths -->
          <UCard>
            <template #header>
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-green-500" />
                <h3 class="text-lg font-semibold text-gray-900">Key Strengths</h3>
              </div>
              <p class="text-sm text-gray-600 mt-1">Highest performing competencies</p>
            </template>
            
            <div class="space-y-3">
              <div v-for="(strength, index) in competencyAnalysis.strengths" :key="index" 
                   class="p-3 bg-green-50 rounded-lg border border-green-200">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium text-gray-900 text-sm">{{ strength.name }}</span>
                  <span class="text-green-600 font-bold">{{ strength.average.toFixed(1) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="flex-1 h-2 bg-green-200 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500 rounded-full" 
                         :style="{ width: `${(strength.average / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-xs text-green-600">{{ getScoreLabel(Math.round(strength.average)) }}</span>
                </div>
              </div>
              
              <div v-if="competencyAnalysis.strengths.length === 0" class="text-center py-4 text-gray-500">
                No strengths identified yet
              </div>
            </div>
          </UCard>

          <!-- Areas for Improvement -->
          <UCard>
            <template #header>
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-orange-500" />
                <h3 class="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
              </div>
              <p class="text-sm text-gray-600 mt-1">Opportunities for development</p>
            </template>
            
            <div class="space-y-3">
              <div v-for="(weakness, index) in competencyAnalysis.weaknesses" :key="index" 
                   class="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium text-gray-900 text-sm">{{ weakness.name }}</span>
                  <span class="text-orange-600 font-bold">{{ weakness.average.toFixed(1) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="flex-1 h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div class="h-full bg-orange-500 rounded-full" 
                         :style="{ width: `${(weakness.average / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-xs text-orange-600">{{ getScoreLabel(Math.round(weakness.average)) }}</span>
                </div>
              </div>
              
              <div v-if="competencyAnalysis.weaknesses.length === 0" class="text-center py-4 text-gray-500">
                No major areas for improvement identified
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Score Distribution -->
      <div class="max-w-7xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Score Distribution</h3>
            <p class="text-sm text-gray-600 mt-1">Frequency of ratings across all sessions</p>
          </template>
          
          <div class="grid grid-cols-6 gap-2">
            <div v-for="(count, score) in scoreDistribution" :key="score" class="text-center">
              <div class="text-2xl font-bold mb-1" :class="getScoreColor(parseInt(score))">{{ score }}</div>
              <div class="text-sm text-gray-600 mb-2">{{ getScoreLabel(parseInt(score)) }}</div>
              <div class="h-32 bg-gray-100 rounded-lg relative overflow-hidden">
                <div v-if="count > 0" 
                     class="absolute bottom-0 left-0 right-0 rounded-lg"
                     :class="score === '0' ? 'bg-gray-400' : 
                             score === '1' ? 'bg-red-400' : 
                             score === '2' ? 'bg-yellow-400' : 
                             score === '3' ? 'bg-green-400' : 
                             score === '4' ? 'bg-blue-400' : 'bg-purple-400'"
                     :style="{ height: `${(count / (25 * 5)) * 100}%` }">
                </div>
              </div>
              <div class="text-xs font-semibold mt-2">{{ count }} ratings</div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Detailed Scores Table -->
      <div class="max-w-7xl mx-auto mb-8">
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Detailed Competency Scores</h3>
                <p class="text-sm text-gray-600 mt-1">Item-by-item breakdown across 5 sessions</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Avg:</span>
                <span class="text-lg font-bold text-blue-600">{{ progressMetrics?.overallAverage }}</span>
              </div>
            </div>
          </template>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th class="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50">
                    Competency Area
                  </th>
                  <th v-for="sessionNum in 5" :key="sessionNum" 
                      class="py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div>Session {{ sessionNum }}</div>
                    <div class="text-xs font-normal text-gray-500">{{ sessionDates[sessionNum - 1] }}</div>
                  </th>
                  <th class="py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Average
                  </th>
                  <th class="py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(score, index) in evaluation.sessions.session_1.evalItemScores" 
                    :key="index" 
                    class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3 px-4 sticky left-0 bg-white">
                    <div class="font-medium text-gray-900 text-sm">{{ score.name }}</div>
                  </td>
                  
                  <!-- Session Scores -->
                  <td v-for="sessionNum in 5" :key="sessionNum" class="py-3 px-4 text-center">
                    <div class="flex flex-col items-center">
                      <span class="text-xl font-bold" 
                            :class="getScoreColor(parseInt(evaluation.sessions[`session_${sessionNum}`].evalItemScores[index].score))">
                        {{ evaluation.sessions[`session_${sessionNum}`].evalItemScores[index].score }}
                      </span>
                      <span class="text-xs text-gray-500 mt-1">
                        {{ getScoreLabel(parseInt(evaluation.sessions[`session_${sessionNum}`].evalItemScores[index].score)) }}
                      </span>
                    </div>
                  </td>
                  
                  <!-- Average -->
                  <td class="py-3 px-4 text-center">
                    <span class="text-xl font-bold" :class="getScoreColor(Math.round(getCompetencyItem(Number(index))?.average ?? 0))">
                      {{ (getCompetencyItem(Number(index))?.average ?? 0).toFixed(1) }}
                    </span>
                  </td>
                  
                  <!-- Trend -->
                  <td class="py-3 px-4 text-center">
                    <UIcon v-if="getCompetencyItem(Number(index))?.scores?.[4] > getCompetencyItem(Number(index))?.scores?.[0]" 
                           name="i-heroicons-arrow-trending-up" class="w-5 h-5 text-green-500" />
                    <UIcon v-else-if="getCompetencyItem(Number(index))?.scores?.[4] < getCompetencyItem(Number(index))?.scores?.[0]" 
                           name="i-heroicons-arrow-trending-down" class="w-5 h-5 text-red-500" />
                    <UIcon v-else name="i-heroicons-minus" class="w-5 h-5 text-gray-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UCard>
      </div>

      <!-- Actions -->
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton 
            icon="i-heroicons-printer" 
            color="gray" 
            variant="solid"
            @click="printReport"
          >
            Print Report
          </UButton>
          <UButton 
            icon="i-heroicons-arrow-down-tray" 
            color="gray" 
            variant="outline"
            @click="exportReport"
          >
            Export JSON
          </UButton>
          <UButton 
            icon="i-heroicons-arrow-left" 
            color="gray" 
            variant="ghost"
            @click="goBack"
          >
            Back to Dashboard
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
