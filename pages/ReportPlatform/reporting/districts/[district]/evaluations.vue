<script setup lang="ts">
const router = useRouter()
const goBack = () => {
    router.back();
};

const route = useRoute()
const district: any = route.params.district

//evaluations
const useEvaluations = useEvalDataStore();

const districtEvals = await useEvaluations.fetchDistrictEvaluations(district);

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
                <span class=" text-gray-400"><strong>Districts</strong></span> | <span
                    class=" text-green-500 font-bold">{{ district }}</span> |<span class=" text-orange-500">
                    Evaluations</span>
            </div>
        </template>
    </SharedBorderedNavBar>
    <UContainer>
        <div class="py-5" />
        <div v-if="districtEvals">
            <p class="text-sky-700">
                <span class="font-bold">{{ district }}</span> district has <span class="text-orange-500 italic">{{ districtEvals.length }} </span> evaluations, to download them,
                please
                click the button below:
            </p>
            <div class="py-5">
                <UButton @click="useDownloadEvaluations(districtEvals)">
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