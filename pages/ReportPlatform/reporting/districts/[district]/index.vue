<script setup lang="ts">
import type IDistrict from "@/interfaces/IDistrict";
import processScores from "~/utilities/processScores";
import evaluationItemData from "@/data/evaluationItemData";

const router = useRouter()
const goBack = () => {
    router.back();
};

const route = useRoute()
const district: any = route.params.district

const useEvaluations = useEvalDataStore();
const districtEvals: any = await useEvaluations.fetchDistrictEvaluations(district)

// Evaluation stats
const evaluationStats = useEvaluationStats(districtEvals)
const evalCounts = useCountDistrictSessionsCompleted(district, evaluationStats);

const totalSessions = computed(() => {
    return (evalCounts.oneCompletedCount + 2 * (evalCounts.twoCompletedCount) + 3 * (evalCounts.allCompletedCount))
})

// Tools analysis
const tools = useTools;
const selectedTool = ref('diabetes')

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

// Finding highest and lowest tool totals
const maxToolTotal = Math.max(...toolEvaluationCounts.value.map(tool => tool.total));
const highestToolTotals = toolEvaluationCounts.value.filter(tool => tool.total === maxToolTotal);
const minToolTotal = Math.min(...toolEvaluationCounts.value.map(tool => tool.total));
const lowestToolTotals = toolEvaluationCounts.value.filter(tool => tool.total === minToolTotal);

const isToolHighestOpen = ref(false)
const isToolLowestOpen = ref(false)

// Facility analysis
const useDistricts = useDistrictsStore();
const districts: Array<IDistrict> = await useDistricts.fetchDistricts();
const districtData = districts.find((el: IDistrict) => el.district == district)
const facilities = districtData?.facilities

const facilityEvaluationCounts = computed(() => {
    let counts: any[] = []
    facilities?.forEach((facility) => {
        counts.push({
            facility: facility,
            total: useCountFacilitySessionsCompleted(facility, evaluationStats).totalCompletedCount,
            totalSessions: useCountFacilitySessionsCompleted(facility, evaluationStats).totalCompletedSessions,
        })
    })
    return counts
})

// Finding highest and lowest facility totals
const maxFacilityTotal = Math.max(...facilityEvaluationCounts.value.map((facility: { total: any; }) => facility.total));
const highestFacilityTotals = facilityEvaluationCounts.value.filter((facility: { total: number; }) => facility.total === maxFacilityTotal);
const minFacilityTotal = Math.min(...facilityEvaluationCounts.value.map(facility => facility.total));
const lowestFacilityTotals = facilityEvaluationCounts.value.filter(facility => facility.total === minFacilityTotal);

const isFacilityHighestOpen = ref(false)
const isFacilityLowestOpen = ref(false)

// Mixed chart data
const sessionFacilityCounts = facilityEvaluationCounts.value.map((counts) => counts.totalSessions)
const evalFacilityCounts = facilityEvaluationCounts.value.map((counts) => counts.total)

// Table view toggle
const showFacilitySessionEvalsTable = ref(false)

