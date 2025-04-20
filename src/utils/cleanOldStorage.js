import { useStorage } from "@vueuse/core";

export function useCleanOldStorage() {
  const keysToClear = ["READ_CHAPTER", "READ_CH", "IS_NOT_UPDATED"];

  keysToClear.forEach((key) => {
    const storageItem = useStorage(key, null);
    storageItem.value = null;
  });
}
