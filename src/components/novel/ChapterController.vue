<template>
  <nav class="flex items-center justify-between my-6 gap-1 md:gap-2">
    <!-- 上一章 -->
    <button
      class="btn btn-primary px-2 md:px-auto"
      :disabled="!hasPrevious || isLoadingContent || isDisabled"
      @click="onHandlePrev"
    >
      <i class="ri-arrow-left-s-line"></i>
      <span>上一章</span>
    </button>

    <Pagination v-if="totalPages > 1" />

    <!-- 下一章 -->
    <button
      class="btn btn-primary px-2 md:px-auto"
      :disabled="!hasNext || isLoadingContent || isDisabled"
      @click="onHandleNext"
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

import { useClickLimit } from "@/composables/useClickLimit";

const { isDisabled, handleClick } = useClickLimit();

// 点击事件
const onHandlePrev = () => {
  handleClick(handlePrev);
};

const onHandleNext = () => {
  handleClick(handleNext);
};
</script>
