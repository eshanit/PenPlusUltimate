<script setup lang="ts">
import * as V from "vee-validate";
import type IMasterUser from "@/interfaces/IMasterUser";
import { useStorage } from "@vueuse/core";
import Routes from "@/constants/Routes";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { array } from "yup";
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
    },
    evaluations: Array
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
        key: 'facility',
        label: 'Facility'
    },
    {
        key: 'evaluations',
        label: 'Evaluations'
    }
]

const q = ref('')
const page = ref(1)
const pageCount = 10

const rows = computed(() => {
    const filteredMentees = props.mentees.filter((mentee: ICoMentor) => {
        const matches = Object.values(mentee).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase());
        });
        console.log(`Mentee: ${mentee.firstname}, Matches: ${matches}`);
        return matches;
    });

    return filteredMentees.slice((page.value - 1) * pageCount, page.value * pageCount);
});

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

///
const menteeEvaluations = (menteeId: string) => {
    return props.evaluations?.filter((el: any) => el.mentee._id == menteeId)
}


///



//

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
            <!-- <pre>
                {{ props.evaluations }}
            </pre> -->
            <v-form @submit="onSubmit()">
                <!-- <div class="text-blue-500">values: {{ values }}</div> -->

                <div class="flex justify-between pt-3 px-3 pb-3.5 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <UInput v-model="q" placeholder="Filter Mentees..." />
                    </div>
                    <!-- <div class=" text-sky-300 text-5xl">{{ countSelected(Object.values(values)) }}</div> -->
                </div>

                <UTable :columns="columns" :rows="rows">
                    <template #evaluations-data="{ row }">
                        <div>
                            <UButton variant="soft" size="sm" color="sky">
                                {{ menteeEvaluations(row._id)?.length }} 
                            </UButton>
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