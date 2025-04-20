<template>
  <label
    for=""
    @click="scrollToTop"
    class="btn btn-soft btn-info btn-square btn-lg drawer-button z-1 fixed shadow-sm right-6 bottom-18 transition-opacity duration-500"
    :class="showButton ? 'opacity-100' : 'opacity-0'"
    aria-label="回到顶部"
  >
    <div class="tooltip tooltip-left" data-tip="回到顶部">
      <i class="ri-skip-up-line m-4"></i>
    </div>
  </label>
</template>

<script setup>
import { useScrollTo } from "@/composables/scrollTo";

const { showButton, scrollToTop, handleScroll } = useScrollTo();

handleScroll();
</script>
