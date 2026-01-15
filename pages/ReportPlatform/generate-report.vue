<script setup lang="ts">
import Routes from '@/constants/Routes'
</script>

<template>
  <div>
    <UContainer>
      <SharedBorderedNavBar>
        <template #lead>
          <NuxtLink :to="Routes.DASHBOARD.path">
            <div class="pr-5 text-blue-500 cursor-pointer">
              <UIcon name="i-heroicons-arrow-small-left" />
            </div>
          </NuxtLink>
          <div class=" text-gray-400"><strong> Generate Report</strong></div>
        </template>
      </SharedBorderedNavBar>

      <div class="py-10 flex items-center justify-center">
        <UCard class="max-w-xl w-full text-center p-8">
          <h2 class="text-2xl font-semibold mb-4">Generate Report — Coming Soon</h2>
          <p class="text-gray-600 mb-6">This feature is coming soon. We'll notify you when it's available.</p>
          <div class="flex justify-center">
            <UButton :to="Routes.DASHBOARD.path" color="blue">Back to Dashboard</UButton>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
