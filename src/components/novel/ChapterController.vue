<template>
  <div class="flex items-center justify-between my-6 gap-1 md:gap-2">
    <!-- 上一章 -->
    <button
      class="btn btn-primary px-2 md:px-auto"
      :disabled="!hasPrevious || novelStore.isLoadingContent"
      @click="handlePrev"
    >
      <i class="ri-arrow-left-s-line"></i>
      <span>上一章</span>
    </button>

    <Pagination v-if="novelStore.totalPages > 1" />

    <!-- 下一章 -->
    <button
      class="btn btn-primary px-2 md:px-auto"
      :disabled="!hasNext || novelStore.isLoadingContent"
      @click="handleNext"
    >
      <span>下一章</span>
      <i class="ri-arrow-right-s-line"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useNovelStore } from "@/stores/novel";

import Pagination from "@/components/ui/Pagination.vue";

const novelStore = useNovelStore();

const router = useRouter();

const hasPrevious = computed(() => novelStore.currentChapterId > 1);

const hasNext = computed(
  () => novelStore.currentChapterId < novelStore.flatChapterList.length
);

const handlePrev = () => {
  router.push({ query: { chapter: novelStore.currentChapterId - 1, page: 1 } });
  window.scrollTo({ top: 200, behavior: "smooth" });
};

const handleNext = () => {
  router.push({ query: { chapter: novelStore.currentChapterId + 1, page: 1 } });
  window.scrollTo({ top: 200, behavior: "smooth" });
};
</script>
