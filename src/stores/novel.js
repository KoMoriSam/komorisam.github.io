import { defineStore } from "pinia";
import { ref, computed } from "vue";

import { useStorage, useTitle, useDebounceFn } from "@vueuse/core";

import CONFIG from "@/config.js";

import fm from "front-matter";

const BASE_URL = CONFIG.BASE_URL;
const CACHE_EXPIRATION = CONFIG.getDynamicCacheExpiration();

export const useNovelStore = defineStore("novel", () => {
  // 章节相关状态
  const chapterList = ref([]);
  const storedChapterList = useStorage("CHAPTER_LIST", {});
  const lastUpdated = useStorage("CHAPTER_LIST_UPDATED_AT", 0);
  const flatChapterList = ref([]);
  const readChapterList = useStorage("READ_CHS", []);
  const currentChapterContent = ref([]);
  const contentCache = useStorage("CHAPTERS_CONTENT", {});
  const currentChapterUuid = useStorage(
    "READ_CH_ID",
    "7d5e9b50-a9cb-428a-9264-903046354e22"
  );
  const currentChapterPage = useStorage("READ_PAGE", 1);
  const title = ref("向远方 | KoMoriSam");

  // 加载状态
  const isLoadingList = ref(true);
  const isLoadingContent = ref(true);

  // 计算参数
  const currentChapter = computed(() => {
    return flatChapterList.value.find(
      (chapter) => chapter.uuid === currentChapterUuid.value
    );
  });

  const currentChapterIndex = computed(() => {
    return flatChapterList.value.findIndex(
      (chapter) => chapter.uuid === currentChapterUuid.value
    );
  });

  const isRecent = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 14 * 24 * 60 * 60 * 1000; // 14 天内
  };

  const latestChapter = computed(() => {
    // 遍历所有章节，找到最近 14 天内的章节
    const recentChapters = flatChapterList.value.filter((chapter) =>
      isRecent(chapter.date)
    );

    // 如果有最近章节，返回最新的一个（假设章节按时间排序）
    if (recentChapters.length > 0) {
      return recentChapters[recentChapters.length - 1];
    }

    // 如果没有符合条件的章节，返回最后一个章节
    return flatChapterList.value[flatChapterList.value.length - 1];
  });

  const totalPages = computed(() => {
    const content = currentChapterContent.value;
    return content.length;
  });

  const currentPageContent = computed(
    () => currentChapterContent.value[currentChapterPage.value - 1] || ""
  );

  const setChapterList = useDebounceFn(async (forceUpdate = false) => {
    const now = Date.now();
    console.log("Cache state:", {
      forceUpdate,
      storedList: storedChapterList.value,
      storedListLength: storedChapterList.value?.length,
      lastUpdated: lastUpdated.value,
      cacheExpiration: CACHE_EXPIRATION,
      isCacheValid: now - lastUpdated.value < CACHE_EXPIRATION,
    });

    if (
      !forceUpdate &&
      Object.keys(storedChapterList.value).length > 0 &&
      now - lastUpdated.value < CACHE_EXPIRATION
    ) {
      console.log("setChapterList: Call cache");
      chapterList.value = storedChapterList.value;
      flatList(storedChapterList.value);
      isLoadingList.value = false;
      return;
    }

    try {
      isLoadingList.value = true;
      const res = await fetch(`${BASE_URL}/content/index.json`);
      const data = await res.json();
      chapterList.value = data;
      storedChapterList.value = chapterList.value;
      lastUpdated.value = now; // 更新缓存时间戳
      flatList(data);
      if (forceUpdate) {
        console.log("setChapterList: Force update");
      } else {
        console.log("setChapterList: First loading");
      }
      await loadChapterContent();
    } catch (error) {
      console.error("列表加载失败:", error);
    } finally {
      isLoadingList.value = false;
    }
  }, 500);

  const flatList = (list) => {
    flatChapterList.value = Object.values(list).flatMap((volume) =>
      volume.chapters.map((chapter) => ({
        ...chapter,
        volumeTitle: volume.volumeInfo.title,
        volumeUuid: volume.volumeInfo.uuid,
      }))
    );
  };

  const refreshChapterList = useDebounceFn(async () => {
    await setChapterList(true);
    contentCache.value = {}; // 清空缓存
    await loadChapterContent();
  }, 500);

  const refreshReadChapterList = useDebounceFn(async () => {
    readChapterList.value = []; // 清空已读章节列表
    await loadChapterContent();
  }, 500);

  const refreshContent = useDebounceFn(async () => {
    try {
      isLoadingContent.value = true;
      delete contentCache.value; // 清空当前章节缓存
      console.log("refreshContent: Clear cache");
      await loadChapterContent(true);
      console.log("refreshContent: Reload content");
    } catch (error) {
      console.error("刷新内容失败:", error);
      throw error;
    } finally {
      isLoadingContent.value = false;
    }
  }, 500);

  const loadChapterContent = async (forceUpdate = false) => {
    // 使用缓存;
    if (!forceUpdate && contentCache.value[currentChapterUuid.value]) {
      isLoadingContent.value = true;
      console.log("loadChapterContent: Call cache");
      currentChapterContent.value =
        contentCache.value[currentChapterUuid.value];
      setRead();
      isLoadingContent.value = false;
      return;
    }

    try {
      isLoadingContent.value = true;

      const response = await fetch(`${BASE_URL}/${currentChapter.value.path}`);
      if (!response.ok) throw new Error("加载失败");
      const markdownRaw = await response.text();
      const { body: content } = fm(markdownRaw);
      const parsedContent = splitContent(content);
      currentChapterContent.value = parsedContent;

      contentCache.value[currentChapterUuid.value] =
        currentChapterContent.value;
      if (forceUpdate) {
        console.log("loadChapterContent: Force update");
      } else {
        console.log("loadChapterContent: First loading");
      }
      setRead();
    } catch (error) {
      console.error("内容加载失败:", error);
    } finally {
      isLoadingContent.value = false;
    }
  };

  const splitContent = (content) => {
    const PAGE_SIZE = 1200;
    const pages = [];
    let currentPage = "";
    const paras = content.split("\n");
    paras.forEach((para) => {
      if (currentPage.length + para.length + 1 > PAGE_SIZE) {
        pages.push(currentPage);
        currentPage = para;
      } else {
        if (currentPage.length > 0) currentPage += "\n";
        currentPage += para;
      }
    });
    if (currentPage.length > 0) pages.push(currentPage);
    return pages;
  };

  const setChapter = useDebounceFn(async (uuid) => {
    currentChapterUuid.value = uuid;
    console.log("setChapter:", uuid);
    await loadChapterContent();
  }, 500);

  const setPage = useDebounceFn((page) => {
    currentChapterPage.value = page;
    console.log("setPage:", page);
  }, 500);

  const updateTitle = () => {
    if (currentChapter.value) {
      title.value = `${currentChapter.value.title} | KoMoriSam`;
      useTitle(title.value);
    }
  };

  const setRead = () => {
    if (
      !readChapterList.value.some(
        (item) => item.uuid === currentChapter.value.uuid
      )
    ) {
      readChapterList.value = [...readChapterList.value, currentChapter.value];
      console.log("setRead: new read", currentChapter.value.title);
    } else {
      console.log("setRead: already read", currentChapter.value.title);
    }
  };

  return {
    chapterList,
    flatChapterList,
    readChapterList,
    currentChapterContent,
    contentCache,
    currentChapterIndex,
    currentChapterUuid,
    currentChapterPage,
    isLoadingList,
    isLoadingContent,
    currentChapter,
    latestChapter,
    totalPages,
    currentPageContent,
    setChapterList,
    isRecent,
    refreshChapterList,
    refreshReadChapterList,
    loadChapterContent,
    refreshContent,
    setChapter,
    setPage,
    updateTitle,
    setRead,
  };
});
