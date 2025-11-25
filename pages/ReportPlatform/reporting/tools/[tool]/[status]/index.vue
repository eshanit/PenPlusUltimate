<script setup lang="ts">
import DatabaseNames from "@/constants/DatabaseNames";
import capitalizeFirstLetter from "@/utilities/capitalizeFirstLetter";

const route = useRoute()
const tool: any = route.params.tool
const status: any = route.params.status


const router = useRouter();

const goBack = () => {
    router.back();
};

const showTool: Ref<Boolean> = ref(false)

//

const tools = useTools;

const toolObj = tools.find((el: any) => {
    return el.name == tool
})

//evaluations
const useEvaluations = useEvalDataStore();

const completedEvals = await useEvaluations.fetchEvaluationScores(DatabaseNames.COMPLETED_EVALUTATIONS);


const toolsEvals = computed(() => {

    const evaluationStats = useEvaluationStats(completedEvals)

    let evals;

    if (status == 'completed') {

        evals = evaluationStats.completedEvaluations.filter((el) => {
            return el.tool == tool
        })

    } else if (status == 'twocompleted') {

        evals = evaluationStats.completed2Evals.filter((el) => {
            return el.tool == tool
        })

    } else if (status == 'onecompleted') {

        evals = evaluationStats.completed1Evals.filter((el) => {
            return el.tool == tool
        })

    } else {

        evals = completedEvals.filter((el: any) => {
            return el.tool == tool
        })


    }
    return evals
})


</script>
<template>
    <div v-if="completedEvals">
        <SharedBorderedNavBar>
            <template #lead>
                <div v-show="!showTool">
                    <!-- <NuxtLink :to="Routes.PREVIEW.path"> -->
                    <div class="pr-5 text-blue-500 cursor-pointer" @click="goBack">
                        <UIcon name="i-heroicons-arrow-small-left" />
                        Back
                    </div>
                    <!-- </NuxtLink> -->
                </div>
                <div v-show="showTool">
                    <div class="pr-5 text-blue-500 cursor-pointer" @click="showTool = false">
                        <UIcon name="i-heroicons-arrow-small-left" />
                    </div>
                </div>
                <!-- 
            <div>
                <span class=" text-gray-400"><strong>Evaluating</strong></span> | <span class=" text-sky-700"> {{
                    selectedTool.label }}</span>
            </div> -->
            </template>
        </SharedBorderedNavBar>
        <UContainer>
            <div class="flex gap-1">
                <div class="text-red-700 text-3xl">{{ toolObj?.label }}</div>
                <div class="mt-2.5">
                    <div v-if="status == 'completed'">
                        <UBadge color="sky">
                            {{ capitalizeFirstLetter(status) }}
                        </UBadge>
                    </div>
                    <div v-else-if="status == 'twocompleted'">
                        <UBadge color="orange">
                            Two sessions completed
                        </UBadge>
                    </div>
                    <div v-else-if="status == 'onecompleted'">
                        <UBadge color="red">
                            One session completed
                        </UBadge>
                    </div>
                    <div v-else>
                        <UBadge color="green">
                            All scenarios
                        </UBadge>
                    </div>
                </div>
            </div>
            <UDivider class="py-5" />
            <TablesSelectedEvaluations :evaluations="toolsEvals" />

          
        </UContainer>
    </div>


</template>