<script setup lang="ts">
import * as V from "vee-validate";
import { useStorage } from "@vueuse/core";
import LocalStorageKeys from "@/constants/LocalStorageKeys";


let VField = V.Field;
let VForm = V.Form;
let VErrorMessage = V.ErrorMessage;

const useDistricts = useDistrictsStore()

const values = ref('')


const props = defineProps({
    districts: {
        type: Array<Object>,
        required: true,
    }
})

/**table**/
const columns = [
    {
        key: 'district',
        label: 'District'
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
    return props.districts.filter((district: any) => {
        return Object.values(district).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        });
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

/** end table */

/**form */

const localStorageState = useStorage(LocalStorageKeys.CHECKED_DISTRICT, values)

const onSubmit = (a: string) => {
    useDistricts.saveGoingDistrict();
};

/**endform */

onUpdated(async () => {
    await useDistricts.fetchDistricts()
})
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
            <v-form @submit="onSubmit(values)">
                <!-- <div class="text-blue-500">values: {{ values }}</div> -->

                <div class="flex justify-between pt-3 px-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <UInput v-model="q" placeholder="Filter Districts..." />
                    </div>
                </div>

                <UTable :columns="columns" :rows="rows">

                    <template #actions-data="{ row }">
                        <!-- <input type="radio" id="yes" name="yes" :value="row._id" v-model="values"  selected /> -->

                        <URadio v-model="values" :value="row._id" />



                    </template>
                </UTable>

                <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                    <UPagination v-model="page" :page-count="pageCount" :total="districts.length" />
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