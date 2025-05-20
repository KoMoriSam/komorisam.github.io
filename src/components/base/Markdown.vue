<template>
  <header
    v-if="headerData"
    class="flex max-md:flex-col md:items-end gap-2 md:gap-0"
  >
    <h1 class="text-3xl font-bold">
      <span
        v-if="headerData.meta"
        class="badge badge-outline badge-info font-normal"
      >
        <i class="ri-book-marked-line"></i>
        {{ headerData.meta }}
      </span>
      <br />
      <i v-if="headerData.icon" :class="headerData.icon + ' font-normal'"></i>
      {{ headerData.title }}
      <div
        v-if="showRefresh"
        class="tooltip tooltip-bottom"
        data-tip="刷新内容"
      >
        <button class="btn btn-xs mb-1" @click="$emit('refresh')">
          <i class="ri-refresh-line"></i>
        </button>
      </div>
    </h1>
    <ul v-if="headerData.stats" class="md:ml-auto">
      <li v-for="(stat, index) in headerData.stats" :key="index">
        <span class="badge badge-sm">
          <i v-if="stat.icon" :class="stat.icon"></i>
          {{ stat.text }}
        </span>
      </li>
    </ul>
  </header>

  <Loading v-if="isLoading" />

  <article
    v-else
    class="prose prose-2xl max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-2xl prose-h4:text-2xl prose-p:text-justify quotes-none prose-blockquote:prose-p:not-italic prose-blockquote:prose-p:indent-0 prose-blockquote:ps-4 lg:prose-blockquote:ps-8 prose-blockquote:prose-p:text-left"
    :class="styleConfigs.fontStyle"
    :style="{
      '--para-font-size': `${styleConfigs.fontSize}px`,
      '--para-letter-spacing': `${styleConfigs.fontGap * 0.25}rem`,
      '--para-line-height': styleConfigs.lineHeight,
      '--para-margin-inline': `${
        styleConfigs.paraHeight *
        ((styleConfigs.fontSize * styleConfigs.lineHeight * 0.5) / 24)
      }rem`,
      '--para-text-indent': `calc(${styleConfigs.fontSize * 2}px 
      + ${styleConfigs.fontGap * 0.7}rem)`,
    }"
  >
    <vue-markdown
      v-if="content"
      :source="content"
      :options="options"
      :plugins="plugins"
    />
    <h1 v-else-if="!headerData">请选择内容</h1>
    <h1 v-else>加载失败，请稍后重试。</h1>
  </article>
</template>

<script setup>
import VueMarkdown from "vue-markdown-render";
import Loading from "@/components/base/Loading.vue";

const props = defineProps({
  // 内容数据
  content: {
    type: String,
    default: "",
  },

  // 头部数据
  headerData: {
    type: Object,
    default: () => ({
      title: "", // 主标题
      meta: "", // 元信息（副标题）
      icon: "", // 标题图标
      stats: [], // 统计信息数组
    }),
  },

  // 是否显示加载状态
  isLoading: {
    type: Boolean,
    default: false,
  },

  // 是否显示刷新按钮
  showRefresh: {
    type: Boolean,
    default: false,
  },

  // 样式配置
  styleConfigs: {
    type: Object,
    default: () => ({
      fontStyle: "font-kai", // 字体样式类名
      fontSize: 24, // 字体大小(px)
      fontGap: 0, // 字间距
      lineHeight: 1.5, // 行高
      paraHeight: 1.5, // 段落高度
    }),
  },
});

const emit = defineEmits(["refresh"]);

// Markdown 渲染选项
const options = {
  html: true,
  typographer: true,
};

import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItContainer from "markdown-it-container";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItKatex from "@vscode/markdown-it-katex";
import MarkdownItTaskLists from "markdown-it-task-lists";

// 封装 MarkdownItAnchor 插件（必须返回一个函数）
function anchorPlugin(md) {
  md.use(MarkdownItAnchor, {
    permalink: MarkdownItAnchor.permalink.linkAfterHeader({
      style: "visually-hidden",
      assistiveText: (title) => `跳转至 “${title}”`,
      visuallyHiddenClass: "hidden",
      wrapper: ['<div class="wrapper">', "</div>"],
    }),
  });
}

// 类型与图标/标题映射
const containerMeta = {
  success: {
    icon: "ri-checkbox-circle-line",
    title: "成功",
  },
  warning: {
    icon: "ri-alert-line",
    title: "警告",
  },
  error: {
    icon: "ri-close-circle-line",
    title: "错误",
  },
  info: {
    icon: "ri-information-line",
    title: "信息",
  },
  tip: {
    icon: "ri-lightbulb-flash-line",
    title: "Tip",
  },
};

function containerPlugin(md) {
  Object.keys(containerMeta).forEach((type) => {
    const { icon, title } = containerMeta[type];
    md.use(MarkdownItContainer, type, {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<div role="alert" class="alert alert-${type} alert-soft alert-vertical sm:alert-horizontal sm:gap-2 mb-4">
            <i class="${icon}"></i>
            <div>
              <h3>${title}</h3>
              <div>`;
        } else {
          return "</div></div></div>\n";
        }
      },
    });
  });
}

const plugins = [
  anchorPlugin,
  containerPlugin,
  MarkdownItFootnote,
  MarkdownItHighlightjs,
  MarkdownItKatex,
  MarkdownItTaskLists,
];
</script>
