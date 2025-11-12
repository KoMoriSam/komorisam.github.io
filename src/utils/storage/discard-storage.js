import { useStorage } from "@vueuse/core";

export function useDiscardStorage() {
  const keysToClear = [
    "READ_CHAPTER",
    "READ_CH",
    "IS_NOT_UPDATED",
    "READ_HEADING",
    "nowChapter",
    "auto",
    "mode",
    "sidebarState",
  ];

  keysToClear.forEach((key) => {
    const storageItem = useStorage(key, null);
    storageItem.value = null;
  });

  // 清除所有 chapter_XXX 格式的键
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("chapter_")) {
      const storageItem = useStorage(key, null);
      storageItem.value = null;
    }
  });
}
