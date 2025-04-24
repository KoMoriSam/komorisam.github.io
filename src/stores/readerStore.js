import { ref } from "vue";
import { defineStore } from "pinia";
import { STYLE_CONFIG_KEYS } from "@/constants/reader";
import { useStorage } from "@vueuse/core";

export const useReaderStore = defineStore("reader", () => {
  const styleConfigs = ref({});

  styleConfigs.value = STYLE_CONFIG_KEYS.reduce((acc, item) => {
    acc[item.key] = useStorage(item.storageKey, item.default);
    return acc;
  }, {});

  const setStyle = (key, value) => {
    styleConfigs.value[key] = value;
    console.log("setStyle:", key, value);
  };

  const isDefault = (key) => {
    const config = STYLE_CONFIG_KEYS.find((item) => item.key === key);
    if (!config || !(key in styleConfigs.value)) return false;

    const currentValue = styleConfigs.value[key];
    return typeof currentValue === "object" && "value" in currentValue
      ? currentValue.value === config.default
      : currentValue === config.default;
  };

  const resetStyle = (key) => {
    const config = STYLE_CONFIG_KEYS.find((item) => item.key === key);
    if (config && key in styleConfigs.value) {
      setStyle(key, config.default);
    }
  };

  return {
    styleConfigs,
    setStyle,
    isDefault,
    resetStyle,
  };
});
