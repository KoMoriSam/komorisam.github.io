<template>
  <div class="join flex items-center justify-center">
    <button
      class="join-item btn px-2"
      @click="handleAnyPage(currentChapterPage - 1)"
      :disabled="currentChapterPage === 1"
    >
      <i class="ri-arrow-left-s-line"></i>
    </button>
    <button class="join-item lg:hidden btn text-xs md:text-sm px-2 md:px-auto">
      <span class="hidden md:inline">第</span>
      {{ currentChapterPage }}
      <span class="hidden md:inline">页</span>
      /
      <span class="hidden md:inline">共</span>
      {{ totalPages }}
      <span class="hidden md:inline">页</span>
    </button>
    <button
      v-for="(page, idx) in totalPages"
      :key="idx"
      @click="handleAnyPage(idx + 1)"
      :class="idx === currentChapterPage - 1 ? 'btn-primary' : ''"
      class="hidden lg:flex join-item btn"
    >
      {{ page }}
    </button>
    <button
      class="join-item btn px-2"
      @click="handleAnyPage(currentChapterPage + 1)"
      :disabled="currentChapterPage === totalPages"
    >
      <i class="ri-arrow-right-s-line"></i>
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

import { useNovelStore } from "@/stores/novelStore";

// 状态管理
const novelStore = useNovelStore();
const { currentChapterPage, totalPages } = storeToRefs(novelStore);

import { useChapters } from "@/composables/useChapters";

const { handleAnyPage } = useChapters();
</script>
