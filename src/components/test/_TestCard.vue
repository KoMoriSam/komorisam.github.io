<template>
  <div class="card bg-base-200/60 border border-base-300 p-6">
    <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({ title: String });
</script>
