<script setup lang="ts">
import * as yup from "yup";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { reactive, watch } from 'vue';
import { useStorage } from '@vueuse/core';

const schema = yup.object({
    lvDepressed: yup.object().shape({
        checked: yup.string(),
        rating: yup.number().min(1).max(5),
    }).label('LV severely depressed'),
    mitralStenosis: yup.object().shape({
        checked: yup.string(),
        rating: yup.number().min(1).max(5),
    }).label('Mitral Stenosis'),
    rvDilated: yup.object().shape({
        checked: yup.string(),
        rating: yup.number().min(1).max(5),
    }).label('RV severely dilated'),
    pericardialEffusion: yup.object().shape({
        checked: yup.string(),
        rating: yup.number().min(1).max(5),
    }).label('Pericardial Effusion'),
    ivcDilated: yup.object().shape({
        checked: yup.string(),
        rating: yup.number().min(1).max(5),
    }).label('IVC dilated, collapse < 50%'),
    normal: yup.string().label('Normal'),
    other: yup.string().label('Other')
});

const init = {
    lvDepressed: { checked: undefined, rating: undefined },
    mitralStenosis: { checked: undefined, rating: undefined },
    rvDilated: { checked: undefined, rating: undefined },
    pericardialEffusion: { checked: undefined, rating: undefined },
    ivcDilated: { checked: undefined, rating: undefined },
    normal: undefined,
    other: undefined
};

const state = reactive(init);
const localStorageState: any = useStorage(LocalStorageKeys.CARDIAC_ECHO_FINDINGS, state);

const options = ['Yes', 'No', 'Unseen'];

const echoFindings = [
    { name: 'lvDepressed', label: 'LV Severely depressed' },
    { name: 'mitralStenosis', label: 'Mitral Stenosis' },
    { name: 'rvDilated', label: 'RV Severely Dilated' },
    { name: 'pericardialEffusion', label: 'Pericardial Effusion' },
    { name: 'ivcDilated', label: 'IVC dilated, Collapse < 50%' }
];

const rateOptions = [1, 2, 3, 4, 5];

// Watch each finding's checked state
computed(() => {
    echoFindings.forEach(finding => {
        watch(
            () => localStorageState[finding.name],
            (newValue) => {
                // Check if newValue exists and has the checked property
                if (newValue && newValue.checked !== 'Yes') {
                    localStorageState[finding.name].rating = undefined;
                }
            },
            { immediate: true } // Run the watcher immediately
        );
    });
})
</script>

<template>
    <div class="py-2.5" v-for="(finding, index) in echoFindings" :key="index">
        <UCard>
            <div class="font-semibold text-sky-700 pb-2.5">{{ finding.label }}</div>
            <div>
                <URadioGroup :options="options" v-model="localStorageState[finding.name].checked"
                    :ui-radio="{ wrapper: 'ms-3 flex flex-row', legend: 'text-sm font-medium text-green-700 dark:text-green-200 mb-1' }" />
            </div>
            <div v-if="localStorageState[finding.name].checked === 'Yes'">
                <UDivider class="py-2.5" />
                <div class="w-1/6">
                    <UFormGroup label="Give Rating" name="bpSystolic" required>
                        <USelect color="primary" :options="rateOptions"
                            v-model="localStorageState[finding.name].rating" />
                    </UFormGroup>
                </div>
            </div>
        </UCard>
    </div>
</template>