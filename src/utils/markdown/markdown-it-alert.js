import MarkdownItContainer from "markdown-it-container";

// 类型与图标/标题映射
const containerMeta = {
  success: {
    icon: "ri-checkbox-circle-line",
    title: "成功",
  },
  warning: {
    icon: "ri-alert-line",
    title: "警告",
  },
  error: {
    icon: "ri-close-circle-line",
    title: "错误",
  },
  info: {
    icon: "ri-information-line",
    title: "信息",
  },
  tip: {
    icon: "ri-lightbulb-flash-line",
    title: "Tip",
  },
};

export function alertPlugin(md) {
  Object.keys(containerMeta).forEach((type) => {
    const { icon, title } = containerMeta[type];
    md.use(MarkdownItContainer, type, {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<div role="alert" class="alert alert-${type} alert-soft alert-vertical sm:alert-horizontal sm:gap-2">
            <i class="${icon}"></i>
            <div>
              <h3>${title}</h3>
              <div>`;
        } else {
          return "</div></div></div>\n";
        }
      },
    });
  });
}
