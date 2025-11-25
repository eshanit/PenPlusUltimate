<script setup lang="ts">
import DatabaseNames from '@/constants/DatabaseNames';
import Routes from '@/constants/Routes';

const toast = useToast()

const syncTo = async (databaseName: string) => {
    const synced = await useReplicateToCouchDB(databaseName)
}

const syncFrom = async (databaseName: string) => {
    const synced = await useReplicateFromCouchDB(databaseName)
}

</script>
<template>
    <div>
        <UContainer>

            <SharedBorderedNavBar>
                <template #lead>
                    <NuxtLink :to="Routes.DASHBOARD">
                        <div class="pr-5 text-blue-500 cursor-pointer">
                            <UIcon name="i-heroicons-arrow-small-left" />
                        </div>
                    </NuxtLink>
                    <div class=" text-gray-400"><strong> Sync your Data</strong></div>
                </template>
            </SharedBorderedNavBar>

 
            <div class="py-5">
               <div>
                    In order to manually sync data, click/press the "Sync" button below.
               </div>
               <div>
                    <UButton @click="useSyncAll()">
                        Sync
                    </UButton>
               </div>
            </div>

        </UContainer>
    </div>
</template>