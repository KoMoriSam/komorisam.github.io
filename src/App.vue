<template>
  <NavBar />
  <router-view />
  <BigUpdate />
</template>

<script setup>
import NavBar from "@/components/layout/NavBar.vue";
import BigUpdate from "@/components/base/BigUpdate.vue";
</script>
