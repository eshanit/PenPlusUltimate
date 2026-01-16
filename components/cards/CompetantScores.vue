<script setup lang="ts">
import ScoreCards from '../shared/ScoreCards.vue';
import ScorePie from '../charts/Shared/Pie.vue';
import { useScoreCount } from '@/composables/useScoreCount';

console.log('CompetantScores component loaded');

type ScoreCount = {
  "1": number;
  "2": number;
  "3": number;
  [key: string]: number;
};

const props = defineProps<{
    tool: string,
    sessionIndex: number,
    scoreCounts: ScoreCount,
    evaluation: any
}>()

console.log('CompetantScores props:', props);

const countScores = useScoreCount(props.evaluation.sessions[`session_${props.sessionIndex}`].evalItemScores)

const percScores = computed(() => {
    const total = Object.values(props.scoreCounts).reduce((sum, value) => sum + value, 0);
  const percentages: ScoreCount = {
    "1": 0,
    "2": 0,
    "3": 0,
  };

  for (const key in props.scoreCounts) {
    percentages[key] = parseFloat(((props.scoreCounts[key] / total) * 100).toFixed(2)); // Convert to number
  }

  return percentages;
})

// View state management
const showAll: Ref<Boolean> = ref(true)
const showOne: Ref<Boolean> = ref(false)
const showTwo: Ref<Boolean> = ref(false)
const showThree: Ref<Boolean> = ref(false)

const switchScoreList = (score: number) => {
    switch (score) {
        case 1:
            showAll.value = false
            showOne.value = true
            showTwo.value = false
            showThree.value = false
            break;
        case 2:
            showAll.value = false
            showOne.value = false
            showTwo.value = true
            showThree.value = false
            break;
        case 3:
            showAll.value = false
            showOne.value = false
            showTwo.value = false
            showThree.value = true
            break;
        default:
            showAll.value = true
            showOne.value = false
            showTwo.value = false
            showThree.value = false
    }
}

// Active state for buttons
const activeView = computed(() => {
  if (showOne.value) return 1
  if (showTwo.value) return 2
  if (showThree.value) return 3
  return 'all'
})
</script>

