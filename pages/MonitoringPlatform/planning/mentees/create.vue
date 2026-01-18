<script setup lang="ts">
import Routes from '@/constants/Routes';
import LocalStorageKeys from "@/constants/LocalStorageKeys";

const router = useRouter();
const facility = ref<string | null>(null);
const district = ref<string | null>(null);

onMounted(() => {
  facility.value = localStorage.getItem(LocalStorageKeys.SELECTED_FACILITY);
  district.value = localStorage.getItem(LocalStorageKeys.DISTRICT);
});

const goBack = () => {
  router.back();
};

// Set page metadata
useSeoMeta({
  title: 'Add Provider - PenPlus NCD Monitoring',
  description: 'Add a new healthcare provider for evaluation'
});
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <UContainer class="py-4">
        <div class="flex items-center space-x-4">
          <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" @click="goBack" class="flex-shrink-0" />
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-plus" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Add New Provider</h1>
              <p class="text-sm text-gray-600">Create a new healthcare provider profile</p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-6 px-4">
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
        </div>
      </UCard>

      <!-- Info Card -->
      <UCard class="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">Add Healthcare Provider</h3>
            <p class="text-sm text-gray-600">
              Create a new provider profile to add them to the evaluation system.
              Fill in the required information to register the provider.
            </p>
          </div>
        </div>
      </UCard>

      <!-- Create Form -->
      <UCard class="bg-white rounded-xl border border-gray-200 shadow-sm">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-user-plus" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">Provider Information</h3>
          </div>
        </template>
        <FormsCreateMentee />
      </UCard>

      <!-- Help Section -->
      <UCard class="mt-6 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">About Adding Providers</h3>
          </div>
        </template>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Fill in all required fields marked with an asterisk (*)</p>
          <p>• Ensure the provider information is accurate and up-to-date</p>
          <p>• The provider will be added to the selected facility</p>
          <p>• You can edit provider details later if needed</p>
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