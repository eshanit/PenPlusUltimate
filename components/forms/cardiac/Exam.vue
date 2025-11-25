<script setup lang="ts">
import * as yup from "yup";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { useStorage } from '@vueuse/core'

const schema = yup.object({
    bpSystolic: yup.number().required().label('BP Systolic Reading'),
    bpDiastolic: yup.number().required().label('BP Diastolic Reading'),
    cxrLab: yup.array().label("CXR, Lab")
})


const init = {
    bpSystolic: undefined,
    bpDiastolic: undefined,
    cxrLab: []
}

const state = reactive(init);
const localStorageState = useStorage(LocalStorageKeys.CARDIAC_EXAM_CXR_LAB, state);

const cxrLabOptions = [
    'Loud Murmur',
    'Cyanosis',
    'Ascites',
    'Oedema',
    'Cardiomegaly (CXR)',
    'Lung Disease (CXR)'
]

// Function to toggle the indication in the array
const toggleIndication = (cxrLab: never) => {
    const index = localStorageState.value.cxrLab.indexOf(cxrLab);
    if (index === -1) {
        localStorageState.value.cxrLab.push(cxrLab); // Add if not present
    } else {
        localStorageState.value.cxrLab.splice(cxrLab, 1); // Remove if present
    }
};

</script>
<template>
    <UForm :state="state" @submit="" class="space-y-4">
        <UCard>
            <div class="flex gap-4 ">
                <div class="lg:w-1/4 sm:w-1/2 md:w-1/2 space-y-4 " >
                    <UFormGroup label="BP Systolic Reading" name="bpSystolic" required>
                        <UInput v-model="localStorageState.bpSystolic" type="number" min="0" max="999" />
                    </UFormGroup>
                    <UFormGroup label="BP Diastolic Reading" name="bpDiastolic" required>
                        <UInput v-model="localStorageState.bpDiastolic" type="number" min="0" max="999" />
                    </UFormGroup>
                </div>
              <div class=" border-r">

              </div>
                <div class="flex justify-center items-center text-5xl font-semibold text-sky-400">
                    <span class="">{{ localStorageState.bpSystolic }}</span>
                    <span><UIcon name="i-heroicons-slash" /></span>
                    <span class="">{{ localStorageState.bpDiastolic }}</span>
                    <span>mmHg</span>
                </div>
            </div>

        </UCard>
        <div v-for="cxrLab in cxrLabOptions" :key="cxrLab" class=" py-2.5">
        <UCheckbox 
            color="primary" 
            :label="cxrLab" 
            :model-value="localStorageState.cxrLab.includes(cxrLab as never)"
            @change="toggleIndication(cxrLab as never)"
        />
    </div>
    </UForm>



</template>