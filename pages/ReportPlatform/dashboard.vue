<script setup lang="ts">
import type IDistrict from "@/interfaces/IDistrict";
import Routes from '@/constants/Routes';
import DatabaseNames from "@/constants/DatabaseNames";

const facilities: Ref<Array<string>> = ref([])
const user = useUserDetails;

// Districts
const useDistricts = useDistrictsStore();
const districts: Array<IDistrict> = await useDistricts.fetchDistricts();
districts?.forEach((d: any) => {
    facilities.value.push(d.facilities);
})

// Mentees
const useMentees = useMenteeStore();
const mentees = await useMentees.fetchMentees();

// Evaluations
const useEvaluations = useEvalDataStore();
const completedEvals = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
const evaluationStats = useEvaluationStats(completedEvals)

// Progress tracking
const tools = useTools

const countToolSessions = computed(() => {
    const arr: any[] = []
    tools.forEach((tool) => {
        const countSessions = useCountToolSessionsCompleted(tool.name, evaluationStats)
        arr.push({
            label: tool.label,
            name: tool.name,
            fiveCompleted: countSessions.allCompletedCount,
            fourCompleted: countSessions.fourCompleted,
            threeCompleted: countSessions.threeCompleted,
            twoCompleted: countSessions.twoCompletedCount,
            oneCompleted: countSessions.oneCompletedCount,
            totalCompleted: countSessions.totalCompletedCount
        })
    });
    return arr
})

const maxCompletedTool = countToolSessions.value.reduce((max, current) => {
    return (current.totalCompleted > max.totalCompleted) ? current : max;
});

const minCompletedTool = countToolSessions.value.reduce((min, current) => {
    return (current.totalCompleted < min.totalCompleted) ? current : min;
});

const totalSessionMinMaxTool = computed(() => {
    const maxEvals = maxCompletedTool.totalCompleted
    const maxSessions = maxCompletedTool.oneCompleted + 2 * maxCompletedTool.twoCompleted + 3 * maxCompletedTool.threeCompleted + 4 * maxCompletedTool.fourCompleted + 5 * maxCompletedTool.fiveCompleted

    const minEvals = minCompletedTool.totalCompleted
    const minSessions = minCompletedTool.oneCompleted + 2 * minCompletedTool.twoCompleted + 3 * minCompletedTool.threeCompleted + 4 * minCompletedTool.fourCompleted + 5 * minCompletedTool.fiveCompleted

    return {
        min: {
            evals: minEvals,
            sessions: minSessions
        },
        max: {
            evals: maxEvals,
            sessions: maxSessions
        }
    }
})

const countAllSessions = computed(() => {
    return (evaluationStats.completed1Evals.length + 2 * evaluationStats.completed2Evals.length + 3 * evaluationStats.completed3Evals.length + 4 * evaluationStats.completed4Evals.length + 5 * evaluationStats.completedEvaluations.length)
})

// Districts sessions
const countDistrictSessions = computed(() => {
    const arr: any[] = []
    districts.forEach((district) => {
        const countSessions = useCountDistrictSessionsCompleted(district.district, evaluationStats)
        arr.push({
            label: district.district,
            name: district.district,
            fiveCompleted: countSessions.allCompletedCount,
            fourCompleted: countSessions.fourCompletedCount,
            threeCompleted: countSessions.threeCompletedCount,
            twoCompleted: countSessions.twoCompletedCount,
            oneCompleted: countSessions.oneCompletedCount,
            totalCompleted: countSessions.totalCompletedCount
        })
    });
    return arr
})

const maxCompletedDistrict = countDistrictSessions.value.reduce((max, current) => {
    return (current.totalCompleted > max.totalCompleted) ? current : max;
});

const minCompletedDistrict = countDistrictSessions.value.reduce((min, current) => {
    return (current.totalCompleted < min.totalCompleted) ? current : min;
});

