<template>
  <BasePage
    :imageSrc="`/assets/images/profile/me1.webp`"
    imageAlt="Hello Me!"
    title="你好！"
    description="这是 KoMoriSam 的个人网站"
  >
    <p>在这里会分享一些正在做的小玩意</p>
    <ServerInfo />
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";
import ServerInfo from "@/components/ServerInfo.vue";
</script>
