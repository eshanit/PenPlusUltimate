<script setup lang="ts">
import * as V from "vee-validate";
import { useStorage } from "@vueuse/core";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import Routes from "@/constants/Routes";

let VField = V.Field;
let VForm = V.Form;
let VErrorMessage = V.ErrorMessage;

const values = ref('')


const props = defineProps({
    facilities: {
        type: Array<Object>,
        required: true,
    }
})

/** facilities */
const columns = [
    {
        key: 'facility',
        label: 'Facility',
    },
    {
        key: 'actions',
        label: 'Select'
    }
]

const q = ref('')
const page = ref(1)
const pageCount = 10

const rows = computed(() => {
    return props.facilities.filter((facility: any) => {
        return Object.values(facility).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        });
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const onSubmit = async () => {

    await navigateTo(Routes.MENTEES)

};

const localStorageState = useStorage(LocalStorageKeys.SELECTED_FACILITY, values)

</script>
<template>
    <SharedTwCard>
        <!-- <template #header>
            <div class="flex justify-between">
              
                <div>
                    <UButton variant="soft" color="purple" size="lg" @click="$emit('showCreateUserForm', true)">
                        <strong>Add District</strong>
                    </UButton>
                </div>
            </div>
        </template> -->
        <template #body>
            <v-form @submit="onSubmit()">
                <!-- <div class="text-blue-500">values: {{ values }}</div> -->

                <div class="flex justify-between pt-3 px-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <UInput v-model="q" placeholder="Filter Facilities..." />
                    </div>
                </div>

                <UTable :columns="columns" :rows="rows">

                    <template #actions-data="{ row }">
                        <URadio :value="row.id" v-model="values" />
                    </template>
                </UTable>

                <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                    <UPagination v-model="page" :page-count="pageCount" :total="facilities.length" />
                </div>

                <div class="flex justify-end">
                    <div class="border-t pt-5" v-show="values.length > 0">
                        <UButton label="Next" type="submit" size="xl" color="sky" />
                    </div>
                </div>
            </v-form>
        </template>
    </SharedTwCard>
</template>