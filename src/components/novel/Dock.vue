<template>
  <aside class="max-lg:dock">
    <FloatingActionButton main-icon="ri-more-line" :actions="fabActions" />
  </aside>
</template>

<script setup>
import { computed } from "vue";
import FloatingActionButton from "@/components/ui/button/FloatingActionButton.vue";

const props = defineProps({
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

const fabActions = computed(() => [
  {
    key: "bottom",
    label: "至底部",
    icon: "ri-skip-down-line",
    buttonClass: "btn-info btn-soft",
    onClick: () => props.scrollToBottom(),
  },
  {
    key: "top",
    label: "至顶部",
    icon: "ri-skip-up-line",
    buttonClass: "btn-info btn-soft",
    onClick: () => props.scrollToTop(),
  },
  {
    key: "settings",
    for: "novel-sidebar",
    label: "阅读器设置",
    icon: "ri-settings-3-line",
    buttonClass: "btn-primary btn-soft",
    onClick: () => emitToolChange("FormatToolbox"),
  },
  // {
  //   key: "fullscreen",
  //   label: "全屏",
  //   icon: props.isFullscreen
  //     ? "ri-collapse-diagonal-fill"
  //     : "ri-expand-diagonal-fill",
  //   buttonClass: "btn-secondary btn-soft",
  //   onClick: () => props.toggle(),
  // },
  {
    key: "chapters",
    for: "novel-sidebar",
    label: "目录",
    icon: "ri-file-list-2-line",
    buttonClass: "btn-primary btn-soft",
    onClick: () => emitToolChange("Chapters"),
  },
  {
    key: "cover",
    label: "封面页",
    icon: "ri-arrow-go-back-line",
    buttonClass: "btn-secondary btn-soft",
    onClick: () => {
      props.scrollToTop();
      props.togglePage();
    },
  },
]);
</script>
