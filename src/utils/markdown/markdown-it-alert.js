// GitHub Callout 类型与现有 alert 类型/图标/默认标题映射
const CALLOUT_META = {
  NOTE: {
    type: "info",
    icon: "ri-information-line",
    title: "说明",
  },
  INFO: {
    type: "info",
    icon: "ri-information-line",
    title: "信息",
  },
  TIP: {
    type: "success",
    icon: "ri-lightbulb-flash-line",
    title: "提示",
  },
  IMPORTANT: {
    type: "info",
    icon: "ri-error-warning-line",
    title: "重要",
  },
  WARNING: {
    type: "warning",
    icon: "ri-alert-line",
    title: "警告",
  },
  CAUTION: {
    type: "error",
    icon: "ri-close-circle-line",
    title: "注意",
  },
  SUCCESS: {
    type: "success",
    icon: "ri-checkbox-circle-line",
    title: "成功",
  },
  ERROR: {
    type: "error",
    icon: "ri-close-circle-line",
    title: "错误",
  },
  DANGER: {
    type: "error",
    icon: "ri-close-circle-line",
    title: "危险",
  },
  QUOTE: {
    type: "accent",
    icon: "ri-chat-quote-line",
    title: "引用",
  },
  SUMMARY: {
    type: "info",
    icon: "ri-list-check-2",
    title: "摘要",
  },
};

const ICON_BY_ALERT_TYPE = {
  info: "ri-information-line",
  success: "ri-checkbox-circle-line",
  warning: "ri-alert-line",
  error: "ri-close-circle-line",
};

function inferAlertTypeFromMarker(markerLower) {
  if (/(warn|attention)/.test(markerLower)) return "warning";
  if (/(error|danger|fail|caution)/.test(markerLower)) return "error";
  if (/(tip|hint|help|success|ok)/.test(markerLower)) return "success";
  return "info";
}

function resolveCalloutMeta(rawType) {
  const upperType = rawType.toUpperCase();
  const fromPreset = CALLOUT_META[upperType];
  if (fromPreset) return fromPreset;

  const markerLower = rawType.toLowerCase();
  const type = inferAlertTypeFromMarker(markerLower);
  return {
    type,
    icon: ICON_BY_ALERT_TYPE[type],
    title: upperType,
  };
}

function parseCalloutHeader(content) {
  const leadingSpacesLength = content.length - content.trimStart().length;
  const normalized = content.slice(leadingSpacesLength);
  const match = normalized.match(
    /^\\?\[!([a-z][a-z0-9_-]*)\]([+-])?(?:[ \t]+([^\r\n]*))?(?:\r?\n|$)/i,
  );
  if (!match) return null;

  const rawType = match[1];
  const meta = resolveCalloutMeta(rawType);
  const foldMarker = match[2] || "";

  return {
    meta,
    customTitle: (match[3] || "").trim(),
    foldable: !!foldMarker,
    collapsed: foldMarker === "-",
    headerLength: leadingSpacesLength + match[0].length,
  };
}

function findBlockquoteCloseIndex(tokens, startIndex) {
  let level = 0;
  for (let i = startIndex; i < tokens.length; i++) {
    if (tokens[i].type === "blockquote_open") level++;
    if (tokens[i].type === "blockquote_close") {
      level--;
      if (level === 0) return i;
    }
  }
  return -1;
}

function retokenizeInline(md, token, content, env) {
  token.content = content;
  const children = [];
  md.inline.parse(content, md, env, children);
  token.children = children;
}

export function alertPlugin(md) {
  md.core.ruler.after("block", "github_callout_to_alert", (state) => {
    const { tokens } = state;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type !== "blockquote_open") continue;

      const closeIndex = findBlockquoteCloseIndex(tokens, i);
      if (closeIndex === -1) continue;

      const firstInlineIndex = i + 2;
      if (
        tokens[i + 1]?.type !== "paragraph_open" ||
        tokens[firstInlineIndex]?.type !== "inline"
      ) {
        continue;
      }

      const firstInline = tokens[firstInlineIndex];
      const parsed = parseCalloutHeader(firstInline.content);
      if (!parsed) {
        continue;
      }

      const remainingBody = firstInline.content.slice(parsed.headerLength);
      retokenizeInline(md, firstInline, remainingBody, state.env);

      if (!remainingBody.trim()) {
        tokens[i + 1].hidden = true;
        firstInline.hidden = true;
        if (tokens[firstInlineIndex + 1]?.type === "paragraph_close") {
          tokens[firstInlineIndex + 1].hidden = true;
        }
      }

      const title = parsed.customTitle || parsed.meta.title;
      const hasTitle = !!title;

      token.meta = {
        alert: {
          type: parsed.meta.type,
          icon: parsed.meta.icon,
          title,
          hasTitle,
          foldable: parsed.foldable,
          collapsed: parsed.collapsed,
        },
      };
      tokens[closeIndex].meta = token.meta;
    }
  });

  const defaultBlockquoteOpen =
    md.renderer.rules.blockquote_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  const defaultBlockquoteClose =
    md.renderer.rules.blockquote_close ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.blockquote_open = function (
    tokens,
    idx,
    options,
    env,
    self,
  ) {
    const alert = tokens[idx].meta?.alert;
    if (!alert) return defaultBlockquoteOpen(tokens, idx, options, env, self);

    const title = md.utils.escapeHtml(alert.title || "");
    const summaryTitle = alert.hasTitle ? title : "";

    if (alert.foldable) {
      const openAttr = alert.collapsed ? "" : " open";
      const summaryRow = `
      <summary class="alert-title collapse-title">
        <i class="${alert.icon} translate-y-0.75 scale-150"></i>
        <h3>${summaryTitle}</h3>
      </summary>`;
      return `
      <details role="alert" 
        class="alert alert-${alert.type} alert-soft alert-vertical sm:gap-2 collapse collapse-arrow"${openAttr}>
        ${summaryRow}
      `;
    }

    const staticSummaryRow = `
    <summary class="alert-title select-none pointer-events-none cursor-default">
      <i class="${alert.icon} translate-y-0.75 scale-150"></i>
      <h3>${summaryTitle}</h3>
    </summary>`;
    return `
    <details role="alert" open 
      class="alert alert-${alert.type} alert-soft alert-vertical sm:gap-2">
      ${staticSummaryRow}
    `;
  };

  md.renderer.rules.blockquote_close = function (
    tokens,
    idx,
    options,
    env,
    self,
  ) {
    const alert = tokens[idx].meta?.alert;
    if (!alert) return defaultBlockquoteClose(tokens, idx, options, env, self);

    return "</details>\n";
  };
}
