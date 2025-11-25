<script setup lang="ts">
import DatabaseNames from '@/constants/DatabaseNames';
import Routes from '@/constants/Routes';
import useReplicateToCouchDB from '@/composables/useReplicateToCouchDB';
import useReplicateFromCouchDB from '@/composables/useReplicateFromCouchDB';


const syncTo = async (databaseName: string) => {
    await useReplicateToCouchDB(databaseName)
}

const syncFrom = async (databaseName: string) => {
    await useReplicateFromCouchDB(databaseName)
}

// Set page metadata
useSeoMeta({
  title: 'Data Synchronization - PenPlus NCD Monitoring',
  description: 'Sync your local data with the server'
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
            :to="Routes.DASHBOARD.path"
            class="flex-shrink-0"
          />
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Data Synchronization</h1>
              <p class="text-sm text-gray-600">
                Sync your local data with the server
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Warning Banner -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard class="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-orange-900 mb-2">Important Notice</h3>
              <p class="text-orange-800">
                When you update the app, please make sure to sync both 
                <span class="font-bold text-sky-500"> districts </span> and 
                <span class="font-bold text-rose-500"> mentees</span>
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Essential Sync Section -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Essential Data Sync</h3>
            <p class="text-sm text-gray-600 mt-1">Sync these first after app updates</p>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Districts Sync -->
            <UCard 
              class="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
              @click="syncFrom(DatabaseNames.DISTRICTS)"
            >
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-sky-600" />
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-sky-700">Sync Districts</div>
                  <div class="text-sm text-sky-600">Update district information</div>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-sky-400" />
              </div>
            </UCard>

            <!-- Mentees Sync -->
            <UCard 
              class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
              @click="syncFrom(DatabaseNames.MENTEES)"
            >
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-rose-600" />
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-rose-700">Sync Mentees</div>
                  <div class="text-sm text-rose-600">Update mentee information</div>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-rose-400" />
              </div>
            </UCard>
          </div>
        </UCard>
      </div>

      <!-- Additional Sync Options -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Additional Sync Options</h3>
            <p class="text-sm text-gray-600 mt-1">Sync other data types as needed</p>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Completed Evaluations -->
            <UCard 
              class="bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
              @click="syncFrom(DatabaseNames.COMPLETED_EVALUTATIONS)"
            >
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-purple-600" />
                </div>
                <div class="font-semibold text-purple-700">Completed Evaluations</div>
                <div class="text-sm text-purple-600 mt-1">Sync finished assessments</div>
              </div>
            </UCard>

            <!-- Incomplete Evaluations -->
            <UCard 
              class="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
              @click="syncTo(DatabaseNames.INCOMPLETE_EVALUATIONS)"
            >
              <div class="text-center">
                <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-clock" class="w-6 h-6 text-teal-600" />
                </div>
                <div class="font-semibold text-teal-700">Incomplete Evaluations</div>
                <div class="text-sm text-teal-600 mt-1">Sync pending assessments</div>
              </div>
            </UCard>

            <!-- Co-Mentors -->
            <UCard 
              class="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
              @click="syncTo(DatabaseNames.COMENTORS)"
            >
              <div class="text-center">
                <div class="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-users" class="w-6 h-6 text-rose-600" />
                </div>
                <div class="font-semibold text-rose-700">Co-Mentors</div>
                <div class="text-sm text-rose-600 mt-1">Sync mentor information</div>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>

      <!-- Sync Status & Instructions -->
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Sync Instructions -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Sync Instructions</h3>
            </template>
            
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">Sync From Server</div>
                  <div class="text-sm text-gray-600">Download latest data from the central server</div>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UIcon name="i-heroicons-arrow-up-tray" class="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">Sync To Server</div>
                  <div class="text-sm text-gray-600">Upload your local data to the server</div>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">Regular Updates</div>
                  <div class="text-sm text-gray-600">Sync regularly to avoid data conflicts</div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Quick Actions -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </template>
            
            <div class="space-y-4">
              <UButton
                icon="i-heroicons-arrow-down-tray"
                color="blue"
                variant="outline"
                label="Sync All From Server"
                class="w-full justify-center"
                @click="() => {
                  syncFrom(DatabaseNames.DISTRICTS)
                  syncFrom(DatabaseNames.MENTEES)
                  syncFrom(DatabaseNames.COMPLETED_EVALUTATIONS)
                }"
              />
              
              <UButton
                icon="i-heroicons-arrow-up-tray"
                color="green"
                variant="outline"
                label="Sync All To Server"
                class="w-full justify-center"
                @click="() => {
                  syncTo(DatabaseNames.INCOMPLETE_EVALUATIONS)
                  syncTo(DatabaseNames.COMENTORS)
                }"
              />
              
              <UButton
                icon="i-heroicons-home"
                color="gray"
                variant="ghost"
                label="Back to Dashboard"
                :to="Routes.DASHBOARD.path"
                class="w-full justify-center"
              />
            </div>
          </UCard>
        </div>

        <!-- Sync Status Indicators -->
        <div class="max-w-4xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <UCard class="text-center bg-blue-50/50">
            <div class="text-2xl font-bold text-blue-600">↓</div>
            <div class="text-sm text-blue-600 font-medium">Pull Data</div>
          </UCard>
          
          <UCard class="text-center bg-green-50/50">
            <div class="text-2xl font-bold text-green-600">↑</div>
            <div class="text-sm text-green-600 font-medium">Push Data</div>
          </UCard>
          
          <UCard class="text-center bg-purple-50/50">
            <div class="text-2xl font-bold text-purple-600">↔</div>
            <div class="text-sm text-purple-600 font-medium">Bidirectional</div>
          </UCard>
          
          <UCard class="text-center bg-orange-50/50">
            <div class="text-2xl font-bold text-orange-600">⚠</div>
            <div class="text-sm text-orange-600 font-medium">Essential</div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}

/* Hover effects for interactive cards */
.cursor-pointer:hover {
  transform: translateY(-2px);
}
</style>