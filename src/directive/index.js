// src/directive/index.js
import { useIntersectionObserver } from "@vueuse/core";
// 封装插件
export const lazyPlugin = {
  install(app) {
    app.directive("lazy", {
      mounted(el, binding) {
        el.classList.add("skeleton max-w-full sm:max-w-3xs object-cover");
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          console.log(isIntersecting);
          if (isIntersecting) {
            el.src = binding.value;
            el.onload = () => {
              el.classList.remove("skeleton object-cover");
            };
            //在监听的图片第一次完成加载后就停止监听
            stop();
          }
        });
      },
    });
  },
};

export const fadeIn = {
  mounted(el) {
    const handleLoad = () => {
      el.classList.add("opacity-100");
      el.classList.remove("opacity-0");
    };

    el.classList.add("opacity-0", "transition-opacity", "duration-500");
    if (el.complete) {
      handleLoad();
    } else {
      el.addEventListener("load", handleLoad);
    }
  },
};
