<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import LocalStorageKeys from "@/constants/LocalStorageKeys";

interface Props {
  evaluationItems: any[];
  mostRecentScores: any[];
  prevExemplaryCount: number;
  prevCompetentCount: number;
}

const props = defineProps<Props>();

// Access scores from localStorage directly for reactivity
const localStorageState = useStorage(LocalStorageKeys.SCORES, { evalItemScores: props.evaluationItems });

// Compute counts from localStorage
const outstandingCount = computed(() => {
  return localStorageState.value.evalItemScores?.filter((s: any) => s.score == 5).length || 0;
});

const highlyCompetentCount = computed(() => {
  return localStorageState.value.evalItemScores?.filter((s: any) => s.score == 4).length || 0;
});

const competentCount = computed(() => {
  return localStorageState.value.evalItemScores?.filter((s: any) => s.score == 3).length || 0;
});

const needsImprovementCount = computed(() => {
  return localStorageState.value.evalItemScores?.filter((s: any) => s.score == 2).length || 0;
});

const notGoodCount = computed(() => {
  return localStorageState.value.evalItemScores?.filter((s: any) => s.score == 1).length || 0;
});

const pendingCount = computed(() => {
  return localStorageState.value.evalItemScores?.filter((s: any) => s.score === undefined).length || 0;
});

</script>

<template>
  <!-- Performance Summary -->
  <UCard class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
    <template #header>
      <h4 class="font-semibold text-gray-900">Performance Overview</h4>
    </template>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
      <div>
        <div class="text-2xl font-bold text-blue-600">
          {{ evaluationItems?.length || 0 }}
        </div>
        <div class="text-sm text-gray-600">Total Items</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-teal-600">
          {{ outstandingCount }}
        </div>
        <div class="text-sm text-gray-600">Outstanding</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-green-600">
          {{ highlyCompetentCount }}
        </div>
        <div class="text-sm text-gray-600">Highly Competent</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-blue-600">
          {{ competentCount }}
        </div>
        <div class="text-sm text-gray-600">Competent</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-yellow-600">
          {{ needsImprovementCount }}
        </div>
        <div class="text-sm text-gray-600">Needs Improvement</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-red-600">
          {{ notGoodCount }}
        </div>
        <div class="text-sm text-gray-600">Not Good</div>
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
          <div class="text-xs text-gray-600">Prev. Outstanding</div>
        </div>
        <div>
          <div class="text-lg font-bold text-blue-600">
            {{ prevCompetentCount }}
          </div>
          <div class="text-xs text-gray-600">Prev. Highly Competent</div>
        </div>
        <div>
          <div class="text-lg font-bold text-teal-600">
            {{ outstandingCount }}
          </div>
          <div class="text-xs text-gray-600">Current Outstanding</div>
        </div>
        <div>
          <div class="text-lg font-bold text-green-600">
            {{ highlyCompetentCount }}
          </div>
          <div class="text-xs text-gray-600">Current Highly Competent</div>
        </div>
      </div>
    </div>
  </UCard>
</template>