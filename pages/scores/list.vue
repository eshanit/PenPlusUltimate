<script setup lang="ts">
import Routes from '@/constants/Routes';
import LocalStorageKeys from '@/constants/LocalStorageKeys';
import { useProcessLocalStorage } from '@/composables/useProcessLocalStorage';
import { useEvaluationStats } from '@/composables/useEvaluationStats';
import DatabaseNames from '@/constants/DatabaseNames';
import { useEvalDataStore } from '@/stores/evaluations';
import type IFinalEvaluation from '@/interfaces/IFinalEvaluation';
import { Capacitor } from '@capacitor/core';

const isMobile = Capacitor.isNativePlatform();

useSeoMeta({
  title: 'My Evaluations - PenPlus NCD Monitoring',
  description: 'View and manage all your healthcare provider evaluation sessions'
})

// Fetch evaluations from database
const { fetchEvaluationScores } = useEvalDataStore()
const evaluations = ref<IFinalEvaluation[]>([])

onMounted(async () => {
  try {
    evaluations.value = await fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS) || []
  } catch (error) {
    console.error('Error fetching evaluations:', error)
    evaluations.value = []
  }
})

// Calculate stats using useEvaluationStats
const { overallMeanScore, completedEvaluations } = useEvaluationStats(evaluations.value);

// Compute stats
const stats = computed(() => {
  const total = evaluations.value.length;
  
  // Calculate completion rate as percentage of sessions completed
  let totalSessions = 0;
  let completedSessions = 0;
  
  evaluations.value.forEach(evaluation => {
    Object.values(evaluation.sessions || {}).forEach(session => {
      totalSessions++;
      if (session && session.evalItemScores && session.evalItemScores.length > 0) {
        completedSessions++;
      }
    });
  });
  
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const avgScore = overallMeanScore.value ? `${overallMeanScore.value}%` : '0%';

  // Calculate this month's stats
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  const thisMonthEvaluations = evaluations.value.filter(evaluation => {
    return Object.values(evaluation.sessions || {}).some(session => {
      if (session && session.evalDate) {
        const sessionDate = new Date(session.evalDate);
        return sessionDate.getMonth() === thisMonth && sessionDate.getFullYear() === thisYear;
      }
      return false;
    });
  });
  
  // Calculate last month's stats
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  
  const lastMonthEvaluations = evaluations.value.filter(evaluation => {
    return Object.values(evaluation.sessions || {}).some(session => {
      if (session && session.evalDate) {
        const sessionDate = new Date(session.evalDate);
        return sessionDate.getMonth() === lastMonth && sessionDate.getFullYear() === lastMonthYear;
      }
      return false;
    });
  });
  
  // Calculate percentage changes
  const totalChange = lastMonthEvaluations.length > 0 
    ? Math.round(((total - lastMonthEvaluations.length) / lastMonthEvaluations.length) * 100)
    : 0;
    
  const thisMonthCount = thisMonthEvaluations.length;
  const lastMonthCount = lastMonthEvaluations.length;
  const thisMonthChange = lastMonthCount > 0 
    ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
    : 0;
    
  // For completion rate change, we'd need historical data - using a placeholder for now
  const completionRateChange = '+2%'; // Placeholder - would need historical completion rates
  
  // For avg score change, we'd need historical scores - using a placeholder for now  
  const avgScoreChange = '+3%'; // Placeholder - would need historical average scores

  return [
    { label: 'Total Evaluations', value: total.toString(), icon: 'i-heroicons-clipboard-document-list', color: 'blue', change: `${totalChange >= 0 ? '+' : ''}${totalChange}%` },
    { label: 'This Month', value: thisMonthCount.toString(), icon: 'i-heroicons-calendar', color: 'green', change: `${thisMonthChange >= 0 ? '+' : ''}${thisMonthChange}%` },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: 'i-heroicons-check-badge', color: 'emerald', change: completionRateChange },
    { label: 'Avg. Score', value: avgScore, icon: 'i-heroicons-chart-bar', color: 'purple', change: avgScoreChange }
  ];
});

