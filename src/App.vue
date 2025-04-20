<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import NavBar from "@/components/layout/NavBar.vue";

import { checkUpdateNotice } from "@/utils/updateNotice";
import { useCleanOldStorage } from "@/utils/cleanOldStorage";

checkUpdateNotice();
useCleanOldStorage();
</script>
