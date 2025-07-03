import MarkdownItFootnote from "markdown-it-footnote";

// 自定义脚注渲染函数
export function footnotePlugin(md) {
  md.use(MarkdownItFootnote);

  // 覆盖默认的脚注标题渲染函数，移除方括号
  md.renderer.rules.footnote_caption = function (
    tokens,
    idx /*, options, env, slf */
  ) {
    let n = Number(tokens[idx].meta.id + 1).toString();
    if (tokens[idx].meta.subId > 0) n += `:${tokens[idx].meta.subId}`;
    return n; // 只返回数字，不带方括号
  };
}
