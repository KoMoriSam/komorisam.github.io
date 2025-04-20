import { defineStore } from "pinia";

import { useStorage } from "@vueuse/core";

export const useReaderStyleStore = defineStore("reader-style", () => {
  // 阅读器样式
  const styleConfigKeys = [
    { key: "fontStyle", storageKey: "STYLE_FONT", default: "font-kai" },
    { key: "fontSize", storageKey: "STYLE_FONT_SIZE", default: 24 },
    { key: "fontGap", storageKey: "STYLE_FONT_GAP", default: 0 },
    { key: "lineHeight", storageKey: "CONTENT_LINE_HEIGHT", default: 1.5 },
    { key: "paraHeight", storageKey: "CONTENT_PARA_HEIGHT", default: 1.5 },
  ];

  const styleConfigs = styleConfigKeys.reduce((acc, item) => {
    acc[item.key] = useStorage(item.storageKey, item.default);
    return acc;
  }, {});

  const setStyle = (key, value) => {
    styleConfigs[key].value = value;
    console.log(`set${key.charAt(0).toUpperCase() + key.slice(1)}:`, value);
  };

  const isDefault = (key) => {
    const config = styleConfigKeys.find((item) => item.key === key);
    if (!config) {
      console.error(`Invalid key: ${key}`);
      return false;
    }
    return styleConfigs[key].value === config.default;
  };

  const setDefault = (key) => {
    const config = styleConfigKeys.find((item) => item.key === key);
    if (!config) {
      console.error(`Invalid key: ${key}`);
      return;
    }
    styleConfigs[key].value = config.default;
    console.log(`Reset ${key} to:`, config.default);
  };

  return {
    styleConfigs,
    setStyle,
    isDefault,
    setDefault,
  };
});
