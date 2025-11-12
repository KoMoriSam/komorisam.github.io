<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import NavBar from "@/components/layout/NavBar.vue";

import { checkUpdateNotice } from "@/utils/update-notice";
import { useStorageMigration } from "@/utils/storage/migrate-storage";
import { useDiscardStorage } from "@/utils/storage/discard-storage";

const isPrerenderBot = /HeadlessChrome|Prerender/i.test(navigator.userAgent);

onMounted(() => {
  if (isPrerenderBot) {
    localStorage.clear();
    return;
  }
  checkUpdateNotice();
});

// 执行迁移
const { migrateStorage } = useStorageMigration();
migrateStorage();
useDiscardStorage();
</script>
