<script setup lang="ts">
import LocalStorageKeys from '@/constants/LocalStorageKeys';

const router = useRouter();
const useAuth = useAuthStore()
const user: any = useProcessLocalStorage().retrieve(LocalStorageKeys.PROFILE)

const goBack = () => {
  router.back();
};

const gotoDashBoard = () => {
  navigateTo('/dashboard')
}

const gotoMentees = () => {
  navigateTo('/ReportPlatform/reporting/mentees')
}

const gotoTools = () => {
  navigateTo('/ReportPlatform/reporting/tools')
}

const gotoDistricts = () => {
  navigateTo('/ReportPlatform/reporting/districts')
}

const gotoFacilities = () => {
  navigateTo('/ReportPlatform/reporting/facilities')
}


</script>
<template>
  <div>
    <!-- User Info and Logout Button - Fixed Position -->
    <div class="fixed top-4 right-4 z-50 flex items-center space-x-3">
      <SharedOnlineStatus />
      <div class="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-user" class="w-4 h-4 text-gray-600" />
          <span class="text-sm font-medium text-gray-900">{{ user?.firstname }} {{ user?.lastname }}</span>
        </div>
      </div>
      <UButton
        icon="i-heroicons-power"
        color="red"
        variant="solid"
        size="sm"
        @click="useAuth.signOut()"
        class="shadow-lg"
      >
        Logout
      </UButton>
    </div>

    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UNotifications />
    <!-- <NuxtWelcome /> -->
  </div>
</template>
