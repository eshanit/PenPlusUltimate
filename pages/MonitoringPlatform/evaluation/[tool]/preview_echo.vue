<script setup lang="ts">
import Routes from "@/constants/Routes";
import { format } from 'date-fns'
import LocalStorageKeys from "@/constants/LocalStorageKeys";



const route = useRoute()
const tool = route.params.tool

const showSummary: Ref<Boolean> = ref(false)

// const selectedTool: Ref<any> = ref()
// selectedTool.value = useProcessLocalStorage().retrieve(LocalStorageKeys.TOOL)

const now = new Date(Date.now());
const formattedDate = format(now, 'MMMM dd, yyyy'); // Example format



const menteeData: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATED_MENTEE)

const evalSession: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATION_SESSION)


const useEvaluationStore = useEvalDataStore()

const submitScores = async () => {

    if (evalSession == '1') {
        await useEvaluationStore.storeScores(tool)
    } else {
        await useEvaluationStore.createSessionEval()
    }

}


const patientInfo: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_PATIENT_INFORMATION)
const echoIndication: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_ECHO_INDICATION)
const exams: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_EXAM_CXR_LAB)
const echoFindings: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_ECHO_FINDINGS)
const primaryDiagnosis: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_PRIMARY_DIAGNOSIS)
const imageQuality: any = useProcessLocalStorage().retrieve(LocalStorageKeys.CARDIAC_IMAGE_QUALITY)

const router = useRouter();

const goBack = () => {
  router.back();
};

</script>
<template>
    <!-- <pre>
        {{ useScoreCount(scoreMarks.evalItemScores) }}
    </pre> -->
    <SharedBorderedNavBar>
        <template #lead>
            <div v-show="!showSummary">
                <!-- <NuxtLink :to="Routes.PREVIEW.path"> -->
                    <div class="pr-5 text-blue-500 cursor-pointer" @click="goBack">
                        <UIcon name="i-heroicons-arrow-small-left" />
                    </div>
                <!-- </NuxtLink> -->
            </div>
            <div v-show="showSummary">
                <div class="pr-5 text-blue-500 cursor-pointer" @click="showSummary = false">
                    <UIcon name="i-heroicons-arrow-small-left" />
                </div>
            </div>

            <div>
                <span class=" text-gray-400"><strong>Evaluating</strong></span> | <span class=" text-sky-700"> {{
                    tool }}</span>
            </div>
        </template>
    </SharedBorderedNavBar>
    <UContainer>
        <!-- <pre>
        {{ scoreMarks }}
    </pre> -->


        <div class="py-5">
            <div class="py-2.5 font-bold text-orange-500">
                Score Preview
            </div>
            <SharedTwCardWithHeader>
                <template #header>
                    Mentee Information
                </template>
                <template #body>
                    <div class="flex gap-4 py-2.5">
                        <div class=" text-sky-600">
                            <strong>Mentee Name:</strong>
                        </div>
                        <div>
                            {{ menteeData.firstname }} {{ menteeData.lastname }}
                        </div>
                    </div>
                    <div class="flex gap-4 py-2.5">
                        <div class=" text-sky-600">
                            <strong>Session:</strong>
                        </div>
                        <div>
                            {{ evalSession }}
                        </div>
                    </div>
                    <div class="flex gap-4 py-2.5">
                        <div class=" text-sky-600">
                            <strong>Date:</strong>
                        </div>
                        <div>
                            {{ formattedDate }}
                        </div>
                    </div>
                </template>
            </SharedTwCardWithHeader>
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
                            {{ patientInfo.caseNumber }}
                        </div>
                    </div>
                    <div class=" flex justify-between py-2.5">
                        <div>
                            Full Name
                        </div>
                        <div class=" ">
                            {{ patientInfo.patientFullName }}
                        </div>
                    </div>
                    <div class=" flex justify-between py-2.5">
                        <div>
                            Gender
                        </div>
                        <div class=" ">
                            {{ patientInfo.gender }}
                        </div>
                    </div>
                    <div class=" flex justify-between py-2.5">
                        <div>
                            Age
                        </div>
                        <div class=" ">
                            {{ patientInfo.age }}
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
                    <div class="py-1" v-for="(indication, index) in echoIndication.echoIndication" :key="index">
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
                            <span>{{ exams.bpSystolic }} </span> <span>
                                <UIcon name="i-heroicons-slash" />
                            </span><span>{{ exams.bpDiastolic }} </span> <span>mmHg</span>
                        </div>
                    </div>

                    <UDivider class="py-5" />

                    <div class="py-1" v-for="(exam, index) in exams.cxrLab" :key="index">
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
                                <tr v-for="(finding, index) in Object.keys(echoFindings)" :key="index"
                                    class="border-t border-gray-200 hover:bg-gray-100">
                                    <td class="py-3 px-6">{{ finding }}</td>
                                    <td class="py-3 px-6 text-left">{{ echoFindings[finding].checked }}</td>
                                    <td class="py-3 px-6 text-left">{{ echoFindings[finding]?.rating }}</td>
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
                    <div class="py-1" v-for="(diagnosis, index) in primaryDiagnosis.cardiacDiagnosis" :key="index">
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
                                <tr v-for="(type, index) in Object.keys(imageQuality)" :key="index"
                                    class="border-t border-gray-200 hover:bg-gray-100">
                                    <td class="py-3 px-6  uppercase">{{ type }}</td>
                                    <td class="py-3 px-6 text-left">{{ imageQuality[type].axis }}</td>
                                    <td class="py-3 px-6 text-left">{{ imageQuality[type].depth }}</td>
                                    <td class="py-3 px-6 text-left">{{ imageQuality[type].gain }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </SharedTwCardWithHeader>

        </div>


        <UDivider class="py-5" />
        <div class=" flex justify-end py-5">
            <div class=" flex gap-1">
                <NuxtLink :to="{
                    name: Routes.EVALUATION_TOOL.name,
                    params: {
                        tool: tool,
                    }
                }">
                    <UButton icon="i-heroicons-chevron-double-left" variant="outline" color="orange" size="xl">Back
                    </UButton>
                </NuxtLink>

                <UButton color="green" size="xl" @click="submitScores()"> Submit Scores </UButton>

            </div>
        </div>

    </UContainer>
</template>