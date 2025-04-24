import { ref, onMounted, onBeforeUnmount } from "vue";

export function useScrollTo() {
  const showButton = ref(false);
  const scrollRef = ref(null);

  const scrollToTop = (position = 0) => {
    window.scrollTo({ top: position, behavior: "smooth" });
  };
  const scrollToBottom = () => {
    setTimeout(() => {
      console.log("内容增加时", scrollRef.value.scrollHeight);
      window.scrollTo({
        top: scrollRef.value.scrollHeight,
        behavior: "smooth",
      });
    }, 20); // 延迟 20ms 以获取到更新后的 dom 节点
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
