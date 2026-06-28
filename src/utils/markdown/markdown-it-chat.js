const selfNames = ["我", "小群主", "Mori", "KoMoriSam"];
const avatarMap = {
  "🈚️内👻，LG": "/assets/images/avatar/lg.webp",
  小群主: "/assets/images/avatar/komorisam.webp",
  Mori: "/assets/images/avatar/komorisam.webp",
  真正群主: "/assets/images/avatar/talloran.webp",
  牛子: "/assets/images/avatar/niuzi.webp",
  欢乐豆人: "/assets/images/avatar/joybean.webp",
  天天: "/assets/images/avatar/smellycat7.webp",
  量子: "/assets/images/avatar/quantum.webp",
  泡泡冰: "/assets/images/avatar/paopao.webp",
  李焰老师: "/assets/images/avatar/liyan.webp",
  赵天明老师: "/assets/images/avatar/zhaotianming.webp",
  爸: "/assets/images/avatar/dad.webp",
  妈: "/assets/images/avatar/mom.webp",
};

const footerStyleMap = [
  { keyword: "已送达", className: "badge-info" },
  { keyword: "已读", className: "badge-success" },
  { keyword: "发送失败", className: "badge-error" },
  { keyword: "已删除", className: "badge-neutral" },
  { keyword: "已编辑", className: "badge-primary" },
  { keyword: "已转发", className: "badge-secondary" },
  { keyword: "已回复", className: "badge-accent" },
  { keyword: "已引用", className: "badge-info" },
  { keyword: "精华消息", className: "badge-secondary" },
  { keyword: "👍", className: "badge-success" },
  { keyword: "👎", className: "badge-error" },
  { keyword: "💬", className: "badge-info" },
  { keyword: "🔗", className: "badge-primary" },
  { keyword: "📎", className: "badge-secondary" },
  { keyword: "📷", className: "badge-accent" },
  { keyword: "🎥", className: "badge-warning" },
];

const DEFAULT_AVATAR = "/assets/images/avatar/default.webp";

function escapeHtml(md, value = "") {
  return md.utils.escapeHtml(String(value));
}

function createNestedRenderEnv(env) {
  const nestedEnv = env && typeof env === "object" ? { ...env } : {};
  // 避免继承外层渲染收集到的脚注，防止在气泡/评论内追加脚注列表
  delete nestedEnv.footnotes;
  return nestedEnv;
}

function renderNestedMarkdown(md, source = "", env) {
  return md.render(String(source), createNestedRenderEnv(env)).trim();
}

function stripOuterQuote(line) {
  return line.replace(/^[ \t]{0,3}> ?/, "");
}

function stripInnerQuote(line) {
  return line.replace(/^> ?/, "");
}

function stripMarkdownStrong(value = "") {
  return value.replace(/^\*\*(.+?)\*\*$/, "$1").trim();
}

function parseStrongHead(line = "") {
  const cleaned = line.trim().replace(/\s+$/g, "");
  const match = cleaned.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (!match) return null;
  return {
    name: match[1].trim(),
    rest: match[2].trim(),
  };
}

