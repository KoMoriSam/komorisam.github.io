<template>
  <KeepAlive>
    <component
      :is="components[currentComponent]"
      :togglePage="toggleComponent"
    ></component>
  </KeepAlive>
</template>

<script setup>
import { useChapterSetup } from "@/composables/useChapterSetup";

import BookDetail from "@/components/novel/BookDetail.vue";
import Reader from "@/components/novel/Reader.vue";

const { setupWatchers } = useChapterSetup();
setupWatchers();

const components = {
  BookDetail,
  Reader,
};

import { useReaderSettingsStorage } from "@/utils/storage/new-reader-settings-storage";
import { ref, watch } from "vue";

const { getValue, setValue } = useReaderSettingsStorage();

// 主组件切换逻辑
const currentComponent = ref(getValue("NOVEL_CURRENT_COMPONENT", "BookDetail"));

// 监听存储变化，确保响应式更新
watch(
  () => getValue("NOVEL_CURRENT_COMPONENT"),
  (newValue) => {
    currentComponent.value = newValue;
  }
);

const toggleComponent = () => {
  const keys = Object.keys(components);
  const currentIndex = keys.indexOf(currentComponent.value);
  const newComponent = keys[(currentIndex + 1) % keys.length];
  setValue("NOVEL_CURRENT_COMPONENT", newComponent);
  currentComponent.value = newComponent; // 立即更新本地状态
};
</script>
