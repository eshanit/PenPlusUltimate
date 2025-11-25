<script setup lang="ts">
import Routes from "@/constants/Routes";
import { format } from "date-fns";
import DatabaseNames from "@/constants/DatabaseNames";
import LocalStorageKeys from "@/constants/LocalStorageKeys";

import type IScore from "@/interfaces/IScore";
import type IFinalEvaluation from "@/interfaces/IFinalEvaluation";

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
        label: 'View'
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

const tools = useTools

const toolName = (tool: string) => {
    return tools.find((t) => t.name === tool)?.label || 'Unknown'
}

const numMentees = props.evaluations
    .filter((el: { mentee: { _id: any; }; }) => el.mentee && el.mentee._id)  // Ensure mentee exists and has an _id
    .map((el: { mentee: { _id: any; }; }) => el.mentee._id);

const uniqueIds = Array.from(new Set(numMentees));

</script>
<template>

    <div class="flex justify-between pt-3 px-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
        <div class=" lg:w-1/3 md:w-1/2 sm:w-1/2 ">
            <UInput v-model="q" placeholder="Filter by Mentee, evaluationID and Tool..." />
        </div>
        <div class=" lg:w-1/3 md:w-1/2 sm:w-1/2 ">
            Mentees Evaluated: <span class="text-orange-500 text-lg font-bold">{{ uniqueIds.length }}</span>
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
                {{ format(row.sessions.session_1.evalDate, 'yyyy-MM-dd') }}
            </UButton>
        </template>
        <template #session2-data="{ row }">
            <div v-if="row.sessions.session_1 && !row.sessions.session_2">
                <UButton variant="soft" color="rose" size="xl" @click="startSession(row._id, row.tool, '2')">
                    Start Session
                </UButton>
            </div>
            <div v-else>
                <UButton variant="soft" color="green" size="xl" @click="viewSession('2', row._id)">
                    {{ format(row.sessions.session_2.evalDate, 'yyyy-MM-dd') }}
                </UButton>
            </div>

        </template>
        <template #session3-data="{ row }">
            <div v-if="row.sessions.session_1 && !row.sessions.session_2">
                -
            </div>
            <div v-else-if="row.sessions.session_1 && row.sessions.session_2 && !row.sessions.session_3"
                @click="startSession(row._id, row.tool, '3')">
                <UButton variant="soft" color="rose" size="xl">
                    Start Session
                </UButton>
            </div>
            <div v-else>
                <UButton variant="soft" color="green" size="xl" @click="viewSession('3', row._id)">
                    {{ format(row.sessions.session_3.evalDate, 'yyyy-MM-dd') }}
                </UButton>
            </div>

        </template>

        <template #actions-data="{ row }">
            <div v-if="row.sessions.session_3">
                <NuxtLink :to="{
                    name: Routes.FULL_EVALUATION_REPORT.name,
                    params: {
                        id: row._id
                    }
                }">
                    <UButton variant="soft" color="blue" size="xl">
                        Report | <span class=" text-rose-500">{{ row.evaluationID }}</span>
                    </UButton>
                </NuxtLink>
            </div>
            <div v-else>
                No report
            </div>
        </template>
    </UTable>
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="pageCount" :total="evaluations.length" />
    </div>
</template>