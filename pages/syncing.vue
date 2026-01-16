<script setup lang="ts">
import DatabaseNames from '@/constants/DatabaseNames';
import Routes from '@/constants/Routes';

const toast = useToast()

const isSyncing = ref(false);

const syncTo = async (databaseName: string) => {
    const synced = await useReplicateToCouchDB(databaseName)
}

const syncFrom = async (databaseName: string) => {
    const synced = await useReplicateFromCouchDB(databaseName)
}

const handleSyncAll = async () => {
    isSyncing.value = true;
    try {
        const result = await useSyncAll();
        
        if (result.isSuccess) {
            toast.add({
                title: '✓ Sync Successful',
                description: `Successfully synced ${result.successful} database(s)`,
                color: 'green',
                icon: 'i-heroicons-check-circle',
                timeout: 5000
            });
        } else {
            const errorMsg = result.errors.length > 0 
                ? result.errors.join(', ') 
                : 'Unknown sync error';
            
            toast.add({
                title: '✗ Sync Failed',
                description: `${result.failed} database(s) failed: ${errorMsg}`,
                color: 'red',
                icon: 'i-heroicons-exclamation-circle',
                timeout: 5000
            });
        }
    } catch (error) {
        toast.add({
            title: '✗ Sync Error',
            description: error instanceof Error ? error.message : 'An unexpected error occurred during sync',
            color: 'red',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 5000
        });
    } finally {
        isSyncing.value = false;
    }
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
                    <UButton 
                        @click="handleSyncAll()"
                        :loading="isSyncing"
                        :disabled="isSyncing"
                        color="blue"
                        variant="solid"
                    >
                        {{ isSyncing ? 'Syncing...' : 'Sync' }}
                    </UButton>
               </div>
            </div>

        </UContainer>
    </div>
</template>