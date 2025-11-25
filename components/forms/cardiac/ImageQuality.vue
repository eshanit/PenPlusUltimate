<script setup lang="ts">
import * as yup from "yup";
import LocalStorageKeys from "@/constants/LocalStorageKeys";
import { reactive } from 'vue'; // Ensure reactive is imported
import { useStorage } from '@vueuse/core';

const schema = yup.object({
    plax: yup.object().shape({
        axis: yup.number().min(1).max(5),
        depth: yup.number().min(1).max(5),
        gain: yup.number().min(1).max(5),
    }).label('PLX'),
    psax: yup.object().shape({
        axis: yup.number().min(1).max(5),
        depth: yup.number().min(1).max(5),
        gain: yup.number().min(1).max(5),
    }).label('PSAX'),
    a4c: yup.object().shape({
        axis: yup.number().min(1).max(5),
        depth: yup.number().min(1).max(5),
        gain: yup.number().min(1).max(5),
    }).label('A4C'),
    sc: yup.object().shape({
        axis: yup.number().min(1).max(5),
        depth: yup.number().min(1).max(5),
        gain: yup.number().min(1).max(5),
    }).label('SC'),
    ivc: yup.object().shape({
        axis: yup.number().min(1).max(5),
        depth: yup.number().min(1).max(5),
        gain: yup.number().min(1).max(5),
    }).label('IVC'),
})

const init = {
    plax: {
        axis: undefined,
        depth: undefined,
        gain: undefined
    },
    psax: {
        axis: undefined,
        depth: undefined,
        gain: undefined
    },
    a4c: {
        axis: undefined,
        depth: undefined,
        gain: undefined
    },
    sc: {
        axis: undefined,
        depth: undefined,
        gain: undefined
    },
    ivc: {
        axis: undefined,
        depth: undefined,
        gain: undefined
    }
}

const state = reactive(init);
const localStorageState: any = useStorage(LocalStorageKeys.CARDIAC_IMAGE_QUALITY, state);

const imageOptions = [
    {
        name: 'plax',
        label: 'PLAX'
    },
    {
        name: 'psax',
        label: 'PSAX'
    },
    {
        name: 'a4c',
        label: 'A4C'
    },
    {
        name: 'sc',
        label: 'SC'
    },
    {
        name: 'ivc',
        label: 'IVC'
    }
]

const rateOptions = [1, 2, 3, 4, 5];

</script>
<template>

    <div class="py-2.5" v-for="(image, index) in imageOptions" :key="index">
        <UCard>
            <div class="font-semibold text-sky-700 pb-2.5">{{ image.label }}</div>
            <div class="flex justify-between" v-if="localStorageState[image.name]">
                <div>
                    <div class="font-bold text-gray-500 pb-1">AXIS</div>
                    <USelect color="primary" :options="rateOptions" v-model="localStorageState[image.name].axis" />
                </div>

                <div>
                    <div class="font-bold text-gray-500 pb-1">DEPTH</div>
                    <USelect color="primary" :options="rateOptions" v-model="localStorageState[image.name].depth" />

                </div>

                <div>
                    <div class="font-bold text-gray-500 pb-1">GAIN</div>
                    <USelect color="primary" :options="rateOptions" v-model="localStorageState[image.name].gain" />

                </div>

            </div>

        </UCard>
    </div>

</template>