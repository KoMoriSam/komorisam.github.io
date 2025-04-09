<template>
  <aside class="max-lg:dock">
    <FloatingButton
      for="my-drawer-2"
      icon="ri-settings-3-line"
      label="设置"
      position-classes="lg:bottom-88"
      button-class="lg:btn-primary"
      :onClick="() => emitToolChange('FormatToolbox')"
    />
    <FloatingButton
      for="my-drawer-2"
      icon="ri-file-list-2-line"
      label="目录"
      position-classes="lg:bottom-74"
      button-class="lg:btn-primary"
      :onClick="() => emitToolChange('ChapterList')"
    />
    <FloatingButton
      icon="ri-arrow-go-back-line"
      label="封面页"
      position-classes="lg:bottom-46"
      button-class="lg:btn-secondary"
      :onClick="
        () => {
          scrollToTop(0);
          toggleComponent();
        }
      "
    />
    <FloatingButton
      :icon="
        isFullscreen ? 'ri-collapse-diagonal-fill' : 'ri-expand-diagonal-fill'
      "
      label="全屏"
      position-classes="lg:bottom-60"
      button-class="lg:btn-secondary"
      :onClick="toggle"
    />
    <FloatingButton
      icon="ri-skip-up-line"
      label="回到顶部"
      position-classes="lg:bottom-32"
      button-class="lg:btn-info"
      :onClick="() => scrollToTop()"
    />
    <FloatingButton
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
  toggleComponent: {
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
  currentTool: {
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
const emit = defineEmits(["update:currentTool"]);
const emitToolChange = (tool) => {
  emit("update:currentTool", tool);
};
</script>
