<script setup lang="ts">
import DatabaseNames from "@/constants/DatabaseNames";

const showTool: Ref<Boolean> = ref(false)

const route = useRoute()
const menteeId: any = route.params.id

const router = useRouter();

const goBack = () => {
    router.back();
};

// Mentee Information
const useMentees = useMenteeStore();
const menteeInfo = await useMentees.fetchMentee(menteeId);

// Evaluations
const useEvaluations = useEvalDataStore();
const menteeEvals = await useEvaluations.fetchMenteeEvals(menteeId);

const viewSession = (session: string, scoreId: string) => {
    navigateTo('/reports/partial/' + session + '/' + scoreId)
}

// Set page metadata
useSeoMeta({
  title: `${menteeInfo.firstname} ${menteeInfo.lastname} - PenPlus NCD Monitoring`,
  description: `Evaluation history and details for ${menteeInfo.firstname} ${menteeInfo.lastname}`
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
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
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">
                {{ menteeInfo.firstname }} {{ menteeInfo.lastname }}
              </h1>
              <p class="text-sm text-gray-600">
                Mentee evaluation history and details
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Mentee Information -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Mentee Information</h3>
            <p class="text-sm text-gray-600 mt-1">Personal and professional details</p>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Personal Info -->
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Full Name</div>
                  <div class="font-semibold text-gray-900">
                    {{ menteeInfo.firstname }} {{ menteeInfo?.middlename }} {{ menteeInfo.lastname }}
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-identification" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Gender</div>
                  <div class="font-semibold text-gray-900">{{ menteeInfo.gender }}</div>
                </div>
              </div>
            </div>

            <!-- Professional Info -->
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">District</div>
                  <div class="font-semibold text-gray-900">{{ menteeInfo.district }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Facility</div>
                  <div class="font-semibold text-gray-900">{{ menteeInfo.facility }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-briefcase" class="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div class="text-sm text-gray-500">Profession</div>
                  <div class="font-semibold text-gray-900">{{ menteeInfo.profession }}</div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Evaluation Summary -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Evaluation Summary</h3>
            <p class="text-sm text-gray-600 mt-1">Complete evaluation history</p>
          </template>
          
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-heroicons-clipboard-document-check" class="w-8 h-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-blue-600">{{ menteeEvals.length }}</div>
            <div class="text-sm text-gray-600 font-medium">
              Disease Evaluation{{ menteeEvals.length !== 1 ? 's' : '' }} Completed
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <p class="text-center text-blue-700">
              The provider has completed 
              <span class="font-bold text-blue-800">{{ menteeEvals.length }}</span> 
              disease evaluation{{ menteeEvals.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </UCard>
      </div>

      <!-- Individual Evaluations -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Evaluation Details</h3>
            <p class="text-sm text-gray-600 mt-1">Individual evaluation sessions and results</p>
          </template>
          
          <div class="space-y-6">
            <div 
              v-for="(evaluation, index) in menteeEvals" 
              :key="index"
              class="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <ReportMenteeEvals :evaluation="evaluation" />
            </div>
            
            <!-- Empty State -->
            <div 
              v-if="menteeEvals.length === 0"
              class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200"
            >
              <UIcon name="i-heroicons-clipboard-document" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 class="text-lg font-semibold text-gray-600 mb-2">No Evaluations Found</h4>
              <p class="text-gray-500 max-w-md mx-auto">
                This mentee hasn't completed any evaluations yet. 
                Evaluations will appear here once they are completed.
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ menteeEvals.length }}</div>
          <div class="text-sm text-blue-600 font-medium">Evaluations</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">{{ menteeInfo.district ? '✓' : '-' }}</div>
          <div class="text-sm text-green-600 font-medium">District</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">{{ menteeInfo.facility ? '✓' : '-' }}</div>
          <div class="text-sm text-purple-600 font-medium">Facility</div>
        </UCard>
        
        <UCard class="text-center bg-rose-50/50">
          <div class="text-2xl font-bold text-rose-600">{{ menteeInfo.profession ? '✓' : '-' }}</div>
          <div class="text-sm text-rose-600 font-medium">Profession</div>
        </UCard>
      </div>

      <!-- Back Button -->
      <div class="max-w-4xl mx-auto flex justify-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Mentees"
          @click="goBack"
        />
      </div>

      <div class="pb-10" />
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}
</style>