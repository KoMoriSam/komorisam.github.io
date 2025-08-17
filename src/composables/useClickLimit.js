import { ref, watch } from "vue";
import { useCounter } from "@vueuse/core";
import { useToast } from "@/composables/useToast";

/**
 * 封装通用的按钮点击限制方法
 * @param {Object} options 配置选项
 * @param {number} [options.maxClicks=5] 最大允许点击次数
 * @param {number} [options.cooldown=3000] 超过限制后的冷却时间(ms)
 * @param {number} [options.cooldown=10000] 未点击时重置点击次数的时间间隔(ms)
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
  let lastClickTime = Date.now(); // 记录最后一次点击的时间
  let resetTimer = null;
  let hasClicked = false; // 标记是否有过点击行为

  // 监听点击次数变化
  watch(count, (newVal) => {
    if (newVal > maxClicks - 1) {
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

  // 处理点击事件
  const handleClick = (callback, ...args) => {
    if (isDisabled.value) return;

    console.log("当前点击次数:", count.value);
    console.log("最大点击次数：", maxClicks);

    const now = Date.now();
    if (now - lastClickTime > cooldown) {
      resetCounter(); // 如果超过重置间隔，重置点击次数
      console.log("超时，点击次数已重置", count.value);
    }
    lastClickTime = now; // 更新最后点击时间
    hasClicked = true; // 标记为已点击

    // 启动定时器
    startResetTimer();

    callback(...args); // 将参数传递给业务函数
    inc();
  };

  // 重置点击次数
  const reset = () => {
    resetCounter();
    isDisabled.value = false;
    lastClickTime = Date.now(); // 重置时更新最后点击时间
  };

  // 定时器检测是否需要重置点击次数
  const startResetTimer = () => {
    if (resetTimer) clearInterval(resetTimer);
    resetTimer = setInterval(() => {
      if (Date.now() - lastClickTime > cooldown) {
        resetCounter();
        hasClicked = false; // 重置后清除点击标记
        console.log("超时，点击次数已重置", count.value);

        // 停止定时器，避免重复触发
        clearInterval(resetTimer);
        resetTimer = null;
      }
    }, cooldown);
  };

  return {
    count,
    isDisabled,
    handleClick,
    reset,
  };
}
