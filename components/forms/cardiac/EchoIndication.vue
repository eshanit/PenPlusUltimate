<script setup lang="ts">
import * as yup from "yup";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { reactive } from 'vue'; // Ensure reactive is imported
import { useStorage } from '@vueuse/core';

const schema = yup.object({
    echoIndication: yup.array().label("Echo Indication")
});

const init = {
    echoIndication: [],
};

const state = reactive(init);
const localStorageState = useStorage(LocalStorageKeys.CARDIAC_ECHO_INDICATION, state);

const indicationOptions = [
    'Oedema',
    'Chest Pain',
    'Palpitation',
    'Dyspnea',
    'Orthopnea',
    'Loud Murmur',
    'Hypertension',
    'Findings of heart failure',
];

// Function to toggle the indication in the array
const toggleIndication = (indication: never) => {
    const index = localStorageState.value.echoIndication.indexOf(indication);
    if (index === -1) {
        localStorageState.value.echoIndication.push(indication); // Add if not present
    } else {
        localStorageState.value.echoIndication.splice(index, 1); // Remove if present
    }
};
</script>

<template>
    <div v-for="indication in indicationOptions" :key="indication" class="py-2.5">
        <UCheckbox 
            class=""
            color="primary" 
            :label="indication" 
            :model-value="localStorageState.echoIndication.includes(indication as never)"
            @change="toggleIndication(indication as never)"
        />
    </div>
</template>
