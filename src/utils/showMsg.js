// src/utils/showMsg.js
import { ref, createApp } from "vue";
import Modal from "@/components/ui/feedback/Modal.vue";

export function showMsg(title, description, options = {}) {
  const { buttonText = "关闭", onSubmit = () => {} } = options;

  const visible = ref(true); // 控制弹窗显示/关闭

  const app = createApp(Modal, {
    title,
    description,
    buttonText,
    visible: visible.value,
    onSubmit: () => {
      onSubmit();
      close();
    },
  });

  const div = document.createElement("div");
  document.body.appendChild(div);
  app.mount(div);

  const close = () => {
    visible.value = false;
    app.unmount();
    document.body.removeChild(div);
  };

  return close; // 返回关闭函数，允许手动调用
}
