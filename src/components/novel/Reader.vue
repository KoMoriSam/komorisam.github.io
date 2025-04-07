<template>
  <main class="flex-1 m-0 p-0 w-full h-full">
    <SideBar>
      <template #content ref="mainContainer">
        <section class="flex-2 basis-xl m-6 max-lg:mb-0" ref="scrollRef">
          <ChapterInfo
            v-if="novelStore.latestChapter"
            badgeText="最新章节"
            :content="novelStore.latestChapter.name"
            additionalClasses="btn-info lg:btn-lg w-full mb-6"
            :onClick="() => handleChange(novelStore.latestChapter)"
          />
          <ChapterInfo
            badgeText="当前章节"
            :content="
              novelStore.currentChapterInfo
                ? novelStore.currentChapterInfo.chapter.name
                : '请选择章节'
            "
            additionalClasses="w-full lg:btn-lg"
          />
          <ChapterController />
          <Markdown />
          <ChapterController v-if="!novelStore.isLoadingContent" />
        </section>

        <section
          class="flex-1 mx-12 max-lg:mt-0 mt-6 md:w-[10%] md:sticky md:top-12 basis-xs"
        >
          <article class="prose mb-3">
            <h1 class="inline">
              {{ currentMapping === "title" ? "本章说" : "本书说" }}
            </h1>
            <button
              class="btn btn-info btn-xs mx-2 mb-4"
              @click="commentToggle"
            >
              {{ currentMapping === "title" ? "切换本书说" : "切换本章说" }}
            </button>
          </article>
          <Giscus
            :key="novelStore.currentChapterInfo?.chapter.name"
            repo="KoMoriSam/komorisam.github.io"
            repo-id="R_kgDOJxn8KA"
            category="Announcements"
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

        <aside class="max-lg:dock">
          <FloatingButton
            for="my-drawer-2"
            icon="ri-settings-3-line"
            label="设置"
            position-classes="lg:bottom-88"
            button-class="lg:btn-primary"
            :onClick="() => (currentTool = 'FormatToolbox')"
          />
          <FloatingButton
            for="my-drawer-2"
            icon="ri-file-list-2-line"
            label="目录"
            position-classes="lg:bottom-74"
            button-class="lg:btn-primary"
            :onClick="() => (currentTool = 'ChapterList')"
          />
          <FloatingButton
            icon="ri-arrow-go-back-line"
            label="封面页"
            position-classes="lg:bottom-46"
            button-class="lg:btn-secondary"
            :onClick="
              () => {
                scrollToTop(0);
                toggleComponent();
              }
            "
          />
          <FloatingButton
            :icon="
              isFullscreen
                ? 'ri-collapse-diagonal-fill'
                : 'ri-expand-diagonal-fill'
            "
            label="全屏"
            position-classes="lg:bottom-60"
            button-class="lg:btn-secondary"
            :onClick="toggle"
          />
          <FloatingButton
            icon="ri-skip-up-line"
            label="回到顶部"
            position-classes="lg:bottom-32"
            button-class="lg:btn-info"
            :onClick="() => scrollToTop()"
          />
          <FloatingButton
            icon="ri-skip-down-line"
            label="回到底部"
            position-classes="lg:bottom-18"
            button-class="lg:btn-info"
            :onClick="() => scrollToBottom()"
          />
        </aside>
      </template>

      <template #aside>
        <KeepAlive>
          <component
            :is="tools[currentTool]"
            :toggleComponent="toggleComponent"
            :currentComponent="currentComponent"
          ></component>
        </KeepAlive>
      </template>
    </SideBar>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch, onUpdated } from "vue";
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
import FloatingButton from "@/components/ui/button/FloatingButton.vue";

// 路由相关
const route = useRoute();
const router = useRouter();

// 状态管理
const novelStore = useNovelStore();
const themeStore = useThemeStore();

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
  router.push({ query: { chapter: chapter.id, page: 1 } }); // 修改 URL，触发 `watch` 监听
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
