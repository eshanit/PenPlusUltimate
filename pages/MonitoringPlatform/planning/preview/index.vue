<script setup lang="ts">
import LocalStorageKeys from '@/constants/LocalStorageKeys';
import Routes from '@/constants/Routes';

// State
const district = ref(localStorage.getItem(LocalStorageKeys.DISTRICT));
const facility = ref(localStorage.getItem(LocalStorageKeys.SELECTED_FACILITY));
const menteeData = ref<any>(null);
const profileData = ref<any>(null);
const selectedTool = ref<any>(null);
const isLoading = ref(false);

// Initialize data
onMounted(async () => {
  try {
    menteeData.value = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATED_MENTEE);
    profileData.value = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE);
    selectedTool.value = useProcessLocalStorage().retrieve(LocalStorageKeys.TOOL);
    
    // Sync data in background
    await useReplicateToCouchDB('mentees');
  } catch (error) {
    console.error('Failed to initialize preview data:', error);
  }
});

// Navigation
const goBack = () => {
  navigateTo(Routes.MENTEES.path);
};

const startEvaluation = async (tool: string) => {
  isLoading.value = true;
  try {
    localStorage.removeItem(LocalStorageKeys.SCORES);
    
    if (tool === 'echo') {
      await navigateTo({
        name: Routes.ECHO_PRAC_EVALUATION.name,
        params: { tool: tool }
      });
    } else {
      await navigateTo('/MonitoringPlatform/evaluation/' + tool);
    }
  } catch (error) {
    console.error('Failed to start evaluation:', error);
  } finally {
    isLoading.value = false;
  }
};

const editSelection = (step: string) => {
  switch (step) {
    case 'tool':
      navigateTo(Routes.START_EVALUATION.path);
      break;
    case 'district':
      navigateTo(Routes.DISTRICTS.path);
      break;
    case 'facility':
      navigateTo(Routes.FACILITIES.path);
      break;
    case 'provider':
      navigateTo(Routes.MENTEES.path);
      break;
  }
};

// Set page metadata
useSeoMeta({
  title: 'Evaluation Preview - PenPlus NCD Monitoring',
  description: 'Review and confirm evaluation setup before starting assessment'
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
              <UIcon name="i-heroicons-eye" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Evaluation Preview</h1>
              <p class="text-sm text-gray-600">
                Review your evaluation setup before starting
                <span v-if="selectedTool" class="text-blue-600 font-medium"> • {{ selectedTool?.label }}</span>
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-6 px-4">
      <!-- Completion Banner -->
      <UCard class="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-xl font-bold mb-2">Ready to Start Evaluation!</h2>
            <p class="text-green-100 opacity-90">
              All setup steps are complete. Review the details below and begin your assessment when ready.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
            <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UIcon name="i-heroicons-check-badge" class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Main Preview Card -->
      <UCard class="mb-6 shadow-lg border-0">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Evaluation Setup Summary</h3>
              <p class="text-sm text-gray-600 mt-1">Review all selected options before starting</p>
            </div>
            <UBadge color="green" variant="subtle">
              <UIcon name="i-heroicons-check" class="w-3 h-3 mr-1" />
              Complete
            </UBadge>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Evaluation Tool -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center space-x-3 mb-3 sm:mb-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div class="font-medium text-gray-900">Evaluation Tool</div>
                <div class="text-sm text-gray-600">{{ selectedTool?.label }}</div>
              </div>
            </div>
            <UButton 
              icon="i-heroicons-pencil-square" 
              color="blue" 
              variant="ghost" 
              size="sm"
              label="Change Tool"
              @click="editSelection('tool')"
            />
          </div>

          <!-- Provider Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div class="flex items-center space-x-3 mb-3 sm:mb-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-user" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">Healthcare Provider</div>
                  <div class="text-sm text-gray-600" v-if="menteeData">
                    {{ menteeData.firstname }} {{ menteeData.lastname }}
                  </div>
                </div>
              </div>
              <UButton 
                icon="i-heroicons-pencil-square" 
                color="green" 
                variant="ghost" 
                size="sm"
                label="Change"
                @click="editSelection('provider')"
              />
            </div>

            <!-- Evaluator Information -->
            <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">Evaluator</div>
                  <div class="text-sm text-gray-600" v-if="profileData">
                    {{ profileData.firstname }} {{ profileData.lastname }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div class="flex items-center space-x-3 mb-3 sm:mb-0">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-map" class="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">District</div>
                  <div class="text-sm text-gray-600">{{ district }}</div>
                </div>
              </div>
              <UButton 
                icon="i-heroicons-pencil-square" 
                color="orange" 
                variant="ghost" 
                size="sm"
                label="Change"
                @click="editSelection('district')"
              />
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div class="flex items-center space-x-3 mb-3 sm:mb-0">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">Facility</div>
                  <div class="text-sm text-gray-600">{{ facility }}</div>
                </div>
              </div>
              <UButton 
                icon="i-heroicons-pencil-square" 
                color="indigo" 
                variant="ghost" 
                size="sm"
                label="Change"
                @click="editSelection('facility')"
              />
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-sm text-gray-600 text-center sm:text-left">
              Ready to begin the evaluation process
            </div>
            <UButton
              v-if="selectedTool?.name === 'echo'"
              icon="i-heroicons-play"
              color="red"
              variant="solid"
              size="lg"
              :loading="isLoading"
              label="Start Echo Evaluation"
              @click="startEvaluation(selectedTool.name)"
              class="min-w-[250px] animate-pulse shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300"
            />
            <UButton
              v-else
              icon="i-heroicons-play"
              color="red"
              variant="solid"
              size="lg"
              :loading="isLoading"
              label="Start Evaluation"
              @click="startEvaluation(selectedTool.name)"
              class="min-w-[250px] animate-pulse shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300"
            />
          </div>
        </template>
      </UCard>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <UCard class="text-center hover:shadow-md transition-shadow cursor-pointer" @click="goBack">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 text-blue-600" />
          </div>
          <div class="font-medium text-gray-900">Back to Providers</div>
          <div class="text-sm text-gray-600">Modify provider selection</div>
        </UCard>

        <UCard class="text-center hover:shadow-md transition-shadow cursor-pointer" @click="editSelection('tool')">
          <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5 text-orange-600" />
          </div>
          <div class="font-medium text-gray-900">Change Tool</div>
          <div class="text-sm text-gray-600">Select different evaluation</div>
        </UCard>

        <UCard class="text-center hover:shadow-md transition-shadow cursor-pointer" @click="editSelection('district')">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-map" class="w-5 h-5 text-purple-600" />
          </div>
          <div class="font-medium text-gray-900">Change Location</div>
          <div class="text-sm text-gray-600">Modify district or facility</div>
        </UCard>
      </div>

      <!-- Help Section -->
      <UCard class="bg-gradient-to-br from-gray-50 to-blue-50/50">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">About Evaluation Preview</h3>
          </div>
        </template>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Review all selected options before starting the evaluation</p>
          <p>• You can modify any selection by clicking the "Change" buttons</p>
          <p>• Once started, the evaluation will use the selected tool and provider</p>
          <p>• Ensure all information is accurate for proper tracking and reporting</p>
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
  
  .min-w-\[200px\] {
    min-width: 100%;
  }
}
</style>