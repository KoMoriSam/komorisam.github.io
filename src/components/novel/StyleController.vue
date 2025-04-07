<template>
  <Menu title="字体大小">
    <NumberController
      v-model="novelStore.styleConfigs.fontSize"
      :step="1"
      :places="0"
      :min="16"
      :max="32"
    />
    <RangeController
      v-model="novelStore.styleConfigs.fontSize"
      :step="1"
      :places="0"
      :min="16"
      :max="32"
    />
  </Menu>
</template>

<script setup>
import { useNovelStore } from "@/stores/novel";

import Menu from "@/components/ui/menu/Menu.vue";
import NumberController from "@/components/ui/input/NumberController.vue";
import RangeController from "@/components/ui/input/RangeController.vue";

const novelStore = useNovelStore();
</script>