// Generate recent activity from evaluations
const recentActivity = computed(() => {
  const recent = evaluations.value.slice(-3).reverse(); // Last 3, reversed for latest first
  return recent.map((evaluation: IFinalEvaluation, index: number) => {
    const timeAgo = ['2 hours ago', '1 day ago', '2 days ago'][index] || 'Recently';
    const type = ['success', 'info', 'warning'][index % 3];
    return {
      action: 'Evaluation completed',
      provider: evaluation.mentee ? `${evaluation.mentee.firstname} ${evaluation.mentee.lastname}` : 'Unknown Provider',
      facility: evaluation.mentee?.facility || 'Unknown Facility',
      time: timeAgo,
      type
    };
  });
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <!-- Header Section -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <UButton 
              icon="i-heroicons-arrow-left" 
              color="gray" 
              variant="ghost" 
              size="sm"
              :to="Routes.MONITORING_PLATFORM.path"
              class="flex-shrink-0"
            />
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">My Evaluations</h1>
                <p class="text-sm text-gray-600">Manage your healthcare provider assessment sessions</p>
              </div>
            </div>
          </div>
          
          <div class="hidden md:flex items-center space-x-3">
            <UButton 
              icon="i-heroicons-plus" 
              color="red" 
              variant="solid"
              label="New Evaluation"
              :to="Routes.START_EVALUATION.path"
            />
            <UButton 
              icon="i-heroicons-arrow-down-tray" 
              color="gray" 
              variant="outline"
              label="Export"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-6 px-4">
      <!-- Stats Overview -->
      <div v-if="!isMobile" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <UCard 
          v-for="stat in stats" 
          :key="stat.label"
          class="hover:shadow-lg transition-all duration-300 hover-lift"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
              <p class="text-xs font-medium text-green-600 mt-1">{{ stat.change }} from last month</p>
            </div>
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="{
                'bg-blue-100': stat.color === 'blue',
                'bg-green-100': stat.color === 'green',
                'bg-emerald-100': stat.color === 'emerald',
                'bg-purple-100': stat.color === 'purple'
              }"
            >
              <UIcon 
                :name="stat.icon" 
                class="w-6 h-6"
                :class="{
                  'text-blue-600': stat.color === 'blue',
                  'text-green-600': stat.color === 'green',
                  'text-emerald-600': stat.color === 'emerald',
                  'text-purple-600': stat.color === 'purple'
                }"
              />
            </div>
          </div>
        </UCard>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- Main Content Column -->
        <div class="xl:col-span-3 space-y-6">
          <!-- Welcome Card -->
          <UCard class="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="flex-1">
                <h2 class="text-xl font-bold mb-2">Evaluation Dashboard</h2>
                <p class="text-blue-100 opacity-90">
                  Track and manage all your healthcare provider evaluations across 6 facilities. 
                  Monitor progress, generate reports, and improve patient care quality.
                </p>
              </div>
              <div class="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                <UButton 
                  icon="i-heroicons-rocket-launch" 
                  color="white" 
                  variant="solid"
                  label="Quick Start Guide"
                  class="text-blue-600 font-semibold"
                />
              </div>
            </div>
          </UCard>

          <!-- Info Banner -->
          <UAlert 
            icon="i-heroicons-information-circle" 
            color="blue" 
            variant="subtle"
            class="border border-blue-200"
          >
            <template #title>
              Session Management Guide
            </template>
            <template #description>
              Below is a list of providers who have at least one evaluation session completed.
              Click on session dates to view previous evaluations. Use the "Start New Evaluation"
              button for new providers or new disease tools.
            </template>
          </UAlert>

          <!-- Evaluations Table Card -->
          <UCard class="shadow-lg border-0">
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Evaluation Sessions</h3>
                  <p class="text-sm text-gray-600 mt-1">All your completed and ongoing evaluations</p>
                </div>
                <div class="flex items-center space-x-2">
                  <UButton 
                    icon="i-heroicons-funnel" 
                    color="gray" 
                    variant="outline"
                    size="sm"
                    label="Filter"
                  />
                  <UButton 
                    icon="i-heroicons-arrow-path" 
                    color="gray" 
                    variant="outline"
                    size="sm"
                    label="Refresh"
                  />
                </div>
              </div>
            </template>

            <TablesEvaluations />
          </UCard>
        </div>

        <!-- Sidebar Column -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Quick Actions -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </template>
            
            <div class="space-y-3">
              <UButton 
                icon="i-heroicons-plus-circle" 
                color="red" 
                variant="solid"
                label="New Evaluation"
                class="w-full justify-start"
                :to="Routes.START_EVALUATION.path"
              />
              <UButton 
                icon="i-heroicons-document-chart-bar" 
                color="blue" 
                variant="outline"
                label="Generate Report"
                class="w-full justify-start"
                :to="Routes.GENERATE_REPORT.path"
              />
              <UButton 
                icon="i-heroicons-user-group" 
                color="green" 
                variant="outline"
                label="Manage Providers"
                class="w-full justify-start"
                :to="Routes.MANAGE_PROVIDERS.path"
              />
              <UButton 
                icon="i-heroicons-cog-6-tooth" 
                color="gray" 
                variant="outline"
                label="Settings"
                class="w-full justify-start"
                :to="Routes.SETTINGS.path"
              />
            </div>
          </UCard>

          <!-- Recent Activity -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </template>
            
            <div class="space-y-4">
              <div 
                v-for="activity in recentActivity" 
                :key="activity.time"
                class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="{
                    'bg-green-100': activity.type === 'success',
                    'bg-blue-100': activity.type === 'info',
                    'bg-orange-100': activity.type === 'warning'
                  }"
                >
                  <UIcon 
                    name="i-heroicons-check-badge" 
                    class="w-4 h-4"
                    :class="{
                      'text-green-600': activity.type === 'success',
                      'text-blue-600': activity.type === 'info',
                      'text-orange-600': activity.type === 'warning'
                    }"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ activity.action }}</p>
                  <p class="text-xs text-gray-600 truncate">{{ activity.provider }} • {{ activity.facility }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                </div>
              </div>
            </div>

            <template #footer>
              <UButton 
                label="View All Activity" 
                color="gray" 
                variant="ghost" 
                size="sm"
                class="w-full justify-center"
                icon="i-heroicons-arrow-right"
              />
            </template>
          </UCard>

          <!-- Support Card -->
          <UCard class="bg-gradient-to-br from-blue-50 to-emerald-50 border border-blue-200">
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-lifebuoy" class="w-6 h-6 text-white" />
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p class="text-sm text-gray-600 mb-4">
                Our support team is here to help you with any questions about evaluations.
              </p>
              <UButton 
                icon="i-heroicons-chat-bubble-left-right" 
                color="blue" 
                variant="solid"
                size="sm"
                label="Contact Support"
                class="w-full"
              />
            </div>
          </UCard>
        </div>
      </div>

      <!-- Mobile Floating Action Button -->
      <div class="fixed bottom-6 right-6 z-20 md:hidden">
        <UButton 
          icon="i-heroicons-plus" 
          color="red" 
          variant="solid"
          size="lg"
          :to="Routes.START_EVALUATION.path"
          class="shadow-lg rounded-full w-14 h-14"
        />
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease-in-out;
}
</style>