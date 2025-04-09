<template>
  <BasePage
    :imageSrc="`/assets/images/profile/me3.png`"
    imageAlt="Contact Me!"
    title="联系我"
    description="可以加 QQ 和 微信 捏~"
  >
    <!-- 可选：插入额外内容 -->
    <address class="join max-sm:join-vertical">
      <a
        class="join-item btn btn-info text-info-content no-underline text-left justify-start"
        ><i class="ri-qq-fill"></i> 3593516798</a
      >
      <a
        class="join-item btn btn-info text-info-content no-underline text-left justify-start"
        ><i class="ri-wechat-fill"></i> MoriSam2023</a
      >
    </address>
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";
</script>
