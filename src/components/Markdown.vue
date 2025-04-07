<template>
  <Loading
    v-if="novelStore.currentChapterInfo && novelStore.isLoadingContent"
  />
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
      v-if="novelStore.totalPages > 0"
      :source="novelStore.currentPageContent"
      :options="options"
    />
    <h1 v-else-if="!novelStore.currentChapterInfo">请选择章节</h1>
    <h1 v-else>加载失败，请稍后重试。</h1>
  </article>
</template>

<script setup>
import { useNovelStore } from "@/stores/novel";

import VueMarkdown from "vue-markdown-render";
import Loading from "@/components/ui/Loading.vue";

// 状态管理
const novelStore = useNovelStore();

// Markdown 渲染选项
const options = {
  html: true,
  typographer: true,
};
</script>
