<template>
  <BasePage
    :imageSrc="`/assets/images/profile/me4.webp`"
    imageAlt="me!"
    title="Ah Oh!"
    description="404 Not Found :("
  >
    <button class="btn btn-primary mt-2 lg:mt-4" @click="route.push('/')">
      回到主页
    </button>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";

import { useRouter } from "vue-router";
const route = useRouter();
</script>
