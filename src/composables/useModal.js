import { createApp, ref, h } from "vue";
import Modal from "@/components/ui/Modal.vue"; // 假设的组件路径

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
        const visible = ref(true);

        const close = () => {
          visible.value = false;
          setTimeout(() => {
            modalApp.unmount();
            document.body.removeChild(container);
          }, 200);
        };

        return () =>
          h(Modal, {
            title,
            description,
            buttonText,
            onSubmit,
            onClose: close,
            visible: visible.value,
          });
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
