<script setup lang="ts">
import capitalizeFirstLetter from "@/utilities/capitalizeFirstLetter";
import evaluationItemData from '@/data/evaluationItemData';
import type IFinalEvaluation from "~/interfaces/IFinalEvaluation";

const props = defineProps<{
    toolEvals: IFinalEvaluation[],
}>()



const itemsCount = (items: {}) => {
    return Object.keys(items).length;
};

const toolTitle = (code: string) => {
    for (const tool of evaluationItemData) {
        for (const item of tool.evaluationItems) {
            if (item.number === code) {
                return item.title;
            }
        }
    }
    return null;
}

// const mentees = computed(() => {
//     const menteesArray = props.toolEvals.map((tool: { mentee: { _id: any; }; }) => tool.mentee._id)

//     return [...new Set(menteesArray)]
// })


// const percent = (num: number) => {
//     return (100 * num / props.mentees).toFixed(2);
// }

</script>
<template>

    <div class="overflow-x-auto p-6 bg-sky-50 rounded-lg">
        <h1 class="text-2xl font-semibold mb-4">Itemized Competency Score Counts Summary</h1>
        <table class="min-w-full bg-white border-collapse border border-gray-300">
            <thead>
                <tr class="bg-gray-200">
                    <th class="border border-gray-300 px-4 py-2">Tool/Disease</th>
                    <th class="border border-gray-300 px-4 py-2">Competency</th>
                    <th class="border border-gray-300 px-4 py-2">Number of Ones</th>
                    <th class="border border-gray-300 px-4 py-2">Number of Twos</th>
                    <th class="border border-gray-300 px-4 py-2">Number of Threes</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(items, category) in useNumResponsesPerTool(props.toolEvals)" :key="category">
                    <template v-for="(item, itemKey, index) in items">
                        <tr>
                            <td class="border border-gray-300 px-4 py-2 text-sky-700 font-bold" v-if="index === 0"
                                :rowspan="itemsCount(items)">
                                {{ capitalizeFirstLetter(category) }}
                            </td>

                            <td class="border border-gray-300 px-4 py-2">
                                <UPopover mode="hover">
                                    <div class=" text-green-700 font-semibold underline decoration-dotted"> {{ itemKey }} </div>

                                    <template #panel>
                                        <div class="p-4 bg-sky-200">
                                            {{ toolTitle(itemKey.toString()) }}
                                        </div>
                                    </template>
                                </UPopover>
                            </td>

                            <td class="border border-gray-300 px-4 py-2">
                                <div class="text-center">
                                    <div>
                                        {{ item.ones }}
                                    </div>
                                    <!-- <div class="text-sky-700 italic">
                                                   {{ percent(item.ones) }}%
                                                </div> -->
                                </div>

                            </td>
                            <td class="border border-gray-300 px-4 py-2">
                                <div class="text-center">
                                    <div>
                                        {{ item.twos }}
                                    </div>
                                    <!-- <div class="text-sky-700 italic">
                                                    ({{ percent(item.twos) }}%)
                                                </div> -->
                                </div>
                            </td>
                            <td class="border border-gray-300 px-4 py-2">
                                <div class="text-center">
                                    <div>
                                        {{ item.threes }}
                                    </div>
                                    <!-- <div class="text-sky-700 italic">
                                                    ({{ percent(item.threes) }}%)
                                                </div> -->
                                </div>
                            </td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
    </div>
</template>