const totalSessionMinMaxDistrict = computed(() => {
    const maxEvals = maxCompletedDistrict.totalCompleted
    const maxSessions = maxCompletedDistrict.oneCompleted + 2 * maxCompletedDistrict.twoCompleted + 3 * maxCompletedDistrict.threeCompleted + 4 * maxCompletedDistrict.fourCompleted + 5 * maxCompletedDistrict.fiveCompleted

    const minEvals = minCompletedDistrict.totalCompleted
    const minSessions = minCompletedDistrict.oneCompleted + 2 * minCompletedDistrict.twoCompleted + 3 * minCompletedDistrict.threeCompleted + 4 * minCompletedDistrict.fourCompleted + 5 * minCompletedDistrict.fiveCompleted

    return {
        min: {
            evals: minEvals,
            sessions: minSessions
        },
        max: {
            evals: maxEvals,
            sessions: maxSessions
        }
    }
})

// Facilities sessions
const countFacilitySessions = computed(() => {
    const arr: any[] = []
    facilities.value.flat().forEach((facility) => {
        const countSessions = useCountFacilitySessionsCompleted(facility, evaluationStats)
        arr.push({
            label: facility,
            name: facility,
            fiveCompleted: countSessions.allCompletedCount,
            fourCompleted: countSessions.fourCompletedCount,
            threeCompleted: countSessions.threeCompletedCount,
            twoCompleted: countSessions.twoCompletedCount,
            oneCompleted: countSessions.oneCompletedCount,
            totalCompleted: countSessions.totalCompletedCount
        })
    });
    return arr
})

const maxCompletedFacility = countFacilitySessions.value.reduce((max, current) => {
    return (current.totalCompleted > max.totalCompleted) ? current : max;
});

const minCompletedFacility = countFacilitySessions.value.reduce((min, current) => {
    return (current.totalCompleted < min.totalCompleted) ? current : min;
});

const totalSessionMinMaxFacility = computed(() => {
    const maxEvals = maxCompletedFacility.totalCompleted
    const maxSessions = maxCompletedFacility.oneCompleted + 2 * maxCompletedFacility.twoCompleted + 3 * maxCompletedFacility.threeCompleted + 4 * maxCompletedFacility.fourCompleted + 5 * maxCompletedFacility.fiveCompleted

    const minEvals = minCompletedFacility.totalCompleted
    const minSessions = minCompletedFacility.oneCompleted + 2 * minCompletedFacility.twoCompleted + 3 * minCompletedFacility.threeCompleted + 4 * minCompletedFacility.fourCompleted + 5 * minCompletedFacility.fiveCompleted

    return {
        min: {
            evals: minEvals,
            sessions: minSessions
        },
        max: {
            evals: maxEvals,
            sessions: maxSessions
        }
    }
})

// Navigation function
const goToDashboard = () => {
  navigateTo(Routes.DASHBOARD.path);
};

