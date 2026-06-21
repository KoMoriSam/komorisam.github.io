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
    title: "提示",
  },
};

export function alertPlugin(md) {
  Object.keys(containerMeta).forEach((type) => {
    const { icon, title: defaultTitle } = containerMeta[type];
    md.use(MarkdownItContainer, type, {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          // 解析自定义标题：格式为 "type | 自定义标题"
          const info = token.info.trim();
          const separatorIndex = info.indexOf("|");
          const customTitle =
            separatorIndex !== -1
              ? info.slice(separatorIndex + 1).trim()
              : null;

          // 图标始终显示；仅当显式指定自定义标题时才渲染标题
          const hasTitle = !!customTitle;

          // 有标题时：标题行与正文分行；无标题时：图标与正文同行
          const alertLayoutClass = hasTitle
            ? "alert-vertical"
            : "alert-horizontal";

          const titleRow = hasTitle
            ? `<div class="flex items-center gap-2">
                <i class="${icon} translate-y-0.75 scale-150"></i>
                <h3>${customTitle}</h3>
              </div>`
            : "";

          return `<div role="alert" class="alert alert-${type} alert-soft ${alertLayoutClass} sm:gap-2">
            ${titleRow || `<i class="${icon} alert-icon"></i>`}
            <div>`;
        } else {
          return "</div></div>\n";
        }
      },
    });
  });
}
