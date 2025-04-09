<template>
  <BasePage
    :imageSrc="`/assets/images/profile/me1.png`"
    imageAlt="Hello Me!"
    title="你好！"
    description="这是 KoMoriSam 的个人网站"
  >
    <p>在这里会分享一些正在做的小玩意</p>
    <a
      class="btn btn-primary mt-2 lg:mt-4 no-underline"
      href="/archive/home/index.html"
    >
      <span class="badge badge-sm">在找以前的网页？</span>点这里跳转
    </a>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";

import { useRouter } from "vue-router";
const route = useRouter();
</script>