// Set page metadata
useSeoMeta({
  title: 'Reporting Dashboard - PenPlus NCD Monitoring',
  description: 'Comprehensive evaluation reports and analytics'
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
            @click="goToDashboard"
            class="flex-shrink-0"
          />
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Reporting Dashboard</h1>
              <p class="text-sm text-gray-600">
                Comprehensive evaluation analytics and insights
              </p>
            </div>
          </div>
          <SharedPrintButton />
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Data Overview -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Data Overview</h3>
            <p class="text-sm text-gray-600 mt-1">
              A <span class="font-semibold text-orange-500">session</span> is a sitting between a provider (mentee) and a mentor, 
              whereas an <span class="font-semibold text-green-500">evaluation</span> is a set of sessions possible to a mentee 
              on a particular <span class="text-sky-500 font-semibold">tool/disease</span>
            </p>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Evaluations Count -->
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-8 h-8 text-green-600" />
              </div>
              <div class="text-3xl font-bold text-green-600">{{ completedEvals?.length }}</div>
              <div class="text-sm text-gray-600 font-medium">Total Evaluations</div>
            </div>
            
            <!-- Sessions Count -->
            <div class="text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-clock" class="w-8 h-8 text-orange-600" />
              </div>
              <div class="text-3xl font-bold text-orange-600">{{ countAllSessions }}</div>
              <div class="text-sm text-gray-600 font-medium">Total Sessions</div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-600">
                Download all evaluations in CSV format
              </p>
              <UButton 
                variant="solid" 
                color="orange" 
                label="Download Data" 
                @click="useDownloadEvaluations(completedEvals)"
                icon="i-heroicons-arrow-down-tray"
              />
            </div>
          </template>
        </UCard>
      </div>

      <!-- Key Performance Indicators -->
      <div class="max-w-4xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Key Performance Indicators</h3>
            <p class="text-sm text-gray-600 mt-1">Click on the cards below for detailed reports and analysis</p>
          </template>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Mentees Card -->
            <NuxtLink :to="Routes.MENTEES_REPORTING.path">
              <UCard
                class="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div class="text-center">
                  <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-blue-600" />
                  </div>
                  <div class="text-2xl font-bold text-blue-600">{{ mentees?.length }}</div>
                  <div class="text-sm font-medium text-blue-700">Mentees/Providers</div>
                </div>
              </UCard>
            </NuxtLink>

            <!-- Tools Card -->
            <NuxtLink :to="Routes.TOOLS_REPORTING.path">
              <UCard
                class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div class="text-center">
                  <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-green-600" />
                  </div>
                  <div class="text-2xl font-bold text-green-600">{{ tools.length }}</div>
                  <div class="text-sm font-medium text-green-700">Tools</div>
                </div>
              </UCard>
            </NuxtLink>

            <!-- Districts Card -->
            <NuxtLink :to="Routes.DISTRICTS_REPORTING.path">
              <UCard
                class="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div class="text-center">
                  <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-purple-600" />
                  </div>
                  <div class="text-2xl font-bold text-purple-600">{{ districts?.length }}</div>
                  <div class="text-sm font-medium text-purple-700">Districts</div>
                </div>
              </UCard>
            </NuxtLink>

            <!-- Facilities Card -->
            <NuxtLink :to="Routes.FACILITIES_REPORTING.path">
              <UCard
                class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div class="text-center">
                  <div class="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-rose-600" />
                  </div>
                  <div class="text-2xl font-bold text-rose-600">{{ facilities?.flat().length }}</div>
                  <div class="text-sm font-medium text-rose-700">Facilities</div>
                </div>
              </UCard>
            </NuxtLink>
          </div>
        </UCard>
      </div>

      <!-- Progress Tracking -->
      <div class="max-w-4xl mx-auto">
        <!-- Tools Progress -->
        <div class="mb-8">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Tools/Diseases Progress Tracking</h3>
              <p class="text-sm text-gray-600 mt-1">Performance across different evaluation tools</p>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Most Evaluated Tool -->
              <UCard class="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200">
                <div class="text-center mb-4">
                  <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-sky-600" />
                  </div>
                  <div class="text-lg font-semibold text-sky-700 mb-2">Most Evaluated Tool</div>
                  <div class="text-3xl font-bold text-sky-600">{{ maxCompletedTool.label }}</div>
                </div>
                <div class="text-center text-sm text-sky-700">
                  <span class="font-semibold">{{ totalSessionMinMaxTool.max.evals }}</span> evaluations • 
                  <span class="font-semibold">{{ totalSessionMinMaxTool.max.sessions }}</span> sessions
                </div>
              </UCard>

              <!-- Least Evaluated Tool -->
              <UCard class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200">
                <div class="text-center mb-4">
                  <div class="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-rose-600" />
                  </div>
                  <div class="text-lg font-semibold text-rose-700 mb-2">Least Evaluated Tool</div>
                  <div class="text-3xl font-bold text-rose-600">{{ minCompletedTool.label }}</div>
                </div>
                <div class="text-center text-sm text-rose-700">
                  <span class="font-semibold">{{ totalSessionMinMaxTool.min.evals }}</span> evaluations • 
                  <span class="font-semibold">{{ totalSessionMinMaxTool.min.sessions }}</span> sessions
                </div>
              </UCard>
            </div>
          </UCard>
        </div>

        <!-- Districts Progress -->
        <div class="mb-8">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Districts Progress Tracking</h3>
              <p class="text-sm text-gray-600 mt-1">Geographical distribution of evaluations</p>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- District with Most Evaluations -->
              <UCard class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div class="text-center mb-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-blue-600" />
                  </div>
                  <div class="text-lg font-semibold text-blue-700 mb-2">District with Most Evaluations</div>
                  <div class="text-3xl font-bold text-blue-600">{{ maxCompletedDistrict.label }}</div>
                </div>
                <div class="text-center text-sm text-blue-700">
                  <span class="font-semibold">{{ totalSessionMinMaxDistrict.max.evals }}</span> evaluations • 
                  <span class="font-semibold">{{ totalSessionMinMaxDistrict.max.sessions }}</span> sessions
                </div>
              </UCard>

              <!-- District with Least Evaluations -->
              <UCard class="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                <div class="text-center mb-4">
                  <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-orange-600" />
                  </div>
                  <div class="text-lg font-semibold text-orange-700 mb-2">District with Least Evaluations</div>
                  <div class="text-3xl font-bold text-orange-600">{{ minCompletedDistrict.label }}</div>
                </div>
                <div class="text-center text-sm text-orange-700">
                  <span class="font-semibold">{{ totalSessionMinMaxDistrict.min.evals }}</span> evaluations • 
                  <span class="font-semibold">{{ totalSessionMinMaxDistrict.min.sessions }}</span> sessions
                </div>
              </UCard>
            </div>
          </UCard>
        </div>

        <!-- Facilities Progress -->
        <div class="mb-8">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Facilities Progress Tracking</h3>
              <p class="text-sm text-gray-600 mt-1">Healthcare facility evaluation performance</p>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Facility with Most Evaluations -->
              <UCard class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div class="text-center mb-4">
                  <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-green-600" />
                  </div>
                  <div class="text-lg font-semibold text-green-700 mb-2">Facility with Most Evaluations</div>
                  <div class="text-3xl font-bold text-green-600">{{ maxCompletedFacility.label }}</div>
                </div>
                <div class="text-center text-sm text-green-700">
                  <span class="font-semibold">{{ totalSessionMinMaxFacility.max.evals }}</span> evaluations • 
                  <span class="font-semibold">{{ totalSessionMinMaxFacility.max.sessions }}</span> sessions
                </div>
              </UCard>

              <!-- Facility with Least Evaluations -->
              <UCard class="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                <div class="text-center mb-4">
                  <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600" />
                  </div>
                  <div class="text-lg font-semibold text-red-700 mb-2">Facility with Least Evaluations</div>
                  <div class="text-3xl font-bold text-red-600">{{ minCompletedFacility.label }}</div>
                </div>
                <div class="text-center text-sm text-red-700">
                  <span class="font-semibold">{{ totalSessionMinMaxFacility.min.evals }}</span> evaluations • 
                  <span class="font-semibold">{{ totalSessionMinMaxFacility.min.sessions }}</span> sessions
                </div>
              </UCard>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-4xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ mentees?.length }}</div>
          <div class="text-sm text-blue-600 font-medium">Mentees</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">{{ tools.length }}</div>
          <div class="text-sm text-green-600 font-medium">Tools</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">{{ districts?.length }}</div>
          <div class="text-sm text-purple-600 font-medium">Districts</div>
        </UCard>
        
        <UCard class="text-center bg-rose-50/50">
          <div class="text-2xl font-bold text-rose-600">{{ facilities?.flat().length }}</div>
          <div class="text-sm text-rose-600 font-medium">Facilities</div>
        </UCard>
      </div>

      <!-- Back to Dashboard Button -->
      <div class="max-w-4xl mx-auto mt-8 flex justify-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Dashboard"
          @click="goToDashboard"
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

/* Hover effects for interactive cards */
.cursor-pointer:hover {
  transform: translateY(-2px);
}
</style>