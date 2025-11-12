<template>
  <main class="flex-1 m-0 p-0 w-full h-full">
    <SideBar>
      <template #content>
        <section
          class="flex-2 basis-xl m-6 max-lg:mb-0 max-w-6/7"
          ref="scrollRef"
        >
          <ChapterInfo
            v-if="latestChapter"
            badge="最新章节"
            :content="latestChapter.title"
            :additionalClasses="`btn-soft lg:btn-lg
            ${isDisabled ? 'btn-disabled' : ''}`"
            :onClick="onClick"
          />
          <ChapterController />
          <Markdown
            v-if="currentChapter"
            :content="currentPageContent"
            :is-loading="isLoadingContent"
            :show-refresh="true"
            @refresh="novelStore.refreshContent"
            :header-data="{
              title: currentChapter.title,
              uuid: currentChapterUuid,
              page: currentChapterPage,
              meta: currentChapter.volumeTitle,
              icon: 'ri-article-line',
              stats: [
                {
                  icon: 'ri-time-line',
                  text: useDateFormat(
                    currentChapter.uploadDate,
                    'YYYY/M/D H:mm 上传'
                  ),
                },
                ...(currentChapter.modifiedDate
                  ? [
                      {
                        icon: 'ri-file-edit-line',
                        text: useDateFormat(
                          currentChapter.modifiedDate,
                          'YYYY/M/D H:mm 修改'
                        ),
                      },
                    ]
                  : []),
                {
                  icon: 'ri-file-text-line',
                  text: `约 ${currentChapter.length} 字`,
                },
              ],
            }"
            :style-configs="styleConfigs"
          />
          <ChapterController v-if="!isLoadingContent" />
        </section>

        <section
          class="flex-1 mx-12 max-lg:mt-0 mt-6 md:w-[10%] md:sticky md:top-12 basis-xs prose"
        >
          <h1 class="inline">
            {{ currentMapping === "title" ? "本章说" : "本书说" }}
          </h1>
          <button
            class="btn btn-info btn-soft btn-xs mx-2 mb-4"
            @click="commentToggle"
          >
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
          :sideCurrentComponent
          :isFullscreen
          :toggle
          @update:sideCurrentComponent="handleSideComponentUpdate"
        />
      </template>

      <template #aside>
        <KeepAlive>
          <component :is="components[sideCurrentComponent]"></component>
        </KeepAlive>
      </template>
    </SideBar>
  </main>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useNovelStore } from "@/stores/novelStore";
import { useReaderStore } from "@/stores/readerStore";
import { useThemeStore } from "@/stores/themeStore";

import Giscus from "@giscus/vue";
import SideBar from "@/components/layout/SideBar.vue";
import Chapters from "@/components/novel/Chapters.vue";
import ChapterController from "@/components/novel/ChapterController.vue";
import FormatToolbox from "@/components/novel/FormatToolbox.vue";
import Markdown from "@/components/articles/Markdown.vue";
import ChapterInfo from "@/components/novel/ChapterInfo.vue";
import Dock from "@/components/novel/Dock.vue";

import { useDateFormat } from "@vueuse/core";
import { useFullscreen } from "@vueuse/core";
import { useChapters } from "@/composables/useChapters";
import { useGiscus } from "@/composables/useGiscus";
import { useScrollTo } from "@/composables/useScrollTo";
import { useClickLimit } from "@/composables/useClickLimit";

const novelStore = useNovelStore();
const {
  currentPageContent,
  latestChapter,
  currentChapter,
  currentChapterUuid,
  currentChapterPage,
  isLoadingContent,
} = storeToRefs(novelStore);

const readerStore = useReaderStore();
const { styleConfigs } = storeToRefs(readerStore);

const themeStore = useThemeStore();
const { giscusTheme } = storeToRefs(themeStore);

const components = {
  Chapters,
  FormatToolbox,
};

import { ref, watch } from "vue";
import { useReaderSettingsStorage } from "@/utils/storage/new-reader-settings-storage";
const { getValue, setValue } = useReaderSettingsStorage();
const sideCurrentComponent = ref(
  getValue("NOVEL_SIDE_CURRENT_COMPONENT", "Chapters")
);

// 同样监听侧边栏组件变化
watch(
  () => getValue("NOVEL_SIDE_CURRENT_COMPONENT"),
  (newValue) => {
    sideCurrentComponent.value = newValue;
  }
);

const handleSideComponentUpdate = (component) => {
  setValue("NOVEL_SIDE_CURRENT_COMPONENT", component);
};

const { currentMapping, commentToggle } = useGiscus();

const { isFullscreen, toggle } = useFullscreen();

const { scrollRef, scrollToTop, scrollToBottom } = useScrollTo();

const { handleRecentChapter } = useChapters();

const { isDisabled, handleClick } = useClickLimit();
const onClick = () => {
  handleClick(handleRecentChapter);
};

const props = defineProps({
  togglePage: {
    type: Function,
    required: true,
  },
});
</script>
