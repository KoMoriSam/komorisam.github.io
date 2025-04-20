<template>
  <Menu :title="title">
    <template v-if="!style.isDefault(configKey)" #description>
      <a
        class="link link-info no-underline"
        @click="style.setDefault(configKey)"
      >
        恢复默认值
        <i class="ri-arrow-go-back-line"></i>
      </a>
    </template>
    <slot></slot>
  </Menu>
</template>

<script setup>
import { useReaderStyleStore } from "@/stores/readerStyle";

import Menu from "@/components/ui/menu/Menu.vue";

defineProps({
  title: String,
  configKey: String,
});

const style = useReaderStyleStore();
</script>
