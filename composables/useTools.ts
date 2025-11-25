import type ITools from '@/interfaces/ITools';

const formTools: Ref<Array<ITools>> = ref([]);
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
    }
];

export default formTools.value