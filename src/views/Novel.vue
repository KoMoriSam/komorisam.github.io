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

import NovelDetail from "@/components/novel/NovelDetail.vue";
import Reader from "@/components/novel/NovelReader.vue";

const { setupWatchers } = useChapterSetup();
setupWatchers();

const components = {
  NovelDetail,
  Reader,
};

import { useReaderSettingsStorage } from "@/utils/storage/new-reader-settings";
import { ref, watch } from "vue";

const { getSetting, setSetting } = useReaderSettingsStorage();

// 主组件切换逻辑
const currentComponent = ref(
  getSetting("NOVEL_CURRENT_COMPONENT", "NovelDetail"),
);

// 监听存储变化，确保响应式更新
watch(
  () => getSetting("NOVEL_CURRENT_COMPONENT"),
  (newValue) => {
    currentComponent.value = newValue;
  },
);

const toggleComponent = () => {
  const keys = Object.keys(components);
  const currentIndex = keys.indexOf(currentComponent.value);
  const newComponent = keys[(currentIndex + 1) % keys.length];
  setSetting("NOVEL_CURRENT_COMPONENT", newComponent);
  currentComponent.value = newComponent; // 立即更新本地状态
};
</script>
