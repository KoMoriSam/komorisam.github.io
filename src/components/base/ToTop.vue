<template>
  <button
    @click="scrollToTop"
    class="fixed right-6 lg:right-12 bottom-18 btn btn-square btn-soft btn-lg btn-info shadow-sm"
    :class="showButton ? '' : 'hidden'"
    title="回到顶部"
  >
    <i class="ri-skip-up-line"></i>
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const showButton = ref(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleScroll = () => {
  showButton.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

defineExpose({ scrollToTop });
</script>
