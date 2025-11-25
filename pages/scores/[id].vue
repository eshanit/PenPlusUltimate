<script setup lang="ts">
import Routes from '@/constants/Routes';

const route = useRoute()
const id: any = route.params.id

const user = useUserDetails;

const useEvalData = useEvalDataStore()

const evaluation = await useEvalData.fetchUserEval(id)

const evalData = useEvaluation()

const evalItems = (toolItem: string, index: number) => {
    const tools = evalData.find((e) => e.evaluationItems[index].number === toolItem)

    return tools?.evaluationItems[index].title
}


</script>
<template>
    <SharedBorderedNavBar>
        <template #lead>
            <NuxtLink :to="Routes.COMPLETED_EVALUATIONS.path">
                <div class="pr-5 text-blue-500 cursor-pointer">
                    <UIcon name="i-heroicons-arrow-small-left" />
                </div>
            </NuxtLink>
            <div>
                <span class=" text-gray-400"><strong>Evaluation Report</strong></span> | <span class=" text-sky-700">
                    -</span>
            </div>
        </template>
    </SharedBorderedNavBar>
    <UContainer>
        <!-- <pre>
            {{ evaluation }}
        </pre> -->
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
                        {{ evaluation.scores.mentee.firstname }} {{ evaluation.scores.mentee.lastname }}
                    </div>
                </div>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Gender:</strong>
                    </div>
                    <div>
                        {{ evaluation.scores.mentee.gender }}
                    </div>
                </div>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Facility:</strong>
                    </div>
                    <div>
                        {{ evaluation.scores.mentee.facility }}
                    </div>
                </div>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Profession:</strong>
                    </div>
                    <div>
                        {{ evaluation.scores.mentee.profession }}
                    </div>
                </div>
            </template>
        </SharedTwCardWithHeader>
        <UDivider class="py-5" />
        <SharedTwCardWithHeader>
            <template #header>
                Scores: (<span class="text-orange-500">{{ evaluation.scores.tool.label }}</span> tool)
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
                            <tr v-for="(score, index) in evaluation.scores.evalItemScores" :key="index"
                                class="border-b border-gray-200 hover:bg-gray-100">
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

        <div v-if="evaluation.scores.tool.name === 'cardiac'">
            <UDivider class="py-5" />
            <SharedTwCardWithHeader>
                <template #header>
                    <span class=" font-bold text-orange-500">Patient Information</span>
                </template>
                <template #body>
                    <div class=" flex justify-between pb-2.5">
                        <div>
                            Case Number
                        </div>
                        <div class=" ">
                            {{ evaluation.cardiacEvaluation.patientInfo.caseNumber }}
                        </div>
                    </div>
                    <div class=" flex justify-between py-2.5">
                        <div>
                            Full Name
                        </div>
                        <div class=" ">
                            {{ evaluation.cardiacEvaluation.patientInfo.patientFullName }}
                        </div>
                    </div>
                    <div class=" flex justify-between py-2.5">
                        <div>
                            Gender
                        </div>
                        <div class=" ">
                            {{ evaluation.cardiacEvaluation.patientInfo.gender }}
                        </div>
                    </div>
                    <div class=" flex justify-between py-2.5">
                        <div>
                            Age
                        </div>
                        <div class=" ">
                            {{ evaluation.cardiacEvaluation.patientInfo.age }}
                        </div>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />
            <SharedTwCardWithHeader>
                <template #header>
                    <span class=" font-bold text-orange-500">Echo Indication</span>
                </template>
                <template #body>
                    <div class="py-1"
                        v-for="(indication, index) in evaluation.cardiacEvaluation.echoIndication.echoIndication"
                        :key="index">
                        <span class=" py-0.5 text-green-500">
                            <UIcon name="i-heroicons-check-circle" />
                        </span> <span>{{ indication }}</span>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />
            <SharedTwCardWithHeader>
                <template #header>
                    <span class=" font-bold text-orange-500">Exam, CXR, Lab</span>
                </template>
                <template #body>
                    <div class=" flex justify-between pb-2.5">
                        <div>
                            Case Number
                        </div>
                        <div class=" ">
                            <span>{{ evaluation.cardiacEvaluation.exams.bpSystolic }} </span> <span>
                                <UIcon name="i-heroicons-slash" />
                            </span><span>{{ evaluation.cardiacEvaluation.exams.bpDiastolic }} </span> <span>mmHg</span>
                        </div>
                    </div>

                    <UDivider class="py-5" />

                    <div class="py-1" v-for="(exam, index) in evaluation.cardiacEvaluation.exams.cxrLab" :key="index">
                        <span class=" py-0.5 text-green-500">
                            <UIcon name="i-heroicons-check-circle" />
                        </span> <span>{{ exam }}</span>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />
            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Echo Findings</span>
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
                            <tbody class="text-gray-600 ">
                                <tr v-for="(finding, index) in Object.keys(evaluation.cardiacEvaluation.echoFindings)"
                                    :key="index" class="border-t border-gray-200 hover:bg-gray-100">
                                    <td class="py-3 px-6">{{ finding }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.cardiacEvaluation.echoFindings[finding].checked }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.cardiacEvaluation.echoFindings[finding]?.rating}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />
            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Primary Cardiac Diagnosis</span>
                </template>
                <template #body>
                    <div class="py-1"
                        v-for="(diagnosis, index) in evaluation.cardiacEvaluation.primaryDiagnosis.cardiacDiagnosis"
                        :key="index">
                        <span class=" py-0.5 text-green-500">
                            <UIcon name="i-heroicons-check-circle" />
                        </span> <span>{{ diagnosis }}</span>
                    </div>
                </template>
            </SharedTwCardWithHeader>
            <UDivider class="py-5" />
            <SharedTwCardWithHeader>
                <template #header>
                    <span class="font-bold text-orange-500">Image Quality</span>
                </template>
                <template #body>
                    <!-- <div>
                        {{ imageQuality }}
                    </div> -->
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
                            <tbody class="text-gray-600 ">
                                <tr v-for="(type, index) in Object.keys(evaluation.cardiacEvaluation.imageQuality)"
                                    :key="index" class="border-t border-gray-200 hover:bg-gray-100">
                                    <td class="py-3 px-6  uppercase">{{ type }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.cardiacEvaluation.imageQuality[type].axis }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.cardiacEvaluation.imageQuality[type].depth }}</td>
                                    <td class="py-3 px-6 text-left">{{
                                        evaluation.cardiacEvaluation.imageQuality[type].gain }}</td>
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