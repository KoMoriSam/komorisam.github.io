import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { usePreferredDark } from "@vueuse/core";
import { useGlobalStorage } from "@/utils/storage/new-global-storage";

const isDark = usePreferredDark();

export const useThemeStore = defineStore("theme", () => {
  const { GLOBAL_INFO } = useGlobalStorage();
  const theme = computed({
    get: () => GLOBAL_INFO.value.SET_THEME || "default",
    set: (value) => {
      GLOBAL_INFO.value.SET_THEME = value;
    },
  });

  const themeList = ref([
    { name: "跟随系统", icon: "ri-contrast-line", value: "default" },
    { name: "日间模式", icon: "ri-sun-line", value: "corporate" },
    { name: "夜间模式", icon: "ri-moon-line", value: "dim" },
  ]);

  const currentTheme = computed(() => {
    return (
      themeList.value.find((t) => t.value === theme) || {
        icon: "ri-contrast-line",
      }
    );
  });

  // 当前主题
  const giscusTheme = computed(() => {
    if (theme === "default") {
      return isDark.value ? "noborder_dark" : "noborder_light";
    } else if (theme === "corporate") {
      return "catppuccin_latte";
    } else if (theme === "dim") {
      return "catppuccin_macchiato";
    }
    return "preferred_color_scheme";
  });

  // 修改主题并存储
  function setTheme(newTheme) {
    theme = newTheme;
  }

  return { theme, themeList, currentTheme, giscusTheme, setTheme };
});
