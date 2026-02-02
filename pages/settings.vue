<script setup lang="ts">
import Routes from '@/constants/Routes'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <UContainer class="py-4">
        <div class="flex items-center space-x-4">
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="ghost"
            size="sm"
            :to="Routes.DASHBOARD.path"
            class="flex-shrink-0"
          />
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Settings</h1>
              <p class="text-sm text-gray-600">Configure application preferences</p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-10">
      <div class="flex items-center justify-center">
        <UCard class="max-w-xl w-full text-center p-8">
          <h2 class="text-2xl font-semibold mb-4">Settings — Coming Soon</h2>
          <p class="text-gray-600 mb-6">Application settings will be available here soon.</p>
          <div class="flex justify-center">
            <UButton :to="Routes.DASHBOARD.path" color="blue">Back to Dashboard</UButton>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
