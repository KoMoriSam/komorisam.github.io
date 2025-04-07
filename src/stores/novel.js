import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { useTitle } from "@vueuse/core";

export const useNovelStore = defineStore("novel", () => {
  // 章节相关状态
  const chapterList = ref([]);
  const flatChapterList = ref([]);
  const readChapterList = useStorage("READ_CHS", []);
  const currentChapterContent = ref([]);
  const contentCache = ref({});
  const currentChapterId = useStorage("READ_CH", 1);
  const currentChapterPage = useStorage("READ_PAGE", 1);
  const title = ref("向远方 | KoMoriSam");

  // 阅读器样式
  const styleConfigKeys = [
    { key: "fontStyle", storageKey: "STYLE_FONT", default: "font-kai" },
    { key: "fontSize", storageKey: "STYLE_FONT_SIZE", default: 24 },
    { key: "fontGap", storageKey: "STYLE_FONT_GAP", default: 0 },
    { key: "lineHeight", storageKey: "CONTENT_LINE_HEIGHT", default: 1.5 },
    { key: "paraHeight", storageKey: "CONTENT_PARA_HEIGHT", default: 1.5 },
  ];

  const styleConfigs = styleConfigKeys.reduce((acc, item) => {
    acc[item.key] = useStorage(item.storageKey, item.default);
    return acc;
  }, {});

  // 加载状态
  const isLoadingList = ref(true);
  const isLoadingContent = ref(true);

  // 计算参数
  const currentChapterInfo = computed(() => {
    const chapter = flatChapterList.value.find(
      (ch) => ch.id === currentChapterId.value
    );
    if (!chapter) return null;

    const group =
      chapterList.value.find((g) =>
        g.options.some((ch) => ch.id === currentChapterId.value)
      )?.label || "未知卷";

    return {
      chapter,
      group,
    };
  });

  const latestChapter = computed(() => flatChapterList.value.at(-1));

  const contentUrl = computed(() => {
    if (!currentChapterInfo.value) return null;
    const { chapter, group } = currentChapterInfo.value;
    const volume = group.match(/(.*)/)?.[0];
    return `/assets/markdown/novel/${volume}/${chapter.name}.md`;
  });

  const totalPages = computed(() => currentChapterContent.value.length);

  const currentPageContent = computed(
    () => currentChapterContent.value[currentChapterPage.value - 1] || ""
  );

  // Actions
  const setChapterList = async () => {
    if (chapterList.value.length > 0) return;
    try {
      isLoadingList.value = true;
      const res = await fetch("/assets/markdown/novel/list.json");
      const data = await res.json();
      chapterList.value = data;
      flatChapterList.value = data.flatMap((ch) => ch.options);
    } catch (error) {
      console.error("列表加载失败:", error);
    } finally {
      isLoadingList.value = false;
    }
  };

  const loadChapterContent = async () => {
    if (!contentUrl.value) return;
    if (contentCache.value[currentChapterId.value]) {
      console.log("loadChapterContent: Call cache");
      currentChapterContent.value = contentCache.value[currentChapterId.value];
      return;
    }
    try {
      isLoadingContent.value = true;
      console.log("loadChapterContent: First loading");
      const response = await fetch(contentUrl.value);
      if (!response.ok) throw new Error("加载失败");
      const markdownContent = await response.text();
      currentChapterContent.value = splitContent(markdownContent);
      contentCache.value[currentChapterId.value] = currentChapterContent.value;
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

  const setChapter = async (id) => {
    currentChapterId.value = id;
    console.log("setChapter:", id);
    await loadChapterContent();
    console.log("The content is loaded!");
  };

  const setPage = (page) => {
    currentChapterPage.value = page;
    console.log("setPage:", page);
  };

  const updateTitle = () => {
    if (currentChapterInfo.value) {
      title.value = `${currentChapterInfo.value.chapter.name} | KoMoriSam`;
      useTitle(title.value);
    }
  };

  const setRead = () => {
    if (
      !readChapterList.value.some(
        (item) =>
          item.chapter.id === currentChapterInfo.value.chapter.id &&
          item.group === currentChapterInfo.value.group
      )
    ) {
      readChapterList.value = [
        ...readChapterList.value,
        currentChapterInfo.value,
      ];
    }
  };

  const setStyle = (key, value) => {
    styleConfigs[key].value = value;
    console.log(`set${key.charAt(0).toUpperCase() + key.slice(1)}:`, value);
  };

  const setDefaultStyle = () => {
    styleConfigKeys.forEach(({ key, default: defaultValue }) => {
      styleConfigs[key].value = defaultValue;
      console.log(`Reset ${key} to:`, defaultValue);
    });
  };

  return {
    chapterList,
    flatChapterList,
    readChapterList,
    currentChapterContent,
    contentCache,
    currentChapterId,
    currentChapterPage,
    styleConfigs,
    isLoadingList,
    isLoadingContent,
    currentChapterInfo,
    latestChapter,
    contentUrl,
    totalPages,
    currentPageContent,
    setChapterList,
    loadChapterContent,
    setChapter,
    setPage,
    updateTitle,
    setRead,
    setStyle,
    setDefaultStyle,
  };
});
