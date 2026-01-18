<script setup lang="ts">
import { format } from 'date-fns'
import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { useEvaluation } from "@/composables/useEvaluation";
import { useProcessLocalStorage } from "@/composables/useProcessLocalStorage";

// State and data
const route = useRoute()
const tool = route.params.tool
const evalData = useEvaluation()
const evalSession = ref<any>(null)
const menteeData = ref<any>(null)
const formattedDate = ref('')
const isLoading = ref(false)

// Initialize data
onMounted(() => {
  evalSession.value = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATION_SESSION)
  menteeData.value = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATED_MENTEE)

  const now = new Date(Date.now());
  formattedDate.value = format(now, 'MMMM dd, yyyy HH:mm:ss');
})

// Get evaluation items
const evalItems = computed(() => {
  return evalData.find((e) => e.tool === tool)
})

// Navigation
const goBack = () => {
  navigateTo(Routes.PREVIEW.path);
};

// Set page metadata
useSeoMeta({
  title: `Evaluation - ${tool} - PenPlus NCD Monitoring`,
  description: `Conducting ${tool} evaluation for healthcare provider assessment`
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <UContainer class="py-4">
        <div class="flex items-center space-x-4">
          <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" @click="goBack"
            class="flex-shrink-0" />
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Evaluation Session</h1>
              <p class="text-sm text-gray-600">
                {{ tool }} assessment in progress
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
          <span class="text-sm font-medium text-gray-700">Evaluation Progress</span>
          <span class="text-sm text-gray-500">Session {{ evalSession }}</span>
        </div>
        <UProgress :value="30" size="sm" color="blue" />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Setup Complete</span>
          <span>Evaluation</span>
          <span>Review</span>
          <span>Submit</span>
        </div>
      </div>

      <!-- Evaluation Info Card -->
      <UCard class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-600">Healthcare Provider</div>
              <div class="font-semibold text-gray-900" v-if="menteeData">
                {{ menteeData.firstname }} {{ menteeData.lastname }}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-600">Session & Date</div>
              <div class="font-semibold text-gray-900">
                Session {{ evalSession }} • {{ formattedDate }}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-600">Evaluation Tool</div>
              <div class="font-semibold text-gray-900 capitalize">{{ tool }}</div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Info Banner -->
      <UAlert icon="i-heroicons-information-circle" color="blue" variant="subtle" class="mb-6 border border-blue-200">
        <template #title>
          Evaluation Guidelines
        </template>
        <template #description>
          Score each competency based on the provider's performance. Use the scoring guide to ensure consistent
          assessment across all evaluation items.
        </template>
      </UAlert>

      <!-- Evaluation Form -->
      <FormsMainEvaluation :mentee-data="menteeData" :selected-tool="tool"
        :evaluation-items="evalItems?.evaluationItems" :cut-off="evalItems?.numItems" />

      <!-- Quick Help -->
      <UCard class="mt-6 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">Scoring Guide</h3>
          </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
          <div class="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div class="font-bold text-red-700">1 - Not Good</div>
            <div class="text-red-600 text-xs mt-1">Skill not demonstrated</div>
          </div>
          <div class="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div class="font-bold text-orange-700">2 - Needs Improvement</div>
            <div class="text-orange-600 text-xs mt-1">Basic understanding shown</div>
          </div>
          <div class="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-bold text-blue-700">3 - Competent</div>
            <div class="text-blue-600 text-xs mt-1">Skill demonstrated adequately</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="font-bold text-green-700">4 - Highly Competent</div>
            <div class="text-green-600 text-xs mt-1">Strong performance</div>
          </div>
          <div class="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
            <div class="font-bold text-teal-700">5 - Outstanding</div>
            <div class="text-teal-600 text-xs mt-1">Exceptional performance</div>
          </div>
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
</style>