import { useStorage } from "@vueuse/core";

export function useGlobalStorage() {
  const GLOBAL_INFO = useStorage("GLOBAL_INFO", {
    APP_VERSION: "1.0.0",
    SET_THEME: "default",
  });

  return {
    GLOBAL_INFO,
  };
}
