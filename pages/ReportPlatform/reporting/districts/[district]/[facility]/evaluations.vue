<script setup lang="ts">
const router = useRouter()
const goBack = () => {
    router.back();
};

const route = useRoute()
const district: any = route.params.district
const facility: any = route.params.facility

//evaluations
const useEvaluations = useEvalDataStore();

const facilityEvals = await useEvaluations.fetchFacilityEvaluations(facility);

</script>
<template>
    <SharedBorderedNavBar>
        <template #lead>
            <!-- <NuxtLink :to="Routes.COMPLETED_EVALUATIONS.path"> -->
            <div class="pr-5 text-blue-500 cursor-pointer" @click="goBack">
                <UIcon name="i-heroicons-arrow-small-left" />
            </div>
            <!-- </NuxtLink> -->
            <div>
                <span class=" text-gray-400"><strong>Districts</strong></span> |
                <span class=" text-sky-500 font-bold">{{ district }}</span> |
                <span class=" text-green-500 font-bold">{{ facility }}</span> |
                <span class=" text-orange-500">
                    Evaluations</span>
            </div>
        </template>
    </SharedBorderedNavBar>
    <UContainer>
        <div class="py-5" />
        <div v-if="facilityEvals">
            <p class="text-sky-700">
                <span class="font-bold">{{ facility }}</span> facility has <span class="text-orange-500 italic">{{
                    facilityEvals.length }} </span> evaluations, to download them,
                please
                click the button below:
            </p>
            <div class="py-5">
                <UButton color="sky" @click="useDownloadEvaluations(facilityEvals)">
                    Download
                </UButton>
            </div>

        </div>
        <div v-else>
            <div>
                No evaluation data for {{ district }} district.
            </div>
        </div>
    </UContainer>


</template>