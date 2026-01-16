<script setup lang="ts">
import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import DatabaseNames from "@/constants/DatabaseNames";
import type ITools from "~/interfaces/ITools";

// State
const showDistrictForm = ref(false);
const selectedTool = ref<ITools | null>(null);
const districts = ref<any[]>([]);
const isLoading = ref(false);
const isSyncing = ref(false);

// Toast
const toast = useToast();

// Stores and composables
const districtsStore = useDistrictsStore();
const router = useRouter();

// Initialize data
onMounted(async () => {
  isLoading.value = true;
  try {
    await districtsStore.fetchDistricts();
    districts.value = districtsStore.districts;
    selectedTool.value = useProcessLocalStorage().retrieve(LocalStorageKeys.TOOL) as ITools | null;
  } catch (error) {
    console.error('Failed to load districts:', error);
  } finally {
    isLoading.value = false;
  }
});

// Check if district was previously selected
const hasPreviousDistrict = computed(() => 
  localStorage.getItem(LocalStorageKeys.CHECKED_DISTRICT)
);

// Navigation
const goBack = () => {
  navigateTo(Routes.START_EVALUATION.path);
};

const proceedToFacilities = async () => {
  const selectedDistrict = useProcessLocalStorage().retrieve(LocalStorageKeys.DISTRICT);
  
  if (!selectedDistrict) {
    localStorage.removeItem(LocalStorageKeys.DISTRICT);
  }
  
  await navigateTo(Routes.FACILITIES.path);
};

const syncDistricts = async () => {
  isSyncing.value = true;
  try {
    const result = await useManualSync(DatabaseNames.DISTRICTS, 'from');
    
    if (result.success) {
      // Refresh districts after sync
      await districtsStore.fetchDistricts();
      districts.value = districtsStore.districts;
      
      toast.add({
        title: '✓ Sync Successful',
        description: 'Districts synchronized successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 5000
      });
    } else {
      throw new Error(result.error || 'Failed to sync districts');
    }
  } catch (error) {
    console.error('Failed to sync districts:', error);
    toast.add({
      title: '✗ Sync Failed',
      description: error instanceof Error ? error.message : `Failed to sync districts: ${String(error)}`,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    });
  } finally {
    isSyncing.value = false;
  }
};

// Set page metadata
useSeoMeta({
  title: 'Select District - PenPlus NCD Monitoring',
  description: 'Choose the district for healthcare provider evaluation'
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50/30">
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
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Select District</h1>
              <p class="text-sm text-gray-600">
                Step 2: Choose evaluation location
                <span v-if="selectedTool" class="text-blue-600 font-medium"> • {{ selectedTool?.label }}</span>
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
          <span class="text-sm font-medium text-gray-700">Evaluation Setup Progress</span>
          <span class="text-sm text-gray-500">Step 2 of 4</span>
        </div>
        <UProgress :value="50" size="sm" color="blue" />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Tool Selected</span>
          <span>District</span>
          <span>Facility</span>
          <span>Provider</span>
        </div>
      </div>

      <!-- Info Card -->
      <UCard class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">District Selection</h3>
            <p class="text-sm text-gray-600">
              Select the district where the healthcare provider evaluation will take place. 
              This helps organize evaluations by geographical location and facility grouping.
            </p>
          </div>
          <div class="mt-3 md:mt-0 md:ml-4 flex-shrink-0">
            <UBadge v-if="hasPreviousDistrict" color="green" variant="subtle">
              <UIcon name="i-heroicons-check" class="w-3 h-3 mr-1" />
              District Previously Selected
            </UBadge>
          </div>
        </div>
      </UCard>

      <!-- Action Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <div>
          <h3 class="font-semibold text-gray-900">Available Districts</h3>
          <p class="text-sm text-gray-600 mt-1">Choose from the list below or sync for latest data</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <UButton
            icon="i-heroicons-arrow-path"
            color="blue"
            variant="outline"
            :label="isSyncing ? 'Syncing...' : 'Sync Districts'"
            :loading="isSyncing"
            :disabled="isSyncing"
            @click="syncDistricts"
            class="flex-1 sm:flex-none"
          />
          <UButton
            v-if="hasPreviousDistrict"
            icon="i-heroicons-arrow-right"
            color="green"
            variant="solid"
            label="Continue to Facilities"
            @click="proceedToFacilities"
            class="flex-1 sm:flex-none"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
        <span class="ml-2 text-gray-600">Loading districts...</span>
      </div>

      <!-- Districts Table -->
      <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <TablesDistricts :districts="districts" />
      </div>

      <!-- Quick Stats -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCard class="text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-map" class="w-6 h-6 text-blue-600" />
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ districts.length }}</div>
          <div class="text-sm text-gray-600">Available Districts</div>
        </UCard>

        <UCard class="text-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-green-600" />
          </div>
          <div class="text-2xl font-bold text-gray-900">6</div>
          <div class="text-sm text-gray-600">Healthcare Facilities</div>
        </UCard>

        <UCard class="text-center">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-purple-600" />
          </div>
          <div class="text-2xl font-bold text-gray-900">24+</div>
          <div class="text-sm text-gray-600">Active Providers</div>
        </UCard>
      </div>

      <!-- Help Section -->
      <UCard class="mt-6 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">Need Help Selecting?</h3>
          </div>
        </template>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Choose the district where the healthcare provider you're evaluating is based</p>
          <p>• If you can't find a specific district, use the sync button to update the list</p>
          <p>• You can skip this step if you've previously selected a district</p>
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

/* Custom styling for better mobile experience */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>