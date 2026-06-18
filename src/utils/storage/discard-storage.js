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

  // 清除指定键
  keysToClear.forEach((key) => {
    localStorage.removeItem(key);
  });

  // 清除所有 chapter_XXX 格式的键
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("chapter_")) {
      localStorage.removeItem(key);
    }
  });
}
