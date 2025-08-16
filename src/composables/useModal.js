import { createApp, ref, h, nextTick } from "vue";
import Modal from "@/components/ui/Modal.vue";

const modal = {
  show(options = {}) {
    const {
      title = "Hello!",
      description = "点击按钮以关闭。",
      buttonText = "关闭",
      onSubmit = () => {},
    } = options;

    const container = document.createElement("div");
    document.body.appendChild(container);

    const modalApp = createApp({
      setup() {
        const visible = ref(false);

        const open = async () => {
          visible.value = true;
          await nextTick(); // 确保 DOM 更新完成后调用 showModal()
          const dialog = container.querySelector("dialog");
          setTimeout(() => {
            dialog.showModal();
          }, 150); // 延迟 50ms，确保动画 CSS 已经应用
        };

        const close = () => {
          const dialog = container.querySelector("dialog");
          dialog.close();
          setTimeout(() => {
            visible.value = false;
            modalApp.unmount();
            if (document.body.contains(container)) {
              document.body.removeChild(container); // 检查节点是否存在再移除
            }
          }, 500);
        };

        // 打开 Modal
        open();

        return () =>
          h(
            Modal,
            {
              title,
              description,
              buttonText,
              onSubmit,
              onClose: close,
              visible: visible.value,
            },
            {
              description: () =>
                typeof description === "string"
                  ? h("p", description)
                  : h("div", description),
            }
          );
      },
    });

    modalApp.mount(container);

    return {
      close: () => {
        modalApp.unmount();
        document.body.removeChild(container);
      },
    };
  },

  info(title, description, options = {}) {
    return this.show({ title, description, ...options });
  },

  confirm(title, description, options = {}) {
    return this.show({
      title,
      description,
      buttonText: options.buttonText || "确认",
      ...options,
    });
  },
};

export function useModal() {
  return modal;
}
