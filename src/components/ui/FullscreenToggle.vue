<template>
  <button
    @click="toggle()"
    class="btn btn-soft btn-primary btn-square btn-lg drawer-button z-1 lg:hidden fixed max-md:left-6 md:right-6 bottom-24 md:bottom-64"
  >
    {{ isFullscreen ? "退出全屏" : "进入全屏" }}
  </button>
</template>

<script setup>
import { ref } from "vue";
import { useFullscreen } from "@vueuse/core";

const target = ref(null);
const { isFullscreen, toggle } = useFullscreen(target);
</script>
