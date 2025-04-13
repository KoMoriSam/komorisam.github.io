<template>
  <main class="flex-1 m-0 p-0 w-full h-full">
    <SideBar>
      <template #content ref="mainContainer">
        <section class="flex-2 basis-xl m-6 max-lg:mb-0" ref="scrollRef">
          <ChapterInfo
            v-if="novelStore.latestChapter"
            badgeText="最新章节"
            :content="novelStore.latestChapter.name"
            additionalClasses="btn-info lg:btn-lg mb-6"
            :onClick="() => handleChange(novelStore.latestChapter)"
          />
          <Modal
            :visible="showModal"
            title="已经是最新章节啦！"
            @close="showModal = false"
          />
          <ChapterInfo
            badgeText="当前章节"
            :content="
              novelStore.currentChapterInfo
                ? novelStore.currentChapterInfo.chapter.name
                : '请选择章节'
            "
            additionalClasses="lg:btn-lg"
          >
            <div class="tooltip tooltip-bottom" data-tip="刷新当前章节">
              <button class="btn lg:btn-lg" @click="novelStore.refreshContent">
                <i class="ri-refresh-line"></i>
              </button>
            </div>
          </ChapterInfo>

          <ChapterController />
          <Markdown />
          <ChapterController v-if="!novelStore.isLoadingContent" />
        </section>

        <section
          class="flex-1 mx-12 max-lg:mt-0 mt-6 md:w-[10%] md:sticky md:top-12 basis-xs prose"
        >
          <h1 class="inline">
            {{ currentMapping === "title" ? "本章说" : "本书说" }}
          </h1>
          <button class="btn btn-info btn-xs mx-2 mb-4" @click="commentToggle">
            {{ currentMapping === "title" ? "切换本书说" : "切换本章说" }}
          </button>
          <Giscus
            :key="novelStore.currentChapterInfo?.chapter.name"
            repo="KoMoriSam/komorisam.github.io"
            repo-id="R_kgDOJxn8KA"
            category="General"
            category-id="DIC_kwDOJxn8KM4Cnp6m"
            :mapping="currentMapping"
            term="向远方"
            strict="0"
            reactions-enabled="1"
            emit-metadata="0"
            input-position="top"
            :theme="themeStore.giscusTheme"
            lang="zh-CN"
            loading="lazy"
          />
        </section>

        <Dock
          :toggleComponent="toggleComponent"
          :scrollToTop="scrollToTop"
          :scrollToBottom="scrollToBottom"
          :currentTool="currentTool"
          :isFullscreen="isFullscreen"
          :toggle="toggle"
          @update:currentTool="(tool) => (currentTool = tool)"
        />
      </template>

      <template #aside>
        <KeepAlive>
          <component :is="tools[currentTool]"></component>
        </KeepAlive>
      </template>
    </SideBar>
  </main>
</template>

<script setup>
import { ref, onMounted, onActivated, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFullscreen } from "@vueuse/core";
import Giscus from "@giscus/vue";

import { useNovelStore } from "@/stores/novel";
import { useThemeStore } from "@/stores/theme";

import SideBar from "@/components/layout/SideBar.vue";
import ChapterList from "@/components/novel/ChapterList.vue";
import ChapterController from "@/components/novel/ChapterController.vue";
import FormatToolbox from "@/components/novel/FormatToolbox.vue";
import Markdown from "@/components/Markdown.vue";
import ChapterInfo from "@/components/novel/ChapterInfo.vue";
import Dock from "@/components/novel/Dock.vue";
import Modal from "@/components/ui/feedback/Modal.vue";

// 路由相关
const route = useRoute();
const router = useRouter();

// 状态管理
const novelStore = useNovelStore();
const themeStore = useThemeStore();
const showModal = ref(false);

const currentTool = ref("ChapterList");
const tools = {
  ChapterList,
  FormatToolbox,
};
const props = defineProps({
  toggleComponent: {
    type: Function,
    required: true,
  },
  currentComponent: {
    type: String,
    required: true,
  },
});

const currentMapping = ref("title");

// 切换评论映射
const commentToggle = () => {
  currentMapping.value =
    currentMapping.value === "title" ? "specific" : "title";
};

// 监听路由参数变化
watch(
  () => route.query.chapter,
  async (newId) => {
    if (newId) {
      await novelStore.setChapter(Number(newId));
    }
  }
);

watch(
  () => route.query.page,
  (newPage) => {
    if (newPage) {
      novelStore.setPage(Number(newPage));
    }
  }
);

// 初始化加载
onMounted(async () => {
  await novelStore.setChapterList();
  if (route.query.chapter) {
    await novelStore.setChapter(Number(route.query.chapter));
  }
  novelStore.updateTitle();
  if (route.query.page) {
    novelStore.setPage(Number(route.query.page));
  }
});

// 监听章节变化，自动更新标题
watch(
  () => [novelStore.currentChapterId, novelStore.currentChapterPage],
  () => {
    novelStore.updateTitle();
  }
);

// 在组件挂载或激活时重新更新标题
onActivated(() => {
  novelStore.updateTitle();
});

// 事件处理函数
const handleChange = (chapter) => {
  if (chapter.id === novelStore.currentChapterId) {
    // 如果是最新章节，弹出对话框
    showModal.value = true;
  } else {
    // 如果不是最新章节，切换到最新章节
    router.push({ query: { chapter: chapter.id, page: 1 } });
  }
};

// 全屏相关
const mainContainer = ref(null);
const { isFullscreen, toggle } = useFullscreen(mainContainer);

const scrollToTop = (position = 110) => {
  window.scrollTo({ top: position, behavior: "smooth" });
};

const scrollRef = ref(null);
const scrollToBottom = () => {
  setTimeout(() => {
    console.log("内容增加时", scrollRef.value.scrollHeight);
    window.scrollTo({
      top: scrollRef.value.scrollHeight,
      behavior: "smooth",
    });
  }, 20); // 注意这里需要延迟20ms正好可以获取到更新后的dom节点
};
</script>
