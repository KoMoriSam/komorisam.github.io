<template>
  <main
    class="flex-1 flex flex-wrap m-12 items-start justify-center lg:justify-evenly gap-4"
  >
    <section class="hero basis-2xl">
      <figure class="hero-content flex-col lg:flex-row">
        <img
          src="/assets/image/cover.png"
          alt="向远方"
          class="max-w-full sm:max-w-3xs rounded-lg shadow-2xl lg:mr-6 mb-6"
        />
        <figcaption>
          <h1 class="text-5xl font-bold">向远方</h1>
          <p class="py-6">
            慌张中，才学会张口……<br />
            匆忙中，才学会乡音……
          </p>
          <button
            class="btn btn-primary w-full"
            @click="handleClick(), toggleComponent()"
          >
            开始阅读
          </button>
          <ChapterInfo
            v-if="novelStore.currentChapterInfo"
            badgeText="继续阅读"
            :content="
              novelStore.readChapterList.length > 0
                ? novelStore.currentChapterInfo?.chapter.name
                : ''
            "
            additionalClasses="w-full my-6"
            :onClick="() => toggleComponent()"
          />
        </figcaption>
      </figure>
    </section>

    <section class="basis-xs">
      <ChapterList
        :toggleComponent="toggleComponent"
        :currentComponent="currentComponent"
      />
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
  </main>
  <FootBar />
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import Giscus from "@giscus/vue";

import { useNovelStore } from "@/stores/novel";
import { useThemeStore } from "@/stores/theme";

import ChapterInfo from "@/components/novel/ChapterInfo.vue";
import ChapterList from "@/components/novel/ChapterList.vue";
import FootBar from "@/components/layout/FootBar.vue";

const novelStore = useNovelStore();
const themeStore = useThemeStore();

const router = useRouter();
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

// 初始化加载
onMounted(async () => {
  await novelStore.setChapterList();
});

// 事件处理函数
const handleClick = () => {
  router.push({ query: { chapter: 1, page: 1 } }); // 修改 URL，触发 `watch` 监听
};
</script>