<template>
  <div class="w-full">
    <!-- Score Overview Header -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Competency Score Distribution</h3>
      <p class="text-sm text-gray-600 mt-1">Click on score categories to filter the view</p>
    </div>

    <!-- Score Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <!-- Score 1 Card -->
      <UCard 
        class="cursor-pointer transition-all duration-300 hover:scale-105"
        :class="[
          activeView === 1 
            ? 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 shadow-lg' 
            : 'bg-white border border-gray-200 hover:shadow-md'
        ]"
        @click="switchScoreList(1)"
      >
        <div class="text-center">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600" />
          </div>
          <div class="text-sm font-medium text-red-700 mb-1">Needs Improvement</div>
          <div class="text-3xl font-bold text-red-600">{{ countScores.one }}</div>
          <div class="text-xs text-red-500 mt-1">Score 1's</div>
          <div 
            v-if="activeView === 1"
            class="w-16 h-1 bg-red-500 rounded-full mx-auto mt-2"
          ></div>
        </div>
      </UCard>

      <!-- Score 2 Card -->
      <UCard 
        class="cursor-pointer transition-all duration-300 hover:scale-105"
        :class="[
          activeView === 2 
            ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 shadow-lg' 
            : 'bg-white border border-gray-200 hover:shadow-md'
        ]"
        @click="switchScoreList(2)"
      >
        <div class="text-center">
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-orange-600" />
          </div>
          <div class="text-sm font-medium text-orange-700 mb-1">Developing</div>
          <div class="text-3xl font-bold text-orange-600">{{ countScores.two }}</div>
          <div class="text-xs text-orange-500 mt-1">Score 2's</div>
          <div 
            v-if="activeView === 2"
            class="w-16 h-1 bg-orange-500 rounded-full mx-auto mt-2"
          ></div>
        </div>
      </UCard>

      <!-- Score 3 Card -->
      <UCard 
        class="cursor-pointer transition-all duration-300 hover:scale-105"
        :class="[
          activeView === 3 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg' 
            : 'bg-white border border-gray-200 hover:shadow-md'
        ]"
        @click="switchScoreList(3)"
      >
        <div class="text-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-green-600" />
          </div>
          <div class="text-sm font-medium text-green-700 mb-1">Proficient</div>
          <div class="text-3xl font-bold text-green-600">{{ countScores.three }}</div>
          <div class="text-xs text-green-500 mt-1">Score 3's</div>
          <div 
            v-if="activeView === 3"
            class="w-16 h-1 bg-green-500 rounded-full mx-auto mt-2"
          ></div>
        </div>
      </UCard>
    </div>

    <!-- Visualization Section -->
    <div class="mb-8">
      <UCard>
        <template #header>
          <h4 class="text-md font-semibold text-gray-900">Score Distribution</h4>
          <p class="text-sm text-gray-600 mt-1">
            {{ 
              activeView === 'all' ? 'Overall score distribution' :
              activeView === 1 ? 'Items needing improvement' :
              activeView === 2 ? 'Developing competency items' :
              'Proficient competency items'
            }}
          </p>
        </template>

        <div class="flex justify-center">
          <div class="w-full max-w-md">
            <div v-if="showAll">
              <ScorePie :pieData="props.scoreCounts" :title="`Score Distribution for ${props.tool.toUpperCase()}`" />
            </div>
            
            <div v-if="showOne" class="text-center">
              <UMeter 
                icon="i-heroicons-exclamation-triangle" 
                color="red" 
                :value="percScores['1']"  
                label="Percentage of Score 1's" 
                size="xl" 
                indicator
                class="mb-4"
              />
              <p class="text-sm text-red-600">
                {{ percScores['1'] }}% of items need improvement
              </p>
            </div>
            
            <div v-if="showTwo" class="text-center">
              <UMeter 
                icon="i-heroicons-check-circle" 
                color="orange" 
                :value="percScores['2']"  
                label="Percentage of Score 2's" 
                size="xl" 
                indicator
                class="mb-4"
              />
              <p class="text-sm text-orange-600">
                {{ percScores['2'] }}% of items show developing competency
              </p>
            </div>
            
            <div v-if="showThree" class="text-center">
              <UMeter 
                icon="i-heroicons-trophy" 
                color="green" 
                :value="percScores['3']"  
                label="Percentage of Score 3's" 
                size="xl" 
                indicator
                class="mb-4"
              />
              <p class="text-sm text-green-600">
                {{ percScores['3'] }}% of items show proficiency
              </p>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <template #footer>
          <div v-if="!showAll" class="text-center">
            <UButton 
              variant="outline" 
              color="blue" 
              @click="switchScoreList(4)"
              class="hover:scale-105 transition-transform duration-200"
              icon="i-heroicons-eye"
            >
              View All Scores
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Score Details Section -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <h4 class="text-md font-semibold text-gray-900">
            {{
              activeView === 'all' ? 'All Evaluation Items' :
              activeView === 1 ? 'Items Needing Improvement (Score 1)' :
              activeView === 2 ? 'Developing Competency Items (Score 2)' :
              'Proficient Items (Score 3)'
            }}
          </h4>
          <p class="text-sm text-gray-600 mt-1">
            Detailed breakdown of competency assessment
          </p>
        </template>

        <div v-if="showOne">
          <ScoreCards :tool="props.tool" :session-index="props.sessionIndex" :evaluation="props.evaluation" score="1" />
        </div>
        <div v-if="showTwo">
          <ScoreCards :tool="props.tool" :session-index="props.sessionIndex" :evaluation="props.evaluation" score="2" />
        </div>
        <div v-if="showThree">
          <ScoreCards :tool="props.tool" :session-index="props.sessionIndex" :evaluation="props.evaluation" score="3" />
        </div>
        <div v-if="showAll">
          <ScoreCards :tool="props.tool" :session-index="props.sessionIndex" :evaluation="props.evaluation" score="all" />
        </div>
      </UCard>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <UCard class="text-center bg-red-50/50">
        <div class="text-xl font-bold text-red-600">{{ countScores.one }}</div>
        <div class="text-sm text-red-600 font-medium">Needs Work</div>
      </UCard>
      
      <UCard class="text-center bg-orange-50/50">
        <div class="text-xl font-bold text-orange-600">{{ countScores.two }}</div>
        <div class="text-sm text-orange-600 font-medium">Developing</div>
      </UCard>
      
      <UCard class="text-center bg-green-50/50">
        <div class="text-xl font-bold text-green-600">{{ countScores.three }}</div>
        <div class="text-sm text-green-600 font-medium">Proficient</div>
      </UCard>
      
      <UCard class="text-center bg-blue-50/50">
        <div class="text-xl font-bold text-blue-600">{{ countScores.one + countScores.two + countScores.three }}</div>
        <div class="text-sm text-blue-600 font-medium">Total Items</div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}

/* Custom hover effects */
.cursor-pointer:hover {
  transform: translateY(-2px);
}
</style>