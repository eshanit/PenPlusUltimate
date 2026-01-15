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
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <!-- Main Content Column -->
            <div class="xl:col-span-3">
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
            </div>

            <!-- Sidebar Column -->
            <div class="xl:col-span-1">
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </template>
                    
                    <div class="space-y-3">
                        <UButton 
                            icon="i-heroicons-plus-circle" 
                            color="red" 
                            variant="solid"
                            label="New Evaluation"
                            class="w-full justify-start"
                            :to="Routes.START_EVALUATION.path"
                        />
                        <UButton 
                            icon="i-heroicons-document-chart-bar" 
                            color="blue" 
                            variant="outline"
                            label="Generate Report"
                            class="w-full justify-start"
                            :to="Routes.GENERATE_REPORT.path"
                        />
                        <UButton 
                            icon="i-heroicons-user-group" 
                            color="green" 
                            variant="outline"
                            label="Manage Providers"
                            class="w-full justify-start"
                            :to="Routes.MANAGE_PROVIDERS.path"
                        />
                        <UButton 
                            icon="i-heroicons-cog-6-tooth" 
                            color="gray" 
                            variant="outline"
                            label="Settings"
                            class="w-full justify-start"
                            :to="Routes.SETTINGS.path"
                        />
                    </div>
                </UCard>
            </div>
        </div>
    </UContainer>
   </div>
</template>