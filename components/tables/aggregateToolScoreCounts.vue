<script setup lang="ts">
import capitalizeFirstLetter from "@/utilities/capitalizeFirstLetter";
import type IFinalEvaluation from "~/interfaces/IFinalEvaluation";

const props = defineProps<{
  toolEvals: IFinalEvaluation[];
}>();

const data = useNumResponsesPerTool(props.toolEvals);

interface ToolCounts {
  zeros: number;
  ones: number;
  twos: number;
  threes: number;
  fours: number;
  fives: number;
}

const aggregateCounts = computed(() => {
  const result: { [key: string]: ToolCounts } = {};

  for (const tool in data) {
    result[tool] = { zeros: 0, ones: 0, twos: 0, threes: 0, fours: 0, fives: 0 };

    for (const key in data[tool]) {
      const toolData = data[tool]![key]!;
      result[tool].zeros += toolData.zeros;
      result[tool].ones += toolData.ones;
      result[tool].twos += toolData.twos;
      result[tool].threes += toolData.threes;
      result[tool].fours += toolData.fours;
      result[tool].fives += toolData.fives;
    }
  }

  return result;
});

// Color intensity based on count
const countColorClass = (count: number): string => {
  if (count === 0) return 'bg-gray-50 text-gray-500';
  if (count <= 5) return 'bg-gray-100 text-gray-800';
  if (count <= 10) return 'bg-green-100 text-green-800';
  if (count <= 20) return 'bg-green-300 text-green-900';
  if (count <= 50) return 'bg-green-500 text-white';
  if (count <= 100) return 'bg-green-700 text-white';
  return 'bg-green-900 text-white font-bold';
};
</script>

<template>
  <div class="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-inner">
    <h1 class="text-2xl font-semibold mb-6 text-emerald-800 flex items-center gap-2">
      <UIcon name="i-heroicons-chart-bar" class="w-6 h-6" />
      Competency Aggregated Score Counts
    </h1>

    <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
      <table class="min-w-full bg-white divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-gray-100 to-gray-200 sticky top-0 z-10">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tool/Disease</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Zeros</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Ones</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Twos</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Threes</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Fours</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Fives</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(counts, disease) in aggregateCounts" :key="disease" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sky-700 font-semibold border-r border-gray-100">
              {{ capitalizeFirstLetter(disease) }}
            </td>
            <td class="px-6 py-4 text-center" :class="countColorClass(counts.zeros)">{{ counts.zeros }}</td>
            <td class="px-6 py-4 text-center" :class="countColorClass(counts.ones)">{{ counts.ones }}</td>
            <td class="px-6 py-4 text-center" :class="countColorClass(counts.twos)">{{ counts.twos }}</td>
            <td class="px-6 py-4 text-center" :class="countColorClass(counts.threes)">{{ counts.threes }}</td>
            <td class="px-6 py-4 text-center" :class="countColorClass(counts.fours)">{{ counts.fours }}</td>
            <td class="px-6 py-4 text-center" :class="countColorClass(counts.fives)">{{ counts.fives }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Legend -->
    <div class="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 justify-center">
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-gray-100 rounded"></span> 1–5</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-100 rounded"></span> 6–10</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-300 rounded"></span> 11–20</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded"></span> 21–50</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-700 rounded"></span> 51–100</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-900 rounded"></span> 101+</span>
    </div>
  </div>
</template>