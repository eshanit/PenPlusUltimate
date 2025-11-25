<script setup lang="ts">
import DatabaseNames from "@/constants/DatabaseNames";
import type IFinalEvaluation from "~/interfaces/IFinalEvaluation";
import evaluationItemData from "@/data/evaluationItemData";

const route = useRoute()
const gender: any = route.params.gender

const router = useRouter();

const goBack = () => {
    router.back();
};

// Evaluations
const useEvaluations = useEvalDataStore();
const completedEvals: IFinalEvaluation[] = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);

const newGender = computed(() => {
    let genderx = 'Other'
    if (gender == 'Males') {
        genderx = 'Male'
    } else if (gender == 'Females') {
        return genderx = 'Female'
    } else {
        genderx = 'Other'
    }
    return genderx
})

const genderEvaluations = computed(() => {
    return completedEvals.filter((e) => {
        return e.mentee.gender == newGender.value
    })
})

const evaluationStats = useEvaluationStats(genderEvaluations.value)
const countSessions = useGenderSessionsCompleted(newGender.value, evaluationStats)

// Tools
const tools = useTools;

const toolEvaluationCounts = computed(() => {
    let counts: any[] = []
    tools.forEach((tool) => {
        counts.push({
            tool: tool.label,
            total: useCountToolSessionsCompleted(tool.name, evaluationStats).totalCompletedCount,
            totalSessions: useCountToolSessionsCompleted(tool.name, evaluationStats).totalCompletedSessions
        })
    });
    return counts;
})

// Finding highest and lowest totals
const maxToolTotal = Math.max(...toolEvaluationCounts.value.map(tool => tool.total));
const highestToolTotals = toolEvaluationCounts.value.filter(tool => tool.total === maxToolTotal);

const minToolTotal = Math.min(...toolEvaluationCounts.value.map(tool => tool.total));
const lowestToolTotals = toolEvaluationCounts.value.filter(tool => tool.total === minToolTotal);

const isToolHighestOpen = ref(false)
const isToolLowestOpen = ref(false)

const selectedTool = ref('diabetes')

// Latest evaluation scores
const latestEvalScores = useLatestSessionEvals(genderEvaluations.value)

const latestEvalScoresCountsPerTool = (tool: string) => {
    const results = latestEvalScores.filter((el: any) => el.tool == tool)
    const scores = results.map(el => el.scores).flat()
    const result: any = {};

    scores.forEach((item) => {
        const name = item.name;
        const score = Number(item.score);
        const scoreKey = `score${score}`;

        if (!result[name]) {
            result[name] = { score1: 0, score2: 0, score3: 0 };
        }

        if (result[name][scoreKey] !== undefined) {
            result[name][scoreKey]++;
        }
    });

    return result
}

const toolData = computed(() => {
    const result = evaluationItemData.filter((t: { tool: string; }) => t.tool == selectedTool.value);
    const newResult: any[] = [];
    const items: any[] = [];

    result.forEach((r: { evaluationItems: any[]; }) => {
        r.evaluationItems.forEach((e) => {
            const counts = latestEvalScoresCountsPerTool(selectedTool.value)
            items.push({
                item: e.number,
                title: e.title,
                numberof3: counts[e.number]?.score3 ?? null,
                numberof2: counts[e.number]?.score2 ?? null,
                numberof1: counts[e.number]?.score1 ?? null,
            })
        })
    })

    return items
})

