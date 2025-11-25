<script setup lang='ts'>
import DatabaseNames from "@/constants/DatabaseNames";
import sumArray from "@/utilities/sumArray";
import type IDistrict from "@/interfaces/IDistrict";
import { computedAsync } from "@vueuse/core";
import type IEvalScore from "@/interfaces/IEvalScore";

const router = useRouter();

const goBack = () => {
    router.back();
};

// Districts
const useDistricts = useDistrictsStore();
const districts: Array<IDistrict> = await useDistricts.fetchDistricts();

// Evaluations
const useEvaluations = useEvalDataStore();
const completedEvals = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
const evaluationStats = useEvaluationStats(completedEvals)

// Mentees
const useMentees = useMenteeStore()

const facilityMentees = async (facility: string) => {
    return await useMentees.fetchAllMentees(facility)
}

const districtMentees = async (district: string) => {
    return await useMentees.fetchDistrictMentees(district)
}

const tools = useTools;
const facilities: Ref<Array<String>> = ref([])
const facilityEvalCounts: Ref<Array<any>> = ref([])
const facilityEvalToolCounts: Ref<Array<any>> = ref([])
const facilityMenteeCounts: Ref<Array<any>> = ref([])

computedAsync(() => {
    const allPromises: any[] = [];

    districts?.forEach((d: any) => {
        let facil = []
        facilities.value.push(d.facilities);
        facil.push(d.facilities);

        facil.forEach((f) => {
            f.forEach((el: string) => {
                allPromises.push(
                    // Mentees
                    facilityMentees(el).then((mentees) => {
                        facilityMenteeCounts.value.push({
                            district: d.district,
                            facility: el,
                            mentees: mentees?.length
                        })
                    }),

                    // Facility 
                    facilityEvalCounts.value.push({
                        district: d.district,
                        facility: el,
                        completedEvals: useCountFacilitySessionsCompleted(el, evaluationStats).allCompletedCount,
                        fourCompletedEvals: useCountFacilitySessionsCompleted(el, evaluationStats).fourCompletedCount,
                        threeCompletedEvals: useCountFacilitySessionsCompleted(el, evaluationStats).threeCompletedCount,
                        twoCompletedEvals: useCountFacilitySessionsCompleted(el, evaluationStats).twoCompletedCount,
                        oneCompletedEvals: useCountFacilitySessionsCompleted(el, evaluationStats).oneCompletedCount,
                        totalEvals: useCountFacilitySessionsCompleted(el, evaluationStats).totalCompletedCount
                    }),
                    // Tools
                    tools.forEach((t) => {
                        facilityEvalToolCounts.value.push({
                            district: d.district,
                            facility: el,
                            tool: t.name,
                            completedEvals: useCountFacilityToolSessionsCompleted(el, t.name, evaluationStats).allCompletedCount,
                            fourCompletedEvals: useCountFacilityToolSessionsCompleted(el, t.name, evaluationStats).fourCompletedCount,
                            threeCompletedEvals: useCountFacilityToolSessionsCompleted(el, t.name, evaluationStats).threeCompletedCount,
                            twoCompletedEvals: useCountFacilityToolSessionsCompleted(el, t.name, evaluationStats).twoCompletedCount,
                            oneCompletedEvals: useCountFacilityToolSessionsCompleted(el, t.name, evaluationStats).oneCompletedCount,
                            totalEvals: useCountFacilityToolSessionsCompleted(el, t.name, evaluationStats).totalCompletedCount
                        })
                    })
                )
            })
        })
    })

    Promise.all(allPromises)
})

const filterDistrictEvals = (district: string) => {
    return facilityEvalCounts.value.filter(f => f.district === district)
}

// Filter by district and Tool
const filterToolDistrictEvals = (district: string, tool: string) => {
    return facilityEvalToolCounts.value.filter(f => (f.district == district && f.tool == tool))
}

// Filter Mentees by District
const filterDistrictMentees = (district: string) => {
    return facilityMenteeCounts.value.filter(f => f.district == district)
}

