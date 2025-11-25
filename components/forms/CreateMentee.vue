<script setup lang="ts">
import * as yup from "yup";
import Routes from "@/constants/Routes"
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import Facilities from "../tables/facilities.vue";

const user:any = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE)
const toast = useToast()
const useMentee = useMenteeStore()

const schema = yup.object({
    firstname: yup.string().required().label("First name"),
    lastname: yup.string().required().label("Last name"),
    facility: yup.string().label("facility"),
    gender: yup.string().required().label("Gender"),
    profession: yup.string().required().min(1).label("Profession"),
});


const init = {
    _id: '',
    firstname: '',
    lastname: '',
    gender: '',
    facility: '',
    profession: '',
    createdAt: Date.now(),
    createdBy: user.id
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
const [profession, professionProps] = defineField("profession", nuxtUiConfig);

const onSubmit = handleSubmit(async (values) => {
    const create = await useMentee.createMentee(values);
    console.log('create front', create)
    if(create.ok === true) {
       // toast.add({title: `You have successifully added ${values.firstName} as a mentee` })
        navigateTo(Routes.MENTEES.path)
        resetForm()
    }

});

const genderOptions = [
    'Male',
    'Female',
    'Other'
]

const emit = defineEmits(['showCreateUserForm'])
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

        <UFormGroup label="Profession   " name="profession" v-bind="professionProps">
            <UInput v-model="profession" />
        </UFormGroup>

        <UButton type="submit"> Submit </UButton>

        <UButton class="ml-4" color="white" variant="outline" type="button" @click="resetForm()">
            Reset
        </UButton>
    </UForm>
</template>