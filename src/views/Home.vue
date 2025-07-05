<template>
  <BasePage
    :imageSrc="`/assets/images/profile/me1.webp`"
    imageAlt="Hello Me!"
    :title="greeting"
    :description
  >
    <ServerInfo />
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";
import ServerInfo from "@/components/ServerInfo.vue";

import { ref, onMounted } from "vue";

const greeting = ref("你好！");
const description = ref("欢迎来到我的个人网站！");

onMounted(() => {
  const isPrerenderBot = /HeadlessChrome|Prerender/i.test(navigator.userAgent);
  if (isPrerenderBot) return;
  const hour = new Date().getHours();
  if (hour < 6) {
    greeting.value = "凌晨好！";
    description.value = "夜深了，早点休息吧！";
  } else if (hour < 12) {
    greeting.value = "早上好！";
    description.value = "记得吃早餐哦！";
  } else if (hour < 14) {
    greeting.value = "中午好！";
    description.value = "午餐时间到了，休息一下吧！";
  } else if (hour < 18) {
    greeting.value = "下午好！";
    description.value = "工作辛苦了，喝杯茶放松一下！";
  } else if (hour < 21) {
    greeting.value = "晚上好！";
    description.value = "今天过得怎么样？";
  } else {
    greeting.value = "深夜好！";
    description.value = "记得照顾好自己！";
  }
});
</script>
