<template>
  <nav class="flex items-center justify-between my-6 gap-1 md:gap-2">
    <!-- 上一章 -->
    <button
      class="btn btn-primary px-2 md:px-auto"
      :disabled="!hasPrevious || isLoadingContent"
      @click="handlePrev"
    >
      <i class="ri-arrow-left-s-line"></i>
      <span>上一章</span>
    </button>

    <Pagination v-if="totalPages > 1" />

    <!-- 下一章 -->
    <button
      class="btn btn-primary px-2 md:px-auto"
      :disabled="!hasNext || isLoadingContent"
      @click="handleNext"
    >
      <span>下一章</span>
      <i class="ri-arrow-right-s-line"></i>
    </button>
  </nav>
</template>

<script setup>
import { storeToRefs } from "pinia";

import { useChapters } from "@/composables/useChapters";

import { useNovelStore } from "@/stores/novelStore";

import Pagination from "@/components/base/Pagination.vue";

const novelStore = useNovelStore();
const { totalPages, isLoadingContent } = storeToRefs(novelStore);

const { hasPrevious, hasNext, handlePrev, handleNext } = useChapters();
</script>
