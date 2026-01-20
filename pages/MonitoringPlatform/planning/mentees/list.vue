<script setup lang="ts">
import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { Capacitor } from '@capacitor/core';

const isMobile = Capacitor.isNativePlatform();

// State
const showMenteeForm = ref(false);
const showUserUpdateForm = ref(false);
const showAlert = ref(false);
const menteeData = ref();
const selectedMentee = ref<string | null>(null);
const facility = ref<string | null>(null);
const district = ref<string | null>(null);
const mentees = ref<any[]>([]);
const selectedTool = ref<any>(null);
const selectedDistrict = ref<any>(null);
const isLoading = ref(false);

// Stores and composables
const menteeStore = useMenteeStore();

// Initialize data
onMounted(async () => {
  isLoading.value = true;
  try {
    facility.value = localStorage.getItem(LocalStorageKeys.SELECTED_FACILITY);
    district.value = localStorage.getItem(LocalStorageKeys.DISTRICT);
    selectedMentee.value = localStorage.getItem(LocalStorageKeys.EVALUATED_MENTEE);
    selectedTool.value = useProcessLocalStorage().retrieve(LocalStorageKeys.TOOL);
    selectedDistrict.value = useProcessLocalStorage().retrieve(LocalStorageKeys.DISTRICT);

    if (facility.value) {
      mentees.value = await menteeStore.fetchAllMentees(facility.value);
    }
  } catch (error) {
    console.error('Failed to load mentees:', error);
  } finally {
    isLoading.value = false;
  }
});

// Watch for mentee data changes (for update form)
watch(menteeData, (newValue) => {
  if (newValue?.show === true) {
    showUserUpdateForm.value = newValue.show;
  }
});

// Navigation
const goBack = () => {
  navigateTo(Routes.FACILITIES.path);
};

const proceedToPreview = async () => {
  if (selectedMentee.value) {
    await navigateTo(Routes.PREVIEW.path);
  } else {
    showAlert.value = true;
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      showAlert.value = false;
    }, 5000);
  }
};

const refreshMentees = async () => {
  if (facility.value) {
    isLoading.value = true;
    try {
      mentees.value = await menteeStore.fetchAllMentees(facility.value);
    } catch (error) {
      console.error('Failed to refresh mentees:', error);
    } finally {
      isLoading.value = false;
    }
  }
};

// Get mentee statistics
const menteeStats = computed(() => {
  return [
    {
      label: 'Available Providers',
      value: mentees.value?.length || 0,
      icon: 'i-heroicons-user-group',
      color: 'blue'
    },
    {
      label: 'Ready for Evaluation',
      value: '12+',
      icon: 'i-heroicons-clipboard-document-check',
      color: 'green'
    },
    {
      label: 'Active This Month',
      value: '8',
      icon: 'i-heroicons-calendar',
      color: 'purple'
    }
  ];
});

