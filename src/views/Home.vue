<template>
  <BasePage
    :imageSrc="`/assets/images/profile/me1.png`"
    imageAlt="Hello Me!"
    title="你好！"
    description="这是 KoMoriSam 的个人网站"
  >
    <p>在这里会分享一些正在做的小玩意</p>
    <router-link class="btn btn-xs no-underline mb-px" to="/changelog">
      更新日志
    </router-link>
    <br />
    <br />
    <small class="text-xs lg:text-sm text-base-content/50">
      在找旧版网页？
      <a
        class="btn btn-primary btn-soft btn-xs no-underline mb-px"
        href="/archive/home/index.html"
      >
        这里跳转
      </a>
    </small>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";
</script>
