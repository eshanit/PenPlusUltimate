<script setup lang="ts">
import { format } from 'date-fns';

interface Props {
  item: any;
  index: number;
  cutOff: number | string | null;
  mostRecentScores: any;
  localStorageState: any;
}

const props = defineProps<Props>();

// Helper to get score color
const getScoreColor = (score: number) => {
  switch (score) {
    case 0: return 'red';
    case 1: return 'orange';
    case 2: return 'blue';
    case 3: return 'green';
    default: return 'gray';
  }
};

// Helper to get most recent score
const getMostRecentScore = (itemNumber: string) => {
  if (!props.mostRecentScores) return null;
  return props.mostRecentScores.find((score: any) => score.itemNumber === itemNumber);
};
</script>

<template>
  <div
    class="p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
    :class="{
      'bg-white border-gray-200': props.cutOff == null || Number(props.index) < Number(props.cutOff),
      'bg-blue-50 border-blue-200': props.cutOff != null && Number(props.index) >= Number(props.cutOff)
    }"
  >
    <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
      <!-- Item Content -->
      <div class="flex-1 space-y-3">
        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-white text-sm"
            :class="{
              'bg-orange-500': props.cutOff == null || props.index < Number(props.cutOff),
              'bg-pink-600': props.cutOff != null && props.index >= Number(props.cutOff)
            }"
          >
            {{ item.number }}
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 leading-relaxed">
              {{ item.title }}
            </h4>

            <!-- Most Recent Previous Score -->
            <div
              v-if="mostRecentScores && getMostRecentScore(item.number)"
              class="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm font-medium text-gray-700">Most Recent Score:</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <UBadge
                      :color="getScoreColor(getMostRecentScore(item.number).score)"
                      variant="subtle"
                      class="font-semibold"
                    >
                      Score {{ getMostRecentScore(item.number).score }}
                    </UBadge>
                    <div class="text-sm text-gray-600">
                      Session {{ getMostRecentScore(item.number).session }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ format(getMostRecentScore(item.number).date, 'MMM dd, yyyy') }}
                    </div>
                  </div>
                </div>

                <!-- Performance Trend -->
                <div class="flex items-center space-x-2">
                  <div class="text-sm font-medium text-gray-700">Trend:</div>
                  <div class="flex items-center space-x-1">
                    <UIcon
                      :name="getMostRecentScore(item.number).score >= 2 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
                      :class="getMostRecentScore(item.number).score >= 2 ? 'text-green-600' : 'text-red-600'"
                      class="w-4 h-4"
                    />
                    <span class="text-sm" :class="getMostRecentScore(item.number).score >= 2 ? 'text-green-600' : 'text-red-600'">
                      {{ getMostRecentScore(item.number).score >= 2 ? 'Improving' : 'Needs Work' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scoring Section -->
      <div class="lg:w-48 space-y-3">
        <div class="text-sm font-medium text-gray-700 mb-2">Score this competency:</div>
        <div class="grid grid-cols-2 gap-2">
          <UButton
            v-for="score in [0, 1, 2, 3]"
            :key="score"
            :color="getScoreColor(score)"
            :variant="localStorageState.evalItemScores[props.index].score === score ? 'solid' : 'outline'"
            size="sm"
            @click="localStorageState.evalItemScores[props.index].score = score"
            class="justify-center font-semibold"
          >
            {{ score }}
          </UButton>
        </div>

        <!-- Current Score Display -->
        <div v-if="localStorageState.evalItemScores[props.index].score !== undefined" class="mt-3 p-2 bg-gray-50 rounded-lg text-center">
          <UBadge
            :color="getScoreColor(localStorageState.evalItemScores[props.index].score)"
            variant="subtle"
            size="xs"
          >
            {{ localStorageState.evalItemScores[props.index].score }}
          </UBadge>
        </div>

        <!-- Performance Comparison -->
        <div v-if="mostRecentScores && getMostRecentScore(item.number)" class="mt-2">
          <div v-if="localStorageState.evalItemScores[props.index].score > getMostRecentScore(item.number).score"
               class="mt-1 text-green-600 font-medium flex items-center space-x-1">
            <UIcon name="i-heroicons-arrow-trending-up" class="w-3 h-3" />
            <span>Improvement!</span>
          </div>
          <div v-else-if="localStorageState.evalItemScores[props.index].score < getMostRecentScore(item.number).score"
               class="mt-1 text-red-600 font-medium flex items-center space-x-1">
            <UIcon name="i-heroicons-arrow-trending-down" class="w-3 h-3" />
            <span>Needs attention</span>
          </div>
          <div v-else class="mt-1 text-blue-600 font-medium flex items-center space-x-1">
            <UIcon name="i-heroicons-minus" class="w-3 h-3" />
            <span>Same as before</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>