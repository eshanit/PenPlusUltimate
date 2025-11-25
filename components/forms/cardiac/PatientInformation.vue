<script setup lang="ts">
import * as yup from "yup";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { useStorage } from '@vueuse/core'

const schema = yup.object({
    caseNumber: yup.string().required().label("Case Number"),
    patientFullName: yup.string().required().label("Full Name"),
    gender: yup.string().required().label("Gender"),
    age: yup.number().label("Age")
})

const init = {
    caseNumber: undefined,
    patientFullName: undefined,
    gender: undefined,
    age: undefined
}

const state = reactive(init)
const localStorageState = useStorage(LocalStorageKeys.CARDIAC_PATIENT_INFORMATION, state)

const genderOptions = [
    'Male',
    'Female',
    'Other'
]

</script>
<template>
    <UForm :state="state" @submit="" class="space-y-4">
        <UFormGroup label="Case Number" name="caseNumber" required>
            <UInput v-model="localStorageState.caseNumber" />
        </UFormGroup>

        <UFormGroup label="Patient Full Name" name="patientFullName" required>
            <UInput v-model="localStorageState.patientFullName" />
        </UFormGroup>

        <UFormGroup label="Gender" name="gender" >
            <USelect v-model="localStorageState.gender" :options="genderOptions" />
        </UFormGroup>

        <UFormGroup label="Patient Age" name="age" required>
            <UInput v-model="localStorageState.age" type="number" min=0 />
        </UFormGroup>

    </UForm>
</template>