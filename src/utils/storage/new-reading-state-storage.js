import { useStorage } from "@vueuse/core";

export function useReadingStateStorage() {
  const READING_STATE = useStorage("READING_STATE", {
    // 章节列表及内容缓存
    CHAPTERS_CONTENT: {},
    CHAPTER_LIST: {},
    CHAPTER_LIST_UPDATED_AT: 0,

    // 阅读进度
    READ_CHS: [],
    READ_CH_ID: "7d5e9b50-a9cb-428a-9264-903046354e22",
    READ_PAGE: 1,
    READ_POS: "",
  });

  return {
    READING_STATE,
  };
}
