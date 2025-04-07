<template>
  <BasePage
    :imageSrc="`/assets/image/me2.png`"
    imageAlt="About Me!"
    title="关于我"
    description="21 岁，是学生。"
  >
    <p>样样通，样样不精</p>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";
</script>
