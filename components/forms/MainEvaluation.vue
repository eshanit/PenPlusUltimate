<script setup lang="ts">
import * as yup from "yup";
import { format } from 'date-fns';
import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { useStorage } from '@vueuse/core';
import { useEvalDataStore } from "@/stores/evaluations";
import { useMostRecentToolItemData } from "@/composables/useMostRecentToolItemData";

interface EvalItemScore {
  name: string;
  score?: number;
}

const props = defineProps<{
  menteeData: any,
  selectedTool: string | string[],
  evaluationItems: any,
  cutOff?: number
}>();

// Form state
const state = reactive({
  evalDate: Date.now(),
  evalItemScores: props.evaluationItems?.map((evalItem: any) => ({
    name: evalItem.number,
    score: undefined,
  })) || [] as EvalItemScore[]
});

const localStorageState = useStorage(LocalStorageKeys.SCORES, state);

// Fetch previous evaluations
const useEvaluations = useEvalDataStore();
const menteeEvals = ref<any[]>([]);
const mostRecentScores = ref<any[]>([]);

onMounted(async () => {
  if (props.menteeData?._id) {
    menteeEvals.value = await useEvaluations.fetchMenteeEvals(props.menteeData._id);
    const toolEvals = menteeEvals.value.filter((t: { tool: string | string[]; }) => t.tool == props.selectedTool);
    mostRecentScores.value = useMostRecentToolItemData(toolEvals);
  }
});

const getMostRecentScore = (itemNum: string): any => {
  return mostRecentScores.value?.find((r: any) => r.name == itemNum);
};

// Form schema
const schema = yup.object({
  evalDate: yup.string().label("Date Today"),
  evalItemScores: yup.array().required().min(0).label("Score"),
});

// Scoring options
const scoringOptions = [
  { label: '0 - Not Observed', value: 0, color: 'red' },
  { label: '1 - Needs Improvement', value: 1, color: 'orange' },
  { label: '2 - Competent', value: 2, color: 'blue' },
  { label: '3 - Exemplary', value: 3, color: 'green' }
];

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
</script>

