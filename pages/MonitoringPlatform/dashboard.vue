<script setup lang="ts">
import Routes from '@/constants/Routes';
import DatabaseNames from "@/constants/DatabaseNames";
import { useEvalDataStore } from "@/stores/evaluations";
import testCouchDBConnection from '~/utilities/testCouchDBConnection';
import { format } from 'date-fns';

const toast = useToast();
const isSyncingData = ref(false);

// Navigation functions
const goBack = () => {
  navigateTo(Routes.DASHBOARD);
}

const startEvaluation = () => {
  navigateTo(Routes.EVALUATIONS.path);
}

const syncData = async () => {
  isSyncingData.value = true;
  let syncProgress = ref('');
  
  try {
    // Show initial progress
    syncProgress.value = 'Testing CouchDB connection...';
    
    // Test connection first
    const isConnected = await testCouchDBConnection('test_connection');
    
    if (!isConnected) {
      toast.add({
        title: '✗ Connection Failed',
        description: 'Cannot connect to CouchDB server. Check network and credentials.',
        color: 'red',
        icon: 'i-heroicons-exclamation-circle',
        timeout: 5000
      });
      return;
    }
    
    syncProgress.value = 'Connection OK. Starting sync...';
    
    const result = await useSyncAll();
    
    if (result.isSuccess) {
      toast.add({
        title: '✓ Sync Successful',
        description: `Successfully synced ${result.successful} database(s)${result.failed > 0 ? `, ${result.failed} failed` : ''}`,
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 5000
      });
      
      // Refresh data after successful sync
      evaluations.value = await useEvalData.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
    } else {
      const errorMsg = result.errors.length > 0 
        ? result.errors.join(', ') 
        : 'Unknown sync error';
      
      toast.add({
        title: '✗ Sync Failed',
        description: `${result.failed} database(s) failed: ${errorMsg}`,
        color: 'red',
        icon: 'i-heroicons-exclamation-circle',
        timeout: 5000
      });
    }
  } catch (error) {
    console.error('Sync process error:', error);
    toast.add({
      title: '✗ Sync Process Error',
      description: error instanceof Error ? error.message : 'An unexpected error occurred',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    });
  } finally {
    isSyncingData.value = false;
    syncProgress.value = '';
  }
}

// Fetch evaluations
const useEvalData = useEvalDataStore()
const evaluations = ref([])

onMounted(async () => {
  evaluations.value = await useEvalData.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS)
})

// Computed stats
import { useDashboardStats } from "@/composables/useDashboardStats";

const stats = computed(() => useDashboardStats(evaluations.value));

const totalEvaluations = computed(() => parseInt(stats.value.find(s => s.label === 'Total Evaluations')?.value || '0'));
const activeFacilities = computed(() => parseInt(stats.value.find(s => s.label === 'Active Facilities')?.value || '0'));
const thisMonth = computed(() => parseInt(stats.value.find(s => s.label === 'This Month')?.value || '0'));
const completionRate = computed(() => parseInt((stats.value.find(s => s.label === 'Completion Rate')?.value || '0%').replace('%', '')));

