<template>
  <KeepAlive>
    <component
      :is="components[currentComponent]"
      :togglePage="toggleComponent"
      :currentPage="currentComponent"
    ></component>
  </KeepAlive>
</template>

<script setup>
import { useToggleComponent } from "@/composables/useToggleComponent";
import { useChapterSetup } from "@/composables/useChapterSetup";

import BookDetail from "@/components/novel/BookDetail.vue";
import Reader from "@/components/novel/Reader.vue";

const { setupWatchers } = useChapterSetup();
setupWatchers();

const components = {
  BookDetail,
  Reader,
};

const { currentComponent, toggleComponent } = useToggleComponent(
  "NOVEL_CURRENT_COMPONENT",
  "BookDetail",
  components
);
</script>
