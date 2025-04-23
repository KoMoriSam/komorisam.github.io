import { ref, createApp, h } from "vue";
import { onClickOutside } from "@vueuse/core";

/**
 * 显示弹窗
 *
 * @param {string} [title="Hello!"] - 弹窗标题
 * @param {string} [description="按下 <kbd class='kbd'>ESC</kbd> 键或点击按钮以关闭。"] - 弹窗内容
 * @param {Object} [options] - 配置选项
 * @param {string} [options.buttonText="关闭"] - 按钮文本
 * @param {Function} [options.onSubmit=() => {}] - 提交回调
 *
 * @returns {Function} - 关闭弹窗的函数
 */
export function showMsg(
  title = "Hello!",
  description = "按下 <kbd class='kbd'>ESC</kbd> 键或点击按钮以关闭。",
  options = {}
) {
  const { buttonText = "关闭", onSubmit = () => {} } = options;
  const visible = ref(true);

  const Modal = {
    setup() {
      const modalRef = ref(null);

      onClickOutside(modalRef, () => {
        onSubmit();
        close();
      });

      const handleSubmit = () => {
        onSubmit();
        close();
      };

      return () =>
        visible.value &&
        h(
          "dialog",
          {
            class: "modal modal-bottom sm:modal-middle",
            open: true,
          },
          [
            h(
              "section",
              {
                ref: modalRef,
                class: "modal-box",
              },
              [
                h("h3", { class: "text-lg font-bold" }, title),
                h("section", {
                  class: "py-4",
                  innerHTML: description,
                }),
                h(
                  "form",
                  {
                    class: "modal-action",
                    method: "dialog",
                    onSubmit: (e) => {
                      e.preventDefault();
                      handleSubmit();
                    },
                  },
                  [h("button", { class: "btn", type: "submit" }, buttonText)]
                ),
              ]
            ),
          ]
        );
    },
  };

  const div = document.createElement("div");
  document.body.appendChild(div);
  const app = createApp(Modal);
  app.mount(div);

  const close = () => {
    visible.value = false;
    setTimeout(() => {
      app.unmount();
      document.body.removeChild(div);
    }, 200);
  };

  return close;
}
