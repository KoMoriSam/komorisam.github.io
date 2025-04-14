<template>
  <main class="flex-1 m-0 p-0 w-full h-full">
    <SideBar>
      <template #content>
        <section class="flex-2 basis-xl m-6 max-lg:mb-0" ref="scrollRef">
          <ChapterInfo
            v-if="latestChapter"
            badgeText="最新章节"
            :content="latestChapter.title"
            additionalClasses="btn-info lg:btn-lg"
            :onClick="handleRecentChapter"
          />
          <Modal
            :visible="showModal"
            title="已经是最新章节啦！"
            @close="handleModalClose()"
          />
          <ChapterController />
          <Markdown />
          <ChapterController v-if="!isLoadingContent" />
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
            :key="currentChapter?.title"
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
            :theme="giscusTheme"
            lang="zh-CN"
            loading="lazy"
          />
        </section>

        <Dock
          :togglePage
          :scrollToTop
          :scrollToBottom
          :currentComponent
          :isFullscreen
          :toggle
          @update:currentComponent="
            (component) => (currentComponent = component)
          "
        />
      </template>

      <template #aside>
        <!-- <BookToc /> -->
        <KeepAlive>
          <component :is="components[currentComponent]"></component>
        </KeepAlive>
      </template>
    </SideBar>
  </main>
</template>

<script setup>
import { storeToRefs } from "pinia";
import Giscus from "@giscus/vue";

import { useChapters } from "@/composables/chapters";
import { useGiscus } from "@/composables/giscus";
import { useFullscreen } from "@vueuse/core";
import { useScrollTo } from "@/composables/scrollTo";
import { useToggleComponent } from "@/composables/toggleComponent";

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

// 状态管理
const novelStore = useNovelStore();
const { latestChapter, currentChapter, isLoadingContent } =
  storeToRefs(novelStore);
const themeStore = useThemeStore();
const { giscusTheme } = storeToRefs(themeStore);

const { currentMapping, commentToggle } = useGiscus();

const { isFullscreen, toggle } = useFullscreen();

const { scrollRef, scrollToTop, scrollToBottom } = useScrollTo();

const { showModal, handleModalClose, handleRecentChapter } = useChapters();

const components = {
  ChapterList,
  FormatToolbox,
};

const { currentComponent } = useToggleComponent(
  "NOVEL_SIDE_CURRENT_COMPONENT",
  "ChapterList",
  components
);

const props = defineProps({
  togglePage: {
    type: Function,
    required: true,
  },
});
</script>
