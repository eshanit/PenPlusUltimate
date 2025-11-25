<script setup lang="ts">

const router = useRouter()
const goBack = () => {
    router.back();
};

const route = useRoute()
const district: any = route.params.district

// Mentees
const useMentees = useMenteeStore();
const mentees = await useMentees.fetchDistrictMentees(district);

// Set page metadata
useSeoMeta({
  title: `${district} Mentees - PenPlus NCD Monitoring`,
  description: `List of mentees and providers in ${district} district`
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
              <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ district }} District</h1>
              <p class="text-sm text-gray-600">
                Mentees and providers in {{ district }} district
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Overview Section -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">District Overview</h3>
            <p class="text-sm text-gray-600 mt-1">Mentee summary for {{ district }} district</p>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Total Mentees -->
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-user-group" class="w-8 h-8 text-green-600" />
              </div>
              <div class="text-3xl font-bold text-green-600">{{ mentees.length }}</div>
              <div class="text-sm text-gray-600 font-medium">Total Mentees</div>
            </div>
            
            <!-- District Info -->
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-map-pin" class="w-8 h-8 text-blue-600" />
              </div>
              <div class="text-2xl font-bold text-blue-600">{{ district }}</div>
              <div class="text-sm text-gray-600 font-medium">District</div>
            </div>
            
            <!-- Status -->
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-8 h-8 text-purple-600" />
              </div>
              <div class="text-2xl font-bold text-purple-600">{{ mentees.length > 0 ? 'Active' : 'No Data' }}</div>
              <div class="text-sm text-gray-600 font-medium">Status</div>
            </div>
          </div>

          <!-- Summary Text -->
          <div class="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <p class="text-center text-blue-700">
              There are <span class="font-bold text-blue-800">{{ mentees.length }}</span> 
              mentee{{ mentees.length !== 1 ? 's' : '' }} in 
              <span class="font-bold text-orange-600">{{ district }}</span> district.
            </p>
          </div>
        </UCard>
      </div>

      <!-- Mentees List -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Mentees List</h3>
            <p class="text-sm text-gray-600 mt-1">
              Complete list of mentees and providers in {{ district }} district
            </p>
          </template>
          
          <div class="bg-white rounded-lg border border-gray-200">
            <TablesAGtablesMenteesList :mentees="mentees" />
          </div>

          <!-- Empty State -->
          <div 
            v-if="mentees.length === 0"
            class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200"
          >
            <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-gray-600 mb-2">No Mentees Found</h4>
            <p class="text-gray-500 max-w-md mx-auto">
              No mentees or providers are currently registered in {{ district }} district.
            </p>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ mentees.length }}</div>
          <div class="text-sm text-blue-600 font-medium">Mentees</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">{{ district }}</div>
          <div class="text-sm text-green-600 font-medium">District</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">{{ mentees.length > 0 ? '✓' : '-' }}</div>
          <div class="text-sm text-purple-600 font-medium">Active</div>
        </UCard>
        
        <UCard class="text-center bg-orange-50/50">
          <div class="text-2xl font-bold text-orange-600">{{ mentees.length > 0 ? '✓' : '-' }}</div>
          <div class="text-sm text-orange-600 font-medium">Data Available</div>
        </UCard>
      </div>

      <!-- Back Button -->
      <div class="max-w-6xl mx-auto flex justify-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Districts"
          @click="goBack"
        />
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}
</style>