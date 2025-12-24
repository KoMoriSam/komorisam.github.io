import { useStorage } from "@vueuse/core";

export function useGlobalStorage() {
  const GLOBAL_INFO = useStorage("GLOBAL_INFO", {});

  // 旧键名到新键名的映射（包含重命名）
  const keyMapping = {
    // 直接映射的键
    APP_VERSION: "APP_VERSION",
    SET_THEME: "SET_THEME",
  };

  // 通用兼容性获取函数
  const getInfo = (key, defaultValue) => {
    const newKey = keyMapping[key] || key;

    // 优先从新结构获取
    if (READER_SETTINGS.value[newKey] !== undefined) {
      return READER_SETTINGS.value[newKey];
    }

    // 尝试从旧键名获取
    const oldValue = localStorage.getItem(key);
    if (oldValue !== null) {
      // 根据类型转换
      let value = oldValue;
      if (numberKeys.includes(key)) {
        value =
          key.includes("LINE_HEIGHT") || key.includes("PARA_HEIGHT")
            ? parseFloat(oldValue)
            : Number(oldValue);
      }

      // 自动迁移到新结构
      READER_SETTINGS.value[newKey] = value;
      return value;
    }

    return defaultValue;
  };

  // 通用设置函数
  const setInfo = (key, value) => {
    const newKey = keyMapping[key] || key;
    READER_SETTINGS.value[newKey] = value;
  };

  return {
    GLOBAL_INFO,
    getInfo,
    setInfo,
  };
}
