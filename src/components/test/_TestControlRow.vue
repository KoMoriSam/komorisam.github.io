<template>
  <div class="flex flex-col gap-1">
    <span class="text-xs font-semibold opacity-60">{{ label }}</span>
    <slot></slot>
    <code class="text-xs opacity-40">当前: {{ value }}</code>
  </div>
</template>

<script setup>
defineProps({ label: String, value: [Number, String] });
</script>
