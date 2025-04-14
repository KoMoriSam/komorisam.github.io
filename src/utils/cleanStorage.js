import { useStorage } from "@vueuse/core";

export function useCleanStorage() {
  const keysToClear = [
    "CHAPTERS_CONTENT",
    "CHAPTER_LIST",
    "READ_CHS",
    "READ_CH",
    "READ_CH_ID",
    "READ_PAGE",
    // "STYLE_FONT",
    // "STYLE_FONT_SIZE",
    // "STYLE_FONT_GAP",
    // "CONTENT_LINE_HEIGHT",
    // "CONTENT_PARA_HEIGHT",
  ];

  keysToClear.forEach((key) => {
    const storageItem = useStorage(key, null);
    storageItem.value = null;
  });
}
