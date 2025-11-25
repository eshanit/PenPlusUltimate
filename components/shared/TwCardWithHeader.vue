<script setup lang="ts">
</script>
<template>
  <TwCard>
    <div class="border-b border-gray-400 pb-5">
      <slot name="header"></slot>
    </div>
    <div class="pt-5">
      <slot name="body"></slot>
    </div>
  </TwCard>
</template>