document.addEventListener("DOMContentLoaded", () => {
  const alertPattern =
    /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:\r?\n)?/i;

  const alertMeta = {
    NOTE: {
      label: "Note",
      icon: `
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6.75 7a.75.75 0 0 0 0 1.5h.5v3h-.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-.5V7.75A.75.75 0 0 0 8 7Z"
          />
        </svg>
      `,
    },

    TIP: {
      label: "Tip",
      icon: `
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8 0a5.5 5.5 0 0 0-3.594 9.666c.53.457.844 1.09.844 1.79v.044a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-.044c0-.7.314-1.333.844-1.79A5.5 5.5 0 0 0 8 0Zm1.25 14h-2.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5Z"
          />
        </svg>
      `,
    },

    IMPORTANT: {
      label: "Important",
      icon: `
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.53.22a.75.75 0 0 1 .94 0l1.61 1.3 2.03-.28a.75.75 0 0 1 .82.6l.35 2.02 1.82.95a.75.75 0 0 1 .37.95l-.88 1.85.88 1.85a.75.75 0 0 1-.37.95l-1.82.95-.35 2.02a.75.75 0 0 1-.82.6l-2.03-.28-1.61 1.3a.75.75 0 0 1-.94 0l-1.61-1.3-2.03.28a.75.75 0 0 1-.82-.6l-.35-2.02-1.82-.95a.75.75 0 0 1-.37-.95l.88-1.85-.88-1.85a.75.75 0 0 1 .37-.95l1.82-.95.35-2.02a.75.75 0 0 1 .82-.6l2.03.28ZM8 4.5a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 8 4.5Zm0 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
          />
        </svg>
      `,
    },

    WARNING: {
      label: "Warning",
      icon: `
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575ZM8 4.75a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 8 4.75Zm0 5.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
          />
        </svg>
      `,
    },

    CAUTION: {
      label: "Caution",
      icon: `
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4.47.22a.75.75 0 0 1 1.06 0L8 2.69 10.47.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06L13.31 8l2.47 2.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L8 13.31l-2.47 2.47a.75.75 0 0 1-1.06 0L.22 11.53a.75.75 0 0 1 0-1.06L2.69 8 .22 5.53a.75.75 0 0 1 0-1.06ZM5.53 3.28 3.28 5.53 5.75 8l-2.47 2.47 2.25 2.25L8 10.25l2.47 2.47 2.25-2.25L10.25 8l2.47-2.47-2.25-2.25L8 5.75Z"
          />
        </svg>
      `,
    },
  };

  document
    .querySelectorAll(".markdown-body blockquote")
    .forEach((blockquote) => {
      const firstParagraph = blockquote.firstElementChild;

      if (!firstParagraph || firstParagraph.tagName !== "P") {
        return;
      }

      const match = firstParagraph.textContent.match(alertPattern);

      if (!match) {
        return;
      }

      const type = match[1].toUpperCase();
      const meta = alertMeta[type];

      if (!meta) {
        return;
      }

      const walker = document.createTreeWalker(
        firstParagraph,
        NodeFilter.SHOW_TEXT,
      );

      while (walker.nextNode()) {
        const textNode = walker.currentNode;
        const markerMatch = textNode.nodeValue.match(alertPattern);

        if (!markerMatch) {
          continue;
        }

        textNode.nodeValue = textNode.nodeValue.replace(alertPattern, "");
        break;
      }

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
        `markdown-alert-${type.toLowerCase()}`,
      );

      const title = document.createElement("p");
      title.className = "markdown-alert-title";

      const icon = document.createElement("span");
      icon.className = "markdown-alert-icon";
      icon.innerHTML = meta.icon;

      const label = document.createElement("span");
      label.textContent = meta.label;

      title.append(icon, label);
      blockquote.insertBefore(title, blockquote.firstChild);

      if (
        !firstParagraph.textContent.trim() &&
        !firstParagraph.children.length
      ) {
        firstParagraph.remove();
      }
    });
});
