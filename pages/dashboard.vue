<script setup lang="ts">
import DatabaseNames from "@/constants/DatabaseNames";
import { useEvalDataStore } from "@/stores/evaluations";
import { useDashboardStats } from "@/composables/useDashboardStats";

// Navigation functions
const navigateToEvaluation = () => {
  navigateTo('/MonitoringPlatform/dashboard');
}

const navigateToReporting = () => {
  navigateTo('/ReportPlatform/dashboard');
}

// Fetch evaluations and compute stats
const useEvalData = useEvalDataStore()
const evaluations = ref([])

onMounted(async () => {
  try {
    evaluations.value = await useEvalData.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS)
  } catch (error) {
    console.error("Error fetching evaluations:", error);
  }
})

// Compute dashboard stats
const dashboardStats = computed(() => useDashboardStats(evaluations.value))
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- <SharedNavBar>
      <template #lead>
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-linear-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-heart" class="w-4 h-4 text-white" />
          </div>
          <div class="font-bold text-gray-800 text-lg">
            PenPlus Dashboard
          </div>
        </div>
      </template>
      
      <template #trail>
        <div class="flex items-center space-x-4">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-bell"
            class="relative"
          >
            <template #leading>
              <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </template>
          </UButton>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-cog-6-tooth"
          />
        </div>
      </template>
    </SharedNavBar> -->

    <UContainer class="py-6 px-4">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Welcome to PenPlus
        </h1>
        <p class="text-gray-600">
          NCD Health Facility Monitoring Platform - Track, analyze, and improve patient care across 6 facilities
        </p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <UCard 
          v-for="stat in dashboardStats" 
          :key="stat.label"
          class="text-center hover:shadow-lg transition-shadow duration-200"
        >
          <div class="flex flex-col items-center space-y-2">
            <div 
              class="w-12 h-12 rounded-full flex items-center justify-center"
              :class="{
                'bg-blue-100': stat.color === 'blue',
                'bg-green-100': stat.color === 'green', 
                'bg-orange-100': stat.color === 'orange',
                'bg-purple-100': stat.color === 'purple'
              }"
            >
              <UIcon 
                :name="stat.icon" 
                class="w-6 h-6"
                :class="{
                  'text-blue-600': stat.color === 'blue',
                  'text-green-600': stat.color === 'green',
                  'text-orange-600': stat.color === 'orange', 
                  'text-purple-600': stat.color === 'purple'
                }"
              />
            </div>
            <div class="text-2xl font-bold text-gray-900">{{ stat.value }}</div>
            <div class="text-sm text-gray-500">{{ stat.label }}</div>
          </div>
        </UCard>
      </div>

      <!-- Main Platform Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Evaluation Platform -->
        <UCard class="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Evaluation Platform</h3>
                <p class="text-sm text-gray-500">Monitor healthcare provider performance</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-gray-600">
              Conduct real-time evaluations of healthcare providers, track performance metrics, 
              and identify areas for improvement in NCD patient care.
            </p>
            
            <div class="flex flex-wrap gap-2">
              <UBadge color="orange" variant="subtle">
                <UIcon name="i-heroicons-clock" class="w-3 h-3 mr-1" />
                Real-time Monitoring
              </UBadge>
              <UBadge color="orange" variant="subtle">
                <UIcon name="i-heroicons-chart-bar" class="w-3 h-3 mr-1" />
                Performance Metrics
              </UBadge>
              <UBadge color="orange" variant="subtle">
                <UIcon name="i-heroicons-user-group" class="w-3 h-3 mr-1" />
                Provider Feedback
              </UBadge>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                23 pending evaluations
              </div>
              <UButton
                color="orange"
                variant="solid"
                label="Enter Evaluation Platform"
                :trailing="true"
                icon="i-heroicons-arrow-right"
                @click="navigateToEvaluation"
                class="font-medium"
              />
            </div>
          </template>
        </UCard>

        <!-- Reporting Platform -->
        <UCard class="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-chart-bar-square" class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Reporting & Analytics</h3>
                <p class="text-sm text-gray-500">Generate insights and reports</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-gray-600">
              Access comprehensive analytics, generate facility reports, and gain insights 
              into NCD care performance across all 6 healthcare facilities.
            </p>
            
            <div class="flex flex-wrap gap-2">
              <UBadge color="green" variant="subtle">
                <UIcon name="i-heroicons-eye" class="w-3 h-3 mr-1" />
                Data Visualization
              </UBadge>
              <UBadge color="green" variant="subtle">
                <UIcon name="i-heroicons-document-chart-bar" class="w-3 h-3 mr-1" />
                Facility Reports
              </UBadge>
              <UBadge color="green" variant="subtle">
                <UIcon name="i-heroicons-light-bulb" class="w-3 h-3 mr-1" />
                Performance Insights
              </UBadge>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                8 new reports available
              </div>
              <UButton
                color="green"
                variant="solid"
                label="Access Reports"
                :trailing="true"
                icon="i-heroicons-arrow-right"
                @click="navigateToReporting"
                class="font-medium"
              />
            </div>
          </template>
        </UCard>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UButton
            color="gray"
            variant="outline"
            icon="i-heroicons-plus-circle"
            label="New Evaluation"
            class="justify-start"
          />
          <UButton
            color="gray"
            variant="outline"
            icon="i-heroicons-document-plus"
            label="Generate Report"
            class="justify-start"
          />
          <UButton
            color="gray"
            variant="outline"
            icon="i-heroicons-user-group"
            label="Manage Facilities"
            class="justify-start"
          />
          <UButton
            color="gray"
            variant="outline"
            icon="i-heroicons-cog-6-tooth"
            label="Settings"
            class="justify-start"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth hover transitions */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}
</style>