<script setup lang="ts">
import { format } from 'date-fns'
import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";



const route = useRoute()
const tool = route.params.tool

const showTool: Ref<Boolean> = ref(false)
// const selectedTool: Ref<any> = ref()
// selectedTool.value = useProcessLocalStorage().retrieve(LocalStorageKeys.TOOL)
const evalSession: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATION_SESSION)


const menteeData: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATED_MENTEE)

const now = new Date(Date.now());
const formattedDate = format(now, 'MMMM dd, yyyy HH:mm:ss'); // Example format

const router = useRouter();

const goBack = () => {
  router.back();
};

</script>
<template>
    <SharedBorderedNavBar>
        <template #lead>
            <div v-show="!showTool">
                <!-- <NuxtLink :to="Routes.PREVIEW.path"> -->
                    <div class="pr-5 text-blue-500 cursor-pointer" @click="goBack">
                        <UIcon name="i-heroicons-arrow-small-left" />
                    </div>
                <!-- </NuxtLink> -->
            </div>
            <div v-show="showTool">
                <div class="pr-5 text-blue-500 cursor-pointer" @click="showTool = false">
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
        <div>
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
        </div>
        <!--form-->

        <div class="py-5">
            Please fill in the form below:
        </div>

        <SharedTwCardWithHeader>
            <template #header>
                <span class=" text-orange-500 font-bold">Patient's Information</span>
            </template>
            <template #body>
                <FormsCardiacPatientInformation />
            </template>
        </SharedTwCardWithHeader>
        <UDivider class=" py-2.5" />
        <SharedTwCardWithHeader>
            <template #header>
                <span class=" text-orange-500 font-bold">Echo Indication</span>
            </template>
            <template #body>

                <FormsCardiacEchoIndication />


            </template>
        </SharedTwCardWithHeader>
        <UDivider class=" py-2.5" />
        <SharedTwCardWithHeader>
            <template #header>
                <span class=" text-orange-500 font-bold">Exam, CXR, Lab</span>
            </template>
            <template #body>
                <FormsCardiacExam />
            </template>
        </SharedTwCardWithHeader>
        <UDivider class=" py-2.5" />
        <SharedTwCardWithHeader>
            <template #header>
                <span class=" text-orange-500 font-bold">Echo Findings</span>
            </template>
            <template #body>

                <FormsCardiacEchoFindings />

            </template>
        </SharedTwCardWithHeader>
        <UDivider class=" py-2.5" />
        <SharedTwCardWithHeader>
            <template #header>
                <span class=" text-orange-500 font-bold">Primary Cardiac Diagnosis</span>
            </template>
            <template #body>

                <FormsCardiacPrimaryDiagnosis />

            </template>
        </SharedTwCardWithHeader>
        <UDivider class=" py-2.5" />
        <SharedTwCardWithHeader>
            <template #header>
                <span class=" text-orange-500 font-bold">Image Quality</span>
            </template>
            <template #body>

                <FormsCardiacImageQuality />

            </template>
        </SharedTwCardWithHeader>
        <div class="flex justify-end py-5">
            <div class=" flex gap-1">
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
                    <NuxtLink :to="{
                        name: Routes.EVALUATION_ECHO_SUMMARY.name,
                        params: {
                            tool: tool,
                        }
                    }">
                        <UButton variant="outline" icon="i-heroicons-chevron-double-right" :trailing="true"
                            color="green" size="xl">
                            Next
                        </UButton>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </UContainer>

</template>