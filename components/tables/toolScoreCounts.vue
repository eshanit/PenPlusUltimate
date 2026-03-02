<script setup lang="ts">
import capitalizeFirstLetter from "@/utilities/capitalizeFirstLetter";
import evaluationItemData from '@/data/evaluationItemData';
import type IFinalEvaluation from "~/interfaces/IFinalEvaluation";

const props = defineProps<{
  toolEvals: IFinalEvaluation[];
}>();

const itemsCount = (items: Record<string, any>) => Object.keys(items).length;

const toolTitle = (code: string) => {
  for (const tool of evaluationItemData) {
    for (const item of tool.evaluationItems) {
      if (item.number === code) return item.title;
    }
  }
  return null;
};

// Same color logic as in aggregate table
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
  <div class="overflow-x-auto p-6 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl shadow-inner">
    <h1 class="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
      <UIcon name="i-heroicons-list-bullet" class="w-6 h-6" />
      Itemized Competency Score Counts
    </h1>

    <div class="rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <table class="min-w-full bg-white divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-gray-100 to-gray-200 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tool/Disease</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Competency</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Zeros</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Ones</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Twos</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Threes</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Fours</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Fives</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <template v-for="(items, category) in useNumResponsesPerTool(props.toolEvals)" :key="category">
            <template v-for="(item, itemKey, index) in items" :key="itemKey">
              <tr class="hover:bg-gray-50 transition-colors">
                <!-- Tool name with rowspan -->
                <td v-if="index === 0" :rowspan="itemsCount(items)"
                    class="px-4 py-3 align-top font-semibold text-sky-700 border-r border-gray-100">
                  {{ capitalizeFirstLetter(category) }}
                </td>

                <!-- Competency code with tooltip -->
                <td class="px-4 py-3">
                  <UPopover mode="hover">
                    <div class="text-green-700 font-semibold underline decoration-dotted cursor-help">
                      {{ itemKey }}
                    </div>
                    <template #panel>
                      <div class="p-3 bg-sky-100 text-sky-800 rounded shadow-lg max-w-xs text-sm">
                        {{ toolTitle(itemKey.toString()) }}
                      </div>
                    </template>
                  </UPopover>
                </td>

                <!-- Score counts with dynamic color -->
                <td class="px-4 py-3 text-center" :class="countColorClass(item.zeros)">{{ item.zeros }}</td>
                <td class="px-4 py-3 text-center" :class="countColorClass(item.ones)">{{ item.ones }}</td>
                <td class="px-4 py-3 text-center" :class="countColorClass(item.twos)">{{ item.twos }}</td>
                <td class="px-4 py-3 text-center" :class="countColorClass(item.threes)">{{ item.threes }}</td>
                <td class="px-4 py-3 text-center" :class="countColorClass(item.fours)">{{ item.fours }}</td>
                <td class="px-4 py-3 text-center" :class="countColorClass(item.fives)">{{ item.fives }}</td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Legend (same as above) -->
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