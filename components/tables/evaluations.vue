<script setup lang="ts">
import Routes from "@/constants/Routes";
import { format } from "date-fns";
import DatabaseNames from "@/constants/DatabaseNames";
import LocalStorageKeys from "@/constants/LocalStorageKeys";

import type IScore from "@/interfaces/IScore";

const useEvalData = useEvalDataStore()

const evaluations = await useEvalData.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS)


const sortedEvals = evaluations.sort((a: IScore, b: IScore) => {
    const maxDateA = Object.values(a.sessions)
        .filter(session => session != null)
        .reduce((max, session) => Math.max(max, session?.evalDate || 0), 0);

    const maxDateB = Object.values(b.sessions)
        .filter(session => session != null)
        .reduce((max, session) => Math.max(max, session?.evalDate || 0), 0);

    return maxDateB - maxDateA;
})

const columns = [
    {
        key: "mentee",
        label: "Mentee",
    },
    {
        key: "tool",
        label: "Tool",
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
        key: "session4",
        label: "Session 4",
    },
    {
        key: "session5",
        label: "Session 5",
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
    return sortedEvals.filter((evaluation: IScore) => {
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

    localStorage.removeItem(LocalStorageKeys.SCORES)

    const process = await useProcessSession(scoreId, session)

    if (process !== false) {
        if (tool === 'echo') {
            navigateTo('/MonitoringPlatform/evaluation/' + tool + '/echo')
        } else {
            navigateTo('/MonitoringPlatform/evaluation/' + tool)
        }

    }

}

const viewSession = (session: string, scoreId: string) => {
    navigateTo('/reports/partial/' + session + '/' + scoreId)
}

</script>
<template>
     <div class="flex justify-between pt-3 px-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
            <UButton variant="outline" label="Start New Evaluation" color="sky" size="xl" @click="nextStep()" />
    </div>
    <div class="flex justify-between pt-3 px-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
        <div class=" lg:w-1/3 md:w-1/2 sm:w-1/2 ">
            <UInput v-model="q" placeholder="Filter by Mentee, evaluationID and Tool..." />
        </div>
    </div>

    <UTable :columns="columns" :rows="rows">
        <template #mentee-data="{ row }">
            {{ row.mentee.firstname }} {{ row.mentee.lastname }}
        </template>
        <template #tool-data="{ row }">
            <span class="font-bold uppercase ">{{ row.tool }}</span>
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
            <div v-else-if="row.sessions.session_1 && row.sessions.session_2 ">
                <UButton variant="soft" color="green" size="xl" @click="viewSession('2', row._id)">
                    {{ format(row.sessions.session_2.evalDate, 'yyyy-MM-dd') }}
                </UButton>
            </div>
            <div v-else>
                -
            </div>
        </template>
        <template #session3-data="{ row }">
            <div v-if="row.sessions.session_2 && !row.sessions.session_3">
                <UButton variant="soft" color="rose" size="xl" @click="startSession(row._id, row.tool, '3')">
                    Start Session
                </UButton>
            </div>
            <div v-else-if="row.sessions.session_1 && row.sessions.session_2 && row.sessions.session_3">
                <UButton variant="soft" color="green" size="xl" @click="viewSession('3', row._id)">
                    {{ format(row.sessions.session_3.evalDate, 'yyyy-MM-dd') }}
                </UButton>
            </div>
            <div v-else>
                -
            </div>
        </template>
        <template #session4-data="{ row }">
            <div v-if="row.sessions.session_3 && !row.sessions.session_4">
                <UButton variant="soft" color="rose" size="xl" @click="startSession(row._id, row.tool, '4')">
                    Start Session
                </UButton>
            </div>
            <div v-else-if="row.sessions.session_4">
                <UButton variant="soft" color="green" size="xl" @click="viewSession('4', row._id)">
                    {{ format(row.sessions.session_4.evalDate, 'yyyy-MM-dd') }}
                </UButton>
            </div>
            <div v-else>
                -
            </div>
        </template>

        <template #session5-data="{ row }">
            <div v-if="row.sessions.session_1 && row.sessions.session_2 && row.sessions.session_3 && row.sessions.session_4 && !row.sessions.session_5"
                @click="startSession(row._id, row.tool, '5')">
                <UButton variant="soft" color="rose" size="xl">
                    Start Session
                </UButton>
            </div>
            <div v-else-if="row.sessions.session_5">
                <UButton variant="soft" color="green" size="xl" @click="viewSession('5', row._id)">
                    {{ format(row.sessions.session_5.evalDate, 'yyyy-MM-dd') }}
                </UButton>
            </div>
            <div v-else>
                -
            </div>
        </template>

        <template #actions-data="{ row }">
            <div v-if="row.sessions.session_5">
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