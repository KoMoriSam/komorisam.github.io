<template>
  <ul class="menu">
    <li class="menu-title flex flex-row justify-between">
      {{ title }}
      <slot name="description"></slot>
    </li>
    <slot></slot>
  </ul>
</template>

<script setup>
const props = defineProps({ title: String });
</script>
