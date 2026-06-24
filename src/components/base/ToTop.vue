<template>
  <FloatingActionButton
    :main-on-click="scrollToTop"
    :main-visible="showButton"
    main-icon="ri-skip-up-line"
    main-button-class="btn-info btn-soft"
    main-label="回到顶部"
    :fab-class="
      [
        'fixed right-6 bottom-18 z-1 transition-opacity duration-500',
        showButton ? 'opacity-100' : 'opacity-0 pointer-events-none',
      ].join(' ')
    "
  />
</template>

<script setup>
import FloatingActionButton from "@/components/ui/button/FloatingActionButton.vue";

import { useScrollTo } from "@/composables/useScrollTo";

const { showButton, scrollToTop, handleScroll } = useScrollTo();

handleScroll();
</script>
