<script setup lang="ts">
import Routes from '@/constants/Routes';

const user = useUserDetails;
</script>
<template>
    <SharedBorderedNavBar>
        <template #lead>
            <NuxtLink :to="Routes.DASHBOARD.path">
                <div class="pr-5 text-blue-500 cursor-pointer">
                    <UIcon name="i-heroicons-arrow-small-left" />
                </div>
            </NuxtLink>
            <div>
                <span class=" text-gray-400"><strong>List of Sessions</strong></span>
            </div>
        </template>
    </SharedBorderedNavBar>
   <div class="py-5">
    <UContainer>
        <div class=" text-red-500 py-2.5">
            Note:
        </div>
        <div>
            Below is a list of providers/mentees who have at least 1 evaluation session done. 
            To view a previous session for a mentee please click the green button which has the date on which the session was done. 
            If a mentee has never done an evaluation before or is being evaluated on a new disease/tool you should use the <span class="text-red-500 font-semibold"> Start New Evaluation</span> button.
        </div>
        <SharedTwCard>
            <template #body>
                <TablesEvaluations />
            </template>
        </SharedTwCard>
    </UContainer>
   </div>
</template>