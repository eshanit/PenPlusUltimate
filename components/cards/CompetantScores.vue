<script setup lang="ts">
import ScoreCards from '../shared/ScoreCards.vue';
import ScorePie from '../charts/Shared/Pie.vue';
import { useScoreCount } from '@/composables/useScoreCount';

console.log('CompetantScores component loaded');

type ScoreCount = {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
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
    "4": 0,
    "5": 0,
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
const showFour: Ref<Boolean> = ref(false)
const showFive: Ref<Boolean> = ref(false)

const switchScoreList = (score: number) => {
    switch (score) {
        case 1:
            showAll.value = false
            showOne.value = true
            showTwo.value = false
            showThree.value = false
            showFour.value = false
            showFive.value = false
            break;
        case 2:
            showAll.value = false
            showOne.value = false
            showTwo.value = true
            showThree.value = false
            showFour.value = false
            showFive.value = false
            break;
        case 3:
            showAll.value = false
            showOne.value = false
            showTwo.value = false
            showThree.value = true
            showFour.value = false
            showFive.value = false
            break;
        case 4:
            showAll.value = false
            showOne.value = false
            showTwo.value = false
            showThree.value = false
            showFour.value = true
            showFive.value = false
            break;
        case 5:
            showAll.value = false
            showOne.value = false
            showTwo.value = false
            showThree.value = false
            showFour.value = false
            showFive.value = true
            break;
        default:
            showAll.value = true
            showOne.value = false
            showTwo.value = false
            showThree.value = false
            showFour.value = false
            showFive.value = false
    }
}

// Active state for buttons
const activeView = computed(() => {
  if (showOne.value) return 1
  if (showTwo.value) return 2
  if (showThree.value) return 3
  if (showFour.value) return 4
  if (showFive.value) return 5
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
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
            ? 'bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 shadow-lg'
            : 'bg-white border border-gray-200 hover:shadow-md'
        ]"
        @click="switchScoreList(3)"
      >
        <div class="text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-hand-thumb-up" class="w-6 h-6 text-blue-600" />
          </div>
          <div class="text-sm font-medium text-blue-700 mb-1">Competent</div>
          <div class="text-3xl font-bold text-blue-600">{{ countScores.three }}</div>
          <div class="text-xs text-blue-500 mt-1">Score 3's</div>
          <div
            v-if="activeView === 3"
            class="w-16 h-1 bg-blue-500 rounded-full mx-auto mt-2"
          ></div>
        </div>
      </UCard>

      <!-- Score 4 Card -->
      <UCard
        class="cursor-pointer transition-all duration-300 hover:scale-105"
        :class="[
          activeView === 4
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg'
            : 'bg-white border border-gray-200 hover:shadow-md'
        ]"
        @click="switchScoreList(4)"
      >
        <div class="text-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-star" class="w-6 h-6 text-green-600" />
          </div>
          <div class="text-sm font-medium text-green-700 mb-1">Highly Competent</div>
          <div class="text-3xl font-bold text-green-600">{{ countScores.four }}</div>
          <div class="text-xs text-green-500 mt-1">Score 4's</div>
          <div
            v-if="activeView === 4"
            class="w-16 h-1 bg-green-500 rounded-full mx-auto mt-2"
          ></div>
        </div>
      </UCard>

      <!-- Score 5 Card -->
      <UCard
        class="cursor-pointer transition-all duration-300 hover:scale-105"
        :class="[
          activeView === 5
            ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 shadow-lg'
            : 'bg-white border border-gray-200 hover:shadow-md'
        ]"
        @click="switchScoreList(5)"
      >
        <div class="text-center">
          <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-teal-600" />
          </div>
          <div class="text-sm font-medium text-teal-700 mb-1">Outstanding</div>
          <div class="text-3xl font-bold text-teal-600">{{ countScores.five }}</div>
          <div class="text-xs text-teal-500 mt-1">Score 5's</div>
          <div
            v-if="activeView === 5"
            class="w-16 h-1 bg-teal-500 rounded-full mx-auto mt-2"
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
              activeView === 1 ? 'Items not good' :
              activeView === 2 ? 'Items needing improvement' :
              activeView === 3 ? 'Competent items' :
              activeView === 4 ? 'Highly competent items' :
              'Outstanding items'
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
                icon="i-heroicons-hand-thumb-up"
                color="blue"
                :value="percScores['3']"
                label="Percentage of Score 3's"
                size="xl"
                indicator
                class="mb-4"
              />
              <p class="text-sm text-blue-600">
                {{ percScores['3'] }}% of items show competency
              </p>
            </div>

            <div v-if="showFour" class="text-center">
              <UMeter
                icon="i-heroicons-star"
                color="green"
                :value="percScores['4']"
                label="Percentage of Score 4's"
                size="xl"
                indicator
                class="mb-4"
              />
              <p class="text-sm text-green-600">
                {{ percScores['4'] }}% of items show high competency
              </p>
            </div>

            <div v-if="showFive" class="text-center">
              <UMeter
                icon="i-heroicons-check-circle"
                color="teal"
                :value="percScores['5']"
                label="Percentage of Score 5's"
                size="xl"
                indicator
                class="mb-4"
              />
              <p class="text-sm text-teal-600">
                {{ percScores['5'] }}% of items are outstanding
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
              activeView === 1 ? 'Not Good Items (Score 1)' :
              activeView === 2 ? 'Needs Improvement Items (Score 2)' :
              activeView === 3 ? 'Competent Items (Score 3)' :
              activeView === 4 ? 'Highly Competent Items (Score 4)' :
              'Outstanding Items (Score 5)'
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
        <div v-if="showFour">
          <ScoreCards :tool="props.tool" :session-index="props.sessionIndex" :evaluation="props.evaluation" score="4" />
        </div>
        <div v-if="showFive">
          <ScoreCards :tool="props.tool" :session-index="props.sessionIndex" :evaluation="props.evaluation" score="5" />
        </div>
        <div v-if="showAll">
          <ScoreCards :tool="props.tool" :session-index="props.sessionIndex" :evaluation="props.evaluation" score="all" />
        </div>
      </UCard>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
      <UCard class="text-center bg-red-50/50">
        <div class="text-xl font-bold text-red-600">{{ countScores.one }}</div>
        <div class="text-sm text-red-600 font-medium">Not Good</div>
      </UCard>

      <UCard class="text-center bg-orange-50/50">
        <div class="text-xl font-bold text-orange-600">{{ countScores.two }}</div>
        <div class="text-sm text-orange-600 font-medium">Needs Improvement</div>
      </UCard>

      <UCard class="text-center bg-blue-50/50">
        <div class="text-xl font-bold text-blue-600">{{ countScores.three }}</div>
        <div class="text-sm text-blue-600 font-medium">Competent</div>
      </UCard>

      <UCard class="text-center bg-green-50/50">
        <div class="text-xl font-bold text-green-600">{{ countScores.four }}</div>
        <div class="text-sm text-green-600 font-medium">Highly Competent</div>
      </UCard>

      <UCard class="text-center bg-teal-50/50">
        <div class="text-xl font-bold text-teal-600">{{ countScores.five }}</div>
        <div class="text-sm text-teal-600 font-medium">Outstanding</div>
      </UCard>

      <UCard class="text-center bg-purple-50/50">
        <div class="text-xl font-bold text-purple-600">{{ countScores.one + countScores.two + countScores.three + countScores.four + countScores.five }}</div>
        <div class="text-sm text-purple-600 font-medium">Total Items</div>
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