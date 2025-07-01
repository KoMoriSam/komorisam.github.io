import { useEventListener, useStorage, useThrottleFn } from "@vueuse/core";

export function useHeadingTracker() {
  const READ_HEADING_KEY = "READ_HEADING";
  const readHeading = useStorage(READ_HEADING_KEY, "");

  const headingSelector = "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]";

  // ✅ 页面加载时：跳转到 READ_HEADING
  function scrollToLastReadHeading() {
    const id = readHeading.value;
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
      }
    }
  }

  const updateCurrentHeading = useThrottleFn(() => {
    const headings = Array.from(document.querySelectorAll(headingSelector));

    const scrollTop = window.scrollY;
    const offset = 0; // 提前判断的偏移量，可微调

    for (let i = headings.length - 1; i >= 0; i--) {
      const el = headings[i];
      const top = el.getBoundingClientRect().top + window.scrollY;

      if (scrollTop + offset >= top) {
        const id = el.id;
        if (id) {
          // 更新 URL hash（不会触发跳转）
          history.replaceState(null, "", `#${id}`);
          // 存入 localStorage
          readHeading.value = id;
        }
        break;
      }
    }
  }, 300);

  scrollToLastReadHeading();
  useEventListener(window, "scroll", updateCurrentHeading);
}