// Latest evaluation scores
const latestEvalScores = useLatestSessionEvals(districtEvals)

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
  title: `${district} District Analysis - PenPlus NCD Monitoring`,
  description: `Comprehensive evaluation analytics and reports for ${district} district`
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
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ district }} District Analysis</h1>
              <p class="text-sm text-gray-600">
                Comprehensive evaluation analytics and insights
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Overview Stats -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">District Overview</h3>
            <p class="text-sm text-gray-600 mt-1">Key metrics and performance indicators</p>
          </template>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Evaluations & Sessions -->
            <div class="space-y-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-8 h-8 text-blue-600" />
                </div>
                <div class="text-3xl font-bold text-blue-600">{{ evalCounts.totalCompletedCount }}</div>
                <div class="text-sm text-gray-600 font-medium">Total Evaluations</div>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-heroicons-clock" class="w-8 h-8 text-orange-600" />
                </div>
                <div class="text-3xl font-bold text-orange-600">{{ totalSessions }}</div>
                <div class="text-sm text-gray-600 font-medium">Total Sessions</div>
              </div>
            </div>

            <!-- Tool Performance -->
            <div class="space-y-6">
              <!-- Most Evaluated Tool -->
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-green-600" />
                </div>
                <div class="text-lg font-semibold text-green-700 mb-1">Most Evaluated Tool</div>
                <div class="text-xl font-bold text-green-600 mb-1">
                  <span v-if="highestToolTotals.length == 1">
                    {{ highestToolTotals[0].tool }}
                  </span>
                  <span v-else-if="highestToolTotals.length > 0">
                    <UButton 
                      variant="soft" 
                      color="green" 
                      @click="isToolHighestOpen = true"
                      class="hover:scale-105 transition-transform duration-200"
                    >
                      {{ highestToolTotals.length }} Tools
                    </UButton>
                  </span>
                  <span v-else>-</span>
                </div>
                <div class="text-sm text-green-600" v-if="highestToolTotals.length > 0">
                  {{ maxToolTotal }} evaluation(s)
                </div>
              </div>

              <!-- Least Evaluated Tool -->
              <div class="text-center">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-orange-600" />
                </div>
                <div class="text-lg font-semibold text-orange-700 mb-1">Least Evaluated Tool</div>
                <div class="text-xl font-bold text-orange-600 mb-1">
                  <span v-if="lowestToolTotals.length == 1">
                    {{ lowestToolTotals[0].tool }}
                  </span>
                  <span v-else-if="lowestToolTotals.length > 0">
                    <UButton 
                      variant="soft" 
                      color="orange" 
                      @click="isToolLowestOpen = true"
                      class="hover:scale-105 transition-transform duration-200"
                    >
                      {{ lowestToolTotals.length }} Tools
                    </UButton>
                  </span>
                  <span v-else>-</span>
                </div>
                <div class="text-sm text-orange-600" v-if="lowestToolTotals.length > 0">
                  {{ minToolTotal }} evaluation(s)
                </div>
              </div>
            </div>

            <!-- Facility Performance -->
            <div class="space-y-6">
              <!-- Most Evaluated Facility -->
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-purple-600" />
                </div>
                <div class="text-lg font-semibold text-purple-700 mb-1">Top Facility</div>
                <div class="text-xl font-bold text-purple-600 mb-1">
                  <span v-if="highestFacilityTotals.length == 1">
                    {{ highestFacilityTotals[0].facility }}
                  </span>
                  <span v-else-if="highestFacilityTotals.length > 0">
                    <UButton 
                      variant="soft" 
                      color="purple" 
                      @click="isFacilityHighestOpen = true"
                      class="hover:scale-105 transition-transform duration-200"
                    >
                      {{ highestFacilityTotals.length }} Facilities
                    </UButton>
                  </span>
                  <span v-else>-</span>
                </div>
                <div class="text-sm text-purple-600" v-if="highestFacilityTotals.length > 0">
                  {{ maxFacilityTotal }} evaluation(s)
                </div>
              </div>

              <!-- Least Evaluated Facility -->
              <div class="text-center">
                <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-heroicons-exclamation-circle" class="w-6 h-6 text-teal-600" />
                </div>
                <div class="text-lg font-semibold text-teal-700 mb-1">Needs Attention</div>
                <div class="text-xl font-bold text-teal-600 mb-1">
                  <span v-if="lowestFacilityTotals.length == 1">
                    {{ lowestFacilityTotals[0].facility }}
                  </span>
                  <span v-else-if="lowestFacilityTotals.length > 0">
                    <UButton 
                      variant="soft" 
                      color="teal" 
                      @click="isFacilityLowestOpen = true"
                      class="hover:scale-105 transition-transform duration-200"
                    >
                      {{ lowestFacilityTotals.length }} Facilities
                    </UButton>
                  </span>
                  <span v-else>-</span>
                </div>
                <div class="text-sm text-teal-600" v-if="lowestFacilityTotals.length > 0">
                  {{ minFacilityTotal }} evaluation(s)
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Evaluation Breakdown -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Evaluation Breakdown</h3>
            <p class="text-sm text-gray-600 mt-1">Session completion analysis and distribution</p>
          </template>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg p-4 border border-gray-200">
              <ChartsDistrictsEvaluationsBar :eval-counts="evalCounts" />
            </div>
            <div class="bg-white rounded-lg p-4 border border-gray-200">
              <ChartsDistrictsEvaluationsPie :eval-counts="evalCounts" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Facility Analysis -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Facility Analysis</h3>
                <p class="text-sm text-gray-600 mt-1">Session and evaluation distribution across facilities</p>
              </div>
              <div>
                <UButton
                  :variant="showFacilitySessionEvalsTable ? 'solid' : 'outline'"
                  color="orange"
                  @click="showFacilitySessionEvalsTable = !showFacilitySessionEvalsTable"
                  class="transition-all duration-200 hover:scale-105"
                >
                  {{ showFacilitySessionEvalsTable ? 'View Charts' : 'View Table' }}
                </UButton>
              </div>
            </div>
          </template>

          <!-- Chart View -->
          <div v-if="!showFacilitySessionEvalsTable" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <ChartsDistrictsFacilitySessions :facilities="facilities" :eval-counts="evalFacilityCounts"
                  :session-counts="sessionFacilityCounts" />
              </div>
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <ChartsDistrictsFacilitySessionsPie :facilities="facilities" 
                  :session-counts="sessionFacilityCounts" />
              </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <ChartsDistrictsFacilityEvaluations :facilities="facilities" :eval-counts="evalFacilityCounts"
                  :session-counts="sessionFacilityCounts" />
              </div>
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <ChartsDistrictsFacilityEvaluationsPie :facilities="facilities" :eval-counts="evalFacilityCounts" />
              </div>
            </div>
          </div>

          <!-- Table View -->
          <div v-else class="bg-white rounded-lg border border-gray-200">
            <TablesAGtablesDistrictsFSessionEvals :facility-data="facilityEvaluationCounts" />
          </div>
        </UCard>
      </div>

      <!-- Tool Analysis -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Tool Analysis</h3>
            <p class="text-sm text-gray-600 mt-1">Detailed score breakdown by evaluation tool</p>
          </template>
          
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Select Evaluation Tool</label>
                <p class="text-sm text-gray-500">Choose a tool to analyze detailed score distributions</p>
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

            <div class="mt-4">
              <div v-if="Object.values(latestEvalScoresCountsPerTool(selectedTool)).length != 0">
                <TablesAGtablesDistrictsToolScores :tool-data="toolData" />
              </div>
              <div v-else class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <UIcon name="i-heroicons-information-circle" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p class="text-gray-600">
                  No evaluations recorded for 
                  <span class="font-semibold text-blue-600">{{ selectedTool }}</span> 
                  in {{ district }} district
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ evalCounts.totalCompletedCount }}</div>
          <div class="text-sm text-blue-600 font-medium">Evaluations</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">{{ totalSessions }}</div>
          <div class="text-sm text-green-600 font-medium">Sessions</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">{{ facilities?.length || 0 }}</div>
          <div class="text-sm text-purple-600 font-medium">Facilities</div>
        </UCard>
        
        <UCard class="text-center bg-orange-50/50">
          <div class="text-2xl font-bold text-orange-600">{{ tools.length }}</div>
          <div class="text-sm text-orange-600 font-medium">Tools</div>
        </UCard>
      </div>

      <!-- Back Button -->
      <div class="max-w-6xl mx-auto flex justify-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Districts"
          @click="goBack"
        />
      </div>
    </UContainer>

    <!-- Modals -->
    <UModal v-model="isToolHighestOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Most Evaluated Tools - {{ district }}
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
              Least Evaluated Tools - {{ district }}
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

    <UModal v-model="isFacilityHighestOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Top Performing Facilities - {{ district }}
            </h3>
            <UButton 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-x-mark" 
              @click="isFacilityHighestOpen = false" 
            />
          </div>
        </template>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-4 font-semibold text-purple-700 bg-purple-50 p-3 rounded-lg">
            <div>Facility Name</div>
            <div class="text-center">Evaluations</div>
          </div>
          
          <div 
            v-for="facility in highestFacilityTotals" 
            :key="facility.facility"
            class="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div class="font-medium text-gray-700">{{ facility.facility }}</div>
            <div class="text-center font-semibold text-purple-600">{{ facility.total }}</div>
          </div>
        </div>
      </UCard>
    </UModal>

    <UModal v-model="isFacilityLowestOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Facilities Needing Attention - {{ district }}
            </h3>
            <UButton 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-x-mark" 
              @click="isFacilityLowestOpen = false" 
            />
          </div>
        </template>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-4 font-semibold text-teal-700 bg-teal-50 p-3 rounded-lg">
            <div>Facility Name</div>
            <div class="text-center">Evaluations</div>
          </div>
          
          <div 
            v-for="facility in lowestFacilityTotals" 
            :key="facility.facility"
            class="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div class="font-medium text-gray-700">{{ facility.facility }}</div>
            <div class="text-center font-semibold text-teal-600">{{ facility.total }}</div>
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