<template>
  <ul class="menu">
    <li class="menu-title">{{ title }}</li>
    <slot></slot>
  </ul>
</template>

<script setup>
const props = defineProps({ title: String });
</script>
