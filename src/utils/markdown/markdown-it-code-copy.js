import { createApp, h } from "vue";
import CodeBlock from "@/components/ui/CodeBlock.vue";

export default function codeCopyPlugin(md) {
  const defaultFenceRenderer = md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    // 获取默认的高亮代码HTML和原始代码内容
    const highlightedHtml = defaultFenceRenderer(
      tokens,
      idx,
      options,
      env,
      self
    );
    const codeContent = tokens[idx].content;
    const lang = tokens[idx].info.trim();

    // 创建挂载点
    const mountId = `code-block-${Date.now()}-${idx}`;

    // 异步挂载Vue组件
    setTimeout(() => {
      const mountEl = document.getElementById(mountId);
      if (mountEl) {
        const app = createApp({
          render: () =>
            h(
              CodeBlock,
              {
                code: codeContent,
                language: lang,
              },
              {
                // 使用默认插槽传递高亮代码
                default: () =>
                  h("div", {
                    innerHTML: highlightedHtml,
                    class: "hljs-container",
                  }),
              }
            ),
        });
        app.mount(mountEl);
      }
    }, 0);

    return `<div id="${mountId}"></div>`;
  };
}
