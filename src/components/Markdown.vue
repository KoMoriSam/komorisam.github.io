<template>
  <header
    v-if="currentChapter"
    class="flex max-md:flex-col md:items-center gap-2 md:gap-0"
  >
    <h1 class="text-3xl font-bold">
      {{ currentChapter.title }}
      <div class="tooltip tooltip-bottom" data-tip="刷新当前章节">
        <button class="btn btn-xs mb-1" @click="novelStore.refreshContent()">
          <i class="ri-refresh-line"></i>
        </button>
      </div>
    </h1>
    <ul class="md:ml-auto">
      <li>
        <span class="badge badge-sm">
          <i class="ri-time-line"></i>
          {{ formatDate(currentChapter.date) }}
        </span>
      </li>
      <li>
        <span class="badge badge-sm">
          <i class="ri-file-text-line"></i>
          {{ currentChapter.length }} 字
        </span>
      </li>
    </ul>
  </header>
  <Loading v-if="currentChapterContent && isLoadingContent" />
  <article
    v-else
    class="prose prose-2xl max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-2xl prose-h4:text-2xl prose-p:text-justify quotes-none prose-blockquote:prose-p:not-italic prose-blockquote:prose-p:indent-0 prose-blockquote:ps-4 lg:prose-blockquote:ps-8 prose-blockquote:prose-p:text-left"
    :class="novelStore.styleConfigs.fontStyle"
    :style="{
      fontSize: `${novelStore.styleConfigs.fontSize}px`,
      letterSpacing: `${novelStore.styleConfigs.fontGap * 0.25}rem`,
      lineHeight: novelStore.styleConfigs.lineHeight,
      '--para-margin-inline': `${novelStore.styleConfigs.paraHeight}rem`,
      '--para-text-indent': `calc(${novelStore.styleConfigs.fontSize * 2}px + ${
        novelStore.styleConfigs.fontGap * 0.6
      }rem)`,
    }"
  >
    <vue-markdown
      v-if="totalPages > 0"
      :source="currentPageContent"
      :options="options"
    />
    <h1 v-else-if="!currentChapterContent">请选择章节</h1>
    <h1 v-else>加载失败，请稍后重试。</h1>
  </article>
</template>

<script setup>
import { storeToRefs } from "pinia";

import { useChapters } from "@/composables/chapters";

import { useNovelStore } from "@/stores/novel";

import VueMarkdown from "vue-markdown-render";
import Loading from "@/components/base/Loading.vue";

// 状态管理
const novelStore = useNovelStore();
const {
  currentChapter,
  currentChapterContent,
  currentPageContent,
  isLoadingContent,
  totalPages,
} = storeToRefs(novelStore);

const { formatDate } = useChapters();

// Markdown 渲染选项
const options = {
  html: true,
  typographer: true,
};
</script>