function splitMeta(rest = "") {
  return rest
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCalloutHead(line, type) {
  const match = line.trim().match(new RegExp(`^\\[!${type}\\]\\s*(.*)$`));
  return match?.[1]?.trim() || "";
}

function renderFooterBadges(footers) {
  if (!footers.length) return "";

  return (
    `<div class="chat-footer join mt-1.5">` +
    footers
      .map((footer) => {
        const matched = footerStyleMap.find(({ keyword }) =>
          footer.includes(keyword),
        );
        const cls = matched ? matched.className : "";
        return `<span class="join-item badge badge-soft ${cls}">${footer}</span>`;
      })
      .join("") +
    `</div>`
  );
}

function renderChatBar(md, headLine) {
  const head = parseStrongHead(headLine);
  const title = head?.name || stripMarkdownStrong(headLine) || "聊天对象";
  const extra = head?.rest?.replace(/^·\s*/, "").trim();
  const avatar = avatarMap[title] || DEFAULT_AVATAR;

  const statusMap = {
    在线: { text: "在线", class: "badge-success" },
    离线: { text: "离线", class: "badge-outline" },
    忙碌: { text: "忙碌", class: "badge-error" },
  };

  const isGroup = extra && /^\d+$/.test(extra);
  const status =
    statusMap[extra] || (extra ? { text: extra, class: "" } : null);

  let infoLine = "";
  if (isGroup) {
    infoLine = `
        <span class="badge max-sm:badge-xs">
          ${escapeHtml(md, extra)}
        </span>`;
  } else if (status) {
    infoLine = `
        <span class="badge badge-soft ${status.class} max-sm:badge-xs">
          ${escapeHtml(md, status.text)}
        </span>`;
  }

  return `
        <div class="chat-bar">
          <i class="ri-arrow-left-wide-line ml-0.5 sm:ml-2 mr-0"></i>
          <div class="chat-image avatar">
            <div class="w-8 sm:w-10 rounded-full">
              <img alt="${escapeHtml(md, title)}" src="${avatar}"/>
            </div>
          </div>
          <span class="font-bold">
            ${escapeHtml(md, title)}
          </span>
          ${infoLine}
          <i class="ri-menu-line ml-auto mr-0.5 sm:mr-2"></i>
        </div>
        <div class="chat-content">`;
}

function parseChatMessages(lines) {
  const messages = [];
  let current = null;

  const pushCurrent = () => {
    if (current) {
      current.content = current.content.join("\n").trim();
      messages.push(current);
      current = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) continue;
    if (!line.startsWith(">")) continue;

    const innerLine = stripInnerQuote(line).trimEnd();
    const head = parseStrongHead(innerLine);
    const looksLikeMessageHead = Boolean(head?.name && head?.rest);

    if (looksLikeMessageHead) {
      pushCurrent();
      const meta = splitMeta(head.rest);
      current = {
        username: head.name,
        time: meta.shift() || "",
        footers: meta,
        content: [],
      };
      continue;
    }

    if (current) current.content.push(innerLine);
  }

  pushCurrent();
  return messages;
}

function renderChatMessage(md, message, env) {
  const username = message.username || "用户";
  const time = message.time || "";
  const footers = message.footers || [];
  const isSelf = selfNames.includes(username);
  const avatar = avatarMap[username.trim()] || DEFAULT_AVATAR;
  const footerHTML = renderFooterBadges(
    footers.map((item) => escapeHtml(md, item)),
  );
  const contentHTML = message.content
    ? renderNestedMarkdown(md, message.content, env)
    : "";

  return `
        <div class="chat ${isSelf ? "chat-end" : "chat-start"}">
          <div class="chat-image avatar">
            <div class="w-10 rounded-full">
              <img alt="${escapeHtml(md, username)}" src="${avatar}"/>
            </div>
          </div>
          <div class="chat-header">
            ${escapeHtml(md, username)}
            <time class="opacity-50">${escapeHtml(md, time)}</time>
          </div>
          ${footerHTML}
          <div class="chat-bubble ${isSelf ? "chat-bubble-primary" : ""}">
            ${contentHTML}
          </div>
        </div>`;
}

function renderChatCallout(md, lines, env) {
  const headLine = parseCalloutHead(lines[0], "chat");
  const messages = parseChatMessages(lines.slice(1));

  return `
        ${renderChatBar(md, headLine)}
        ${messages.map((message) => renderChatMessage(md, message, env)).join("\n")}
        </div>
`;
}

function parseMomentHead(line) {
  const headLine = parseCalloutHead(line, "moment");
  const head = parseStrongHead(headLine);
  const username = head?.name || stripMarkdownStrong(headLine) || "用户";
  const meta = splitMeta(head?.rest || "");

  return {
    username,
    time: meta.shift() || "",
    location: meta.join(" · "),
  };
}

function parseMomentStats(line = "") {
  const like =
    line.match(/❤️\s*(\d+)/)?.[1] || line.match(/Likes?:\s*(\d+)/i)?.[1] || "";
  const comment =
    line.match(/💬\s*(\d+)/)?.[1] ||
    line.match(/Comments?:\s*(\d+)/i)?.[1] ||
    "";
  const share =
    line.match(/🔁\s*(\d+)/)?.[1] || line.match(/Shares?:\s*(\d+)/i)?.[1] || "";

  return { like, comment, share };
}

function isMomentStatsLine(line = "") {
  return /❤️\s*\d+|💬\s*\d+|🔁\s*\d+|Likes?:\s*\d+|Comments?:\s*\d+|Shares?:\s*\d+/i.test(
    line,
  );
}

function parseMarkdownImage(line = "") {
  const match = line.trim().match(/^!\[([^\]]*)\]\((.+?)\)$/);
  if (!match) return null;

  let url = match[2].trim();
  const titleMatch = url.match(/^(.+?)\s+["'].*["']$/);
  if (titleMatch) url = titleMatch[1].trim();

  return {
    alt: match[1].trim(),
    url,
  };
}

function renderActions(like = "", comment = "", share = "") {
  return `
        <div class="moments-actions">
          <button class="btn btn-ghost btn-sm">
            <i class="ri-thumb-up-line"></i>
            <span class="hidden sm:inline">点赞</span>
            ${like ? `<span class="hidden sm:inline">·</span><span>${like}</span>` : ""}
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="ri-chat-3-line"></i>
            <span class="hidden sm:inline">评论</span>
            ${comment ? `<span class="hidden sm:inline">·</span><span>${comment}</span>` : ""}
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="ri-share-forward-line"></i>
            <span class="hidden sm:inline">分享</span>
            ${share ? `<span class="hidden sm:inline">·</span><span>${share}</span>` : ""}
          </button>
        </div>`;
}

function parseCommentHead(line = "") {
  const match = line.match(/^-\s+\*\*(.+?)\*\*\s+(.+?)(?:：\s*(.*))?$/);
  if (!match) return null;
  return {
    username: match[1].trim(),
    time: match[2].trim(),
    content: match[3]?.trim() || "",
    replies: [],
  };
}

function parseReplyHead(line = "") {
  const match = line.match(
    /^\s+-\s+\*\*(.+?)\*\*\s+回复\s+\*\*(.+?)\*\*\s+(.+?)(?:：\s*(.*))?$/,
  );
  if (!match) return null;
  return {
    replier: match[1].trim(),
    target: match[2].trim(),
    time: match[3].trim(),
    content: match[4]?.trim() || "",
  };
}

function parseMomentComments(lines) {
  const comments = [];
  let currentComment = null;
  let currentReply = null;

  const pushReply = () => {
    if (currentReply && currentComment) {
      currentReply.content = currentReply.content.trim();
      currentComment.replies.push(currentReply);
    }
    currentReply = null;
  };

  const pushComment = () => {
    pushReply();
    if (currentComment) {
      currentComment.content = currentComment.content.trim();
      comments.push(currentComment);
    }
    currentComment = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, "");
    if (!line.trim()) continue;

    const reply = parseReplyHead(line);
    if (reply) {
      pushReply();
      currentReply = reply;
      continue;
    }

    const comment = parseCommentHead(line);
    if (comment) {
      pushComment();
      currentComment = comment;
      continue;
    }

    if (currentReply && /^\s{4,}\S/.test(line)) {
      currentReply.content += `${currentReply.content ? "\n" : ""}${line.trim()}`;
    } else if (currentComment && /^\s{2,}\S/.test(line)) {
      currentComment.content += `${currentComment.content ? "\n" : ""}${line.trim()}`;
    }
  }

  pushComment();
  return comments;
}

function injectCommentInfoIntoFirstParagraph(html, infoHTML) {
  const trimmed = String(html || "").trim();
  if (!trimmed) return `<p>${infoHTML}</p>`;

  return trimmed.replace(/<p([^>]*)>/, `<p$1>${infoHTML}`);
}

function renderMomentComment(md, comment, env) {
  const username = comment.username || "用户";
  const avatar = avatarMap[username] || DEFAULT_AVATAR;
  const isSelf = selfNames.includes(username);
  const infoHTML = `
            <span class="comments-info">
              <span class="user-name">${!isSelf ? escapeHtml(md, username) : "我"}</span>
              ${comment.time ? `<span class="comment-time">${escapeHtml(md, comment.time)}</span>` : ""}
            </span>
            `;
  const contentHTML = injectCommentInfoIntoFirstParagraph(
    comment.content ? renderNestedMarkdown(md, comment.content, env) : "",
    infoHTML,
  );

  return `
        <div class="flex items-center gap-2 not-prose">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img class="m-0!" src="${avatar}" alt="${escapeHtml(md, username)}" />
            </div>
          </div>
          ${contentHTML}
        </div>
        ${comment.replies.map((reply) => renderMomentReply(md, reply, env)).join("\n")}`;
}

function renderMomentReply(md, reply, env) {
  const replier = reply.replier || "用户";
  const target = reply.target || "用户";
  const avatar = avatarMap[replier] || DEFAULT_AVATAR;
  const isSelf = selfNames.includes(replier);
  const infoHTML = `
            <span class="comments-info">
              <span class="user-name">${!isSelf ? escapeHtml(md, replier) : "我"}
              <span class="opacity-60"> 回复 </span>
              ${escapeHtml(md, target)}</span>
              ${reply.time ? `<span class="comment-time">${escapeHtml(md, reply.time)}</span>` : ""}
            </span>
            `;
  const contentHTML = injectCommentInfoIntoFirstParagraph(
    reply.content ? renderNestedMarkdown(md, reply.content, env) : "",
    infoHTML,
  );

  return `
        <div class="flex items-center gap-2 ml-10 -translate-y-1.5 not-prose">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img class="m-0!" src="${avatar}" alt="${escapeHtml(md, replier)}" />
            </div>
          </div>
          ${contentHTML}
        </div>`;
}

function renderMomentComments(md, comments, env) {
  if (!comments.length) return "";

  const commentUser = "小群主";
  const commentAvatar = avatarMap[commentUser] || DEFAULT_AVATAR;

  return `
        <div class="moments-comments">
          <div class="flex items-center gap-2 mb-2 w-full">
            <div class="avatar">
              <div class="w-8 rounded-full">
                <img src="${commentAvatar}" alt="${commentUser}" />
              </div>
            </div>
            <div class="join w-full">
              <input type="text" placeholder="说点什么……" class="input input-bordered input-sm join-item w-full" />
              <button class="btn btn-primary btn-sm join-item">发送</button>
            </div>
          </div>
          <div class="comments-list">
            ${comments.map((comment) => renderMomentComment(md, comment, env)).join("\n")}
          </div>
        </div>`;
}

function renderMomentCallout(md, lines, env) {
  const { username, time, location } = parseMomentHead(lines[0]);
  const avatar = avatarMap[username] || DEFAULT_AVATAR;
  const isSelf = selfNames.includes(username);

  const contentLines = [];
  const images = [];
  let stats = { like: "", comment: "", share: "" };
  const commentLines = [];
  let inComments = false;

  for (const rawLine of lines.slice(1)) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (/^\*\*评论\*\*$/.test(trimmed)) {
      inComments = true;
      continue;
    }

    if (inComments || /^-\s+\*\*/.test(line)) {
      inComments = true;
      commentLines.push(line);
      continue;
    }

    const image = parseMarkdownImage(trimmed);
    if (image) {
      images.push(image);
      continue;
    }

    if (isMomentStatsLine(trimmed)) {
      stats = parseMomentStats(trimmed);
      continue;
    }

    contentLines.push(line);
  }

  const contentHTML = contentLines.join("\n").trim()
    ? renderNestedMarkdown(md, contentLines.join("\n").trim(), env)
    : "";
  const imagesHTML = images.length
    ? `<div class="moments-images not-prose">\n${images
        .map(
          ({ url, alt }) =>
            `<img src="${escapeHtml(md, url)}" alt="${escapeHtml(md, alt)}" loading="lazy" />`,
        )
        .join("\n")}\n</div>`
    : "";
  const comments = parseMomentComments(commentLines);

  return `
        <div class="moments-card not-prose">
          <div class="card-body">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-12 rounded-full">
                  <img class="m-0!" src="${avatar}" alt="${escapeHtml(md, username)}" />
                </div>
              </div>
              <div class="moments-header">
                <div class="header-title">${escapeHtml(md, username)}</div>
                <div class="header-info">
                  ${time ? `<span><i class="ri-time-line"></i> ${escapeHtml(md, time)}</span>` : ""}
                  ${location ? `<span><i class="ri-map-pin-2-line"></i> ${escapeHtml(md, location)}</span>` : ""}
                </div>
              </div>
              ${isSelf ? '<i class="ri-more-2-line"></i>' : ""}
            </div>
            <div class="moments-content mt-3">
              ${contentHTML}
              ${imagesHTML}
            </div>
            ${renderActions(stats.like, stats.comment, stats.share)}
            ${renderMomentComments(md, comments, env)}
          </div>
        </div>
`;
}

