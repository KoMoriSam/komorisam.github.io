import { useStorage } from "@vueuse/core";

export function useReadingStateStorage() {
  const READING_STATE = useStorage("READING_STATE", {});

  const keyMapping = {
    CHAPTER_LIST: "CHAPTER_LIST",
    CHAPTER_LIST_UPDATED_AT: "CHAPTER_LIST_UPDATED_AT",
    READ_CHS: "READ_CHS",
    READ_CH_ID: "READ_CH_ID",
    READ_PAGE: "READ_PAGE",
    READ_POS: "READ_POS",
  };

  // 通用兼容性获取函数
  const getState = (key, defaultValue) => {
    const newKey = keyMapping[key] || key;

    // 优先从新结构获取
    if (READING_STATE.value[newKey] !== undefined) {
      return READING_STATE.value[newKey];
    }

    // 尝试从旧键名获取
    const oldValue = localStorage.getItem(key);
    if (oldValue !== null) {
      // 根据类型转换
      let value = oldValue;

      // 自动迁移到新结构
      READING_STATE.value[newKey] = value;
      return value;
    }

    return defaultValue;
  };

  // 通用设置函数
  const setState = (key, value) => {
    const newKey = keyMapping[key] || key;
    READING_STATE.value[newKey] = value;
  };

  return {
    READING_STATE,
    getState,
    setState,
  };
}
