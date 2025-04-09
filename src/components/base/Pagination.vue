<template>
  <div class="join flex items-center justify-center">
    <button
      class="join-item btn px-2"
      @click="handleChange(novelStore.currentChapterPage - 1)"
      :disabled="novelStore.currentChapterPage === 1"
    >
      <i class="ri-arrow-left-s-line"></i>
    </button>
    <button class="join-item lg:hidden btn text-xs md:text-sm px-2 md:px-auto">
      <span class="hidden md:inline">第</span>
      {{ novelStore.currentChapterPage }}
      <span class="hidden md:inline">页</span>
      /
      <span class="hidden md:inline">共</span>
      {{ novelStore.totalPages }}
      <span class="hidden md:inline">页</span>
    </button>
    <button
      v-for="(page, idx) in novelStore.totalPages"
      :key="idx"
      @click="handleChange(idx + 1)"
      :class="idx === novelStore.currentChapterPage - 1 ? 'btn-primary' : ''"
      class="hidden lg:flex join-item btn"
    >
      {{ page }}
    </button>
    <button
      class="join-item btn px-2"
      @click="handleChange(novelStore.currentChapterPage + 1)"
      :disabled="novelStore.currentChapterPage === novelStore.totalPages"
    >
      <i class="ri-arrow-right-s-line"></i>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useNovelStore } from "@/stores/novel";

// 状态管理
const novelStore = useNovelStore();

const router = useRouter();

const handleChange = (pageIndex) => {
  router.push({
    query: { chapter: novelStore.currentChapterId, page: pageIndex },
  }); // 修改 URL，触发 `watch` 监听
  window.scrollTo({ top: 200, behavior: "smooth" });
};
</script>
