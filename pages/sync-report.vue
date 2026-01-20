<script setup lang="ts">
import DatabaseNames from "@/constants/DatabaseNames";
import { useEvalDataStore } from "@/stores/evaluations";
import { format } from 'date-fns';

const toast = useToast();
const isLoading = ref(false);

// Fetch evaluations
const useEvalData = useEvalDataStore();
const evaluations = ref<any[]>([]);

// Mock sync status - in real app this would come from actual sync tracking
const syncStatuses = ref<Record<string, 'success' | 'failed' | 'pending'>>({});

onMounted(async () => {
  isLoading.value = true;
  try {
    evaluations.value = await useEvalData.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS) || [];

    // Sort evaluations by latest first (descending order by date)
    evaluations.value.sort((a, b) => {
      const dateA = a.lastSyncedAt || a.sessions?.session_5?.evalDate || 0;
      const dateB = b.lastSyncedAt || b.sessions?.session_5?.evalDate || 0;
      return dateB - dateA;
    });

    // Sync statuses are now stored in the evaluation documents
    evaluations.value.forEach((evalItem) => {
      const evalId = evalItem._id;
      // If lastSyncedAt exists, consider it synced, otherwise check syncStatus or default to pending
      syncStatuses.value[evalId] = evalItem.lastSyncedAt ? 'success' : (evalItem.syncStatus || 'pending');
    });
  } catch (error) {
    console.error('Failed to load evaluations:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to load evaluation data',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    });
  } finally {
    isLoading.value = false;
  }
});

// Manual sync function
const syncEvaluation = async (evaluation: any) => {
  const evalId = evaluation._id;

  // Set to pending
  syncStatuses.value[evalId] = 'pending';

  try {
    // Get the evaluation document
    const db = await import('@/utilities/pouchDbConnect').then(m => m.default(DatabaseNames.COMPLETED_EVALUTATIONS));
    const doc = await db.get(evalId);

    // Attempt to sync
    const syncResult = await import('@/composables/useReplicateToCouchDB').then(m => m.default(DatabaseNames.COMPLETED_EVALUTATIONS));

    // Wait for sync completion
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Sync timeout'));
      }, 30000); // 30 second timeout

      syncResult
        .on("complete", () => {
          clearTimeout(timeout);
          // Update document sync status to success
          doc.syncStatus = 'success';
          doc.lastSyncedAt = Date.now();
          db.put(doc);
          syncStatuses.value[evalId] = 'success';
          resolve(true);
        })
        .on("error", (err: any) => {
          clearTimeout(timeout);
          // Update document sync status to failed
          doc.syncStatus = 'failed';
          db.put(doc);
          syncStatuses.value[evalId] = 'failed';
          reject(err);
        });
    });

    toast.add({
      title: 'Sync Successful',
      description: `Evaluation for ${evaluation.mentee?.firstname} ${evaluation.mentee?.lastname} synced successfully`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 5000
    });
  } catch (error) {
    syncStatuses.value[evalId] = 'failed';
    toast.add({
      title: 'Sync Failed',
      description: 'Failed to sync evaluation. Please check your connection and try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    });
  }
};

// Get sync status for evaluation
const getSyncStatus = (evaluation: any) => {
  const evalId = evaluation._id || `${evaluation.mentee?._id}-${Date.now()}`;
  return syncStatuses.value[evalId] || 'pending';
};

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'green';
    case 'failed': return 'red';
    case 'pending': return 'orange';
    default: return 'gray';
  }
};

// Get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return 'i-heroicons-check-circle';
    case 'failed': return 'i-heroicons-exclamation-circle';
    case 'pending': return 'i-heroicons-arrow-path';
    default: return 'i-heroicons-question-mark-circle';
  }
};

// Navigation
const goBack = () => {
  navigateTo('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
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
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Sync Report</h1>
              <p class="text-sm text-gray-600">Monitor evaluation sync status</p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-6 px-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
        <span class="ml-2 text-gray-600">Loading evaluations...</span>
      </div>

      <!-- Sync Summary -->
      <div v-else-if="evaluations.length > 0" class="mb-6">
        <UCard class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ evaluations.length }}</div>
              <div class="text-sm text-gray-600">Total Evaluations</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">
                {{ Object.values(syncStatuses).filter(s => s === 'success').length }}
              </div>
              <div class="text-sm text-gray-600">Successfully Synced</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-red-600">
                {{ Object.values(syncStatuses).filter(s => s === 'failed').length }}
              </div>
              <div class="text-sm text-gray-600">Sync Failed</div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Evaluations List -->
      <div v-if="!isLoading && evaluations.length > 0" class="space-y-4">
        <UCard v-for="evaluation in evaluations" :key="evaluation._id || evaluation.mentee?._id" class="shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <div class="font-medium text-gray-900">
                  {{ evaluation.mentee?.firstname }} {{ evaluation.mentee?.lastname }}
                </div>
                <UBadge
                  :color="getStatusColor(getSyncStatus(evaluation))"
                  variant="subtle"
                  size="sm"
                >
                  <UIcon :name="getStatusIcon(getSyncStatus(evaluation))" class="w-3 h-3 mr-1" />
                  {{ getSyncStatus(evaluation) === 'success' ? 'Synced' : getSyncStatus(evaluation) === 'failed' ? 'Failed' : 'Pending' }}
                </UBadge>
              </div>
              <div class="text-sm text-gray-600 space-y-1">
                <div>Facility: {{ evaluation.mentee?.facility }}</div>
                <div>Tool: {{ evaluation.tool || 'N/A' }}</div>
                <div>Last Synced: {{ evaluation.lastSyncedAt ? format(new Date(evaluation.lastSyncedAt), 'MMM dd, yyyy HH:mm') : (evaluation.sessions?.session_5?.evalDate ? format(new Date(evaluation.sessions.session_5.evalDate), 'MMM dd, yyyy HH:mm') : 'N/A') }}</div>
              </div>
            </div>
            <div class="ml-4">
              <UButton
                v-if="getSyncStatus(evaluation) === 'failed'"
                icon="i-heroicons-arrow-path"
                color="orange"
                variant="solid"
                size="sm"
                label="Retry Sync"
                :loading="getSyncStatus(evaluation) === 'pending'"
                @click="syncEvaluation(evaluation)"
              />
              <UButton
                v-else-if="getSyncStatus(evaluation) === 'success'"
                icon="i-heroicons-check-circle"
                color="green"
                variant="outline"
                size="sm"
                label="Synced"
                disabled
              />
              <UButton
                v-else
                icon="i-heroicons-arrow-path"
                color="blue"
                variant="outline"
                size="sm"
                label="Syncing..."
                disabled
                :loading="true"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center py-12">
        <UIcon name="i-heroicons-clipboard-document-list" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No evaluations found</h3>
        <p class="text-gray-500 mb-4">
          There are no completed evaluations to display.
        </p>
        <UButton
          icon="i-heroicons-arrow-left"
          color="blue"
          variant="outline"
          label="Back to Dashboard"
          @click="goBack"
        />
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Custom animations for sync status */
@keyframes pulse-orange {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse-orange {
  animation: pulse-orange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

The page is now accessible via the "Sync Report" button in the dashboard's Quick Actions section.