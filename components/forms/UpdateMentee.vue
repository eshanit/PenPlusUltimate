<script setup lang="ts">
import * as yup from "yup";
import Routes from "@/constants/Routes"
import LocalStorageKeys from "@/constants/LocalStorageKeys";

const user:any = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE)
const useMentee = useMenteeStore()
const toast = useToast()

const menteeData: any = useProcessLocalStorage().retrieve(LocalStorageKeys.UPDATE_MENTEE)

const schema = yup.object({
    firstname: yup.string().required().label("First name"),
    lastname: yup.string().required().label("Last name"),
    gender: yup.string().required().label("Gender"),
    facility: yup.string().required().label("Facility"),
    profession: yup.string().required().min(1).label("Profession"),
});


const init = {
    _id: menteeData.id,
    _rev: menteeData.rev,
    firstname: menteeData.firstname,
    lastname: menteeData.lastname,
    facility: menteeData.facility,
    gender: menteeData.gender,
    profession: menteeData.profession,
    createdAt: menteeData.createdAt,
    createdBy: menteeData.createdBy,
    updatedAt: Date.now(),
    updatedBy: user.id
}

const state = reactive(init)

const { values, defineField, handleSubmit, resetForm, errors } = useForm({
    validationSchema: schema,
    initialValues: init,
});


const nuxtUiConfig = (state: { errors: any[] }) => {
    return {
        props: {
            error: state.errors[0],
        },
    };
};

const [firstname, firstnameProps] = defineField("firstname", nuxtUiConfig);
const [lastname, lastnameProps] = defineField("lastname", nuxtUiConfig);
const [gender, genderProps] = defineField("gender", nuxtUiConfig);
const [facility, facilityProps] = defineField("facility", nuxtUiConfig);
const [profession, professionProps] = defineField("profession", nuxtUiConfig);

const onSubmit = handleSubmit(async (values) => {
    const update = await useMentee.updateMentee(values);
    console.log('create front', update)
    if(update === true) {
        // toast.add({
        //     title: `You have successifully updated ${values.firstName}`,
        //     color: 'amber'
        // })
        navigateTo(Routes.MENTEES.path)
        resetForm()
    }

});

const genderOptions = [
    'Male',
    'Female',
    'Other'
]


const facilityOptions: any = useProcessLocalStorage().retrieve(LocalStorageKeys.FACILITIES)



</script>
<template>
    <!-- {{ values }} -->
    <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="First name" name="firstname" v-bind="firstnameProps">
            <UInput v-model="firstname" />
        </UFormGroup>

        <UFormGroup label="Last name" name="lastname" v-bind="lastnameProps">
            <UInput v-model="lastname" />
        </UFormGroup>

        <UFormGroup label="Gender" name="gender" v-bind="genderProps">
            <USelect v-model="gender" :options="genderOptions" />
        </UFormGroup>

        <UFormGroup label="Facility" name="facility" v-bind="facilityProps">
            <USelect v-model="facility" :options="facilityOptions" />
        </UFormGroup>

        <UFormGroup label="Profession   " name="profession" v-bind="professionProps">
            <UInput v-model="profession" />
        </UFormGroup>

        <UButton type="submit"> Submit </UButton>

        <UButton class="ml-4" color="white" variant="outline" type="button" @click="resetForm()">
            Reset
        </UButton>
    </UForm>
</template>