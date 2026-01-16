<script setup lang="ts">
const { isOnline } = useNetworkStatus();
</script>

<template>
  <div class="flex items-center space-x-2">
    <div
      class="w-3 h-3 rounded-full"
      :class="isOnline ? 'bg-green-500' : 'bg-red-500'"
    ></div>
    <span class="text-sm font-medium" :class="isOnline ? 'text-green-700' : 'text-red-700'">
      {{ isOnline ? 'Online' : 'Offline' }}
    </span>
  </div>
</template>