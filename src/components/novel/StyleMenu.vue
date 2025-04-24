<template>
  <Menu :title="title">
    <template v-if="!style.isDefault(configKey)" #description>
      <a
        class="link link-info no-underline"
        @click="style.resetStyle(configKey)"
      >
        恢复默认值
        <i class="ri-arrow-go-back-line"></i>
      </a>
    </template>
    <slot></slot>
  </Menu>
</template>

<script setup>
import { useReaderStore } from "@/stores/readerStore";

import Menu from "@/components/ui/menu/Menu.vue";

defineProps({
  title: String,
  configKey: String,
});

const style = useReaderStore();
</script>
