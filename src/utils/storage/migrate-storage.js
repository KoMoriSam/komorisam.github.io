import { useStorage } from "@vueuse/core";

export function useStorageMigration() {
  // 检查并执行迁移
  const migrateStorage = () => {
    const migrationFlag = useStorage("STORAGE_MIGRATION_V2", false);

    if (migrationFlag.value) {
      console.log("迁移已完成，跳过");
      return;
    }

    console.log("开始迁移 localStorage...");

    // 迁移网页全局信息
    migrateGlobalSettings();

    // 迁移小说阅读器设置
    migrateReaderSettings();

    // 迁移阅读状态信息
    migrateReadingState();

    // 清理旧键名（可选，建议先注释掉测试）
    // cleanupOldKeys();

    migrationFlag.value = true;
    console.log("迁移完成");
  };

  const migrateGlobalSettings = () => {
    const GLOBAL_INFO = useStorage("GLOBAL_INFO", {});
    const oldAppVersion = localStorage.getItem("APP_VERSION");
    const oldSetTheme = localStorage.getItem("SET_THEME");

    if (oldAppVersion && !GLOBAL_INFO.value.APP_VERSION) {
      GLOBAL_INFO.value.APP_VERSION = oldAppVersion;
    }

    if (oldSetTheme && !GLOBAL_INFO.value.SET_THEME) {
      GLOBAL_INFO.value.SET_THEME = oldSetTheme;
    }
  };

  const migrateReaderSettings = () => {
    const READER_SETTINGS = useStorage("READER_SETTINGS", {});

    // 定义迁移映射：旧键名 -> 新键名
    const migrationMap = {
      // 直接迁移（键名不变）
      STYLE_FONT: "STYLE_FONT",
      STYLE_FONT_GAP: "STYLE_FONT_GAP",
      STYLE_FONT_SIZE: "STYLE_FONT_SIZE",
      NOVEL_CURRENT_COMPONENT: "NOVEL_CURRENT_COMPONENT",
      NOVEL_SIDE_CURRENT_COMPONENT: "NOVEL_SIDE_CURRENT_COMPONENT",

      // 需要重命名的键
      CONTENT_LINE_HEIGHT: "STYLE_LINE_HEIGHT",
      CONTENT_PARA_HEIGHT: "STYLE_PARA_HEIGHT",
    };

    Object.entries(migrationMap).forEach(([oldKey, newKey]) => {
      const oldValue = localStorage.getItem(oldKey);
      if (oldValue && !READER_SETTINGS.value[newKey]) {
        // 根据键名类型处理值
        if (["STYLE_FONT_GAP", "STYLE_FONT_SIZE"].includes(oldKey)) {
          READER_SETTINGS.value[newKey] = Number(oldValue);
        } else if (
          ["CONTENT_LINE_HEIGHT", "CONTENT_PARA_HEIGHT"].includes(oldKey)
        ) {
          READER_SETTINGS.value[newKey] = parseFloat(oldValue);
        } else {
          READER_SETTINGS.value[newKey] = oldValue;
        }
      }
    });
  };

  const migrateReadingState = () => {
    const READING_STATE = useStorage("READING_STATE", {});
    const oldKeys = [
      "CHAPTERS_CONTENT",
      "CHAPTER_LIST",
      "CHAPTER_LIST_UPDATED_AT",
      "READ_CHS",
      "READ_CH_ID",
      "READ_PAGE",
      "READ_POS",
    ];

    oldKeys.forEach((key) => {
      const oldValue = localStorage.getItem(key);
      if (oldValue && !READING_STATE.value[key]) {
        try {
          // 尝试解析 JSON
          READING_STATE.value[key] = JSON.parse(oldValue);
        } catch {
          // 如果不是 JSON，直接存储
          READING_STATE.value[key] = oldValue;
        }
      }
    });
  };

  const cleanupOldKeys = () => {
    // 等迁移稳定后再取消注释
    const keysToClear = [
      "APP_VERSION",
      "SET_THEME",
      "STYLE_FONT",
      "STYLE_FONT_GAP",
      "STYLE_FONT_SIZE",
      "CONTENT_LINE_HEIGHT",
      "CONTENT_PARA_HEIGHT",
      "NOVEL_CURRENT_COMPONENT",
      "NOVEL_SIDE_CURRENT_COMPONENT",
      "CHAPTERS_CONTENT",
      "CHAPTER_LIST",
      "CHAPTER_LIST_UPDATED_AT",
      "READ_CHS",
      "READ_CH_ID",
      "READ_PAGE",
      "READ_POS",
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
  };

  return {
    migrateStorage,
  };
}
