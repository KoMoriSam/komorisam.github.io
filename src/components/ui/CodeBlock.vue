<template>
  <div class="relative group">
    <pre><code ref="codeEl" class="hljs" :class="`language-${language}`">{{ code }}</code></pre>

    <div
      v-if="isSupported"
      class="absolute right-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity tooltip tooltip-left"
      :class="copied ? 'tooltip-success' : 'tooltip-accent'"
      :data-tip="copied ? '复制成功' : '复制到剪贴板'"
    >
      <button
        class="btn btn-sm"
        @click="copy(code)"
        :class="{ 'btn-success': copied, 'btn-ghost': !copied }"
      >
        <i :class="copied ? 'ri-check-line' : 'ri-clipboard-line'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useClipboard } from "@vueuse/core";
import { ref } from "vue";

// 接收 props
const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: "plaintext" },
});

const code = props.code;
const codeEl = ref(null);

// 复制功能
const { copy, copied, isSupported } = useClipboard({
  source: code,
});
</script>
