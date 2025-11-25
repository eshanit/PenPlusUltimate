<script setup lang="ts">
import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";

// State
const showFacilityForm = ref(false);
const showAlert = ref(false);
const selectedTool = ref<any>(null);
const facilities = ref<any[]>([]);
const selectedFacility = ref<string | null>(null);

// Initialize data
onMounted(() => {
  selectedTool.value = useProcessLocalStorage().retrieve(LocalStorageKeys.TOOL);
  facilities.value = useProcessLocalStorage().retrieve(LocalStorageKeys.FACILITIES_FOR_SELECTED_DISTRICT) || [];
  selectedFacility.value = localStorage.getItem(LocalStorageKeys.SELECTED_FACILITY);
});

// Navigation
const goBack = () => {
  navigateTo(Routes.DISTRICTS.path);
};

const proceedToMentees = async () => {
  if (selectedFacility.value) {
    await navigateTo(Routes.MENTEES.path);
  } else {
    showAlert.value = true;
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      showAlert.value = false;
    }, 5000);
  }
};

// Get facility statistics (mock data - replace with real data)
const facilityStats = computed(() => {
  return [
    { label: 'Total Facilities', value: facilities.value?.length || 0, icon: 'i-heroicons-building-office', color: 'blue' },
    { label: 'Active Providers', value: '24+', icon: 'i-heroicons-user-group', color: 'green' },
    { label: 'This District', value: 'Selected', icon: 'i-heroicons-map-pin', color: 'purple' }
  ];
});

// Set page metadata
useSeoMeta({
  title: 'Select Facility - PenPlus NCD Monitoring',
  description: 'Choose the healthcare facility for provider evaluation'
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
              <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Select Facility</h1>
              <p class="text-sm text-gray-600">
                Step 3: Choose healthcare facility
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
          <span class="text-sm text-gray-500">Step 3 of 4</span>
        </div>
        <UProgress :value="75" size="sm" color="blue" />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Tool Selected</span>
          <span>District</span>
          <span>Facility</span>
          <span>Provider</span>
        </div>
      </div>

      <!-- Alert -->
      <UAlert 
        v-if="showAlert"
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="subtle"
        class="mb-6"
        title="Facility Selection Required"
        description="Please select a healthcare facility before proceeding to the next step."
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link' }"
        @close="showAlert = false"
      />

      <!-- Info Card -->
      <UCard class="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">Facility Selection</h3>
            <p class="text-sm text-gray-600">
              Choose the specific healthcare facility where the evaluation will take place. 
              This ensures proper tracking and organization of provider assessments by location.
            </p>
          </div>
          <div class="mt-3 md:mt-0 md:ml-4 flex-shrink-0">
            <UBadge v-if="selectedFacility" color="green" variant="subtle">
              <UIcon name="i-heroicons-check" class="w-3 h-3 mr-1" />
              Facility Selected
            </UBadge>
            <UBadge v-else color="orange" variant="subtle">
              <UIcon name="i-heroicons-exclamation" class="w-3 h-3 mr-1" />
              Select Facility
            </UBadge>
          </div>
        </div>
      </UCard>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <UCard 
          v-for="stat in facilityStats" 
          :key="stat.label"
          class="text-center hover:shadow-md transition-shadow"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
               :class="{
                 'bg-blue-100': stat.color === 'blue',
                 'bg-green-100': stat.color === 'green',
                 'bg-purple-100': stat.color === 'purple'
               }">
            <UIcon :name="stat.icon" 
                   class="w-5 h-5"
                   :class="{
                     'text-blue-600': stat.color === 'blue',
                     'text-green-600': stat.color === 'green',
                     'text-purple-600': stat.color === 'purple'
                   }" />
          </div>
          <div class="text-lg font-bold text-gray-900">{{ stat.value }}</div>
          <div class="text-sm text-gray-600">{{ stat.label }}</div>
        </UCard>
      </div>

      <!-- Action Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <div>
          <h3 class="font-semibold text-gray-900">Healthcare Facilities</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ facilities?.length || 0 }} facilities available in selected district
          </p>
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          <UButton
            v-if="selectedFacility"
            icon="i-heroicons-arrow-right"
            color="green"
            variant="solid"
            label="Continue to Providers"
            @click="proceedToMentees"
            class="flex-1 sm:flex-none"
          />
        </div>
      </div>

      <!-- Facilities Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <TablesFacilities :facilities="facilities" />
      </div>

      <!-- Empty State -->
      <div v-if="!facilities || facilities.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-building-office" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No facilities available</h3>
        <p class="text-gray-500 mb-4">
          There are no facilities available for the selected district.
        </p>
        <UButton 
          icon="i-heroicons-arrow-left"
          color="blue"
          variant="outline"
          label="Back to Districts"
          @click="goBack"
        />
      </div>

      <!-- Help Section -->
      <UCard class="mt-6 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">About Facility Selection</h3>
          </div>
        </template>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Select the specific healthcare facility where the provider works</p>
          <p>• This helps organize evaluations by physical location and facility type</p>
          <p>• You can proceed once you've selected a facility</p>
          <p>• If no facilities appear, please check your district selection</p>
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