import MarkdownItAnchor from "markdown-it-anchor";

export function anchorPlugin(md) {
  md.use(MarkdownItAnchor, {
    permalink: MarkdownItAnchor.permalink.linkAfterHeader({
      style: "visually-hidden",
      assistiveText: (title) => `跳转至 “${title}”`,
      visuallyHiddenClass: "hidden",
      wrapper: ['<div class="heading-wrapper">', "</div>"],
    }),
  });
}
