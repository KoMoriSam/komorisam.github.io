import { ref, onMounted, onBeforeUnmount } from "vue";

export function useScrollTo() {
  const showButton = ref(false);
  const scrollRef = ref(null);

  const isScrollableElement = (element) => {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;
    const canScroll = overflowY === "auto" || overflowY === "scroll";

    return canScroll && element.scrollHeight > element.clientHeight;
  };

  const getScrollContainer = () => {
    const element = scrollRef.value;

    if (!element) return window;

    let parent = element.parentElement;
    while (parent) {
      if (isScrollableElement(parent)) {
        return parent;
      }

      parent = parent.parentElement;
    }

    return window;
  };

  const scrollContainerTo = (container, top) => {
    if (container === window) {
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }

    container.scrollTo({ top, behavior: "smooth" });
  };

  const scrollToTop = (position = 0) => {
    const container = getScrollContainer();
    scrollContainerTo(container, position);
  };

  const scrollToBottom = () => {
    const container = getScrollContainer();

    if (container === window) {
      const target = scrollRef.value;

      if (target) {
        const top =
          target.getBoundingClientRect().top +
          window.scrollY +
          target.scrollHeight -
          window.innerHeight;

        scrollContainerTo(window, Math.max(0, top));
        return;
      }

      const maxTop = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      scrollContainerTo(window, Math.max(0, maxTop - window.innerHeight));
      return;
    }

    const target = scrollRef.value;
    if (target && container.contains(target)) {
      const top =
        target.offsetTop + target.scrollHeight - container.clientHeight;
      scrollContainerTo(container, Math.max(0, top));
      return;
    }

    scrollContainerTo(
      container,
      Math.max(0, container.scrollHeight - container.clientHeight),
    );
  };

  const handleScroll = () => {
    showButton.value = window.scrollY > 300; // 滚动超过 300px 显示按钮
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return { showButton, scrollRef, scrollToTop, scrollToBottom, handleScroll };
}
