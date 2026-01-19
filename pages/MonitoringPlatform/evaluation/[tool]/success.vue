<script setup lang="ts">
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import Routes from "@/constants/Routes";
import { useProcessLocalStorage } from "@/composables/useProcessLocalStorage";

const route = useRoute()
const tool = route.params.tool
const menteeData = ref<any>(null)

// Initialize data
onMounted(() => {
  menteeData.value = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATED_MENTEE)
})

// Navigation
const goToDashboard = () => {
  navigateTo(Routes.DASHBOARD.path);
};

const startNewEvaluation = () => {
  navigateTo(Routes.MONITORING_PLATFORM.path);
};

const viewEvaluationReports = () => {
  navigateTo('/scores/list');
};

// Set page metadata
useSeoMeta({
  title: 'Evaluation Submitted - PenPlus NCD Monitoring',
  description: 'Evaluation successfully submitted and recorded'
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <UContainer class="py-4">
        <div class="flex items-center space-x-4">
          <UButton 
            icon="i-heroicons-arrow-left" 
            color="gray" 
            variant="ghost" 
            size="sm"
            @click="goToDashboard"
            class="flex-shrink-0"
          />
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Evaluation Complete</h1>
              <p class="text-sm text-gray-600">
                Successfully submitted
                <span class="text-green-600 font-medium"> • {{ tool }}</span>
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Success Celebration -->
      <div class="max-w-2xl mx-auto text-center mb-8">
        <div class="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <UIcon name="i-heroicons-check" class="w-16 h-16 text-white" />
        </div>
        
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Evaluation Submitted Successfully!</h2>
        
        <p class="text-lg text-gray-600 mb-2">
          Thank you for completing the 
          <span class="font-semibold text-green-600 capitalize">{{ tool }}</span> evaluation
        </p>
        
        <p class="text-gray-500" v-if="menteeData">
          for <span class="font-medium text-gray-700">{{ menteeData.firstname }} {{ menteeData.lastname }}</span>
        </p>
      </div>

      <!-- Success Details -->
      <div class="max-w-2xl mx-auto mb-8">
        <UCard class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-green-600" />
              </div>
              <div class="text-sm text-gray-600">Evaluation Status</div>
              <div class="text-2xl font-bold text-green-600">Complete</div>
            </div>
            
            <div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-clock" class="w-6 h-6 text-blue-600" />
              </div>
               <div class="text-sm text-gray-600">Submitted At</div>
              <div class="text-2xl font-bold text-blue-600">Now</div>
            </div>
            
            <div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-server" class="w-6 h-6 text-purple-600" />
              </div>
              <div class="text-sm text-gray-600">Data Status</div>
              <div class="text-2xl font-bold text-purple-600">Synced</div>
              
            </div>
          </div>
        </UCard>
      </div>

      <!-- Next Steps -->
      <div class="max-w-2xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">What's Next?</h3>
          </template>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-3 cursor-pointer" @click="viewEvaluationReports">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div class="font-medium text-gray-900">View Evaluation Reports</div>
                <div class="text-sm text-gray-600">Access detailed analytics and performance reports</div>
              </div>
            </div>
            
            <div class="flex items-start space-x-3 cursor-pointer" @click="startNewEvaluation">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-heroicons-plus" class="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div class="font-medium text-gray-900">Start New Evaluation</div>
                <div class="text-sm text-gray-600">Begin another assessment with a different provider</div>
              </div>
            </div>
            
            <div class="flex items-start space-x-3 cursor-pointer" @click="goToDashboard">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-heroicons-home" class="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div class="font-medium text-gray-900">Return to Dashboard</div>
                <div class="text-sm text-gray-600">Go back to the main dashboard overview</div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Action Buttons -->
      <div class="max-w-2xl mx-auto">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            icon="i-heroicons-home"
            color="gray"
            variant="outline"
            label="Dashboard"
            @click="goToDashboard"
            class="flex-1 sm:flex-none"
          />
          
          <UButton
            icon="i-heroicons-plus"
            color="green"
            variant="solid"
            label="New Evaluation"
            @click="startNewEvaluation"
            class="flex-1 sm:flex-none"
          />
        </div>
        
        <!-- Quick Stats -->
        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <UCard class="text-center">
            <div class="text-2xl font-bold text-green-600">✓</div>
            <div class="text-sm text-gray-600">Submitted</div>
          </UCard>
          
          <UCard class="text-center">
            <div class="text-2xl font-bold text-blue-600">100%</div>
            <div class="text-sm text-gray-600">Complete</div>
          </UCard>
          
          <UCard class="text-center">
            <div class="text-2xl font-bold text-purple-600">✓</div>
            <div class="text-sm text-gray-600">Saved</div>
          </UCard>
          
          <UCard class="text-center">
            <div class="text-2xl font-bold text-orange-600">✓</div>
            <div class="text-sm text-gray-600">Synced</div>
          </UCard>
        </div>
      </div>

      <!-- Celebration Confetti Effect (Visual only) -->
      <div class="fixed inset-0 pointer-events-none z-50 opacity-10">
        <div class="absolute top-10 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
        <div class="absolute top-20 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
        <div class="absolute top-32 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
        <div class="absolute top-16 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.6s;"></div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}
</style>