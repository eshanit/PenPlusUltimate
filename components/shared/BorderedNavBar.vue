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

const gotoGenerateReport = () => {
    navigateTo('/ReportPlatform/generate-report')
}

const gotoManageProviders = () => {
    navigateTo('/ReportPlatform/manage-providers')
}

const gotoSettings = () => {
    navigateTo('/settings')
}

</script>
<template>
    <div class="flex flex-col md:flex-row justify-between p-3 md:p-5 border-b-2 gap-3 md:gap-0">
             <div class="flex flex-wrap gap-2 md:gap-5 items-center">
            <slot name="lead" />
            <div>
                <UButton color="red" size="sm" @click="gotoDashBoard()"> Dashboard</UButton>
            </div>
            <div class="flex flex-wrap gap-2 md:gap-5">
                <div>
                    <UButton color="sky" variant="outline" size="sm" @click="gotoMentees()"> Mentees</UButton>
                </div>

                <div>
                    <UButton color="green" variant="outline" size="sm" @click="gotoTools()">Competancies</UButton>
                </div>

                <div>
                    <UButton color="orange" variant="outline" size="sm" @click="gotoDistricts()"> Districts</UButton>
                </div>

                <div>
                    <UButton color="blue" variant="outline" size="sm" @click="gotoFacilities()"> Facilities</UButton>
                </div>

                <div>
                    <UButton color="purple" variant="outline" size="sm" @click="gotoGenerateReport()"> Generate Report</UButton>
                </div>

                <div>
                    <UButton color="teal" variant="outline" size="sm" @click="gotoManageProviders()"> Providers</UButton>
                </div>

                <div>
                    <UButton color="gray" variant="ghost" size="sm" @click="gotoSettings()"> Settings</UButton>
                </div>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <div class=" text-gray-500 pr-1 text-sm md:text-base">
                {{ user?.firstname}}
            </div>
            <div class=" text-red-500 text-lg font-bold cursor-pointer">
                <UIcon name="i-heroicons-power" @click="useAuth.signOut()" />
            </div>
        </div>

    </div>
</template>

