<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import NavBar from "@/components/layout/NavBar.vue";

import { checkUpdateNotice } from "@/utils/update-notice";
import { useCleanOldStorage } from "@/utils/discard-storage";

checkUpdateNotice();
useCleanOldStorage();
</script>
