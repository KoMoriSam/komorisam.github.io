<template>
  <Menu :title="title">
    <template v-if="!novelStore.isDefault(configKey)" #description>
      <a
        class="link link-info no-underline"
        @click="novelStore.setDefault(configKey)"
      >
        恢复默认值
        <i class="ri-arrow-go-back-line"></i>
      </a>
    </template>
    <slot></slot>
  </Menu>
</template>

<script setup>
import { useNovelStore } from "@/stores/novel";

import Menu from "@/components/ui/menu/Menu.vue";

defineProps({
  title: String,
  configKey: String,
});

const novelStore = useNovelStore();
</script>
