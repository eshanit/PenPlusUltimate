<script setup lang="ts">
import * as yup from "yup";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { reactive } from 'vue'; // Ensure reactive is imported
import { useStorage } from '@vueuse/core';

const schema = yup.object({
    cardiacDiagnosis: yup.array().label("Echo Indication")
});

const init = {
    cardiacDiagnosis: []
}

const state =  reactive(init)
const localStorageState = useStorage(LocalStorageKeys.CARDIAC_PRIMARY_DIAGNOSIS, state);

const primaryOptions = [
    'Cardiomyopathy',
    'Mitral Stenosis',
    'Other congenital or valvular disease',
    'Hypertensive Heart Disease',
    'Right Ventricular Failure',
    'Pericardial disease',
    'Non-cardiac',
    'Other:'
]

// Function to toggle the indication in the array
const toggleIndication = (cardiac: never) => {
    const index = localStorageState.value.cardiacDiagnosis.indexOf(cardiac);
    if (index === -1) {
        localStorageState.value.cardiacDiagnosis.push(cardiac); // Add if not present
    } else {
        localStorageState.value.cardiacDiagnosis.splice(cardiac, 1); // Remove if present
    }
};

</script>
<template>
      <div v-for="cardiac in primaryOptions" :key="cardiac" class="py-2.5">
        <UCheckbox 
            class=""
            color="primary" 
            :label="cardiac" 
            :model-value="localStorageState.cardiacDiagnosis.includes(cardiac as never)"
            @change="toggleIndication(cardiac as never)"
        />
    </div>
</template>