// Recent activities
const recentActivities = computed(() => {
  const completed = evaluations.value.filter((e: any) => e.sessions.session_1 && e.sessions.session_2 && e.sessions.session_3 && e.sessions.session_4 && e.sessions.session_5)
  const sorted = completed.sort((a: any, b: any) => {
    const aDate = new Date(a.sessions.session_5.evalDate)
    const bDate = new Date(b.sessions.session_5.evalDate)
    return bDate.getTime() - aDate.getTime()
  })
  return sorted.slice(0, 3).map((e: any) => ({
    facility: e.mentee.facility,
    date: format(new Date(e.sessions.session_5.evalDate), 'yyyy-MM-dd')
  }))
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <UContainer class="py-6 px-4">
      <!-- Back button for desktop -->
      <div class="mb-6 hidden md:block">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="ghost"
          label="Back to Dashboard"
          @click="goBack"
        />
      </div>

      <!-- Welcome Section -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Healthcare Provider Evaluation</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Monitor and evaluate healthcare providers across 6 facilities to improve NCD patient care quality and identify training needs.
        </p>
      </div>

      <!-- Action Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <!-- Start Evaluation Card -->
        <UCard 
          class="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 cursor-pointer"
          @click="startEvaluation"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Start Evaluation</h3>
                <p class="text-sm text-gray-500">Begin new provider assessment</p>
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <p class="text-gray-600 text-sm">
              Conduct comprehensive evaluations of healthcare providers using standardized assessment tools. 
              Track performance metrics and identify areas for improvement in NCD patient care delivery.
            </p>
            
            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="subtle" size="sm">
                <UIcon name="i-heroicons-clock" class="w-3 h-3 mr-1" />
                Real-time
              </UBadge>
              <UBadge color="primary" variant="subtle" size="sm">
                <UIcon name="i-heroicons-chart-bar" class="w-3 h-3 mr-1" />
                Performance Metrics
              </UBadge>
              <UBadge color="primary" variant="subtle" size="sm">
                <UIcon name="i-heroicons-document-check" class="w-3 h-3 mr-1" />
                Standardized Tools
              </UBadge>
            </div>
          </div>

          <template #footer>
            <UButton
              color="primary"
              variant="solid"
              label="Begin Evaluation"
              :trailing="true"
              icon="i-heroicons-arrow-right"
              class="w-full justify-center font-medium"
              @click="startEvaluation"
            />
          </template>
        </UCard>

        <!-- Sync Data Card -->
        <UCard 
          class="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 cursor-pointer"
          @click="syncData"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Data Synchronization</h3>
                <p class="text-sm text-gray-500">Manage data connectivity</p>
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <p class="text-gray-600 text-sm">
              Manually synchronize evaluation data with central servers, manage offline data collection, 
              and ensure all assessment records are properly backed up and available for reporting.
            </p>
            
            <div class="flex flex-wrap gap-2">
              <UBadge color="orange" variant="subtle" size="sm">
                <UIcon name="i-heroicons-cloud-arrow-up" class="w-3 h-3 mr-1" />
                Cloud Sync
              </UBadge>
              <UBadge color="orange" variant="subtle" size="sm">
                <UIcon name="i-heroicons-shield-check" class="w-3 h-3 mr-1" />
                Data Backup
              </UBadge>
              <UBadge color="orange" variant="subtle" size="sm">
                <UIcon name="i-heroicons-wifi" class="w-3 h-3 mr-1" />
                Offline Support
              </UBadge>
            </div>
          </div>

          <template #footer>
            <UButton
              color="orange"
              variant="solid"
              :label="isSyncingData ? 'Syncing...' : 'Sync Data Now'"
              :trailing="!isSyncingData"
              :icon="isSyncingData ? 'i-heroicons-arrow-path' : 'i-heroicons-arrow-right'"
              :loading="isSyncingData"
              :disabled="isSyncingData"
              class="w-full justify-center font-medium"
              @click="syncData"
            />
          </template>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="mt-12 max-w-4xl mx-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">Evaluation Overview</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UCard class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ totalEvaluations }}</div>
            <div class="text-sm text-gray-500">Total Evaluations</div>
          </UCard>
          <UCard class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ thisMonth }}</div>
            <div class="text-sm text-gray-500">This Month</div>
          </UCard>
          <UCard class="text-center">
            <div class="text-2xl font-bold text-orange-600">{{ activeFacilities }}</div>
            <div class="text-sm text-gray-500">Active Facilities</div>
          </UCard>
          <UCard class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ completionRate }}%</div>
            <div class="text-sm text-gray-500">Completion Rate</div>
          </UCard>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8 max-w-4xl mx-auto">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </template>
          <div class="space-y-3">
            <div v-for="activity in recentActivities" :key="activity.facility + activity.date" class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-blue-500" />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Evaluation completed</p>
                <p class="text-xs text-gray-500">Facility {{ activity.facility }} - {{ activity.date }}</p>
              </div>
              <UBadge color="green" variant="subtle" size="sm">Completed</UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}

/* Mobile-first responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>