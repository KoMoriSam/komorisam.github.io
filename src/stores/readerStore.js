import { defineStore } from "pinia";
import { computed } from "vue";
import { STYLE_CONFIG_KEYS } from "@/constants/reader";
import { useReaderSettingsStorage } from "@/utils/storage/new-reader-settings-storage";

export const useReaderStore = defineStore("reader", () => {
  const { getValue, setValue } = useReaderSettingsStorage();

  const styleConfigs = computed(() => {
    const configs = {};
    STYLE_CONFIG_KEYS.forEach((config) => {
      configs[config.key] = getValue(config.storageKey, config.default);
    });
    return configs;
  });

  const isDefault = (key) => {
    const config = STYLE_CONFIG_KEYS.find((item) => item.key === key);
    if (!config) return false;
    const currentValue = getValue(config.storageKey, config.default);
    return currentValue === config.default;
  };

  const resetStyle = (key) => {
    const config = STYLE_CONFIG_KEYS.find((item) => item.key === key);
    if (config) {
      setValue(config.storageKey, config.default);
    }
  };

  const setStyle = (key, value) => {
    const config = STYLE_CONFIG_KEYS.find((item) => item.key === key);
    if (config) {
      setValue(config.storageKey, value);
    }
  };

  return {
    styleConfigs, // 保持兼容性
    setStyle,
    isDefault,
    resetStyle,
  };
});
