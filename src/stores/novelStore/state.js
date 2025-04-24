import { ref } from "vue";
import { useStorage } from "@vueuse/core";

export const useNovelState = () => {
  // 章节相关状态
  const chapterList = ref([]);
  const storedChapterList = useStorage("CHAPTER_LIST", {});
  const lastUpdated = useStorage("CHAPTER_LIST_UPDATED_AT", 0);
  const flatChapterList = ref([]);
  const readChapterList = useStorage("READ_CHS", []);

  // 内容相关状态
  const currentChapterContent = ref([]);
  const contentCache = useStorage("CHAPTERS_CONTENT", {});

  // 阅读进度状态
  const currentChapterUuid = useStorage(
    "READ_CH_ID",
    "7d5e9b50-a9cb-428a-9264-903046354e22"
  );
  const currentChapterPage = useStorage("READ_PAGE", 1);

  // 其他状态
  const title = ref("向远方 | KoMoriSam");
  const isLoadingList = ref(true);
  const isLoadingContent = ref(true);

  return {
    chapterList,
    storedChapterList,
    lastUpdated,
    flatChapterList,
    readChapterList,
    currentChapterContent,
    contentCache,
    currentChapterUuid,
    currentChapterPage,
    title,
    isLoadingList,
    isLoadingContent,
  };
};
