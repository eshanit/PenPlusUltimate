<script setup lang="ts">
import Routes from '@/constants/Routes';

const router = useRouter();

const goBack = () => {
  router.back();
};

</script>
<template>
    <div>
        <SharedBorderedNavBar>
            <template #lead>
                <!-- <NuxtLink :to="Routes.MENTEES"> -->
                    <div class="pr-5 text-sky-500 cursor-pointer" @click="goBack">
                        <UIcon name="i-heroicons-arrow-small-left" />
                    </div>
                <!-- </NuxtLink> -->


                <div class=" text-gray-400"><strong>Planning</strong></div>
            </template>
        </SharedBorderedNavBar>
        <UContainer>
            <SharedTwCardWithHeader>
                <template #header>
                    <div class="text-sm text-cyan-800"><strong>Create New Mentee</strong></div>
                </template>
                <template #body>
                    <FormsCreateMentee />
                </template>
            </SharedTwCardWithHeader>
        </UContainer>
    </div>
</template>