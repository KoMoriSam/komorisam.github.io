import { useEventListener, useStorage, useThrottleFn } from "@vueuse/core";

export function usePosTracker(router) {
  const READ_POS_KEY = "READ_POS";
  const readPos = useStorage(READ_POS_KEY, "");
  let isManualHashChange = false;

  const posSelector = "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id], p[id]";

  // 动态生成完整的段落 id
  function getFullId(shortId) {
    // 如果已经是完整ID格式（包含章节和页码），直接返回
    if (
      shortId.match(
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}-\d+-/
      )
    ) {
      return shortId;
    }

    // 如果是普通标题，直接返回
    if (!shortId.match(/^\d+$/)) {
      return shortId;
    }

    // 如果是脚注，直接返回
    if (shortId.startsWith("fn")) {
      return shortId;
    }

    const chapter = router.currentRoute.value.query.chapter; // 从查询参数获取章节UUID
    const page = router.currentRoute.value.query.page; // 从查询参数获取页码
    return `${chapter}-${page}-${shortId}`; // 拼接完整的段落ID
  }

  // 提取简化的段落 id
  function getShortId(fullId) {
    // 如果已经是简化ID格式，直接返回
    if (
      !fullId.match(
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}-\d+-/
      )
    ) {
      return fullId;
    }

    const parts = fullId.split("-");
    if (parts.length >= 3) {
      return `${parts[parts.length - 1]}`; // 提取段落编号
    }
  }

  // 跳转到 READ_POS
  function scrollToLastReadPos() {
    const shortId = readPos.value;
    if (shortId) {
      const id = getFullId(shortId); // 动态生成完整的段落ID
      const el = document.getElementById(id);
      if (el) {
        isManualHashChange = true;
        router.replace({
          path: router.currentRoute.value.path,
          query: router.currentRoute.value.query,
          hash: `#${decodeURIComponent(shortId)}`, // URL中只使用简化的ID
        });
        el.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          isManualHashChange = false;
        }, 1000);
      }

      // 确保路由已加载完成后再执行
      if (
        router.currentRoute.value.query.chapter &&
        router.currentRoute.value.query.page
      ) {
        setTimeout(() => {
          const id = getFullId(shortId);
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 750); // 初始延迟
      } else {
        console.warn("路由参数未准备好，无法滚动到上次阅读位置");
      }
    }
  }

  const updateCurrentPos = useThrottleFn(() => {
    if (isManualHashChange) return;

    const poss = Array.from(document.querySelectorAll(posSelector));
    if (poss.length === 0) return;

    const scrollTop = window.scrollY;
    const offset = 0.25 * window.innerHeight; // 提前 25% 触发位置更新

    const firstPos = poss[0];
    const firstPosTop = firstPos.getBoundingClientRect().top + window.scrollY;

    if (scrollTop + offset >= firstPosTop) {
      for (let i = poss.length - 1; i >= 0; i--) {
        const el = poss[i];
        const top = el.getBoundingClientRect().top + window.scrollY;

        if (scrollTop + offset >= top) {
          const id = el.id;
          if (id) {
            const shortId = getShortId(id); // 确保存储的是简化ID
            isManualHashChange = true;
            router.replace({
              path: router.currentRoute.value.path,
              query: router.currentRoute.value.query,
              hash: `#${decodeURIComponent(shortId)}`,
            });
            readPos.value = shortId; // 存储简化ID
            setTimeout(() => {
              isManualHashChange = false;
            }, 300);
          }
          break;
        }
      }
    } else {
      if (readPos.value && !readPos.value.startsWith("#fn")) {
        readPos.value = "";
        router.replace({
          path: router.currentRoute.value.path,
          query: router.currentRoute.value.query,
          hash: "",
        });
      }
    }
  }, 300);

  // 监听hash变化事件（包括脚注跳转）
  useEventListener(window, "hashchange", (e) => {
    const hash = window.location.hash;
    if (hash.startsWith("#fn")) {
      isManualHashChange = true;
      readPos.value = hash.substring(1); // 记录脚注（如 "fn1"）
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
      readPos.value = target.getAttribute("href")?.substring(1) || ""; // 记录脚注（如 "fn1"）
      setTimeout(() => {
        isManualHashChange = false;
      }, 300);
    }
  });

  scrollToLastReadPos();
  useEventListener(window, "scroll", updateCurrentPos);
}
