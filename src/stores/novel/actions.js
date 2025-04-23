import { useDebounceFn } from "@vueuse/core";
import { useChapterApi } from "@/services/apiChapters";
import CONFIG from "@/config.js";
import fm from "front-matter";
import { useTitle } from "@vueuse/core";
import { showAlert } from "@/utils/showAlert";

const CACHE_EXPIRATION = CONFIG.getDynamicCacheExpiration();
const { fetchChapterList, fetchChapterContent } = useChapterApi();

export const useNovelActions = (state, getters) => {
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

  const flatList = (list) => {
    state.flatChapterList.value = Object.values(list).flatMap((volume) =>
      volume.chapters.map((chapter) => ({
        ...chapter,
        volumeTitle: volume.volumeInfo.title,
        volumeUuid: volume.volumeInfo.uuid,
      }))
    );
  };

  const setRead = () => {
    if (
      !state.readChapterList.value.some(
        (item) => item.uuid === getters.currentChapter.value.uuid
      )
    ) {
      state.readChapterList.value = [
        ...state.readChapterList.value,
        getters.currentChapter.value,
      ];
      console.log("setRead: new read", getters.currentChapter.value.title);
    } else {
      console.log("setRead: already read", getters.currentChapter.value.title);
    }
  };

  // 章节相关操作
  const setChapterList = useDebounceFn(async (forceUpdate = false) => {
    const now = Date.now();

    if (
      !forceUpdate &&
      Object.keys(state.storedChapterList.value).length > 0 &&
      now - state.lastUpdated.value < CACHE_EXPIRATION
    ) {
      console.log("setChapterList: Call cache");
      state.chapterList.value = state.storedChapterList.value;
      flatList(state.storedChapterList.value);
      state.isLoadingList.value = false;
      showAlert("从缓存中获取到章节目录！", "success");
      if (state.currentChapterContent.value.length < 0) {
        await loadChapterContent();
      }
      return;
    }

    try {
      state.isLoadingList.value = true;
      const data = await fetchChapterList();
      state.chapterList.value = data;
      state.storedChapterList.value = state.chapterList.value;
      state.lastUpdated.value = now;
      flatList(data);
      if (forceUpdate) {
        console.log("setChapterList: Force update");
        showAlert("章节目录已刷新！", "success");
      } else {
        console.log("setChapterList: First loading");
        showAlert("章节目录加载完成！", "success");
      }
      if (state.currentChapterContent.value.length < 0) {
        await loadChapterContent();
      }
    } catch (error) {
      console.error("列表加载失败:", error);
    } finally {
      state.isLoadingList.value = false;
    }
  }, 500);

  const refreshChapterList = useDebounceFn(async () => {
    await setChapterList(true);
    state.contentCache.value = {};
    await loadChapterContent(true);
  }, 500);

  const refreshReadChapterList = useDebounceFn(async () => {
    state.readChapterList.value = [];
    showAlert("已清空阅读记录", "success");
    await loadChapterContent(true);
  }, 500);

  // 内容相关操作
  const loadChapterContent = async (forceUpdate = false) => {
    if (
      !forceUpdate &&
      state.contentCache.value[state.currentChapterUuid.value]
    ) {
      state.isLoadingContent.value = true;
      console.log("loadChapterContent: Call cache");
      state.currentChapterContent.value =
        state.contentCache.value[state.currentChapterUuid.value];
      setRead();
      state.isLoadingContent.value = false;
      showAlert("从缓存中获取到章节内容！", "success");
      return;
    }

    try {
      state.isLoadingContent.value = true;

      const markdownRaw = await fetchChapterContent(
        getters.currentChapter.value.path
      );
      const { body: content } = fm(markdownRaw);
      const parsedContent = splitContent(content);
      state.currentChapterContent.value = parsedContent;

      state.contentCache.value[state.currentChapterUuid.value] =
        state.currentChapterContent.value;
      if (forceUpdate) {
        console.log("loadChapterContent: Force update");
        showAlert("章节内容已刷新！", "success");
      } else {
        console.log("loadChapterContent: First loading");
        showAlert("章节内容加载完成！", "success");
      }
      setRead();
    } catch (error) {
      console.error("内容加载失败:", error);
    } finally {
      state.isLoadingContent.value = false;
    }
  };

  const refreshContent = useDebounceFn(async () => {
    try {
      state.isLoadingContent.value = true;
      delete state.contentCache.value[state.currentChapterUuid.value];
      console.log("refreshContent: Clear cache");
      await loadChapterContent(true);
      console.log("refreshContent: Reload content");
    } catch (error) {
      console.error("刷新内容失败:", error);
      throw error;
    } finally {
      state.isLoadingContent.value = false;
    }
  }, 500);

  // 阅读进度相关操作
  const setChapter = useDebounceFn(async (uuid) => {
    state.currentChapterUuid.value = uuid;
    console.log("setChapter:", uuid);
    await loadChapterContent();
  }, 500);

  const setPage = useDebounceFn((page) => {
    state.currentChapterPage.value = page;
    console.log("setPage:", page);
  }, 500);

  const updateTitle = () => {
    if (getters.currentChapter.value) {
      state.title.value = `${getters.currentChapter.value.title} | KoMoriSam`;
      useTitle(state.title.value);
    }
  };

  return {
    // 章节操作
    setChapterList,
    refreshChapterList,
    refreshReadChapterList,

    // 内容操作
    loadChapterContent,
    refreshContent,

    // 阅读进度操作
    setChapter,
    setPage,
    updateTitle,
    setRead,
  };
};
