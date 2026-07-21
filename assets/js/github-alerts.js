document.addEventListener("DOMContentLoaded", () => {
  const alertPattern =
    /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:\r?\n)?/i;

  const labels = {
    NOTE: "Note",
    TIP: "Tip",
    IMPORTANT: "Important",
    WARNING: "Warning",
    CAUTION: "Caution",
  };

  document
    .querySelectorAll(".markdown-body blockquote")
    .forEach((blockquote) => {
      const firstParagraph = blockquote.firstElementChild;

      if (!firstParagraph || firstParagraph.tagName !== "P") {
        return;
      }

      const walker = document.createTreeWalker(
        firstParagraph,
        NodeFilter.SHOW_TEXT,
      );

      let markerNode = null;
      let markerMatch = null;

      while (walker.nextNode()) {
        const match = walker.currentNode.nodeValue.match(alertPattern);

        if (match) {
          markerNode = walker.currentNode;
          markerMatch = match;
          break;
        }

        // 第一个有效文本不是 Alert 标记时停止检查
        if (walker.currentNode.nodeValue.trim()) {
          break;
        }
      }

      if (!markerNode || !markerMatch) {
        return;
      }

      const type = markerMatch[1].toUpperCase();
      const normalizedType = type.toLowerCase();

      // 从正文中删除 [!CAUTION] 等标记
      markerNode.nodeValue = markerNode.nodeValue.replace(alertPattern, "");

      // 清理标记后残留的换行或 <br>
      while (firstParagraph.firstChild) {
        const child = firstParagraph.firstChild;

        if (
          child.nodeType === Node.TEXT_NODE &&
          child.nodeValue.trim() === ""
        ) {
          child.remove();
          continue;
        }

        if (child.nodeType === Node.ELEMENT_NODE && child.tagName === "BR") {
          child.remove();
          continue;
        }

        break;
      }

      blockquote.classList.add(
        "markdown-alert",
        `markdown-alert-${normalizedType}`,
      );

      const title = document.createElement("p");
      title.className = "markdown-alert-title";

      const icon = document.createElement("span");
      icon.className = "markdown-alert-icon";
      icon.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.textContent = labels[type];

      title.append(icon, label);
      blockquote.insertBefore(title, blockquote.firstChild);

      // 标记单独占据一个空段落时，删除空段落
      if (
        !firstParagraph.textContent.trim() &&
        !firstParagraph.children.length
      ) {
        firstParagraph.remove();
      }
    });
});
