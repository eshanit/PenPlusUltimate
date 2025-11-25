<script setup lang="ts">
import DatabaseNames from "@/constants/DatabaseNames";
import type IFinalEvaluation from "~/interfaces/IFinalEvaluation";

const router = useRouter();

const goBack = () => {
    router.back();
};

// Mentees
const useMentees = useMenteeStore();
const mentees: any = await useMentees.fetchMentees();

// Evaluations
const useEvaluations = useEvalDataStore();
const completedEvals: IFinalEvaluation[] = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);

const genderEvaluations = (profession: string) => {
    return completedEvals.filter((e) => {
        return e.mentee.profession == profession
    })
}

const genderCounts = computed(() => {
    const males = mentees.filter((m: any) => m.gender == 'Male')
    const females = mentees.filter((m: any) => m.gender == 'Female')
    const Other = mentees.filter((m: any) => m.gender == 'Other')

    return {
        Males: males.length,
        Females: females.length,
        Other: Other.length
    }
})

const genderReport = (gender: string): void => {
    navigateTo('/ReportPlatform/Reporting/Mentees/Gender/'+ gender)
}

const professions: string[] = Array.from(new Set(mentees.map((m: { profession: any; }) => m.profession)))

interface ProfessionCounts {
    [key: string]: number;
}

const professionCounts = computed<ProfessionCounts>(() => {
    const count: ProfessionCounts = {};
    professions.forEach((p) => {
        count[p] = mentees.filter((m: { profession: string; }) => m.profession === p).length;
    });
    return count;
});

// Set page metadata
useSeoMeta({
  title: 'Mentees Reporting - PenPlus NCD Monitoring',
  description: 'Comprehensive mentee analytics and performance reports'
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
              <h1 class="text-xl font-bold text-gray-900">Mentees Reporting</h1>
              <p class="text-sm text-gray-600">
                Comprehensive analytics and performance reports
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-8 px-4">
      <!-- Mentees List -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">All Mentees</h3>
            <p class="text-sm text-gray-600 mt-1">Complete list of mentees with evaluation data</p>
          </template>
          
          <div class="bg-white rounded-lg">
            <TablesAGtablesMenteesAllList :mentees="mentees" :evaluations="completedEvals" />
          </div>
        </UCard>
      </div>

      <!-- Gender Analysis -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Mentees by Gender</h3>
            <p class="text-sm text-gray-600 mt-1">Distribution and analysis across gender categories</p>
          </template>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Pie Chart -->
            <div class="bg-white rounded-lg p-4 border border-gray-200">
              <ChartsSharedPie :pie-data="genderCounts" />
            </div>
            
            <!-- Gender Data Table -->
            <div class="space-y-4">
              <div class="grid grid-cols-3 gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div class="font-semibold text-blue-700 text-sm">Gender</div>
                <div class="font-semibold text-blue-700 text-sm">Count</div>
                <div class="font-semibold text-blue-700 text-sm">Actions</div>
              </div>
              
              <div v-for="(count, gender) in genderCounts" :key="gender"
                   class="grid grid-cols-3 gap-4 py-3 px-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div class="font-medium text-gray-700">{{ gender }}</div>
                <div class="text-gray-600">{{ count }}</div>
                <div>
                  <UButton 
                    color="orange" 
                    variant="soft" 
                    size="sm"
                    @click="genderReport(gender)"
                    class="hover:shadow-md transition-all duration-200"
                  >
                    View Report
                  </UButton>
                </div>
              </div>
              
              <!-- Summary -->
              <div class="grid grid-cols-3 gap-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mt-4">
                <div class="font-bold text-green-700">Total</div>
                <div class="font-bold text-green-700">{{ Object.values(genderCounts).reduce((a, b) => a + b, 0) }}</div>
                <div class="text-green-600 text-sm">All Mentees</div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Profession Analysis -->
      <div class="max-w-6xl mx-auto mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Mentees by Profession</h3>
            <p class="text-sm text-gray-600 mt-1">Distribution across professional categories</p>
          </template>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Pie Chart -->
            <div class="bg-white rounded-lg p-4 border border-gray-200">
              <ChartsSharedPie :pie-data="professionCounts" />
            </div>
            
            <!-- Profession Data Table -->
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                <div class="font-semibold text-purple-700 text-sm">Profession</div>
                <div class="font-semibold text-purple-700 text-sm">Count</div>
              </div>
              
              <div v-for="(count, profession) in professionCounts" :key="profession"
                   class="grid grid-cols-2 gap-4 py-3 px-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div class="font-medium text-gray-700">{{ profession }}</div>
                <div class="text-gray-600">{{ count }}</div>
              </div>
              
              <!-- Summary -->
              <div class="grid grid-cols-2 gap-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200 mt-4">
                <div class="font-bold text-orange-700">Total</div>
                <div class="font-bold text-orange-700">{{ Object.values(professionCounts).reduce((a, b) => a + b, 0) }}</div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <UCard class="text-center bg-blue-50/50">
          <div class="text-2xl font-bold text-blue-600">{{ mentees?.length }}</div>
          <div class="text-sm text-blue-600 font-medium">Total Mentees</div>
        </UCard>
        
        <UCard class="text-center bg-green-50/50">
          <div class="text-2xl font-bold text-green-600">{{ genderCounts.Males }}</div>
          <div class="text-sm text-green-600 font-medium">Male</div>
        </UCard>
        
        <UCard class="text-center bg-purple-50/50">
          <div class="text-2xl font-bold text-purple-600">{{ genderCounts.Females }}</div>
          <div class="text-sm text-purple-600 font-medium">Female</div>
        </UCard>
        
        <UCard class="text-center bg-rose-50/50">
          <div class="text-2xl font-bold text-rose-600">{{ Object.keys(professionCounts).length }}</div>
          <div class="text-sm text-rose-600 font-medium">Professions</div>
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

      <div class="pb-10" />
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s ease-in-out;
}

/* Hover effects for interactive elements */
.hover\:bg-gray-50:hover {
  transform: translateY(-1px);
}
</style>