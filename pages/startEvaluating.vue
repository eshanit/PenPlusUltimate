<script setup lang="ts">
import type ITools from '@/interfaces/ITools';
import Routes from '@/constants/Routes';

const user = useUserDetails;

// Form tools data
const formTools: Ref<Array<ITools>> = ref([
  {
    label: 'Diabetes',
    name: 'diabetes',
    svg_path: 'dietology',
    description: 'Diabetes care and management evaluation',
    color: 'green',
    category: 'Metabolic'
  },
  {
    label: 'Cardiac',
    name: 'cardiac', 
    svg_path: 'cardiology',
    description: 'Cardiovascular disease assessment',
    color: 'red',
    category: 'Cardiovascular'
  },
  {
    label: 'Echo',
    name: 'echo',
    svg_path: 'heart',
    description: 'Echocardiography evaluation',
    color: 'pink',
    category: 'Cardiovascular'
  },
  {
    label: 'Sickle Cell',
    name: 'sickle',
    svg_path: 'endocrinology',
    description: 'Sickle cell disease management',
    color: 'purple',
    category: 'Hematology'
  },
  {
    label: 'Respiratory Disease',
    name: 'respiratory',
    svg_path: 'lungs',
    description: 'Respiratory conditions assessment',
    color: 'blue',
    category: 'Pulmonary'
  },
  {
    label: 'Hyper Tension',
    name: 'hypertension',
    svg_path: 'pills',
    description: 'Hypertension management evaluation',
    color: 'yellow',
    category: 'Cardiovascular'
  },
  {
    label: 'Epilepsy',
    name: 'epilepsy',
    svg_path: 'patient',
    description: 'Neurological disorder assessment',
    color: 'indigo',
    category: 'Neurology'
  },
  {
    label: 'Liver',
    name: 'liver',
    svg_path: 'liver',
    description: 'Hepatic disease evaluation',
    color: 'yellow',
    category: 'Gastrointestinal'
  },
  {
    label: 'Kidney',
    name: 'kidney',
    svg_path: 'kidneys',
    description: 'Renal disease management',
    color: 'blue',
    category: 'Renal'
  },
  {
    label: 'Palliative Care',
    name: 'Palliative-Care',
    svg_path: 'patient',
    description: 'End-of-life care assessment',
    color: 'gray',
    category: 'Supportive Care'
  }
]);

// Navigation
const goBack = () => {
  navigateTo(Routes.MONITORING_PLATFORM.path);
};

const selectTool = (tool: ITools) => {
  useProcessLocalStorage().store('Tool', tool);
  navigateTo(Routes.DISTRICTS.path);
};

// Set page metadata
useSeoMeta({
  title: 'Select Evaluation Tool - PenPlus NCD Monitoring',
  description: 'Choose the appropriate evaluation form for healthcare provider assessment'
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
              <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Select Evaluation Tool</h1>
              <p class="text-sm text-gray-600">Choose the appropriate form for your assessment</p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-6 px-4">
      <!-- Welcome Section -->
      <UCard class="mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-xl font-bold mb-2">Welcome, {{ user.firstname }} {{ user.lastname }}</h2>
            <p class="text-blue-100 opacity-90">
              Select from specialized evaluation tools below to begin assessing healthcare providers. 
              Each tool is designed for specific NCD conditions and care protocols.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
            <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UIcon name="i-heroicons-user" class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Info Banner -->
      <UAlert 
        icon="i-heroicons-information-circle" 
        color="blue" 
        variant="subtle"
        class="mb-6 border border-blue-200"
      >
        <template #title>
          Evaluation Tool Selection
        </template>
        <template #description>
          Choose the evaluation form that matches the healthcare condition you wish to assess. 
          Each tool contains condition-specific metrics and protocols for comprehensive provider evaluation.
        </template>
      </UAlert>

      <!-- Tools Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <UCard 
          v-for="tool in formTools" 
          :key="tool.name"
          class="hover:shadow-lg transition-all duration-300 hover-lift cursor-pointer group border-l-4"
          :class="{
            'border-l-green-500': tool.color === 'green',
            'border-l-red-500': tool.color === 'red',
            'border-l-pink-500': tool.color === 'pink',
            'border-l-purple-500': tool.color === 'purple',
            'border-l-blue-500': tool.color === 'blue',
            'border-l-orange-500': tool.color === 'orange',
            'border-l-indigo-500': tool.color === 'indigo',
            'border-l-yellow-500': tool.color === 'yellow',
            'border-l-teal-500': tool.color === 'teal',
            'border-l-gray-500': tool.color === 'gray'
          }"
          @click="selectTool(tool)"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <UBadge
                size="sm"
                variant="subtle"
                :color="(tool.color as any)"
                class="font-medium"
              >
                {{ tool.category }}
              </UBadge>
              <UIcon 
                name="i-heroicons-arrow-right" 
                class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" 
              />
            </div>
          </template>

          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :class="{
                    'bg-green-100': tool.color === 'green',
                    'bg-red-100': tool.color === 'red',
                    'bg-pink-100': tool.color === 'pink',
                    'bg-purple-100': tool.color === 'purple',
                    'bg-blue-100': tool.color === 'blue',
                    'bg-orange-100': tool.color === 'orange',
                    'bg-indigo-100': tool.color === 'indigo',
                    'bg-yellow-100': tool.color === 'yellow',
                    'bg-teal-100': tool.color === 'teal',
                    'bg-gray-100': tool.color === 'gray'
                  }"
                >
                  <NuxtImg 
                    :src="`/icons/${tool.svg_path}.png`" 
                    :alt="`${tool.label} icon`"
                    class="w-6 h-6"
                  />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-lg truncate">{{ tool.label }}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ tool.description }}</p>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Click to select</span>
              <UButton 
                icon="i-heroicons-play" 
                color="gray" 
                variant="ghost" 
                size="xs"
                label="Start"
              />
            </div>
          </template>
        </UCard>
      </div>

      <!-- Empty State (if needed) -->
      <div v-if="formTools.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-clipboard-document" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No evaluation tools available</h3>
        <p class="text-gray-500">Please contact your administrator to configure evaluation tools.</p>
      </div>

      <!-- Quick Stats Footer -->
      <div class="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600">{{ formTools.length }}</div>
            <div class="text-sm text-gray-600">Available Tools</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600">6</div>
            <div class="text-sm text-gray-600">Disease Categories</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600">Standardized</div>
            <div class="text-sm text-gray-600">Assessment Protocols</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-orange-600">NCD Focus</div>
            <div class="text-sm text-gray-600">Specialized Tools</div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.hover-lift:hover {
  transform: translateY(-4px);
  transition: transform 0.2s ease-in-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease-in-out;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
  
  .icon-size {
    max-height: 60px;
  }
}
</style>