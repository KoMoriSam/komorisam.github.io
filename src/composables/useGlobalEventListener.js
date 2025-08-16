import { onUnmounted } from "vue";

/**
 * 通用的全局事件监听器
 * @param {string} eventType - 事件类型（如 "click", "keydown"）
 * @param {Function} callback - 事件触发时的回调函数
 * @param {boolean|object} options - 事件监听选项（如 capture 阶段）
 */
export const useGlobalEventListener = (
  eventType,
  callback,
  options = false
) => {
  let isListenerAdded = false;

  const addEventListener = () => {
    if (isListenerAdded) return;

    document.addEventListener(eventType, callback, options);
    isListenerAdded = true;
  };

  const removeEventListener = () => {
    if (!isListenerAdded) return;

    document.removeEventListener(eventType, callback, options);
    isListenerAdded = false;
  };

  // 自动清理事件监听器
  onUnmounted(removeEventListener);

  return { addEventListener, removeEventListener };
};