// Set page metadata
useSeoMeta({
  title: `${gender} Reporting - PenPlus NCD Monitoring`,
  description: `Evaluation reports and analytics for ${gender} mentees`
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
            @click="goBack"
            class="flex-shrink-0"
          />
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ gender }} Reporting</h1>
              <p class="text-sm text-gray-600">
                Detailed evaluation analytics for {{ gender.toLowerCase() }} mentees
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Overview Stats -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <p class="text-sm text-gray-600 mt-1">Evaluation statistics for {{ gender.toLowerCase() }} mentees</p>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Total Evaluations -->
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-8 h-8 text-blue-600" />
              </div>
              <div class="text-3xl font-bold text-blue-600">{{ countSessions.totalCompletedCount }}</div>
              <div class="text-sm text-gray-600 font-medium">Total Evaluations</div>
            </div>
            
            <!-- Total Sessions -->
            <div class="text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-clock" class="w-8 h-8 text-orange-600" />
              </div>
              <div class="text-3xl font-bold text-orange-600">{{ countSessions.totalCompletedSessions }}</div>
              <div class="text-sm text-gray-600 font-medium">Total Sessions</div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Tool Performance -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Tool Performance Analysis</h3>
            <p class="text-sm text-gray-600 mt-1">Most and least evaluated tools</p>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Most Evaluated Tool -->
            <UCard class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div class="text-center mb-4">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-green-600" />
                </div>
                <div class="text-lg font-semibold text-green-700 mb-2">Most Evaluated Tool</div>
                <div class="text-3xl font-bold text-green-600 mb-2">
                  <span v-if="highestToolTotals.length == 1">
                    {{ highestToolTotals[0].tool }}
                  </span>
                  <span v-else-if="highestToolTotals.length > 0" class="inline-block cursor-pointer hover:scale-105 transition-transform duration-200">
                    <UButton variant="solid" color="green" icon="i-heroicons-light-bulb" class="animate-pulse" @click="isToolHighestOpen = true">
                      {{ highestToolTotals.length }} Tools
                    </UButton>
                  </span>
                  <span v-else>-</span>
                </div>
                <div class="text-sm text-green-600" v-if="highestToolTotals.length > 0">
                  {{ maxToolTotal }} evaluation(s)
                </div>
              </div>
            </UCard>

            <!-- Least Evaluated Tool -->
            <UCard class="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
              <div class="text-center mb-4">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-orange-600" />
                </div>
                <div class="text-lg font-semibold text-orange-700 mb-2">Least Evaluated Tool</div>
                <div class="text-3xl font-bold text-orange-600 mb-2">
                  <span v-if="lowestToolTotals.length == 1">
                    {{ lowestToolTotals[0].tool }}
                  </span>
                  <span v-else-if="lowestToolTotals.length > 1" class="inline-block cursor-pointer hover:scale-105 transition-transform duration-200">
                    <UButton variant="solid" color="orange" icon="i-heroicons-light-bulb" class="animate-pulse" @click="isToolLowestOpen = true">
                      {{ lowestToolTotals.length }} Tools
                    </UButton>
                  </span>
                  <span v-else>-</span>
                </div>
                <div class="text-sm text-orange-600" v-if="lowestToolTotals.length > 0">
                  {{ minToolTotal }} evaluation(s)
                </div>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>

      <!-- Detailed Tool Analysis -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Detailed Tool Analysis</h3>
            <p class="text-sm text-gray-600 mt-1">Select a tool to view detailed score breakdowns</p>
          </template>
          
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Select Tool</label>
                <p class="text-sm text-gray-500">Choose a tool to analyze evaluation scores</p>
              </div>
              <div class="w-full sm:w-64">
                <USelect 
                  v-model="selectedTool" 
                  :options="tools" 
                  option-attribute="label" 
                  value-attribute="name"
                  placeholder="Select a tool..."
                />
              </div>
            </div>

            <div class="mt-6">
              <div v-if="Object.values(latestEvalScoresCountsPerTool(selectedTool)).length != 0">
                <TablesAGtablesDistrictsToolScores :tool-data="toolData" />
              </div>
              <div v-else class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <UIcon name="i-heroicons-information-circle" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p class="text-gray-600">
                  No evaluations recorded for 
                  <span class="font-semibold text-blue-600">{{ selectedTool }}</span> 
                  for {{ gender.toLowerCase() }} mentees
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ countSessions.totalCompletedCount }}</div>
          <div class="text-sm text-blue-600 font-medium">Evaluations</div>
        </UCard>
        
        <UCard class="text-center bg-orange-50/50">
          <div class="text-2xl font-bold text-orange-600">{{ countSessions.totalCompletedSessions }}</div>
          <div class="text-sm text-orange-600 font-medium">Sessions</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">{{ highestToolTotals.length }}</div>
          <div class="text-sm text-green-600 font-medium">Top Tools</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">{{ tools.length }}</div>
          <div class="text-sm text-purple-600 font-medium">Total Tools</div>
        </UCard>
      </div>

      <!-- Back Button -->
      <div class="max-w-4xl mx-auto flex justify-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Mentees Reports"
          @click="goBack"
        />
      </div>
    </UContainer>

    <!-- Slideover Modals -->
    <UModal v-model="isToolHighestOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Most Evaluated Tools - {{ gender }}
            </h3>
            <UButton 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-x-mark" 
              @click="isToolHighestOpen = false" 
            />
          </div>
        </template>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-4 font-semibold text-green-700 bg-green-50 p-3 rounded-lg">
            <div>Tool Name</div>
            <div class="text-center">Evaluations</div>
          </div>
          
          <div 
            v-for="tool in highestToolTotals" 
            :key="tool.tool"
            class="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div class="font-medium text-gray-700">{{ tool.tool }}</div>
            <div class="text-center font-semibold text-green-600">{{ tool.total }}</div>
          </div>
        </div>
      </UCard>
    </UModal>

    <UModal v-model="isToolLowestOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Least Evaluated Tools - {{ gender }}
            </h3>
            <UButton 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-x-mark" 
              @click="isToolLowestOpen = false" 
            />
          </div>
        </template>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-4 font-semibold text-orange-700 bg-orange-50 p-3 rounded-lg">
            <div>Tool Name</div>
            <div class="text-center">Evaluations</div>
          </div>
          
          <div 
            v-for="tool in lowestToolTotals" 
            :key="tool.tool"
            class="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div class="font-medium text-gray-700">{{ tool.tool }}</div>
            <div class="text-center font-semibold text-orange-600">{{ tool.total }}</div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}
</style>