<template>
  <UForm :state="state" @submit="" class="space-y-6">
    <!-- Evaluation Items -->
    <UCard class="shadow-lg border-0">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Competency Assessment</h3>
            <p class="text-sm text-gray-600 mt-1">
              Score each competency based on observed performance
            </p>
          </div>
          <UBadge color="blue" variant="subtle">
            {{ evaluationItems?.length || 0 }} Items
          </UBadge>
        </div>
      </template>

      <div class="space-y-6">
        <div 
          v-for="(item, index) in evaluationItems" 
          :key="item.number"
          class="p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
          :class="{
            'bg-white border-gray-200': !props?.cutOff || index < props?.cutOff,
            'bg-blue-50 border-blue-200': props?.cutOff && index >= props?.cutOff
          }"
        >
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <!-- Item Content -->
            <div class="flex-1 space-y-3">
              <div class="flex items-start space-x-3">
                <div 
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-white text-sm"
                  :class="{
                    'bg-orange-500': !props?.cutOff || index < props?.cutOff,
                    'bg-pink-600': props?.cutOff && index >= props?.cutOff
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
                        <div 
                          v-if="getMostRecentScore(item.number).score === 3" 
                          class="flex items-center space-x-1 text-green-600"
                        >
                          <UIcon name="i-heroicons-trending-up" class="w-4 h-4" />
                          <span class="text-sm font-medium">Mastered</span>
                        </div>
                        <div 
                          v-else-if="getMostRecentScore(item.number).score === 2" 
                          class="flex items-center space-x-1 text-blue-600"
                        >
                          <UIcon name="i-heroicons-arrow-trending-up" class="w-4 h-4" />
                          <span class="text-sm font-medium">Competent</span>
                        </div>
                        <div 
                          v-else-if="getMostRecentScore(item.number).score === 1" 
                          class="flex items-center space-x-1 text-orange-600"
                        >
                          <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
                          <span class="text-sm font-medium">Needs Practice</span>
                        </div>
                        <div 
                          v-else 
                          class="flex items-center space-x-1 text-red-600"
                        >
                          <UIcon name="i-heroicons-arrow-trending-down" class="w-4 h-4" />
                          <span class="text-sm font-medium">Not Observed</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Progress Notes -->
                    <div v-if="getMostRecentScore(item.number).notes" class="mt-2 p-2 bg-white rounded border text-sm text-gray-600">
                      <strong>Previous Notes:</strong> {{ getMostRecentScore(item.number).notes }}
                    </div>
                  </div>

                  <!-- No Previous Score -->
                  <div 
                    v-else-if="menteeEvals.length > 0"
                    class="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div class="flex items-center space-x-2 text-gray-500">
                      <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
                      <span class="text-sm">No previous score recorded for this competency</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Score Selection -->
            <div class="lg:w-48 flex-shrink-0">
              <UFormGroup :label="`Current Score`" name="score" class="w-full">
                <USelect
                  v-model="localStorageState.evalItemScores[index].score"
                  :options="scoringOptions"
                  option-attribute="label"
                  value-attribute="value"
                  placeholder="Select score"
                  class="w-full"
                  :ui="{
                    base: 'w-full'
                  }"
                >
                  <template #label>
                    <span v-if="localStorageState.evalItemScores[index].score !== undefined"
                          class="flex items-center space-x-2">
                      <span class="w-3 h-3 rounded-full"
                            :class="`bg-${getScoreColor(localStorageState.evalItemScores[index].score)}-500`"></span>
                      <span>{{ localStorageState.evalItemScores[index].score }}</span>
                    </span>
                  </template>

                  <template #option="{ option }">
                    <div class="flex items-center space-x-3">
                      <span class="w-3 h-3 rounded-full" :class="`bg-${option.color}-500`"></span>
                      <span>{{ option.label }}</span>
                    </div>
                  </template>
                </USelect>
              </UFormGroup>
              
              <!-- Score Comparison -->
              <div v-if="localStorageState.evalItemScores[index].score !== undefined && getMostRecentScore(item.number)"
                   class="mt-2 p-2 bg-white rounded-lg border text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">Previous:</span>
                  <UBadge
                    :color="getScoreColor(getMostRecentScore(item.number).score)"
                    variant="subtle"
                    size="xs"
                  >
                    {{ getMostRecentScore(item.number).score }}
                  </UBadge>
                </div>
                <div class="flex justify-between items-center mt-1">
                  <span class="text-gray-500">Current:</span>
                  <UBadge
                    :color="getScoreColor(localStorageState.evalItemScores[index].score)"
                    variant="subtle"
                    size="xs"
                  >
                    {{ localStorageState.evalItemScores[index].score }}
                  </UBadge>
                </div>
                <div v-if="localStorageState.evalItemScores[index].score > getMostRecentScore(item.number).score"
                     class="mt-1 text-green-600 font-medium flex items-center space-x-1">
                  <UIcon name="i-heroicons-arrow-trending-up" class="w-3 h-3" />
                  <span>Improvement!</span>
                </div>
                <div v-else-if="localStorageState.evalItemScores[index].score < getMostRecentScore(item.number).score"
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
      </div>

      <template #footer>
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-sm text-gray-600 text-center sm:text-left">
            Complete all competency assessments before proceeding
          </div>
          <UButton
            icon="i-heroicons-arrow-right"
            color="orange"
            variant="solid"
            :trailing="true"
            size="lg"
            :to="{
              name: Routes?.EVALUATION_SUMMARY.name,
              params: { tool: selectedTool }
            }"
            class="min-w-[140px]"
          >
            Continue to Review
          </UButton>
        </div>
      </template>
    </UCard>

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
            {{ state.evalItemScores?.filter((s: EvalItemScore) => s.score === 3).length || 0 }}
          </div>
          <div class="text-sm text-gray-600">Exemplary</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-blue-600">
            {{ state.evalItemScores?.filter((s: EvalItemScore) => s.score === 2).length || 0 }}
          </div>
          <div class="text-sm text-gray-600">Competent</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-orange-600">
            {{ state.evalItemScores?.filter((s: EvalItemScore) => s.score === undefined).length || 0 }}
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
              {{ mostRecentScores.filter(s => s.score === 3).length }}
            </div>
            <div class="text-xs text-gray-600">Prev. Exemplary</div>
          </div>
          <div>
            <div class="text-lg font-bold text-blue-600">
              {{ mostRecentScores.filter(s => s.score === 2).length }}
            </div>
            <div class="text-xs text-gray-600">Prev. Competent</div>
          </div>
          <div>
            <div class="text-lg font-bold text-green-600">
              {{ state.evalItemScores?.filter((s: EvalItemScore) => s.score === 3).length || 0 }}
            </div>
            <div class="text-xs text-gray-600">Current Exemplary</div>
          </div>
          <div>
            <div class="text-lg font-bold text-blue-600">
              {{ state.evalItemScores?.filter((s: EvalItemScore) => s.score === 2).length || 0 }}
            </div>
            <div class="text-xs text-gray-600">Current Competent</div>
          </div>
        </div>
      </div>
    </UCard>
  </UForm>
</template>

<style scoped>
/* Custom styling for better mobile experience */
@media (max-width: 1024px) {
  .lg\:w-48 {
    width: 100%;
  }
}
</style>