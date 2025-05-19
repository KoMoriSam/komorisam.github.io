import { ref } from "vue";
import { useStorage } from "@vueuse/core";

export const useNovelState = () => {
  // 章节相关状态
  const chapters = ref([]);
  const storedChapters = useStorage("CHAPTER_LIST", {});
  const lastUpdated = useStorage("CHAPTER_LIST_UPDATED_AT", 0);
  const flatChapters = ref([]);
  const readChapters = useStorage("READ_CHS", []);

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
  const currentComponent = useStorage("NOVEL_CURRENT_COMPONENT");
  const isLoadingList = ref(true);
  const isLoadingContent = ref(true);

  return {
    chapters,
    storedChapters,
    lastUpdated,
    flatChapters,
    readChapters,
    currentChapterContent,
    contentCache,
    currentChapterUuid,
    currentChapterPage,
    title,
    currentComponent,
    isLoadingList,
    isLoadingContent,
  };
};
