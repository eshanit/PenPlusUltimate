<script setup lang="ts">
import type IScore from "@/interfaces/IScore";


const route = useRoute()
const tool: any = route.params.tool
const district: any = route.params.district

const router = useRouter();

const goBack = () => {
    router.back();
};

const useEvaluations = useEvalDataStore();

const districtEvals: IScore[] = await useEvaluations.fetchDistrictEvaluations(district)

//
const toolEvals = computed(() => {
    return districtEvals.filter((el: any) => {
        return el.tool == tool
    })
})

//simple statistucs

const toolScoresList = computed(() => {
    const data = toolEvals.value.map(t => t.sessions)

    return data.map(session => {
        return Object.values(session) // Get values of the session object
            .filter(sessionData => sessionData && sessionData.evalItemScores) // Filter out null values
            .flatMap(sessionData => sessionData?.evalItemScores); // Flatten the array of evalItemScores
    })
        .flat();
})


const scoreCounts: any = useScoreCount(toolScoresList.value)

const scoreStatistics = useScoreSimpleStatistics(toolScoresList.value)
</script>
<template>
    <SharedBorderedNavBar>
        <template #lead>
            <!-- <NuxtLink :to="Routes.EVALUATIONS.path"> -->
            <div class="pr-5 text-blue-500 cursor-pointer" @click="goBack">
                <UIcon name="i-heroicons-arrow-small-left" />
            </div>
            <!-- </NuxtLink> -->
            <div>
                <span class=" text-gray-400"><strong>Districts</strong></span> | <span
                    class=" text-green-500 font-bold">{{ district }}</span> |<span class=" text-orange-500">
                    {{ tool }}</span>
            </div>
        </template>
    </SharedBorderedNavBar>

    <UContainer>
        <!-- <pre>
        {{ toolScoresList }}
    </pre> -->

        <div class="py-5">
            <span class="text-sky-500 text-3xl">
                {{ district }}
            </span> |
            <span class="text-green-500">
                {{ tool }}
            </span>

        </div>
        <UDivider />

        <p class="pt-5">
            Click the button below to download all the evaluation data for tool <span
                class="text-orange-500 font-semibold italic">{{ tool }}</span> in <span
                class="text-sky-500 font-semibold italic">{{ district }}</span> district, in csv format.

        </p>
        <div class="py-5">
            <UButton variant="outline" color="red" label="Download" @click="useDownloadEvaluations(toolEvals)" />
        </div>
        <UDivider class="py-5" label="Score Simple Statistics" />

        <div class="grid grid-cols-3 gap-5 pb-5">
            <div>
                <UCard class="">
                    <div class="flex justify-between font-semibold">
                        <div>
                            Mean Score
                        </div>
                        <div class="text-2xl text-sky-700">
                            {{ scoreStatistics.meanScore }}
                        </div>
                    </div>
                    <template #footer>
                        <div class=" text-gray-500 text-sm">
                            The average competency score for <span class=" text-orange-500 font-semibold italic">{{ tool
                                }}</span> across all evaluation items for this district.
                        </div>
                    </template>
                </UCard>
            </div>
            <div>
                <UCard class="">
                    <div class="flex justify-between font-semibold">
                        <div>
                            Median Score
                        </div>
                        <div class="text-2xl text-red-700">
                            {{ scoreStatistics.medianScore }}
                        </div>
                    </div>
                    <template #footer>
                        <div class="  text-gray-500 text-sm">
                            The middle competency score for <span class=" text-orange-500 font-semibold italic">{{ tool
                                }}</span> when all scores are sorted
                        </div>
                    </template>
                </UCard>
            </div>
            <div>
                <UCard class="">
                    <div class="flex justify-between font-semibold">
                        <div>
                            Mode Score
                        </div>
                        <div class="text-2xl text-green-700">
                            {{ scoreStatistics.modeScore }}
                        </div>
                    </div>
                    <template #footer>
                        <div class=" text-gray-500 text-sm">
                            The most frequently occurring score(s) for <span
                                class=" text-orange-500 font-semibold italic">{{ tool }}</span> in
                            <span class=" text-sky-500 font-semibold italic">{{ district }}</span>
                        </div>
                    </template>
                </UCard>
            </div>
        </div>
        <UDivider />

        <div class="py-5">
            Below is a list of all evaluations for tool <span class="text-orange-500 font-semibold italic">{{ tool
                }}</span>
            in the <span class="text-sky-500 font-semibold italic">{{ district }}</span> district.
        </div>
        <TablesSelectedEvaluations :evaluations="toolEvals" />
        <UDivider />
        <div class="py-5">
            Below is a list of all evaluations for tool <span class="text-orange-500 font-semibold italic">{{ tool
                }}</span>
            in the <span class="text-sky-500 font-semibold italic">{{ district }}</span> district.
        </div>
        <TablesSelectedEvaluationMeans :evaluations="toolEvals" />




    </UContainer>
</template>