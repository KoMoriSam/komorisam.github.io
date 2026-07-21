document.addEventListener("DOMContentLoaded", () => {
  const alertPattern =
    /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:\r?\n)?/i;

  const alertMeta = {
    NOTE: {
      label: "Note",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12 2 6.47715 6.47715 2 12 2 17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 7.58172 4 4 7.58172 4 12 4 16.4183 7.58172 20 12 20ZM13 10.5V15H14V17H10V15H11V12.5H10V10.5H13ZM13.5 8C13.5 8.82843 12.8284 9.5 12 9.5 11.1716 9.5 10.5 8.82843 10.5 8 10.5 7.17157 11.1716 6.5 12 6.5 12.8284 6.5 13.5 7.17157 13.5 8Z"></path></svg>`,
    },

    TIP: {
      label: "Tip",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.97308 18H11V13H13V18H14.0269C14.1589 16.7984 14.7721 15.8065 15.7676 14.7226C15.8797 14.6006 16.5988 13.8564 16.6841 13.7501C17.5318 12.6931 18 11.385 18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10C6 11.3843 6.46774 12.6917 7.31462 13.7484C7.40004 13.855 8.12081 14.6012 8.23154 14.7218C9.22766 15.8064 9.84103 16.7984 9.97308 18ZM10 20V21H14V20H10ZM5.75395 14.9992C4.65645 13.6297 4 11.8915 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 11.8925 19.3428 13.6315 18.2443 15.0014C17.624 15.7748 16 17 16 18.5V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V18.5C8 17 6.37458 15.7736 5.75395 14.9992Z"></path></svg>`,
    },

    IMPORTANT: {
      label: "Important",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM4 18.3851L5.76282 17H20V5H4V18.3851ZM11 13H13V15H11V13ZM11 7H13V12H11V7Z"></path></svg>`,
    },

    WARNING: {
      label: "Warning",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.8659 3.00017L22.3922 19.5002C22.6684 19.9785 22.5045 20.5901 22.0262 20.8662C21.8742 20.954 21.7017 21.0002 21.5262 21.0002H2.47363C1.92135 21.0002 1.47363 20.5525 1.47363 20.0002C1.47363 19.8246 1.51984 19.6522 1.60761 19.5002L11.1339 3.00017C11.41 2.52187 12.0216 2.358 12.4999 2.63414C12.6519 2.72191 12.7782 2.84815 12.8659 3.00017ZM4.20568 19.0002H19.7941L11.9999 5.50017L4.20568 19.0002ZM10.9999 16.0002H12.9999V18.0002H10.9999V16.0002ZM10.9999 9.00017H12.9999V14.0002H10.9999V9.00017Z"></path></svg>`,
    },

    CAUTION: {
      label: "Caution",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.936 2.50098L21.501 8.06595V15.936L15.936 21.501H8.06595L2.50098 15.936V8.06595L8.06595 2.50098H15.936ZM15.1076 4.50098H8.89437L4.50098 8.89437V15.1076L8.89437 19.501H15.1076L19.501 15.1076V8.89437L15.1076 4.50098ZM11.0002 15.0002H13.0002V17.0002H11.0002V15.0002ZM11.0002 7.00024H13.0002V13.0002H11.0002V7.00024Z"></path></svg>`,
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
