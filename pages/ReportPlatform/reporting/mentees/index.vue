
<script setup lang="ts">
import DatabaseNames from "@/constants/DatabaseNames";
import type IMasterUser from "~/interfaces/IMasterUser";
import type IFinalEvaluation from "~/interfaces/IFinalEvaluation";

const router = useRouter();

const goBack = () => {
    router.back();
};

// Mentees
const useMentees = useMenteeStore();
const menteesData = await useMentees.fetchMentees();
const mentees = computed<IMasterUser[]>(() => (menteesData as IMasterUser[]) || []);

// Evaluations
const useEvaluations = useEvalDataStore();
const completedEvalsData = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);
const completedEvals = computed<IFinalEvaluation[]>(() => completedEvalsData as IFinalEvaluation[] || []);


const genderCounts = computed(() => {
    const males = mentees.value.filter((m: IMasterUser) => m.gender == 'Male')
    const females = mentees.value.filter((m: IMasterUser) => m.gender == 'Female')
    const Other = mentees.value.filter((m: IMasterUser) => m.gender == 'Other')

    return {
        Males: males.length,
        Females: females.length,
        Other: Other.length
    }
})

const genderReport = (gender: string): void => {
    navigateTo('/ReportPlatform/Reporting/Mentees/Gender/'+ gender)
}

const professions: string[] = Array.from(new Set(mentees.value.map((m: IMasterUser) => m.profession)))

interface ProfessionCounts {
    [key: string]: number;
}

const professionCounts = computed<ProfessionCounts>(() => {
    const count: ProfessionCounts = {};
    professions.forEach((p) => {
        count[p] = mentees.value.filter((m: IMasterUser) => m.profession === p).length;
    });
    return count;
});

// Check if data is loaded
const isDataLoaded = computed(() => mentees.value.length > 0);

// Set page metadata
useSeoMeta({
  title: 'Mentees Reporting - PenPlus NCD Monitoring',
  description: 'Comprehensive mentee analytics and performance reports'
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
              @click="goBack"
              class="rounded-full"
            />
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-semibold text-slate-800">Mentees Reporting</h1>
                <p class="text-sm text-slate-500">Comprehensive analytics and performance reports</p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4 sm:px-6 lg:px-8">
      <!-- Mentees List -->
      <div class="max-w-6xl mx-auto mb-10">
        <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-slate-800">All Mentees</h3>
              <span class="text-xs font-medium px-3 py-1 bg-teal-100 text-teal-700 rounded-full">Live</span>
            </div>
            <p class="text-sm text-slate-500 mt-1">Complete list of mentees with evaluation data</p>
          </template>

          <div class="bg-white rounded-lg">
            <TablesAGtablesMenteesAllList :mentees="mentees" :evaluations="completedEvals" />
          </div>
        </UCard>
      </div>

      <!-- Gender Analysis -->
      <div class="max-w-6xl mx-auto mb-10">
        <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <h3 class="text-lg font-medium text-slate-800">Mentees by Gender</h3>
            <p class="text-sm text-slate-500 mt-1">Distribution and analysis across gender categories</p>
          </template>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2">
            <!-- Pie Chart -->
            <div v-if="mentees?.length > 0" class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <ChartsSharedPie :pie-data="genderCounts" />
            </div>
            <div v-else class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-center min-h-[200px]">
              <p class="text-slate-500 text-sm">Loading gender data...</p>
            </div>

            <!-- Gender Data Table -->
            <div class="space-y-4">
              <div class="grid grid-cols-3 gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div class="font-semibold text-blue-700 text-sm">Gender</div>
                <div class="font-semibold text-blue-700 text-sm">Count</div>
                <div class="font-semibold text-blue-700 text-sm">Actions</div>
              </div>

              <div v-for="(count, gender) in genderCounts" :key="gender"
                   class="grid grid-cols-3 gap-4 py-3 px-4 border-b border-slate-100 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div class="font-medium text-slate-700">{{ gender }}</div>
                <div class="text-slate-600">{{ count }}</div>
                <div>
                  <UButton
                    color="orange"
                    variant="soft"
                    size="sm"
                    @click="genderReport(gender)"
                    class="rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    View Report
                  </UButton>
                </div>
              </div>

              <!-- Summary -->
              <div class="grid grid-cols-3 gap-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200 mt-4">
                <div class="font-bold text-emerald-700">Total</div>
                <div class="font-bold text-emerald-700">{{ (genderCounts?.Males || 0) + (genderCounts?.Females || 0) + (genderCounts?.Other || 0) }}</div>
                <div class="text-emerald-600 text-sm">All Mentees</div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Profession Analysis -->
      <div class="max-w-6xl mx-auto mb-10">
        <UCard class="border-0 shadow-lg rounded-2xl overflow-hidden">
          <template #header>
            <h3 class="text-lg font-medium text-slate-800">Mentees by Profession</h3>
            <p class="text-sm text-slate-500 mt-1">Distribution across professional categories</p>
          </template>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2">
            <!-- Pie Chart -->
            <div v-if="mentees?.length > 0" class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <ChartsSharedPie :pie-data="professionCounts" />
            </div>
            <div v-else class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-center min-h-[200px]">
              <p class="text-slate-500 text-sm">Loading profession data...</p>
            </div>

            <!-- Profession Data Table -->
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                <div class="font-semibold text-purple-700 text-sm">Profession</div>
                <div class="font-semibold text-purple-700 text-sm">Count</div>
              </div>

              <div v-for="(count, profession) in professionCounts" :key="profession"
                   class="grid grid-cols-2 gap-4 py-3 px-4 border-b border-slate-100 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div class="font-medium text-slate-700">{{ profession }}</div>
                <div class="text-slate-600">{{ count }}</div>
              </div>

              <!-- Summary -->
              <div class="grid grid-cols-2 gap-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 mt-4">
                <div class="font-bold text-amber-700">Total</div>
                <div class="font-bold text-amber-700">{{ Object.values(professionCounts || {}).reduce((a: any, b: any) => a + b, 0) }}</div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ mentees?.length || 0 }}</div>
          <div class="text-xs text-slate-500">Total Mentees</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ genderCounts?.Males || 0 }}</div>
          <div class="text-xs text-slate-500">Male</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ genderCounts?.Females || 0 }}</div>
          <div class="text-xs text-slate-500">Female</div>
        </UCard>
        <UCard class="border-0 shadow-sm bg-slate-50/80 rounded-xl text-center py-3">
          <div class="text-xl font-semibold text-slate-700">{{ Object.keys(professionCounts || {}).length || 0 }}</div>
          <div class="text-xs text-slate-500">Professions</div>
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
          class="rounded-full px-6"
        />
      </div>

      <div class="pb-10" />
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Optional: subtle hover lift for table rows */
.hover\:bg-slate-50:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
</style>
