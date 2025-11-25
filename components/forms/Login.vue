<script setup lang="ts">
import * as yup from "yup";

const useAuth = useAuthStore();


const schema = yup.object({
    username: yup.string().required().min(4).label("Username"),
    password: yup.string().required().min(6).label("Password"),
});

const init = {
    username: '',
    password: '',
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

///console.log('is Registered?', useAuth.isRegistered)

const [username, usernameProps] = defineField("username", nuxtUiConfig);
const [password, passwordProps] = defineField("password", nuxtUiConfig);

const onSubmit = handleSubmit((values) => {
    useAuth.signIn(values);
});

</script>
<template>
    <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <div class="text-center">
            <div>
                <strong>Login to the:</strong>
            </div>
            <div>
                <span class="text-orange-400">NCD PenPlus Monitoring Tool Reporting Platform</span>
            </div>
        </div>
        <UFormGroup label="Username" name="username" v-bind="usernameProps">
            <UInput v-model="username" />
        </UFormGroup>

        <UFormGroup label="Password" name="password" v-bind="passwordProps">
            <UInput v-model="password" type="password" />
        </UFormGroup>

        <UButton type=""> Submit </UButton>


        <UButton class="ml-4" color="white" variant="outline" type="button" @click="resetForm()">
            Reset
        </UButton>
        <div class="text-sm">
            Dont have an account? click here to 
            <nuxt-link :to="{name: 'register'}">
                <UButton color="orange" variant="outline" type="button" label="Register" />
            </nuxt-link>   
        </div>
    </UForm>
</template>