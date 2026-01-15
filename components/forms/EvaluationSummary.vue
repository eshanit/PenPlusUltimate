<script setup lang="ts">
interface Props {
  evaluationItems: any[];
  exemplaryCount: number;
  competentCount: number;
  pendingCount: number;
  mostRecentScores: any[];
  prevExemplaryCount: number;
  prevCompetentCount: number;
}

defineProps<Props>();
</script>

<template>
  <!-- Performance Summary -->
  <UCard class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
    <template #header>
      <h4 class="font-semibold text-gray-900">Performance Overview</h4>
    </template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <div class="text-2xl font-bold text-blue-600">
          {{ evaluationItems?.length || 0 }}
        </div>
        <div class="text-sm text-gray-600">Total Items</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-green-600">
          {{ exemplaryCount }}
        </div>
        <div class="text-sm text-gray-600">Exemplary</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-blue-600">
          {{ competentCount }}
        </div>
        <div class="text-sm text-gray-600">Competent</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-orange-600">
          {{ pendingCount }}
        </div>
        <div class="text-sm text-gray-600">Pending</div>
      </div>
    </div>

    <!-- Previous vs Current Comparison -->
    <div v-if="mostRecentScores.length > 0" class="mt-4 pt-4 border-t border-gray-200">
      <h5 class="font-medium text-gray-900 mb-2">Progress Since Last Evaluation</h5>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-lg font-bold text-purple-600">
            {{ prevExemplaryCount }}
          </div>
          <div class="text-xs text-gray-600">Prev. Exemplary</div>
        </div>
        <div>
          <div class="text-lg font-bold text-blue-600">
            {{ prevCompetentCount }}
          </div>
          <div class="text-xs text-gray-600">Prev. Competent</div>
        </div>
        <div>
          <div class="text-lg font-bold text-green-600">
            {{ exemplaryCount }}
          </div>
          <div class="text-xs text-gray-600">Current Exemplary</div>
        </div>
        <div>
          <div class="text-lg font-bold text-blue-600">
            {{ competentCount }}
          </div>
          <div class="text-xs text-gray-600">Current Competent</div>
        </div>
      </div>
    </div>
  </UCard>
</template>