<script setup lang="ts">
import { format } from 'date-fns'
import evaluationItemData from '@/data/evaluationItemData';

const props = defineProps<{
    evaluation: any
}>()

const averageScore = (a: number, b: number, c: number, d: number, e: number) => {
    const averageScore = (a + b + c + d + e) / 5
    return averageScore.toFixed(2)
}

const average4Score = (a: number, b: number, c: number, d: number) => {
    const averageScore = (a + b + c + d) / 4
    return averageScore.toFixed(2)
}

const average3Score = (a: number, b: number, c: number) => {
    const averageScore = (a + b + c) / 3
    return averageScore.toFixed(2)
}


const average2Score = (a: number, b: number) => {
    const averageScore = (a + b) / 2
    return averageScore.toFixed(2)
}

const average1Score = (a: number) => {
    return a
}

const viewSession = (session: string, scoreId: string) => {
    navigateTo('/reports/partial/' + session + '/' + scoreId)
}

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

</script>
<template>
    <SharedTwCardWithHeader>
        <template #header>
            Scores | <span class="text-sky-600 font-semibold uppercase">{{ props.evaluation.tool }}</span>
        </template>
        <template #body>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left">Tool Item</th>
                            <th class="py-3 px-6 text-left">
                                <div>Rating Session 1</div>
                                <div class=" ">
                                    <UButton variant="soft" color="orange" size="xl" @click="viewSession('1', evaluation._id)">
                                        {{ format(evaluation.sessions.session_1.evalDate,'yyyy-MM-dd') }}
                                    </UButton>
                                </div>
                            </th>
                            <th class="py-3 px-6 text-left">
                                <div>Rating Session 2</div>
                                <div class="text-orange-500" v-if="evaluation.sessions.session_2">
                                    <UButton variant="soft" color="orange" size="xl" @click="viewSession('2', evaluation._id)">
                                        {{ format(evaluation.sessions.session_2.evalDate,'yyyy-MM-dd') }}
                                    </UButton>
                                </div>
                            </th>
                            <th class="py-3 px-6 text-left">
                                <div>Rating Session 3</div>
                                    <div class="text-orange-500" v-if="evaluation.sessions.session_3">
                                        <UButton variant="soft" color="orange" size="xl" @click="viewSession('3', evaluation._id)">
                                            {{ format(evaluation.sessions.session_3.evalDate,'yyyy-MM-dd') }}
                                        </UButton>
                                    </div>
                            </th>
                            <th class="py-3 px-6 text-left">
                                <div>Rating Session 4</div>
                                <div class="text-orange-500" v-if="evaluation.sessions.session_4">
                                    <UButton variant="soft" color="orange" size="xl" @click="viewSession('4', evaluation._id)">
                                        {{ format(evaluation.sessions.session_4.evalDate,'yyyy-MM-dd') }}
                                    </UButton>
                                    </div>
                            </th>
                            <th class="py-3 px-6 text-left">
                                <div>Rating Session 5</div>
                                <div class="text-orange-500" v-if="evaluation.sessions.session_5">
                                   
                                    <UButton variant="soft" color="orange" size="xl" @click="viewSession('5', evaluation._id)">
                                        {{ format(evaluation.sessions.session_5.evalDate,'yyyy-MM-dd') }}
                                    </UButton>
                                        </div>
                            </th>
                            <th class="py-3 px-6 text-left">Average</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-semibold">
                        <tr v-for="(score, index) in evaluation.sessions.session_1.evalItemScores" :key="index"
                            class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6">
                                <UPopover mode="hover">
                                <span class="text-sky-600 font-semibold underline decoration-dotted">{{ score.name }}</span>
                                    <template #panel>
                                        <div class="p-4 bg-sky-100">
                                            {{ toolTitle(score.name) }}
                                        </div>
                                    </template>
                                </UPopover>
                            </td>
                            <td class="py-3 px-6 text-left">
                                <div class="flex gap-1">
                                    <span class="font-semibold">
                                        {{ evaluation.sessions.session_1.evalItemScores[index].score }}
                                    </span>
                                    <span class="mt-0.5 text-green-500" v-if="evaluation.sessions.session_1.evalItemScores[index].score  == '3'">
                                        <UIcon name="i-heroicons-check-circle" size="18" />
                                    </span>
                                </div>
                            </td>
                            <td class="py-3 px-6 text-left">
                                <span v-if="evaluation.sessions.session_2">
                                    <div class="flex gap-1">
                                    <span class="font-semibold">
                                        {{ evaluation.sessions.session_2.evalItemScores[index].score }}
                                    </span>
                                    <span class="mt-0.5 text-green-500" v-if="evaluation.sessions.session_2.evalItemScores[index].score  == '3'">
                                        <UIcon name="i-heroicons-check-circle" size="18" />
                                    </span>
                                </div>
                                </span>
                                <span v-else>
                                    -
                                </span>
                            </td>
                            <td class="py-3 px-6 text-left">
                                <span v-if="evaluation.sessions.session_3">
                                    <div class="flex gap-1">
                                    <span class="font-semibold">
                                        {{ evaluation.sessions.session_3.evalItemScores[index].score }}
                                    </span>
                                    <span class="mt-0.5 text-green-500" v-if="evaluation.sessions.session_3.evalItemScores[index].score  == '3'">
                                        <UIcon name="i-heroicons-check-circle" size="18" />
                                    </span>
                                </div>
                                </span>
                                <span v-else>
                                    -
                                </span>
                            </td>
                            <td class="py-3 px-6 text-left">
                                <span v-if="evaluation.sessions.session_4">
                                    <div class="flex gap-1">
                                    <span class="font-semibold">
                                        {{ evaluation.sessions.session_4.evalItemScores[index].score }}
                                    </span>
                                    <span class="mt-0.5 text-green-500" v-if="evaluation.sessions.session_4.evalItemScores[index].score  == '3'">
                                        <UIcon name="i-heroicons-check-circle" size="18" />
                                    </span>
                                </div>
                                </span>
                                <span v-else>
                                    -
                                </span>
                            </td>
                            <td class="py-3 px-6 text-left">
                                <span v-if="evaluation.sessions.session_5">
                                    <div class="flex gap-1">
                                    <span class="font-semibold">
                                        {{ evaluation.sessions.session_5.evalItemScores[index].score }}
                                    </span>
                                    <span class="mt-0.5 text-green-500" v-if="evaluation.sessions.session_5.evalItemScores[index].score  == '3'">
                                        <UIcon name="i-heroicons-check-circle" size="18" />
                                    </span>
                                </div>
                                </span>
                                <span v-else>
                                    -
                                </span>
                            </td>
                            <td class="py-3 px-6 text-left">
                                <span
                                    v-if="evaluation.sessions.session_1 && !evaluation.sessions.session_2 && !evaluation.sessions.session_3 && !evaluation.sessions.session_4 && !evaluation.sessions.session_5">
                                    {{
                                        average1Score(parseInt(evaluation.sessions.session_1.evalItemScores[index].score))
                                    }}
                                </span>
                                <span
                                    v-else-if="evaluation.sessions.session_1 && evaluation.sessions.session_2 && !evaluation.sessions.session_3 && !evaluation.sessions.session_4 && !evaluation.sessions.session_5">
                                    {{
                                        average2Score(parseInt(evaluation.sessions.session_1.evalItemScores[index].score),
                                            parseInt(evaluation.sessions.session_2.evalItemScores[index].score)) }}
                                </span>
                                <span
                                    v-else-if="evaluation.sessions.session_1 && evaluation.sessions.session_2 && evaluation.sessions.session_3 && !evaluation.sessions.session_4 && !evaluation.sessions.session_5">
                                    {{ average3Score(
                                        parseInt(evaluation.sessions.session_1.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_2.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_3.evalItemScores[index].score) ) }}
                                </span>
                                <span
                                    v-else-if="evaluation.sessions.session_1 && evaluation.sessions.session_2 && evaluation.sessions.session_3 && evaluation.sessions.session_4 && !evaluation.sessions.session_5">
                                    {{ average4Score(
                                        parseInt(evaluation.sessions.session_1.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_2.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_3.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_4.evalItemScores[index].score)
                                    ) }}
                                </span>
                                <span v-else>
                                    {{ averageScore(
                                        parseInt(evaluation.sessions.session_1.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_2.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_3.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_4.evalItemScores[index].score),
                                        parseInt(evaluation.sessions.session_5.evalItemScores[index].score)
                                    )
                                    }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </SharedTwCardWithHeader>
</template>