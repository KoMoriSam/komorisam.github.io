import { ref } from "vue";

export function useScrollTo() {
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

  return { scrollRef, scrollToTop, scrollToBottom };
}
