<script setup lang="ts">
/**
 * ScoreSelector.vue - Reusable score selection component
 * Extracted from MainEvaluation.vue for better code organization
 */

type BadgeColor = 'red' | 'orange' | 'blue' | 'green' | 'teal' | 'gray';

interface ScoringOption {
  description: string;
  score: number;
  color: BadgeColor;
}

interface Props {
  modelValue: number | undefined;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined];
}>();

const scoringOptions: ScoringOption[] = [
  { description: '0 - The competency cannot be evaluated', score: 0, color: 'gray' },
  { description: '1 - Does not demonstrate competency', score: 1, color: 'red' },
  { description: '2 - Demonstrates basic competency', score: 2, color: 'orange' },
  { description: '3 - Demonstrates satisfactory competency', score: 3, color: 'blue' },
  { description: '4 - Demonstrates advanced competency', score: 4, color: 'green' },
  { description: '5 - Demonstrates exceptional competency', score: 5, color: 'teal' }
];

const updateScore = (value: number | undefined) => {
  emit('update:modelValue', value);
};

const getScoreColor = (score: number | undefined): BadgeColor => {
  if (score === undefined) return 'gray';
  const option = scoringOptions.find(opt => opt.score === score);
  return option ? option.color : 'gray';
};
</script>

<template>
  <UFormGroup :label="`Current Score`" name="score" class="w-full">
    <USelect
      :model-value="modelValue"
      :options="scoringOptions"
      option-attribute="description"
      value-attribute="score"
      placeholder="Select score"
      class="w-full"
      :disabled="disabled"
      @update:model-value="updateScore"
    >
      <template #label>
        <span v-if="modelValue !== undefined" class="flex items-center space-x-2">
          <span 
            class="w-3 h-3 rounded-full" 
            :class="`bg-${getScoreColor(modelValue)}-500`"
          ></span>
          <span>{{ modelValue }}</span>
        </span>
      </template>

      <template #option="{ option }">
        <div class="flex items-center space-x-3">
          <span class="w-3 h-3 rounded-full" :class="`bg-${(option as ScoringOption).color}-500`"></span>
          <span>{{ (option as ScoringOption).description }}</span>
        </div>
      </template>
    </USelect>
  </UFormGroup>
</template>
