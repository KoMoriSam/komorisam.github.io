<template>
  <main
    class="flex-1 flex flex-wrap m-12 items-start justify-center lg:justify-evenly gap-4"
  >
    <section class="hero basis-2xs">
      <figure class="hero-content relative flex flex-col w-full m-0 p-0">
        <div
          v-show="!imageLoaded"
          class="skeleton absolute inset-0 aspect-12/17 w-full rounded-lg z-20"
        ></div>
        <img
          v-fade-in
          src="/assets/images/covers/theHorizon.webp"
          alt="向远方"
          class="w-full aspect-12/17 object-cover rounded-lg shadow-2xl z-10"
          @load="handleImageLoad"
        />
        <figcaption class="relative z-0 pt-6">
          <h1 class="text-5xl font-bold">向远方</h1>
          <p class="py-6">
            慌张中，才学会张口……<br />
            匆忙中，才学会乡音……
          </p>
          <ChapterInfo
            badge="开始阅读"
            :content="
              flatChapters.length > 0 ? flatChapters[0]?.title : '加载中……'
            "
            additionalClasses="btn-primary"
            :onClick="
              () => {
                handleFirstChapter();
                togglePage();
              }
            "
          />
          <ChapterInfo
            v-if="readChapters.length > 0"
            badge="继续阅读"
            :content="currentChapter ? currentChapter?.title : '加载中……'"
            additionalClasses="mt-6"
            :onClick="() => togglePage()"
          />
        </figcaption>
      </figure>
    </section>

    <section class="basis-xs">
      <Chapters :togglePage />
    </section>

    <Giscus
      class="basis-sm"
      repo="KoMoriSam/komorisam.github.io"
      repo-id="R_kgDOJxn8KA"
      category="General"
      category-id="DIC_kwDOJxn8KM4Cnp6m"
      mapping="specific"
      term="向远方"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="themeStore.giscusTheme"
      lang="zh-CN"
      loading="lazy"
    />
    <ToTop />
  </main>
  <FootBar />
</template>

<script setup>
import Giscus from "@giscus/vue";

import { useChapters } from "@/composables/useChapters";
import { useImageLoad } from "@/composables/useImageLoad";

import { storeToRefs } from "pinia";
import { useNovelStore } from "@/stores/novelStore";
import { useThemeStore } from "@/stores/themeStore";

import ChapterInfo from "@/components/novel/ChapterInfo.vue";
import Chapters from "@/components/novel/Chapters.vue";
import ToTop from "@/components/base/ToTop.vue";
import FootBar from "@/components/layout/FootBar.vue";

const novelStore = useNovelStore();
const { readChapters, flatChapters, currentChapter } = storeToRefs(novelStore);
const themeStore = useThemeStore();

const { imageLoaded, handleImageLoad } = useImageLoad();

const { handleFirstChapter } = useChapters();

const props = defineProps({
  togglePage: {
    type: Function,
    required: true,
  },
});
</script>
