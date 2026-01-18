<script setup lang="ts">
const printPage = () => {
  window.print()
}
</script>

<template>
  <UButton
    icon="i-heroicons-printer"
    color="gray"
    variant="outline"
    size="sm"
    @click="printPage"
    class="print:hidden"
  >
    Print / PDF
  </UButton>
</template>

<style scoped>
@media print {
  .print\\:hidden {
    display: none;
  }
}
</style>