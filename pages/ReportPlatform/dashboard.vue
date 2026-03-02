<script setup lang="ts">
// [Keep all your existing script code exactly as is]
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
            fourCompleted: countSessions.fourCompletedCount,
            threeCompleted: countSessions.threeCompletedCount,
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
        const countSessions = useCountDistrictSessionsCompleted(district.district, evaluationStats, district.facilities)
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
  <div class="min-h-screen bg-slate-50">
    <!-- Header with glass effect -->
    <div class="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UButton
              icon="i-heroicons-arrow-left-20-solid"
              color="gray"
              variant="ghost"
              size="md"
              @click="goToDashboard"
              class="rounded-full"
            />
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-semibold text-slate-800">Reporting Dashboard</h1>
                <p class="text-sm text-slate-500">Evaluation analytics and performance insights</p>
              </div>
            </div>
          </div>
          <SharedPrintButton />
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4 sm:px-6 lg:px-8">
      <!-- Data Overview Card -->
      <div class="max-w-5xl mx-auto mb-10">
        <UCard class="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/80 rounded-2xl overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-slate-800">Data Overview</h3>
              <span class="text-xs font-medium px-3 py-1 bg-teal-100 text-teal-700 rounded-full">Live</span>
            </div>
            <p class="text-sm text-slate-500 mt-1">
              A <span class="font-semibold text-amber-600">session</span> is a sitting between a provider (mentee) and a mentor,
              whereas an <span class="font-semibold text-emerald-600">evaluation</span> is a set of sessions on a particular tool.
            </p>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <!-- Evaluations Count -->
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <div class="text-3xl font-bold text-slate-800">{{ completedEvals?.length }}</div>
                <div class="text-sm text-slate-500 font-medium">Total Evaluations</div>
              </div>
            </div>

            <!-- Sessions Count -->
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm">
                <UIcon name="i-heroicons-clock" class="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <div class="text-3xl font-bold text-slate-800">{{ countAllSessions }}</div>
                <div class="text-sm text-slate-500 font-medium">Total Sessions</div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p class="text-sm text-slate-500">Download all evaluations in CSV format</p>
              <UButton
                variant="solid"
                color="teal"
                label="Download Data"
                @click="useDownloadEvaluations(completedEvals)"
                icon="i-heroicons-arrow-down-tray"
                class="rounded-lg"
              />
            </div>
          </template>
        </UCard>
      </div>

      <!-- Key Performance Indicators -->
      <div class="max-w-5xl mx-auto mb-10">
        <h2 class="text-lg font-medium text-slate-800 mb-4">Key Performance Indicators</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Mentees Card (clickable) -->
          <NuxtLink :to="Routes.MENTEES_REPORTING.path" class="group">
            <UCard class="relative border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/70">
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 text-blue-600" />
              </div>
              <div class="text-center py-2">
                <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <UIcon name="i-heroicons-user-group" class="w-7 h-7 text-blue-600" />
                </div>
                <div class="text-2xl font-bold text-blue-700">{{ mentees?.length }}</div>
                <div class="text-sm font-medium text-blue-600/80">Mentees/Providers</div>
              </div>
            </UCard>
          </NuxtLink>

          <!-- Tools Card (clickable) -->
          <NuxtLink :to="Routes.TOOLS_REPORTING.path" class="group">
            <UCard class="relative border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50/70">
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 text-emerald-600" />
              </div>
              <div class="text-center py-2">
                <div class="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <UIcon name="i-heroicons-wrench-screwdriver" class="w-7 h-7 text-emerald-600" />
                </div>
                <div class="text-2xl font-bold text-emerald-700">{{ tools.length }}</div>
                <div class="text-sm font-medium text-emerald-600/80">Tools</div>
              </div>
            </UCard>
          </NuxtLink>

          <!-- Districts Card (clickable) -->
          <NuxtLink :to="Routes.DISTRICTS_REPORTING.path" class="group">
            <UCard class="relative border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50/70">
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 text-purple-600" />
              </div>
              <div class="text-center py-2">
                <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-purple-600" />
                </div>
                <div class="text-2xl font-bold text-purple-700">{{ districts?.length }}</div>
                <div class="text-sm font-medium text-purple-600/80">Districts</div>
              </div>
            </UCard>
          </NuxtLink>

          <!-- Facilities Card (clickable) -->
          <NuxtLink :to="Routes.FACILITIES_REPORTING.path" class="group">
            <UCard class="relative border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50/70">
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 text-rose-600" />
              </div>
              <div class="text-center py-2">
                <div class="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <UIcon name="i-heroicons-building-office" class="w-7 h-7 text-rose-600" />
                </div>
                <div class="text-2xl font-bold text-rose-700">{{ facilities?.flat().length }}</div>
                <div class="text-sm font-medium text-rose-600/80">Facilities</div>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </div>

      <!-- Progress Tracking Sections -->
      <div class="max-w-5xl mx-auto space-y-10">
        <!-- Tools Progress -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1 h-6 bg-teal-500 rounded-full"></div>
            <h2 class="text-lg font-medium text-slate-800">Tools/Diseases Progress Tracking</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Most Evaluated Tool -->
            <UCard class="border-0 shadow-md rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/70">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center shadow-sm">
                  <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-sky-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-sky-700 font-medium">Most Evaluated Tool</p>
                  <p class="text-2xl font-bold text-sky-800 mt-1">{{ maxCompletedTool.label }}</p>
                  <div class="mt-2 text-sm text-sky-700">
                    <span class="font-semibold">{{ totalSessionMinMaxTool.max.evals }}</span> evaluations •
                    <span class="font-semibold">{{ totalSessionMinMaxTool.max.sessions }}</span> sessions
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Least Evaluated Tool -->
            <UCard class="border-0 shadow-md rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/70">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-sm">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-amber-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-amber-700 font-medium">Least Evaluated Tool</p>
                  <p class="text-2xl font-bold text-amber-800 mt-1">{{ minCompletedTool.label }}</p>
                  <div class="mt-2 text-sm text-amber-700">
                    <span class="font-semibold">{{ totalSessionMinMaxTool.min.evals }}</span> evaluations •
                    <span class="font-semibold">{{ totalSessionMinMaxTool.min.sessions }}</span> sessions
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </section>

        <!-- Districts Progress -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1 h-6 bg-indigo-500 rounded-full"></div>
            <h2 class="text-lg font-medium text-slate-800">Districts Progress Tracking</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- District with Most Evaluations -->
            <UCard class="border-0 shadow-md rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/70">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                  <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-indigo-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-indigo-700 font-medium">District with Most Evaluations</p>
                  <p class="text-2xl font-bold text-indigo-800 mt-1">{{ maxCompletedDistrict.label }}</p>
                  <div class="mt-2 text-sm text-indigo-700">
                    <span class="font-semibold">{{ totalSessionMinMaxDistrict.max.evals }}</span> evaluations •
                    <span class="font-semibold">{{ totalSessionMinMaxDistrict.max.sessions }}</span> sessions
                  </div>
                </div>
              </div>
            </UCard>

            <!-- District with Least Evaluations -->
            <UCard class="border-0 shadow-md rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/70">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-orange-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-orange-700 font-medium">District with Least Evaluations</p>
                  <p class="text-2xl font-bold text-orange-800 mt-1">{{ minCompletedDistrict.label }}</p>
                  <div class="mt-2 text-sm text-orange-700">
                    <span class="font-semibold">{{ totalSessionMinMaxDistrict.min.evals }}</span> evaluations •
                    <span class="font-semibold">{{ totalSessionMinMaxDistrict.min.sessions }}</span> sessions
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </section>

        <!-- Facilities Progress -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1 h-6 bg-emerald-500 rounded-full"></div>
            <h2 class="text-lg font-medium text-slate-800">Facilities Progress Tracking</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Facility with Most Evaluations -->
            <UCard class="border-0 shadow-md rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50/70">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                  <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-emerald-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-emerald-700 font-medium">Facility with Most Evaluations</p>
                  <p class="text-2xl font-bold text-emerald-800 mt-1">{{ maxCompletedFacility.label }}</p>
                  <div class="mt-2 text-sm text-emerald-700">
                    <span class="font-semibold">{{ totalSessionMinMaxFacility.max.evals }}</span> evaluations •
                    <span class="font-semibold">{{ totalSessionMinMaxFacility.max.sessions }}</span> sessions
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Facility with Least Evaluations -->
            <UCard class="border-0 shadow-md rounded-2xl bg-gradient-to-br from-red-50 to-rose-50/70">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shadow-sm">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-red-700 font-medium">Facility with Least Evaluations</p>
                  <p class="text-2xl font-bold text-red-800 mt-1">{{ minCompletedFacility.label }}</p>
                  <div class="mt-2 text-sm text-red-700">
                    <span class="font-semibold">{{ totalSessionMinMaxFacility.min.evals }}</span> evaluations •
                    <span class="font-semibold">{{ totalSessionMinMaxFacility.min.sessions }}</span> sessions
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </section>
      </div>

      <!-- Quick Stats Row -->
      <div class="max-w-5xl mx-auto mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ mentees?.length }}</div>
          <div class="text-xs text-slate-500">Mentees</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ tools.length }}</div>
          <div class="text-xs text-slate-500">Tools</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ districts?.length }}</div>
          <div class="text-xs text-slate-500">Districts</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ facilities?.flat().length }}</div>
          <div class="text-xs text-slate-500">Facilities</div>
        </UCard>
      </div>

      <!-- Back to Dashboard Button -->
      <div class="max-w-5xl mx-auto mt-8 flex justify-center">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="outline"
          label="Back to Dashboard"
          @click="goToDashboard"
          class="rounded-full px-6"
        />
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Optional: subtle animation for cards */
.group:hover .absolute {
  transform: scale(1.05);
}
</style>