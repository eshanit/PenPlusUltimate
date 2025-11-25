<script setup lang="ts">
import { format } from 'date-fns'
import { useEvaluation } from '@/composables/useEvaluation'
import type IFinalEvaluation from '~/interfaces/IFinalEvaluation'
import type IEvalScore from '~/interfaces/IEvalScore'

const props = defineProps<{
    tool: string,
    score: string,
    sessionIndex: number,
    evaluation: IFinalEvaluation
}>()

const evalData = useEvaluation()

const evalItems = (toolItem: string) => {
    const tools = evalData.find((e) => e.tool === props.tool)
    const item = tools?.evaluationItems.find((ei) => ei.slug === toolItem)
    return item?.title
}

const evaluationScore = computed(() => {

    let scores: IEvalScore[] = []

    if(props.score === 'all') {
        scores = (props.evaluation.sessions as any)[`session_${props.sessionIndex}`]?.evalItemScores ?? []
    } else {
       scores =  (props.evaluation.sessions as any)[`session_${props.sessionIndex}`]?.evalItemScores?.filter((e: IEvalScore) => e.score === props.score) ?? []
    }

    return scores

})



</script>
<template>
            <UCard>
            <template #header>
                <div>
                    <div class="" v-if="score === 'all'">
                        All Scores
                    </div>
                    <div v-else>
                        Score of <span class="text-orange-500 font-semibold italic" >{{ props.score }}</span>
                    </div>
                </div>
                
            </template>
            <!-- <template #body> -->
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left">Tool Item</th>
                            <th class="py-3 px-6 text-left">Score</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-light">
                        <tr v-for="(score, index) in evaluationScore"
                            :key="index" class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6">
                                <span class="text-green-500 font-semibold">{{ score.name }}</span> : {{
                                    evalItems(score.name) }}
                            </td>
                            <td class="py-3 px-6 text-left">
                                <div class="flex gap-1">
                                    <span class="font-semibold">
                                        {{ score.score }}
                                    </span>
                                    <span class="mt-0.5 text-green-500" v-if="score.score === '3'">
                                        <UIcon name="i-heroicons-check-circle" size="18" />
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- </template> -->
        </UCard>
</template>