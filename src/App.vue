<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import NavBar from "@/components/layout/NavBar.vue";

import { checkUpdateNotice } from "@/utils/update-notice";
import { useDiscardStorage } from "@/utils/discard-storage";

const isPrerenderBot = /HeadlessChrome|Prerender/i.test(navigator.userAgent);

onMounted(() => {
  if (isPrerenderBot) {
    localStorage.clear();
    return;
  }
  checkUpdateNotice();
});

useDiscardStorage();
</script>
