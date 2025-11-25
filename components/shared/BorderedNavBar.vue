<script setup lang="ts">
import LocalStorageKeys from '@/constants/LocalStorageKeys';

const useAuth = useAuthStore()
const user:any = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE)


const gotoDashBoard = () => {
    navigateTo('/dashboard')
}

const gotoMentees = () => {
    navigateTo('/ReportPlatform/reporting/mentees')
}

const gotoTools = () => {
    navigateTo('/ReportPlatform/reporting/tools')
}

const gotoDistricts = () => {
    navigateTo('/ReportPlatform/reporting/districts')
}

const gotoFacilities = () => {
    navigateTo('/ReportPlatform/reporting/facilities')
}

</script>
<template>
    <div class="flex justify-between p-5 border-b-2">
             <div class="flex gap-5">
            <slot name="lead" />
            <div>
                <UButton color="red" @click="gotoDashBoard()"> Dashboard</UButton>
            </div>
            <div class="flex gap-5">
                <div>
                    <UButton color="sky" variant="outline" @click="gotoMentees()"> Mentees</UButton>
                </div>

                <div>
                    <UButton color="green" variant="outline" @click="gotoTools()">Competancies</UButton>
                </div>

                <div>
                    <UButton color="orange" variant="outline" @click="gotoDistricts()"> Districts</UButton>
                </div>

                <div>
                    <UButton color="blue" variant="outline" @click="gotoFacilities()"> Facilities</UButton>
                </div>
            </div>
        </div>
        <div class="flex">
            <div class=" text-gray-500 pr-1">
                {{ user.firstname}}
            </div>
            <div class=" text-red-500 text-lg font-bold cursor-pointer">
                <UIcon name="i-heroicons-power" @click="useAuth.signOut()" />
            </div>
        </div>

    </div>
</template>

