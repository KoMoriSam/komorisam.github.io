import { createApp, h } from "vue";

// 确保 toast 容器存在
function ensureToastContainer() {
  let container = document.querySelector(".toast");
  if (!container) {
    container = document.createElement("div");
    container.className =
      "toast md:toast-middle toast-end z-1 max-md:bottom-16 md:right-16";
    document.body.appendChild(container);
  }
  return container;
}

/**
 * 显示一个 alert 消息
 * @param {string} message - 要显示的消息内容
 * @param {string} type - alert 类型 (info, success, error, warning)
 * @param {Object} [options] - 配置选项
 * @param {number} [options.duration] - 自动消失的延迟时间(毫秒)，0 表示不自动消失
 * @param {string} [options.icon] - 自定义图标类名
 * @param {boolean} [options.closable] - 是否显示关闭按钮，默认为 false
 */
export function showAlert(message, type = "info", options = {}) {
  const { duration = 2000, icon, closable = false } = options;

  const container = ensureToastContainer();

  // 默认图标配置
  const icons = {
    info: "ri-information-line",
    success: "ri-checkbox-circle-line",
    error: "ri-close-circle-line",
    warning: "ri-alert-line",
  };

  // 创建 alert 元素
  const alertDiv = document.createElement("div");

  // 添加图标
  const iconElement = document.createElement("i");
  iconElement.className = icon || icons[type] || icons.info;
  alertDiv.appendChild(iconElement);

  // 添加消息内容
  const span = document.createElement("span");
  span.textContent = message;
  alertDiv.appendChild(span);

  // 添加关闭按钮（如果启用）
  if (closable) {
    const closeButton = document.createElement("button");
    closeButton.className = "btn btn-circle btn-ghost btn-xs";
    closeButton.innerHTML = '<i class="ri-close-line"></i>';
    closeButton.addEventListener("click", () => {
      removeAlert(container);
    });
    alertDiv.appendChild(closeButton);
  }

  // 添加到容器中
  container.appendChild(alertDiv);
  alertDiv.className = `alert alert-soft alert-${type} transition-opacity duration-500`;

  const removeAlert = (container) => {
    alertDiv.classList.add("opacity-0");
    setTimeout(() => {
      alertDiv.remove();
    }, 300);
    if (container.children.length === 0) {
      container.remove();
    }
  };

  // 如果设置了持续时间，自动移除
  if (duration > 0) {
    setTimeout(() => {
      removeAlert(container);
    }, duration);
  }

  // 返回移除函数
  return () => {
    setTimeout(() => {
      removeAlert(container);
    }, 300);
  };
}

// 快捷方法
export const alert = {
  info: (message, duration) => showAlert(message, "info", duration),
  success: (message, duration) => showAlert(message, "success", duration),
  error: (message, duration) => showAlert(message, "error", duration),
  warning: (message, duration) => showAlert(message, "warning", duration),

  // 自定义图标
  custom: (message, type, icon, duration) =>
    showAlert(message, type, duration, icon),
};
