<script setup lang="ts">
import Routes from '@/constants/Routes';
import DatabaseNames from "@/constants/DatabaseNames";

const user = useUserDetails;

const evaluate = () => {
    navigateTo('/MonitoringPlatform/dashboard', )
}

const reporting = () => {
    navigateTo('/ReportPlatform/dashboard', )
}

</script>
<template>
    <SharedNavBar>
        <template #lead>
            <div class="font-bold text-sky-700">
                Dashboard
            </div>
        </template>
    </SharedNavBar>

<UContainer  class="p-4 h-screen flex flex-col justify-center">
    <div class="grid grid-cols-2 gap-5">
        <div>
            <UCard>
                <template #header>
                    <div class="text-center text-orange-500 text-2xl">
                        Evaluation
                    </div>
                </template>
                <div class="text-center text-gray-500">
                    <div>
                        Use this side to test the evaluation app. Click on the button below
                    </div>
                    <div class="py-2.5" />
                    <div>
                        <UButton variant="outline" color="orange" label="Evaluate Mentees" @click="evaluate()"/>
                    </div>
                </div>
            </UCard>
        </div>

        <div>
            <UCard>
                <template #header>
                    <div class="text-center text-green-500 text-2xl">
                        Reporting
                    </div>
                </template>
                <div class="text-center text-gray-500">
                    <div>
                        Use this side to test the reporting app. Click on the button below
                    </div>
                    <div class="py-2.5" />
                    <div>
                        <UButton variant="outline" color="green" label="Reporting Platform" @click="reporting()"/>
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</UContainer>
</template>