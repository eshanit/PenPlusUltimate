<script setup lang="ts">
const useAuth = useAuthStore();
const showAlert = ref(false)
const isRegistered = computed(() => useAuth.isRegistered);
</script>
<template>
    <!-- <div class="bg-[url('/assets/img/solidarmed.png')]  bg-no-repeat bg-right-bottom"> -->
        <UContainer>
            <div>
                <div class=" flex items-center justify-center h-screen">

                    <UCard>
                        <FormsLogin />
                    </UCard>

                </div>

            </div>
        </UContainer>
    <!-- </div> -->
</template>