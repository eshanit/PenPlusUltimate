<script setup lang="ts">
import Routes from "@/constants/Routes";
import { format } from "date-fns";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import sumArray from "@/utilities/sumArray";
import type IScore from "@/interfaces/IScore";
import type IEvalScore from "@/interfaces/IEvalScore";

//const useEvalData = useEvalDataStore()

//const evaluations = await useEvalData.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS)

const props = defineProps<{
    evaluations: Array<IScore>
}>()

const columns = [
    {
        key: "evaluator",
        label: "Mentor",
    },
    {
        key: "mentee",
        label: "Mentee",
    },
    {
        key: "session1",
        label: "Session 1",
    },
    {
        key: "session2",
        label: "Session 2",
    },
    {
        key: "session3",
        label: "Session 3",
    },
    {
        key: 'actions',
        label: 'Mean Score'
    }
]

const q = ref('')
const page = ref(1)
const pageCount = 10

const rows = computed(() => {
    return props.evaluations.filter((evaluation: IScore) => {
        return (
            Object.values(evaluation).some((value) => {
                return String(value).toLowerCase().includes(q.value.toLowerCase());
            }) ||
            (evaluation.mentee.firstname.toLowerCase().includes(q.value.toLowerCase()) ||
                evaluation.mentee.lastname.toLowerCase().includes(q.value.toLowerCase()) ||
                evaluation.evaluationID.toLowerCase().includes(q.value.toLowerCase()) ||
                evaluation.tool.includes(q.value.toLowerCase()))
        );
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount);
});


const nextStep = () => {
    localStorage.setItem(LocalStorageKeys.EVALUATION_SESSION, '1')
    navigateTo(Routes.START_EVALUATION.path)
}

//

const startSession = async (scoreId: string, tool: string, session: string) => {

    const process = await useProcessSession(scoreId, session)

    if (process !== false) {
        if (tool === 'echo') {
            navigateTo('/evaluation/' + tool + '/echo')
        } else {
            navigateTo('/evaluation/' + tool)
        }

    }

}

const viewSession = (session: string, scoreId: string) => {
    navigateTo('/reports/partial/' + session + '/' + scoreId)
}

// const useSessionMeanScore = (arrScore: IEvalScore[]) => {
//     const avgScore = sumArray(arrScore, 'score') / arrScore.length

//     return avgScore.toFixed(2)
// }

//
const tools = useTools

const toolName = (tool: string) => {
    return tools.find((t) => t.name === tool)?.label || 'Unknown'
}

const numMentees = props.evaluations
    .filter((el: { mentee: { _id: any; }; }) => el.mentee && el.mentee._id)  // Ensure mentee exists and has an _id
    .map((el: { mentee: { _id: any; }; }) => el.mentee._id);

const uniqueIds = Array.from((numMentees));

</script>
<template>

    <div class="flex justify-between pt-3 px-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
        <div class=" lg:w-1/3 md:w-1/2 sm:w-1/2 ">
            <UInput v-model="q" placeholder="Filter by Mentee, evaluationID and Tool..." />
        </div>
        <div class=" lg:w-1/3 md:w-1/2 sm:w-1/2 ">
            Mentees Evaluated: <span class="font-bold text-lg text-orange-500">{{ uniqueIds.length }}</span>
        </div>
    </div>
    <UTable :columns="columns" :rows="rows">
        <template #mentee-data="{ row }">
            <div>{{ row.mentee.firstname }} {{ row.mentee.lastname }}</div>
            <div class="text-red-500 text-xs font-thin italic"> {{ row.mentee.facility }}</div>
        </template>
        <template #evaluator-data="{ row }">
            <div class="font-bold">{{ row.evaluator.firstname }} {{ row.evaluator.lastname }}</div>
            <div class="text-sky-500 text-xs font-thin italic"> {{ toolName(row.tool) }}</div>
        </template>
        <template #session1-data="{ row }">
            <UButton variant="soft" color="green" size="xl" @click="viewSession('1', row._id)">
                <span v-if="row.tool == 'echo'">
                    -.--
                </span>
                <span v-else>
                    {{ useSessionMeanScore(row.sessions.session_1.evalItemScores) }}
                </span>
            </UButton>
        </template>
        <template #session2-data="{ row }">
            <div v-if="row.sessions.session_1 && !row.sessions.session_2">
                -
            </div>
            <div v-else>
                <UButton variant="soft" color="green" size="xl" @click="viewSession('2', row._id)">
                    <span v-if="row.tool == 'echo'">
                        -.--
                    </span>
                    <span v-else>
                        {{ useSessionMeanScore(row.sessions.session_2.evalItemScores) }}
                    </span>
                </UButton>
            </div>

        </template>
        <template #session3-data="{ row }">
            <div v-if="row.sessions.session_1 && !row.sessions.session_2">
                -
            </div>
            <div v-else-if="row.sessions.session_1 && row.sessions.session_2 && !row.sessions.session_3">
                -
            </div>
            <div v-else>
                <UButton variant="soft" color="green" size="xl" @click="viewSession('3', row._id)">
                    <span v-if="row.tool == 'echo'">
                        -.--
                    </span>
                    <span v-else>
                        {{ useSessionMeanScore(row.sessions.session_3.evalItemScores) }}
                    </span>
                </UButton>
            </div>

        </template>

        <template #actions-data="{ row }">
            <span v-if="row.tool == 'echo'">
                <UButton variant="outline" color="orange" size="xl">
                    -.--
                </UButton>
            </span>
            <span v-else>
                <NuxtLink :to="{
                    name: Routes.FULL_EVALUATION_REPORT.name,
                    params: {
                        id: row._id
                    }
                }">
                    <div v-if="row.sessions.session_1 && !row.sessions.session_2">
                        <UButton variant="outline" color="orange" size="xl">
                            {{ parseFloat(useSessionMeanScore(row.sessions.session_1.evalItemScores)) }}
                        </UButton>
                    </div>
                    <div v-else-if="row.sessions.session_1 && row.sessions.session_2 && !row.sessions.session_3">
                        <UButton variant="outline" color="orange" size="xl">
                            {{ ((parseFloat(useSessionMeanScore(row.sessions.session_1.evalItemScores)) +
                                parseFloat(useSessionMeanScore(row.sessions.session_2.evalItemScores))) / 2).toFixed(2) }}
                        </UButton>
                    </div>
                    <div v-else>
                        <UButton variant="outline" color="orange" size="xl">
                            {{ ((parseFloat(useSessionMeanScore(row.sessions.session_1.evalItemScores)) +
                                parseFloat(useSessionMeanScore(row.sessions.session_2.evalItemScores)) +
                                parseFloat(useSessionMeanScore(row.sessions.session_3.evalItemScores))) / 3).toFixed(2) }}
                        </UButton>
                    </div>
                </NuxtLink>
            </span>
        </template>
    </UTable>
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="pageCount" :total="evaluations.length" />
    </div>
</template>