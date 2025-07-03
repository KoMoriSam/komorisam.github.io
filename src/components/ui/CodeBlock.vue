<template>
  <div class="relative">
    <slot></slot>
    <div
      v-if="isSupported"
      class="absolute right-8 top-1 tooltip tooltip-left"
      :class="copied ? 'tooltip-success' : 'tooltip-accent'"
      :data-tip="copied ? '复制成功' : '复制到剪贴板'"
    >
      <button
        class="btn btn-sm"
        @click="copy(props.code)"
        :class="{ 'btn-success': copied, 'btn-ghost': !copied }"
      >
        <i :class="copied ? 'ri-check-line' : 'ri-clipboard-line'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useClipboard } from "@vueuse/core";

const props = defineProps({
  code: String,
});

const { copy, copied, isSupported } = useClipboard({
  source: props.code,
});
</script>
