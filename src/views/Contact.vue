<template>
  <BasePage
    :imageSrc="`/assets/images/profile/me3.webp`"
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
      <div class="dropdown dropdown-right dropdown-center">
        <a
          tabindex="0"
          role="button"
          class="join-item btn btn-info text-info-content no-underline text-left justify-start relative group"
        >
          <i class="ri-wechat-fill"></i> MoriSam2023
        </a>
        <div
          tabindex="0"
          class="card card-sm dropdown-content bg-base-200 rounded-box z-1 w-32 sm:w-48 shadow-sm ml-2"
        >
          <section tabindex="0" class="card-body">
            <div
              class="aspect-square bg-base-content mask-contain mask-no-repeat mask-[url(/assets/images/profile/wechat.svg)]"
            >
              <div alt="" class="w-30 sm:w-46"></div>
            </div>
          </section>
        </div>
      </div>
    </address>
    <br />
  </BasePage>
</template>

<script setup>
import BasePage from "@/components/layout/BasePage.vue";
</script>