function installCalloutPlugin(md) {
  if (md.__komorisamChatCalloutPluginInstalled) return;
  md.__komorisamChatCalloutPluginInstalled = true;

  md.renderer.rules.komorisam_chat_moment_callout = function (
    tokens,
    idx,
    options,
    env,
  ) {
    const { type, lines } = tokens[idx].meta || {};

    if (type === "chat") {
      return renderChatCallout(md, lines || [], env);
    }

    if (type === "moment") {
      return renderMomentCallout(md, lines || [], env);
    }

    return "";
  };

  md.block.ruler.before(
    "blockquote",
    "komorisam_chat_moment_callout",
    (state, startLine, endLine, silent) => {
      const startPos = state.bMarks[startLine] + state.tShift[startLine];
      const startMax = state.eMarks[startLine];
      const startRaw = state.src.slice(startPos, startMax);
      const startText = stripOuterQuote(startRaw).trim();
      const type = startText.match(/^\[!(chat|moment)\]\s*/)?.[1];

      if (!type) return false;
      if (silent) return true;

      const lines = [];
      let nextLine = startLine;

      for (; nextLine < endLine; nextLine += 1) {
        const pos = state.bMarks[nextLine] + state.tShift[nextLine];
        const max = state.eMarks[nextLine];
        const raw = state.src.slice(pos, max);

        if (!/^[ \t]{0,3}>/.test(raw)) break;
        lines.push(stripOuterQuote(raw));
      }

      const token = state.push("komorisam_chat_moment_callout", "", 0);
      token.block = true;
      token.map = [startLine, nextLine];
      token.meta = { type, lines };

      state.line = nextLine;
      return true;
    },
    { alt: ["paragraph", "reference", "blockquote"] },
  );
}

export function chatContainerPlugin(md) {
  installCalloutPlugin(md);
}

export function chatHeaderPlugin(md) {
  installCalloutPlugin(md);
}

export function momentsPlugin(md) {
  installCalloutPlugin(md);
}
