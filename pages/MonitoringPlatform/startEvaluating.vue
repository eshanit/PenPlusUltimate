<script setup lang="ts">
import type ITools from '@/interfaces/ITools';
import Routes from '@/constants/Routes';

const formTools: Ref<Array<ITools>> = ref([]);

const user = useUserDetails;

formTools.value = [
    {
        label: 'Diabetes',
        name: 'diabetes',
        svg_path: 'dietology',
    },
    {
        label: 'Cardiac',
        name: 'cardiac',
        svg_path: 'cardiology',
    },
    {
        label: 'Echo',
        name: 'echo',
        svg_path: 'heart',
    },
    {
        label: 'Sickle Cell',
        name: 'sickle',
        svg_path: 'endocrinology',
    },
    {
        label: 'Respiratory Disease',
        name: 'respiratory',
        svg_path: 'lungs',
    },
    {
        label: 'Hyper Tension',
        name: 'hypertension',
        svg_path: 'pills',
    },
    {
        label: 'Epilepsy',
        name: 'epilepsy',
        svg_path: 'patient',
    },
    {
        label: 'Liver',
        name: 'liver',
        svg_path: 'liver',
    },
    {
        label: 'Kidney',
        name: 'kidney',
        svg_path: 'kidneys',
    },
    {
        label: 'Palliative Care',
        name: 'Palliative-Care',
        svg_path: 'patient',
    }
];

//
const nextStep = (tool: string) => {

    const chosenTool = formTools.value.find((formTool: ITools) =>{
        return formTool.name == tool
    })

    useProcessLocalStorage().store('Tool', chosenTool)

    navigateTo(Routes.DISTRICTS.path)
}

</script>

<template>
    <div class="bg-gray-100">


        <UContainer class="p-4 h-screen flex flex-col justify-center">
            <div class="text-center mb-4">
                Welcome,
                <span class="text-purple-500 font-bold">{{ user.firstname }} {{ user.lastname }}</span>
            </div>

            <UDivider class="my-4" />

            <div class="text-center mb-4">
                <p class="text-gray-700">Below are the forms for Pen Plus Monitoring Tool, please select a form to start
                    monitoring:</p>
            </div>

            <div class="grid grid-cols-1 h-full gap-4">
                <div v-for="form in formTools" :key="form.label" class="flex flex-col  justify-center h-full cursor-pointer">
                    <SharedTwCard>
                        <template #body>
                            <div class="flex justify-between" @click="nextStep(form.name)">
                                <div class=" py-5 text-sky-700 text-xl font-semibold">
                                    {{ form.label }}
                                </div>
                                <div>
                                    <NuxtImg :src="`/icons/${form.svg_path}.png`" alt="Icon for {{ form.label }}"
                                        class="icon-size" />
                                </div>
                            </div>

                        </template>
                    </SharedTwCard>

                </div>
            </div>
        </UContainer>
    </div>
</template>

<style scoped>
/* Additional custom styles */

.text-pretty {
    color: #3B82F6;
    /* Sky color */
}

.icon-size {
    width: 100%;
    /* Fill the container width */
    height: auto;
    /* Maintain aspect ratio */
    max-height: 100px;
    /* Limit height for larger icons */
}

@media (max-width: 768px) {
    .text-lg {
        font-size: 1.5rem;
        /* Larger text on mobile */
    }

    .icon-size {
        max-height: 80px;
        /* Adjust icon size for smaller screens */
    }
}
</style>