<script setup lang="ts">
/**
 * PreviousScoreDisplay.vue - Shows previous score data
 * Extracted from MainEvaluation.vue
 */
import { format } from 'date-fns';

type BadgeColor = 'red' | 'orange' | 'blue' | 'green' | 'teal' | 'gray';

interface Props {
  score?: {
    score: number;
    session: number;
    date: number;
    notes?: string;
  };
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  score: undefined,
  isLoading: false
});

const getScoreColor = (score: number | undefined): BadgeColor => {
  if (score === undefined) return 'gray';
  if (score === 5) return 'teal';
  if (score === 4) return 'green';
  if (score === 3) return 'blue';
  if (score === 2) return 'orange';
  if (score === 1) return 'red';
  return 'gray';
};

const getScoreLabel = (score: number): string => {
  if (score === 5) return 'Exceptional';
  if (score === 4) return 'Advanced';
  if (score === 3) return 'Satisfactory';
  if (score === 2) return 'Basic';
  if (score === 1) return 'Needs Improvement';
  return 'Not Evaluated';
};

const getScoreIcon = (score: number): string => {
  if (score === 5) return 'i-heroicons-star';
  if (score === 4) return 'i-heroicons-star';
  if (score === 3) return 'i-heroicons-hand-thumb-up';
  if (score === 2) return 'i-heroicons-check-circle';
  if (score === 1) return 'i-heroicons-exclamation-triangle';
  return 'i-heroicons-question-mark-circle';
};
</script>

<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="p-3 bg-gray-50 rounded-lg border border-gray-200">
    <div class="flex items-center space-x-2 text-gray-500">
      <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
      <span class="text-sm">Loading previous scores...</span>
    </div>
  </div>

  <!-- Has Previous Score -->
  <div v-else-if="score" class="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-blue-600" />
          <span class="text-sm font-medium text-gray-700">Most Recent Score:</span>
        </div>
        <div class="flex items-center space-x-3">
          <UBadge 
            :color="getScoreColor(score.score)" 
            variant="subtle"
            class="font-semibold"
          >
            Score {{ score.score }}
          </UBadge>
          <div class="text-sm text-gray-600">
            Session {{ score.session }}
          </div>
          <div class="text-sm text-gray-600">
            {{ format(new Date(score.date), 'MMM dd, yyyy') }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress Notes -->
    <div v-if="score.notes" class="mt-2 p-2 bg-white rounded border text-sm text-gray-600">
      <strong>Previous Notes:</strong> {{ score.notes }}
    </div>
    
    <!-- Performance Indicators -->
    <div class="flex items-center space-x-2 mt-2">
      <div 
        v-if="score.score === 5" 
        class="flex items-center space-x-1 text-teal-600"
      >
        <UIcon :name="getScoreIcon(score.score)" class="w-4 h-4" />
        <span class="text-sm font-medium">Exceptional</span>
      </div>
      <div 
        v-else-if="score.score === 4" 
        class="flex items-center space-x-1 text-green-600"
      >
        <UIcon :name="getScoreIcon(score.score)" class="w-4 h-4" />
        <span class="text-sm font-medium">Advanced</span>
      </div>
      <div 
        v-else-if="score.score === 3" 
        class="flex items-center space-x-1 text-blue-600"
      >
        <UIcon :name="getScoreIcon(score.score)" class="w-4 h-4" />
        <span class="text-sm font-medium">Satisfactory</span>
      </div>
      <div 
        v-else-if="score.score === 2" 
        class="flex items-center space-x-1 text-orange-600"
      >
        <UIcon :name="getScoreIcon(score.score)" class="w-4 h-4" />
        <span class="text-sm font-medium">Basic</span>
      </div>
      <div 
        v-else-if="score.score === 1" 
        class="flex items-center space-x-1 text-red-600"
      >
        <UIcon :name="getScoreIcon(score.score)" class="w-4 h-4" />
        <span class="text-sm font-medium">Needs Improvement</span>
      </div>
      <div 
        v-else 
        class="flex items-center space-x-1 text-gray-600"
      >
        <UIcon :name="getScoreIcon(score.score)" class="w-4 h-4" />
        <span class="text-sm font-medium">Not Evaluated</span>
      </div>
    </div>
  </div>

  <!-- No Previous Score -->
  <div v-else class="p-3 bg-gray-50 rounded-lg border border-gray-200">
    <div class="flex items-center space-x-2 text-gray-500">
      <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
      <span class="text-sm">No previous score recorded for this competency</span>
    </div>
  </div>
</template>
