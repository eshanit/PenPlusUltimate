<script setup lang="ts">
import * as V from "vee-validate";
import type IMasterUser from "@/interfaces/IMasterUser";
import { useStorage } from "@vueuse/core";
import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
const facility = localStorage.getItem(LocalStorageKeys.SELECTED_FACILITY);

let VField = V.Field;
let VForm = V.Form;
let VErrorMessage = V.ErrorMessage;


const useMentees = useMenteeStore()
const toast = useToast()

const values = ref('')
let showSuccessMessage = ref(false)

type ICoMentor = Pick<IMasterUser, "_id" | "_rev" | "firstname" | "lastname" | "gender" | "profession">

const props = defineProps({
    mentees: {
        type: Array<ICoMentor>,
        required: true,
    }
})

/**table */
const columns = [
    {
        key: 'firstname',
        label: 'First Name',
    },
    {
        key: 'lastname',
        label: 'Last Name',
    },
    {
        key: 'gender',
        label: 'Gender',
    },
    {
        key: 'profession',
        label: 'Profession'
    },
    {
        key: 'actions',
        label: 'Select | Edit | Delete'
    }
]

const q = ref('')
const page = ref(1)
const pageCount = 10

const rows = computed(() => {
    return props.mentees.filter((mentee: any) => {
        return Object.values(mentee).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        });
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

/** end table */

/**form */


// set some initial values


const onSubmit = () => {
    useMentees.saveEvalMentee();
};


/**endform */



const deleteMentee = async (menteeId: string, menteeRev: string, firstname: string) => {
    const e = await useMentees.deleteMentee(menteeId, menteeRev)
    if (e === true) {
        toast.add({
            title: `You have successifully deleted ${firstname}`,
            color: 'red'
        })
    }
}


const updateMentee = (menteeData: object) => {

    useProcessLocalStorage().store(LocalStorageKeys.UPDATE_MENTEE, menteeData)

    navigateTo(Routes.UPDATE_MENTEE.path)

}

const localStorageState = useStorage(LocalStorageKeys.CHECKED_MENTEE, values)



onUpdated(() => {
    useMentees.fetchAllMentees(facility)
})
</script>


<template>
    <SharedTwCardWithHeader>
        <template #header>
            <div class="flex justify-between">
                <div class="text-sm text-cyan-700">
                    <strong>Mentees: <span class="text-rose-500">{{ mentees.length }}</span></strong>
                </div>
                <div>
                    <NuxtLink :to="Routes.CREATE_MENTEE">
                        <UButton variant="soft" color="purple" size="lg">
                            <strong>Add Mentee</strong>
                        </UButton>
                    </NuxtLink>
                </div>
            </div>
        </template>
        <template #body>
            <v-form @submit="onSubmit()">
                <!-- <div class="text-blue-500">values: {{ values }}</div> -->

                <div class="flex justify-between pt-3 px-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <UInput v-model="q" placeholder="Filter Mentees..." />
                    </div>
                    <!-- <div class=" text-sky-300 text-5xl">{{ countSelected(Object.values(values)) }}</div> -->
                </div>

                <UTable :columns="columns" :rows="rows">
                    <template #actions-data="{ row }">
                        <div class="flex gap-4">
                            <div>
                                <!-- <input type="radio" id="yes" name="yes" :value="row._id" v-model="values" /> -->
                                <URadio :value="row._id" v-model="values" />
                            </div>
                            <div>
                                <UIcon name="i-heroicons-pencil-square" class=" text-green-500 text-xl" @click="updateMentee({
                                    id: row._id,
                                    rev: row._rev,
                                    firstname: row.firstname,
                                    lastname: row.lastname,
                                    gender: row.gender,
                                    facility: row.facility,
                                    profession: row.profession,
                                    show: true
                                })" />
                            </div>
                            <div>

                                <div class="flex gap-4 items-center">
                                    <UPopover overlay>
                                        <UIcon name="i-heroicons-trash" class=" text-red-500 text-xl" />

                                        <template #panel="{ close }">
                                            <div class="p-4">
                                                <div class="pb-5">
                                                    <div class="pb-5" v-if="!showSuccessMessage">
                                                        Are you sure you want to delete Co-Mentor <strong>{{ row.firstname
                                                        }} {{ row.lastname }}</strong>
                                                    </div>
                                                    <div v-else>
                                                        You have successifully deleted comentor! <span
                                                            class="line-through"><strong>{{ row.firstname
                                                            }} {{ row.lastname }}</strong></span>
                                                    </div>
                                                </div>
                                                <div class="flex bp-5">

                                                    <div class="flex" v-if="!showSuccessMessage">
                                                        <div class="pr-2">
                                                            <UButton variant="outline" color="sky" label="Yes"
                                                                @click=" deleteMentee(row._id, row._rev, row.firstname); close()" />
                                                        </div>
                                                        <div>
                                                            <UButton variant="outline" color="rose" label="No"
                                                                @click="close" />
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        <div>
                                                            <UButton variant="outline" color="rose" label="Close"
                                                                @click="close" />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </template>
                                    </UPopover>

                                </div>
                            </div>
                        </div>

                    </template>
                </UTable>

                <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                    <UPagination v-model="page" :page-count="pageCount" :total="mentees.length" />
                </div>


                <div class="flex justify-end">
                    <div class="border-t pt-5" v-show="values.length > 0">
                        <UButton label="Next" type="submit" size="xl" color="sky" />
                    </div>
                </div>
            </v-form>
        </template>
    </SharedTwCardWithHeader>
</template>