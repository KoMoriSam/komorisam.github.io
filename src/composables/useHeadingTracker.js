import { useEventListener, useStorage, useThrottleFn } from "@vueuse/core";

export function useHeadingTracker() {
  const READ_HEADING_KEY = "READ_HEADING";
  const readHeading = useStorage(READ_HEADING_KEY, "");
  let isManualHashChange = false;

  const headingSelector = "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]";

  // 跳转到 READ_HEADING
  function scrollToLastReadHeading() {
    const id = readHeading.value;
    if (id) {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          isManualHashChange = true;
          history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}#${id}`
          );
          el.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isManualHashChange = false;
          }, 1000);
        }
      }, 750);
    }
  }

  const updateCurrentHeading = useThrottleFn(() => {
    if (isManualHashChange) return; // 如果是手动触发的hash变化，不更新

    const headings = Array.from(document.querySelectorAll(headingSelector));
    if (headings.length === 0) return;

    const scrollTop = window.scrollY;
    const offset = 25;

    const firstHeading = headings[0];
    const firstHeadingTop =
      firstHeading.getBoundingClientRect().top + window.scrollY;

    if (scrollTop + offset >= firstHeadingTop) {
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i];
        const top = el.getBoundingClientRect().top + window.scrollY;

        if (scrollTop + offset >= top) {
          const id = el.id;
          if (id) {
            isManualHashChange = true;
            history.replaceState(null, "", `#${id}`);
            readHeading.value = id;
            setTimeout(() => {
              isManualHashChange = false;
            }, 300);
          }
          break;
        }
      }
    } else {
      if (readHeading.value && !readHeading.value.startsWith("#fn")) {
        readHeading.value = "";
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  }, 300);

  // 监听hash变化事件（包括脚注跳转）
  useEventListener(window, "hashchange", (e) => {
    const hash = window.location.hash;
    if (hash.startsWith("#fn")) {
      isManualHashChange = true;
      readHeading.value = hash.substring(1); // 记录脚注（如 "fn1"）
      setTimeout(() => {
        isManualHashChange = false;
      }, 300);
    }
  });

  // 监听点击事件，检测脚注链接点击
  useEventListener(document, "click", (e) => {
    const target = e.target.closest("a");
    if (target?.getAttribute("href")?.startsWith("#fn")) {
      isManualHashChange = true;
      readHeading.value = target.getAttribute("href")?.substring(1) || ""; // 记录脚注（如 "fn1"）
      setTimeout(() => {
        isManualHashChange = false;
      }, 300);
    }
  });

  scrollToLastReadHeading();
  useEventListener(window, "scroll", updateCurrentHeading);
}
