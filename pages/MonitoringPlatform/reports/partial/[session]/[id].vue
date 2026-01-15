<script setup lang="ts">
import { format } from 'date-fns'
import Routes from "@/constants/Routes"
import capitalizeFirstLetter from '@/utilities/capitalizeFirstLetter'

const route = useRoute()
const evalId: any = route.params.id
const sessionIndex: any = route.params.session

const useEvaluationStore = useEvalDataStore()

const evaluation = await useEvaluationStore.fetchUserEval(evalId)

const tool = evaluation.tool

const evalData = useEvaluation()

const evalItems = (toolItem: string, index: number) => {
    const tools = evalData.find((e) => e.tool === tool)
    console.log(tools)
    return tools?.evaluationItems[index]?.title
}

const router = useRouter();

const goBack = () => {
    router.back();
};

</script>
<template>
    <UContainer>
        <SharedBorderedNavBar>
            <template #lead>
                <!-- <NuxtLink :to="Routes.EVALUATIONS.path"> -->
                <div class="pr-5 text-blue-500 cursor-pointer" @click="goBack">
                    <UIcon name="i-heroicons-arrow-small-left" />
                </div>
                <!-- </NuxtLink> -->
                <div>
                    <span class=" text-gray-400"><strong>Evaluation Report</strong></span> | <span
                        class=" text-orange-500">
                        {{ evaluation.evaluationID }}</span> | <span class=" text-green-500">
                        Session {{ sessionIndex }}</span>
                </div>
            </template>
        </SharedBorderedNavBar>
        <SharedTwCardWithHeader>
            <template #header>
                Evaluator Details
            </template>
            <template #body>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Full Name:</strong>
                    </div>
                    <div>
                        {{ evaluation.evaluator.firstname }} {{ evaluation.evaluator.lastname }}
                    </div>
                </div>
            </template>
        </SharedTwCardWithHeader>
        <UDivider class="py-5" />
        <SharedTwCardWithHeader>
            <template #header>
                Mentee Details
            </template>
            <template #body>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Full Name:</strong>
                    </div>
                    <div>
                        {{ evaluation.mentee.firstname }} {{ evaluation.mentee.lastname }}
                    </div>
                </div>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Gender:</strong>
                    </div>
                    <div>
                        {{ evaluation.mentee.gender }}
                    </div>
                </div>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Facility:</strong>
                    </div>
                    <div>
                        {{ evaluation.mentee.facility }}
                    </div>
                </div>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Profession:</strong>
                    </div>
                    <div>
                        {{ evaluation.mentee.profession }}
                    </div>
                </div>
            </template>
        </SharedTwCardWithHeader>
        <UDivider class="py-5" />
        <div v-if="evaluation.tool === 'echo'">
            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Patient Information</span> |
                    <span class="text-sky-600 font-semibold"> Session {{ sessionIndex }}</span> | <span
                        class="text-green-500 font-bold">{{
                            format(evaluation.sessions[`session_${sessionIndex}`].evalDate,
                                'yyyy-MM-dd') }}</span>
                </template>
                <template #body>
                    <div class="flex justify-between pb-2.5">
                        <div>Case Number</div>
                        <div>{{
                            evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.caseNumber }}
                        </div>
                    </div>
                    <div class="flex justify-between py-2.5">
                        <div>Full Name</div>
                        <div>{{
                            evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.patientFullName
                        }}</div>
                    </div>
                    <div class="flex justify-between py-2.5">
                        <div>Gender</div>
                        <div>{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.gender }}
                        </div>
                    </div>
                    <div class="flex justify-between py-2.5">
                        <div>Age</div>
                        <div>{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.patientInfo.age }}
                        </div>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />

            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Echo Indication</span> |
                    <span class="text-sky-600 font-semibold"> Session {{ sessionIndex }}</span> | <span
                        class="text-green-500 font-bold">{{
                            format(evaluation.sessions[`session_${sessionIndex}`].evalDate,
                                'yyyy-MM-dd') }}</span>
                </template>
                <template #body>
                    <div class="py-1"
                        v-for="(indication, index) in evaluation.sessions[`session_${sessionIndex}`].cardiacEval.echoIndication.echoIndication"
                        :key="index">
                        <span class="py-0.5 text-green-500">
                            <UIcon name="i-heroicons-check-circle" />
                        </span> <span>{{ indication }}</span>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />

            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Exam, CXR, Lab</span> |
                    <span class="text-sky-600 font-semibold"> Session {{ sessionIndex }}</span> | <span
                        class="text-green-500 font-bold">{{
                            format(evaluation.sessions[`session_${sessionIndex}`].evalDate,
                                'yyyy-MM-dd') }}</span>
                </template>
                <template #body>
                    <div class="flex justify-between pb-2.5">
                        <div>BP</div>
                        <div>
                            <span>{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.exam.bpSystolic
                            }} </span>
                            <span>
                                <UIcon name="i-heroicons-slash" />
                            </span>
                            <span>{{ evaluation.sessions[`session_${sessionIndex}`].cardiacEval.exam.bpDiastolic
                            }} </span>
                            <span>mmHg</span>
                        </div>
                    </div>

                    <UDivider class="py-5" />

                    <div class="py-1"
                        v-for="(exam, index) in evaluation.sessions[`session_${sessionIndex}`].cardiacEval.exam.cxrLab"
                        :key="index">
                        <span class="py-0.5 text-green-500">
                            <UIcon name="i-heroicons-check-circle" />
                        </span> <span>{{ exam }}</span>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />

            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Echo Findings</span> |
                    <span class="text-sky-600 font-semibold"> Session {{ sessionIndex }}</span> | <span
                        class="text-green-500 font-bold">{{
                            format(evaluation.sessions[`session_${sessionIndex}`].evalDate,
                                'yyyy-MM-dd') }}</span>
                </template>
                <template #body>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr class="bg-gray-200 text-gray-600 uppercase leading-normal">
                                    <th class="py-3 px-6 text-left">List</th>
                                    <th class="py-3 px-6 text-left">Found</th>
                                    <th class="py-3 px-6 text-left">Rating (If yes)</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-600">
                                <tr v-for="(finding, index) in Object.keys(evaluation.sessions[`session_${sessionIndex}`].cardiacEval.echoFindings)"
                                    :key="index" class="border-t border-gray-200 hover:bg-gray-100">
                                    <td class="py-3 px-6">{{ finding }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.sessions[`session_${sessionIndex}`].cardiacEval.echoFindings[finding].checked
                                    }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.sessions[`session_${sessionIndex}`].cardiacEval.echoFindings[finding]?.rating
                                        }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />

            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Primary Cardiac Diagnosis</span> |
                    <span class="text-sky-600 font-semibold"> Session {{ sessionIndex }}</span> | <span
                        class="text-green-500 font-bold">{{
                            format(evaluation.sessions[`session_${sessionIndex}`].evalDate,
                                'yyyy-MM-dd') }}</span>
                </template>
                <template #body>
                    <div class="py-1"
                        v-for="(diagnosis, index) in evaluation.sessions[`session_${sessionIndex}`].cardiacEval.primaryDiagnosis.cardiacDiagnosis"
                        :key="index">
                        <span class="py-0.5 text-green-500">
                            <UIcon name="i-heroicons-check-circle" />
                        </span> <span>{{ diagnosis }}</span>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />

            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Image Quality</span> |
                    <span class="text-sky-600 font-semibold"> Session {{ sessionIndex }}</span> | <span
                        class="text-green-500 font-bold">{{
                            format(evaluation.sessions[`session_${sessionIndex}`].evalDate,
                                'yyyy-MM-dd') }}</span>
                </template>
                <template #body>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr class="bg-gray-200 text-gray-600 uppercase leading-normal">
                                    <th class="py-3 px-6 text-left">Image Type</th>
                                    <th class="py-3 px-6 text-left">Axis</th>
                                    <th class="py-3 px-6 text-left">Depth</th>
                                    <th class="py-3 px-6 text-left">Gain</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-600">
                                <tr v-for="(type, index) in Object.keys(evaluation.sessions[`session_${sessionIndex}`].cardiacEval.imageQuality)"
                                    :key="index" class="border-t border-gray-200 hover:bg-gray-100">
                                    <td class="py-3 px-6 uppercase">{{ type }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.sessions[`session_${sessionIndex}`].cardiacEval.imageQuality[type].axis
                                    }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.sessions[`session_${sessionIndex}`].cardiacEval.imageQuality[type].depth
                                    }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.sessions[`session_${sessionIndex}`].cardiacEval.imageQuality[type].gain
                                    }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </SharedTwCardWithHeader>
        </div>
        <div v-else>
            <SharedTwCardWithHeader>
                <template #header>
                    <div class="flex justify-between">
                        <div>
                            Scores: (<span class="text-orange-500">{{ capitalizeFirstLetter(tool) }}</span> tool) | <span
                                class=" text-green-500">{{
                                    format(evaluation.sessions[`session_${sessionIndex}`].evalDate,
                                'yyyy-MM-dd') }}</span>
                        </div>
                        <div>
                            Mean Score: 
                                <span class="font-bold text-rose-500" v-if="parseFloat(useScoreStatistics(evaluation.sessions[`session_${sessionIndex}`].evalItemScores).mean) <= 1.5">
                                     {{ useScoreStatistics(evaluation.sessions[`session_${sessionIndex}`].evalItemScores).mean }}
                                </span>
                                <span class="font-bold text-yellow-400" v-else-if="parseFloat(useScoreStatistics(evaluation.sessions[`session_${sessionIndex}`].evalItemScores).mean) > 1.5 && parseFloat(useScoreStatistics(evaluation.sessions[`session_${sessionIndex}`].evalItemScores).mean) <= 2.5">
                                    {{ useScoreStatistics(evaluation.sessions[`session_${sessionIndex}`].evalItemScores).mean }}
                                </span>
                                <span class="font-bold text-sky-500" v-else>
                                    {{ useScoreStatistics(evaluation.sessions[`session_${sessionIndex}`].evalItemScores).mean }}
                                </span>
                        </div>

                    </div>
                </template>
                <template #body>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th class="py-3 px-6 text-left">Tool Item</th>
                                    <th class="py-3 px-6 text-left">Rating</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-600 text-sm font-light">
                                <tr v-for="(score, index) in evaluation.sessions[`session_${sessionIndex}`].evalItemScores"
                                    :key="index" class="border-b border-gray-200 hover:bg-gray-100">
                                    <td class="py-3 px-6">
                                        <span class="text-green-500 font-semibold">{{ score.name }}</span> : {{
                                            evalItems(score.name, index) }}
                                    </td>
                                    <td class="py-3 px-6 text-left">
                                        {{ score.score }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </SharedTwCardWithHeader>
        </div>
        <UDivider class="py-5" />
        <div class=" flex justify-end py-5">
            <NuxtLink :to="Routes.DASHBOARD.path">
                <UButton variant="outline" icon="i-heroicons-chevron-double-right" :trailing="true" color="orange"
                    size="xl">
                    Exit
                </UButton>
            </NuxtLink>
            <!-- <UButton class="ml-4" color="white" variant="outline" type="button" @click="resetForm()">
                    Reset
                </UButton> -->
        </div>
    </UContainer>
</template>