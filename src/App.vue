<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import NavBar from "@/components/layout/NavBar.vue";
import { checkUpdateNotice } from "@/utils/updateNotice";

checkUpdateNotice();
</script>
