<script setup lang="ts">
import LocalStorageKeys from '@/constants/LocalStorageKeys';
import Routes from '@/constants/Routes';

const district = ref(localStorage.getItem(LocalStorageKeys.DISTRICT));
const facility = ref(localStorage.getItem(LocalStorageKeys.SELECTED_FACILITY));

// const comentorsData:any = useProcessLocalStorage().retrieve(LocalStorageKeys.SELECTED_COMENTORS)
const menteeData: any = useProcessLocalStorage().retrieve(LocalStorageKeys.EVALUATED_MENTEE)

const profileData: any = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE)

const selectedTool: Ref<any> = ref()
selectedTool.value = useProcessLocalStorage().retrieve(LocalStorageKeys.TOOL)

const startEvaluation = computed(()=>{
    navigateTo('evaluation/'+ selectedTool.value.name)
})

onMounted(async () => {
    await useReplicateToCouchDB('mentees')
})

</script>
<template>

    <SharedBorderedNavBar>
        <template #lead>
            <NuxtLink :to="Routes.MENTEES">
                <div class="pr-5 text-blue-500 cursor-pointer">
                    <UIcon name="i-heroicons-arrow-small-left" />
                </div>
            </NuxtLink>
            <div>
                <span class=" text-gray-400"><strong>Planning</strong></span> | <span class=" text-sky-700"> {{
                    selectedTool.label }}</span>
            </div>
        </template>
    </SharedBorderedNavBar>
    <UContainer>
        <SharedTwCardWithHeader>
            <template #header>
                <div class="pt-5">
                    Below is a Preview of whats been <span class="text-rose-500"><strong>planned</strong></span> so far:
                </div>
            </template>
            <template #body>

                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Mentee Name:</strong>
                    </div>
                    <div>
                        {{ menteeData.firstname }} {{ menteeData.lastname }}
                    </div>
                </div>
                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>District:</strong>
                    </div>
                    <div>
                        {{ district }}
                    </div>
                </div>

                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Facility:</strong>
                    </div>
                    <div>
                        {{ facility }}
                    </div>
                </div>

                <div class="flex justify-between py-2.5">
                    <div class=" text-sky-600">
                        <strong>Evaluator:</strong>
                    </div>
                    <div>
                        {{ profileData.firstname }} {{ profileData.lastname }}
                    </div>
                </div>
                <UDivider class=" py-5" />

                <div class="grid grid-cols-2 gap-5 pt-10">

                    <div>
                        If you are satisfied with the above information, please click on the right button / card to
                        start
                        evaluation:
                    </div>
                    <div v-if="selectedTool.name === 'echo'">
                        <NuxtLink :to="{
                            name: Routes.ECHO_PRAC_EVALUATION.name,
                            params: {
                                tool: selectedTool.name,
                            }
                        }">
                            <UButton variant="soft" color="orange" size="xl" label="Start Evaluation" :block=true />
                        </NuxtLink>
                    </div>
                    <div v-else>
                        <NuxtLink :to="{
                            name: Routes.EVALUATION_TOOL.name,
                            params: {
                                tool: selectedTool.name,
                            }
                        }">
                            <UButton variant="soft" color="orange" size="xl" label="Start Evaluation" :block=true />
                        </NuxtLink>
                    </div>

                </div>
            </template>
        </SharedTwCardWithHeader>


        <!-- <div class="pt-5">
                <SharedTwCardWithHeader>
                    <template #header>
                        <div class=" text-teal-950"><strong>Co-Mentors selected for the evaluation:</strong> <span
                                class=" text-orange-500">{{ comentors().length }}</span></div>
                    </template>

                    <template #body>
                        <TablesSelectedComentors :comentors="comentors()" />
                    </template>

                </SharedTwCardWithHeader>
            </div> -->


    </UContainer>

</template>