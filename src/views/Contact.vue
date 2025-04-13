<template>
  <BasePage
    :imageSrc="`/assets/images/profile/me3.png`"
    imageAlt="Contact Me!"
    title="联系我"
    description="可以加 QQ 和 微信 捏~"
  >
    <br />
    <address class="join max-sm:join-vertical relative">
      <a
        class="join-item btn btn-info text-info-content no-underline text-left justify-start"
        href="https://qm.qq.com/q/eYk72ol3qg"
        target="_blank"
      >
        <i class="ri-qq-fill"></i> 3593516798
      </a>
      <a
        class="join-item btn btn-info text-info-content no-underline text-left justify-start relative group"
      >
        <i class="ri-wechat-fill"></i> MoriSam2023
        <!-- 悬停时显示的图片 -->
        <img
          class="card bg-base-100 shadow-xl absolute left-42 p-2 mt-2 opacity-0 w-32 h-32 group-hover:opacity-100 transition-opacity duration-250"
          src="/assets/images/profile/wechat.png"
          alt="My WeChat QR Code"
        />
      </a>
    </address>
    <br />
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";
</script>
