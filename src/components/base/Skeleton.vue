<template>
  <main class="flex items-center justify-center">
    <div class="skeleton" :class="size"></div>
  </main>
</template>

<script setup>
const props = defineProps({
  size: { type: String },
});
</script>
