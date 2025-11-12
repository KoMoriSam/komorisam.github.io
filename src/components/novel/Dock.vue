<template>
  <aside class="max-lg:dock">
    <FloatingButton
      for="novel-sidebar"
      icon="ri-settings-3-line"
      label="设置"
      position-classes="lg:bottom-88"
      button-class="lg:btn-primary"
      :onClick="() => emitToolChange('FormatToolbox')"
    />
    <FloatingButton
      for="novel-sidebar"
      icon="ri-file-list-2-line"
      label="目录"
      position-classes="lg:bottom-74"
      button-class="lg:btn-primary"
      :onClick="() => emitToolChange('Chapters')"
    />
    <FloatingButton
      for=""
      icon="ri-arrow-go-back-line"
      label="封面页"
      position-classes="lg:bottom-60"
      button-class="lg:btn-secondary"
      :onClick="
        () => {
          scrollToTop();
          togglePage();
        }
      "
    />
    <FloatingButton
      for=""
      :icon="
        isFullscreen ? 'ri-collapse-diagonal-fill' : 'ri-expand-diagonal-fill'
      "
      label="全屏"
      position-classes="lg:bottom-46"
      button-class="lg:btn-secondary"
      :onClick="toggle"
    />
    <FloatingButton
      for=""
      icon="ri-skip-up-line"
      label="回到顶部"
      position-classes="lg:bottom-32"
      button-class="lg:btn-info"
      :onClick="() => scrollToTop()"
    />
    <FloatingButton
      for=""
      icon="ri-skip-down-line"
      label="回到底部"
      position-classes="lg:bottom-18"
      button-class="lg:btn-info"
      :onClick="() => scrollToBottom()"
    />
  </aside>
</template>

<script setup>
import FloatingButton from "@/components/ui/button/FloatingButton.vue";

defineProps({
  togglePage: {
    type: Function,
    required: true,
  },
  scrollToTop: {
    type: Function,
    required: true,
  },
  scrollToBottom: {
    type: Function,
    required: true,
  },
  sideCurrentComponent: {
    type: String,
    required: true,
  },
  isFullscreen: {
    type: Boolean,
    required: true,
  },
  toggle: {
    type: Function,
    required: true,
  },
});

// 触发父组件事件
const emit = defineEmits(["update:sideCurrentComponent"]);
const emitToolChange = (component) => {
  emit("update:sideCurrentComponent", component);
};
</script>
