<script setup lang="ts">
import capitalizeFirstLetter from "@/utilities/capitalizeFirstLetter";
import evaluationItemData from '@/data/evaluationItemData';
import type IFinalEvaluation from "~/interfaces/IFinalEvaluation";

const props = defineProps<{
    toolEvals: IFinalEvaluation[],
}>()


interface ToolCounts {
    ones: number;
    twos: number;
    threes: number;
}

interface Data {
    [key: string]: {
        [key: string]: ToolCounts;
    };
}

const data = useNumResponsesPerTool(props.toolEvals)

const aggregateCounts = computed(() => {
    const result: { [key: string]: ToolCounts } = {};

    for (const tool in data) {
        result[tool] = { ones: 0, twos: 0, threes: 0 };

        for (const key in data[tool]) {
            result[tool].ones += data[tool][key].ones;
            result[tool].twos += data[tool][key].twos;
            result[tool].threes += data[tool][key].threes;
        }
    }

    return result;
})

</script>
<template>
 <div class="p-6 bg-green-50 rounded-lg">
    <h1 class="text-2xl font-semibold mb-4">Competency Aggregated Score Counts Summary</h1>
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
      <thead>
        <tr class="bg-gray-200">
          <th class="py-2 px-4 border-b">Tool/Disease</th>
          <th class="py-2 px-4 border-b">Number of Ones</th>
          <th class="py-2 px-4 border-b"> Number of Twos</th>
          <th class="py-2 px-4 border-b">Number of Threes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(counts, disease) in aggregateCounts" :key="disease">
          <td class="text-sky-700 font-semibold py-2 px-4 border-b ">{{ capitalizeFirstLetter(disease) }}</td>
          <td class="text-center py-2 px-4 border-b">{{ counts.ones }}</td>
          <td class="text-center py-2 px-4 border-b">{{ counts.twos }}</td>
          <td class="text-center py-2 px-4 border-b">{{ counts.threes }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>