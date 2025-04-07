<template>
  <KeepAlive>
    <component
      :is="components[currentComponent]"
      :toggleComponent="toggleComponent"
      :currentComponent="currentComponent"
    ></component>
  </KeepAlive>
</template>

<script setup>
import { useStorage } from "@vueuse/core";

import BookDetail from "@/components/novel/BookDetail.vue";
import Reader from "@/components/novel/Reader.vue";

const currentComponent = useStorage("NOVEL_CURRENT_COMPONENT", "BookDetail");
const components = {
  BookDetail,
  Reader,
};

// 切换页面的方法
const toggleComponent = () => {
  currentComponent.value =
    currentComponent.value === "BookDetail" ? "Reader" : "BookDetail";
};
</script>