// Navigation functions
const viewDistrictAnalysis = (district: string): void => {
    navigateTo(`districts/${district}`)
}

const viewDistrictMentees = (district: string): void => {
    navigateTo(`districts/${district}/mentees`)
}

const viewDistrictEvaluations = (district: string): void => {
    navigateTo(`districts/${district}/evaluations`)
}

const viewDistrictFacilityEvaluations = (district: string, facility: string): void => {
    navigateTo(`districts/${district}/${facility}/evaluations`)
}

const viewFacilityReport = (facility: string): void => {
    navigateTo(`facilities/${facility}/all`)
}

const viewCompletedEvals = (district: string): void => {
    navigateTo(`districts/${district}/completed`)
}

const viewTwoCompletedEvals = (district: string): void => {
    navigateTo(`districts/${district}/twocompleted`)
}

const viewOneCompletedEvals = (district: string): void => {
    navigateTo(`districts/${district}/onecompleted`)
}

const viewAllEvals = (district: string): void => {
    navigateTo(`districts/${district}/all`)
}

const viewDistrictTool = (district: string, tool: string) => {
    navigateTo(`districts/${district}/Tools/${tool}`)
}

// Set page metadata
useSeoMeta({
  title: 'Districts Analysis - PenPlus NCD Monitoring',
  description: 'Comprehensive district-wise evaluation analytics and reporting'
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
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Districts Analysis</h1>
              <p class="text-sm text-gray-600">
                Comprehensive district-wise evaluation analytics
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Overview Section -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">District Overview</h3>
            <p class="text-sm text-gray-600 mt-1">Summary of districts and facilities</p>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-map-pin" class="w-8 h-8 text-green-600" />
              </div>
              <div class="text-3xl font-bold text-green-600">{{ districts.length }}</div>
              <div class="text-sm text-gray-600 font-medium">Total Districts</div>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-building-office" class="w-8 h-8 text-blue-600" />
              </div>
              <div class="text-3xl font-bold text-blue-600">{{ facilities.flat().length }}</div>
              <div class="text-sm text-gray-600 font-medium">Total Facilities</div>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-8 h-8 text-orange-600" />
              </div>
              <div class="text-3xl font-bold text-orange-600">{{ completedEvals?.length }}</div>
              <div class="text-sm text-gray-600 font-medium">Total Evaluations</div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Mentees by District -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Mentees by District</h3>
            <p class="text-sm text-gray-600 mt-1">
              Click on mentee counts to view providers or view buttons for district reports
            </p>
          </template>
          
          <div class="overflow-x-auto">
            <div class="grid grid-cols-4 gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 font-semibold text-blue-700 min-w-[800px]">
              <div>District</div>
              <div class="text-center">Facilities</div>
              <div class="text-center">Mentees</div>
              <div class="text-center">Report</div>
            </div>
            
            <div 
              v-for="district in districts" 
              :key="district.district"
              class="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 min-w-[800px]"
            >
              <div class="font-semibold text-gray-700">{{ district.district }}</div>
              
              <div class="flex justify-center">
                <UPopover mode="hover">
                  <UButton variant="ghost" color="blue" class="font-semibold">
                    {{ district.facilities.length }}
                  </UButton>
                  <template #panel>
                    <div class="p-3 bg-white shadow-lg rounded-lg border border-gray-200 min-w-[200px]">
                      <div class="font-semibold text-blue-600 mb-2">Facilities in {{ district.district }}</div>
                      <div class="space-y-1 max-h-60 overflow-y-auto">
                        <div 
                          v-for="facility in district.facilities" 
                          :key="facility"
                          class="text-sm text-gray-700 py-1 px-2 hover:bg-blue-50 rounded"
                        >
                          {{ facility }}
                        </div>
                      </div>
                    </div>
                  </template>
                </UPopover>
              </div>
              
              <div class="text-center">
                <UButton 
                  variant="soft" 
                  color="gray" 
                  size="sm"
                  @click="viewDistrictMentees(district.district)"
                  class="hover:scale-105 transition-transform duration-200"
                >
                  {{ sumArray(filterDistrictMentees(district.district), 'mentees') }}
                </UButton>
              </div>
              
              <div class="text-center">
                <UButton 
                  variant="solid" 
                  color="blue" 
                  size="sm"
                  @click="viewDistrictAnalysis(district.district)"
                  class="hover:shadow-md transition-all duration-200"
                >
                  View Report
                </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Evaluations by District & Facilities -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Evaluations by District & Facilities</h3>
            <p class="text-sm text-gray-600 mt-1">
              Facility-wise evaluation counts and mean scores
            </p>
          </template>
          
          <div class="overflow-x-auto">
            <div class="grid grid-cols-3 gap-4 bg-gradient-to-r from-purple-50 to-violet-50 p-4 font-semibold text-purple-700 min-w-[900px]">
              <div>District</div>
              <div>
                <div class="grid grid-cols-3 gap-4">
                  <div>Facility</div>
                  <div class="text-center">Evaluations</div>
                  <div class="text-center">Mean Score</div>
                </div>
              </div>
              <div class="text-center">District Total</div>
            </div>
            
            <div 
              v-for="district in districts" 
              :key="district.district"
              class="grid grid-cols-3 gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 min-w-[900px]"
            >
              <div class="font-semibold text-gray-700">{{ district.district }}</div>
              
              <div>
                <div 
                  v-for="facility in district.facilities" 
                  :key="facility"
                  class="grid grid-cols-3 gap-4 py-2 even:bg-gray-50/50 rounded"
                >
                  <div class="text-gray-600">{{ facility }}</div>
                  
                  <div class="text-center">
                    <UButton 
                      variant="soft" 
                      color="gray" 
                      size="sm"
                      @click="viewDistrictFacilityEvaluations(district.district, facility)"
                      class="hover:scale-105 transition-transform duration-200"
                    >
                      {{ useCountFacilitySessionsCompleted(facility, evaluationStats).totalCompletedCount }}
                    </UButton>
                  </div>
                  
                  <div class="text-center">
                    <UButton 
                      :variant="parseFloat(useFacilityMeans(completedEvals, facility)) < 2.5 ? 'solid' : 'soft'"
                      :color="parseFloat(useFacilityMeans(completedEvals, facility)) < 2.5 ? 'red' : 'blue'"
                      size="sm"
                      @click="viewFacilityReport(facility)"
                      class="font-semibold hover:shadow-md transition-all duration-200"
                    >
                      {{ useFacilityMeans(completedEvals, facility) }}
                    </UButton>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-center">
                <UButton 
                  variant="solid" 
                  color="blue" 
                  size="sm"
                  @click="viewDistrictEvaluations(district.district)"
                  class="hover:scale-105 transition-transform duration-200"
                >
                  {{ sumArray(filterDistrictEvals(district.district), 'totalEvals') }}
                </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Evaluation Progress Tracking -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Evaluation Progress Tracking</h3>
            <p class="text-sm text-gray-600 mt-1">
              Session completion rates across districts
            </p>
          </template>
          
          <div class="overflow-x-auto">
            <div class="grid grid-cols-7 gap-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 font-semibold text-green-700 text-sm min-w-[1200px]">
              <div class="text-center">District</div>
              <div class="text-center">
                <div>1 Session</div>
                <div class="text-xs font-normal text-green-600">Partial</div>
              </div>
              <div class="text-center">
                <div>2 Sessions</div>
                <div class="text-xs font-normal text-green-600">Partial</div>
              </div>
              <div class="text-center">
                <div>3 Sessions</div>
                <div class="text-xs font-normal text-green-600">Partial</div>
              </div>
              <div class="text-center">
                <div>4 Sessions</div>
                <div class="text-xs font-normal text-green-600">Partial</div>
              </div>
              <div class="text-center">
                <div>5 Sessions</div>
                <div class="text-xs font-normal text-green-600">Complete</div>
              </div>
              <div class="text-center">Total</div>
            </div>
            
            <div 
              v-for="district in districts" 
              :key="district.district"
              class="grid grid-cols-7 gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 min-w-[1200px]"
            >
              <div class="font-semibold text-gray-700 text-center">{{ district.district }}</div>
              
              <div class="text-center">
                <UButton 
                  color="red" 
                  variant="soft" 
                  size="sm"
                  @click="viewOneCompletedEvals(district.district)"
                  class="hover:scale-105 transition-transform duration-200 w-full"
                >
                  {{ sumArray(filterDistrictEvals(district.district), 'oneCompletedEvals') }}
                </UButton>
              </div>
              
              <div class="text-center">
                <UButton 
                  color="orange" 
                  variant="soft" 
                  size="sm"
                  @click="viewTwoCompletedEvals(district.district)"
                  class="hover:scale-105 transition-transform duration-200 w-full"
                >
                  {{ sumArray(filterDistrictEvals(district.district), 'twoCompletedEvals') }}
                </UButton>
              </div>
              
              <div class="text-center">
                <UButton 
                  color="yellow" 
                  variant="soft" 
                  size="sm"
                  @click="viewOneCompletedEvals(district.district)"
                  class="hover:scale-105 transition-transform duration-200 w-full"
                >
                  {{ sumArray(filterDistrictEvals(district.district), 'threeCompletedEvals') }}
                </UButton>
              </div>
              
              <div class="text-center">
                <UButton 
                  color="lime" 
                  variant="soft" 
                  size="sm"
                  @click="viewTwoCompletedEvals(district.district)"
                  class="hover:scale-105 transition-transform duration-200 w-full"
                >
                  {{ sumArray(filterDistrictEvals(district.district), 'fourCompletedEvals') }}
                </UButton>
              </div>
              
              <div class="text-center">
                <UButton 
                  color="green" 
                  variant="soft" 
                  size="sm"
                  @click="viewCompletedEvals(district.district)"
                  class="hover:scale-105 transition-transform duration-200 w-full"
                >
                  {{ sumArray(filterDistrictEvals(district.district), 'completedEvals') }}
                </UButton>
              </div>
              
              <div class="text-center">
                <UButton 
                  color="blue" 
                  variant="solid" 
                  size="sm"
                  @click="viewAllEvals(district.district)"
                  class="hover:shadow-md transition-all duration-200 w-full font-semibold"
                >
                  {{ sumArray(filterDistrictEvals(district.district), 'totalEvals') }}
                </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Tool Evaluations by District -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Tool Evaluations by District</h3>
            <p class="text-sm text-gray-600 mt-1">
              Disease/tool evaluation distribution across districts
            </p>
          </template>
          
          <div class="overflow-x-auto">
            <div class="grid grid-cols-5 gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-4 font-semibold text-orange-700 text-sm min-w-[1000px]">
              <div class="text-center">Tool/Disease</div>
              <div 
                v-for="district in districts" 
                :key="district.district"
                class="text-center"
              >
                {{ district.district }}
              </div>
            </div>
            
            <div 
              v-for="(tool, i) in tools" 
              :key="tool.name"
              class="grid grid-cols-5 gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 min-w-[1000px]"
            >
              <div class="font-semibold text-gray-700 text-center">{{ tool.label }}</div>
              
              <div 
                v-for="district in districts" 
                :key="district.district"
                class="text-center"
              >
                <UButton 
                  color="green" 
                  variant="soft" 
                  size="sm"
                  @click="viewDistrictTool(district.district, tool.name)"
                  class="hover:scale-105 transition-transform duration-200 w-full"
                >
                  {{ sumArray(filterToolDistrictEvals(district.district, tool.name), 'totalEvals') }}
                </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ districts.length }}</div>
          <div class="text-sm text-blue-600 font-medium">Districts</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">{{ facilities.flat().length }}</div>
          <div class="text-sm text-green-600 font-medium">Facilities</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">{{ completedEvals?.length }}</div>
          <div class="text-sm text-purple-600 font-medium">Evaluations</div>
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
          label="Back to Reports"
          @click="goBack"
        />
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}

/* Custom scrollbar for overflow tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>