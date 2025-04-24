import { ref } from "vue";

export function useImageLoad() {
  const imageLoaded = ref(false); // 图片加载状态
  const imageError = ref(false); // 图片加载错误状态

  const handleImageLoad = () => {
    imageLoaded.value = true; // 图片加载完成后设置为 true
  };

  const handleImageError = () => {
    imageError.value = true; // 图片加载错误时设置为 true
  };

  return {
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError,
  };
}
