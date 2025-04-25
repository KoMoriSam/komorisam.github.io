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
          src="/assets/images/covers/theHorizon.png"
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
          <button
            class="btn btn-primary w-full"
            @click="handleFirstChapter(), togglePage()"
          >
            开始阅读
          </button>
          <ChapterInfo
            v-if="novelStore.currentChapter"
            badgeText="继续阅读"
            :content="
              novelStore.readChapterList.length > 0
                ? novelStore.currentChapter?.title
                : ''
            "
            additionalClasses="w-full my-6 truncate"
            :onClick="() => togglePage()"
          />
        </figcaption>
      </figure>
    </section>

    <section class="basis-xs">
      <ChapterList :togglePage />
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

import { useNovelStore } from "@/stores/novelStore";
import { useThemeStore } from "@/stores/themeStore";

import ChapterInfo from "@/components/novel/ChapterInfo.vue";
import ChapterList from "@/components/novel/ChapterList.vue";
import ToTop from "@/components/base/ToTop.vue";
import FootBar from "@/components/layout/FootBar.vue";

const novelStore = useNovelStore();
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
