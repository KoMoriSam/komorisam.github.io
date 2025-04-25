import { ref, watch } from "vue";
import { useCounter } from "@vueuse/core";
import { useToast } from "@/composables/useToast";

/**
 * 封装通用的按钮点击限制方法
 * @param {Object} options 配置选项
 * @param {number} [options.maxClicks=5] 最大允许点击次数
 * @param {number} [options.cooldown=3000] 超过限制后的冷却时间(ms)
 * @param {Object} [options.toastOptions={ position: 'center-top', duration: 3000, closable: false }] 提示信息配置
 * @param {string} [options.exceedMessage='点太快啦！'] 超过限制时的提示信息
 * @param {string} [options.cooldownEndMessage=''] 冷却结束时的提示信息
 * @returns {Object} 包含 count, isDisabled, handleClick, reset 的对象
 */
export function useClickLimit(options = {}) {
  const {
    maxClicks = 5,
    cooldown = 3000,
    toastOptions = { position: "center-top", duration: 3000, closable: false },
    exceedMessage = "操作过于频繁，请稍后再试！",
    cooldownEndMessage = "",
  } = options;

  const { count, inc, dec, reset: resetCounter } = useCounter();
  const toast = useToast(toastOptions);
  const isDisabled = ref(false);

  watch(count, (newVal) => {
    if (newVal > maxClicks) {
      toast.warning(exceedMessage);
      isDisabled.value = true;

      setTimeout(() => {
        dec(newVal - 1); // 重置到最大允许点击次数
        isDisabled.value = false;
        if (cooldownEndMessage) {
          toast.success(cooldownEndMessage);
        }
      }, cooldown);
    }
  });

  const handleClick = (callback, ...args) => {
    if (isDisabled.value) return;
    callback(...args); // 将参数传递给业务函数
    inc();
  };

  const reset = () => {
    resetCounter();
    isDisabled.value = false;
  };

  return {
    count,
    isDisabled,
    handleClick,
    reset,
  };
}