// Set page metadata
useSeoMeta({
  title: 'Select Provider - PenPlus NCD Monitoring',
  description: 'Choose the healthcare provider for evaluation'
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <UContainer class="py-4">
        <div class="flex items-center space-x-4">
          <UButton v-if="!showUserUpdateForm" icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm"
            @click="goBack" class="flex-shrink-0" />
          <UButton v-else icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm"
            @click="showUserUpdateForm = false" class="flex-shrink-0" />
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">
                {{ showUserUpdateForm ? 'Update Provider' : 'Select Provider' }}
              </h1>
              <p class="text-sm text-gray-600">
                Step 4: {{ showUserUpdateForm ? 'Update provider information' : 'Choose provider for evaluation' }}
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
          <span class="text-sm text-gray-500">Step 4 of 4</span>
        </div>
        <UProgress :value="100" size="sm" color="green" />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Tool Selected</span>
          <span>District</span>
          <span>Facility</span>
          <span class="font-medium text-green-600">Provider</span>
        </div>
      </div>

      <!-- Alert -->
      <UAlert v-if="showAlert" icon="i-heroicons-exclamation-triangle" color="orange" variant="subtle" class="mb-6"
        title="Provider Selection Required"
        description="Please select a healthcare provider before proceeding to the evaluation preview."
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link' }"
        @close="showAlert = false" />

      <!-- Location Breadcrumb -->
      <UCard class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
              <span>Evaluation Location</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <UBadge color="blue" variant="subtle" class="font-medium">
                <UIcon name="i-heroicons-map" class="w-3 h-3 mr-1" />
                {{ district }}
              </UBadge>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
              <UBadge color="green" variant="subtle" class="font-medium">
                <UIcon name="i-heroicons-building-office" class="w-3 h-3 mr-1" />
                {{ facility }}
              </UBadge>
            </div>
          </div>
          <div class="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
            <UBadge v-if="selectedMentee" color="green" variant="subtle">
              <UIcon name="i-heroicons-check" class="w-3 h-3 mr-1" />
              Provider Selected
            </UBadge>
            <UBadge v-else color="orange" variant="subtle">
              <UIcon name="i-heroicons-user" class="w-3 h-3 mr-1" />
              Select Provider
            </UBadge>
          </div>
        </div>
      </UCard>

      <!-- Main Content Area -->
      <div v-if="!showUserUpdateForm">
        <!-- Info Card -->
        <UCard class="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 mb-2">Provider Selection</h3>
              <p class="text-sm text-gray-600">
                Choose the healthcare provider you will be evaluating.
                This final step completes the evaluation setup and prepares the assessment tool.
              </p>
            </div>
            <div class="mt-3 md:mt-0 md:ml-4 flex-shrink-0">
              <NuxtLink :to="Routes.CREATE_MENTEE">
                <UButton icon="i-heroicons-plus" color="green" variant="solid" label="Add New Provider"
                  @click="showMenteeForm = true" />
              </NuxtLink>
            </div>
          </div>
        </UCard>

        <!-- Quick Stats -->
        <div v-if="!isMobile" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <UCard v-for="stat in menteeStats" :key="stat.label" class="text-center hover:shadow-md transition-shadow">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" :class="{
              'bg-blue-100': stat.color === 'blue',
              'bg-green-100': stat.color === 'green',
              'bg-purple-100': stat.color === 'purple'
            }">
              <UIcon :name="stat.icon" class="w-5 h-5" :class="{
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
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div>
            <h3 class="font-semibold text-gray-900">Healthcare Providers</h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ mentees?.length || 0 }} providers available at {{ facility }}
            </p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <UButton icon="i-heroicons-arrow-path" color="blue" variant="outline" label="Refresh" :loading="isLoading"
              @click="refreshMentees" class="flex-1 sm:flex-none" />
            <UButton v-if="selectedMentee" icon="i-heroicons-eye" color="green" variant="solid"
              label="Preview Evaluation" @click="proceedToPreview" class="flex-1 sm:flex-none" />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
          <span class="ml-2 text-gray-600">Loading providers...</span>
        </div>

        <!-- Mentees Table -->
        <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <TablesMentees :mentees="mentees" @show-create-user-form="showMenteeForm = $event"
            @mentee-data="menteeData = $event" />
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && (!mentees || mentees.length === 0)" class="text-center py-12">
          <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No providers available</h3>
          <p class="text-gray-500 mb-4">
            There are no healthcare providers available at the selected facility.
          </p>
          <div class="flex flex-col sm:flex-row gap-2 justify-center">
            <UButton icon="i-heroicons-plus" color="green" variant="solid" label="Add New Provider"
              @click="showMenteeForm = true" />
            <UButton icon="i-heroicons-arrow-left" color="blue" variant="outline" label="Change Facility"
              @click="goBack" />
          </div>
        </div>
      </div>

      <!-- Update Mentee Form -->
      <div v-else>
        <FormsUpdateMentee :mentee-data="menteeData" @show-update-user-form="showUserUpdateForm = $event" />
      </div>

      <!-- Help Section -->
      <UCard class="mt-6 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">About Provider Selection</h3>
          </div>
        </template>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Select the healthcare provider you will be evaluating</p>
          <p>• You can update provider information by clicking the edit button</p>
          <p>• Add new providers if they are not listed</p>
          <p>• Once selected, proceed to preview the evaluation setup</p>
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