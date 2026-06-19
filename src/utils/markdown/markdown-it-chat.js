import MarkdownItContainer from "markdown-it-container";

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

export function chatContainerPlugin(md) {
  md.use(MarkdownItContainer, "chat", {
    validate: (params) => /^chat\s+.+\|.+/.test(params.trim()),
    render(tokens, idx) {
      const token = tokens[idx];
      const match = token.info
        .trim()
        .match(/^chat\s+(.+?)\s*\|\s*(.+?)(?:\s*\|\s*(.+))?$/);
      const username = match?.[1]?.trim() || "用户";
      const time = match?.[2]?.trim() || "";
      const footerRaw = match?.[3] || "";
      const footers = footerRaw
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);

      const isSelf = selfNames.includes(username);
      const avatar =
        avatarMap[username.trim()] || "/assets/images/avatar/default.webp";

      if (token.nesting === 1) {
        const footerHTML =
          footers.length > 0
            ? `<div class="chat-footer join mt-1.5">` +
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
            : "";
        return `
        <div class="chat ${isSelf ? "chat-end" : "chat-start"}">
          <div class="chat-image avatar">
            <div class="w-10 rounded-full">
              <img alt="${username}" src="${avatar}"/>
            </div>
          </div>
          <div class="chat-header">
            ${username}
            <time class="opacity-50">${time}</time>
          </div>
		  ${footerHTML}
          <div class="chat-bubble ${isSelf ? "chat-bubble-primary" : ""}">\n`;
      } else {
        return `</div></div>\n`;
      }
    },
  });
}

export function chatHeaderPlugin(md) {
  md.use(MarkdownItContainer, "chat-header", {
    validate: (params) => /^chat-header\s+.+/.test(params.trim()),
    render(tokens, idx) {
      const token = tokens[idx];
      const match = token.info
        .trim()
        .match(/^chat-header\s+(.+?)(?:\s*\|\s*(.+))?$/);
      const title = match?.[1]?.trim() || "聊天对象";
      const extra = match?.[2]?.trim();

      const avatar = avatarMap[title] || "/assets/images/avatar/default.webp";

      // 状态字段映射
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
          ${extra}
        </span>`;
      } else if (status) {
        infoLine = `
        <span class="badge badge-soft ${status.class} max-sm:badge-xs">
          ${status.text}
        </span>`;
      }

      if (token.nesting === 1) {
        return `
        <div class="chat-bar">
          <i class="ri-arrow-left-wide-line ml-0.5 sm:ml-2 mr-0"></i>
          <div class="chat-image avatar">
            <div class="w-8 sm:w-10 rounded-full">
              <img alt="${title}" src="${avatar}"/>
            </div>
          </div>
          <span class="font-bold">
            ${title}
          </span>
          ${infoLine}
          <i class="ri-menu-line ml-auto mr-0.5 sm:mr-2"></i>
        </div>
        <div class="chat-content">`;
      } else {
        return `</div>\n`;
      }
    },
  });
}

export function momentsPlugin(md) {
  let _momentsLike = ""; // 闭包变量，在开/闭标签间传递 like
  let _momentsComment = ""; // 评论数
  let _momentsShare = ""; // 分享数
  let _hasMomentsComments = false; // 标记当前 moments 是否包含 moments-comments

  const renderActions = () => `
        <div class="moments-actions">
          <button class="btn btn-ghost btn-sm">
            <i class="ri-thumb-up-line"></i>
            <span class="hidden sm:inline">点赞</span>
            ${_momentsLike ? `<span class="hidden sm:inline">·</span><span>${_momentsLike}</span>` : ""}
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="ri-chat-3-line"></i>
            <span class="hidden sm:inline">评论</span>
            ${_momentsComment ? `<span class="hidden sm:inline">·</span><span>${_momentsComment}</span>` : ""}
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="ri-share-forward-line"></i>
            <span class="hidden sm:inline">分享</span>
            ${_momentsShare ? `<span class="hidden sm:inline">·</span><span>${_momentsShare}</span>` : ""}
          </button>
        </div>`;

  md.use(MarkdownItContainer, "moments", {
    validate: (params) => /^moments\s+.+\|.+/.test(params.trim()),
    render(tokens, idx) {
      const token = tokens[idx];

      if (token.nesting === 1) {
        _hasMomentsComments = false;
        // 只在开标签解析参数（闭标签 token.info 不含参数）
        const params = token.info
          .trim()
          .replace(/^moments\s+/, "")
          .split("|")
          .map((s) => s.trim());
        const [
          username = "用户",
          time = "",
          location = "",
          like = "",
          comment = "",
          share = "",
        ] = params;
        _momentsLike = like;
        _momentsComment = comment;
        _momentsShare = share;

        const avatar =
          avatarMap[username] || "/assets/images/avatar/default.webp";
        const isSelf = selfNames.includes(username);

        return `
        <div class="moments-card not-prose">
          <div class="card-body">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-12 rounded-full">
                  <img class="m-0!" src="${avatar}" alt="${username}" />
                </div>
              </div>
              <div class="flex-1">
                <div class="text-lg font-bold">${username}</div>
                <div class="text-xs opacity-70 flex gap-2">
                  <span><i class="ri-time-line"></i> ${time}</span>
                  ${location ? `<span><i class="ri-map-pin-2-line"></i> ${location}</span>` : ""}
                </div>
              </div>
              ${isSelf ? '<i class="ri-more-2-line"></i>' : ""}
            </div>
            <div class="moments-content mt-3">
        `;
      } else {
        // moments 闭合标签：若没有 moments-comments，则自行关闭 moments-content + 渲染 actions + 关闭 card
        if (_hasMomentsComments) {
          return `
          </div>
        </div>
        `;
        }
        return `
            </div>
            ${renderActions()}
          </div>
        </div>
        `;
      }
    },
  });

  // 朋友圈图片组插件（使用 ; 标记符，避免与外层 ::: 容器冲突）
  md.use(MarkdownItContainer, "moments-images", {
    marker: ";",
    validate: (params) => params.trim() === "moments-images",
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        return `<div class="moments-images grid gap-2 mt-3 not-prose">\n`;
      } else {
        return `</div>\n`;
      }
    },
  });

  // 朋友圈评论插件（使用 ^ 标记符，避免与外层 ::: 容器冲突）
  // 用法: ^moments-comments [用户名]  — 用户名可选，默认 "小群主"
  md.use(MarkdownItContainer, "moments-comments", {
    marker: "^",
    validate: (params) => /^moments-comments/.test(params.trim()),
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        _hasMomentsComments = true;
        const userParam = tokens[idx].info
          .trim()
          .replace(/^moments-comments\s*/, "")
          .trim();
        const commentUser = userParam || "小群主";
        const commentAvatar =
          avatarMap[commentUser] || "/assets/images/avatar/default.webp";
        return `
            </div>
            ${renderActions()}
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
        `;
      } else {
        return `
          </div>
        </div>
        `;
      }
    },
  });

  // 单条评论插件（使用 ^ 标记符，避免与外层 ::: 容器冲突）
  // 用法: ^^^ comment 用户名 | 时间 | 评论内容
  md.use(MarkdownItContainer, "comment", {
    marker: "^",
    validate: (params) => /^comment\s+.+\|.+/.test(params.trim()),
    render(tokens, idx) {
      const token = tokens[idx];
      const raw = token.info.trim().replace(/^comment\s+/, "");
      const parts = raw.split("|").map((s) => s.trim());
      const [username = "用户", time = "", content = ""] = parts;
      const avatar =
        avatarMap[username] || "/assets/images/avatar/default.webp";
      const isSelf = selfNames.includes(username);

      if (token.nesting === 1) {
        return `
        <div class="flex items-center gap-2 not-prose">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img class="m-0!" src="${avatar}" alt="${username}" />
            </div>
          </div>
          <p>
            <span class="user-name">${!isSelf ? `${username}` : "我"}</span>
            ${time ? `<span class="opacity-50 text-xs ml-1">${time}</span>` : ""}
            <br />
            ${content}
          </p>
        </div>
        `;
      } else {
        return "";
      }
    },
  });

  // 回复评论插件（使用 ^ 标记符，避免与外层 ::: 容器冲突）
  // 用法: ^^^ reply 回复者 -> 被回复者 | 时间 | 回复内容
  md.use(MarkdownItContainer, "reply", {
    marker: "^",
    validate: (params) => /^reply\s+.+->.+\|.+/.test(params.trim()),
    render(tokens, idx) {
      const token = tokens[idx];
      const raw = token.info.trim().replace(/^reply\s+/, "");
      const parts = raw.split("|").map((s) => s.trim());
      const [head = "", time = "", content = ""] = parts;

      // 从 head 中解析 回复者 -> 被回复者
      const arrowIdx = head.indexOf("->");
      const replier = arrowIdx > -1 ? head.substring(0, arrowIdx).trim() : head;
      const target =
        arrowIdx > -1 ? head.substring(arrowIdx + 2).trim() : "用户";

      const avatar = avatarMap[replier] || "/assets/images/avatar/default.webp";
      const isSelf = selfNames.includes(replier);

      if (token.nesting === 1) {
        return `
        <div class="flex items-center gap-2 ml-10 not-prose">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img class="m-0!" src="${avatar}" alt="${replier}" />
            </div>
          </div>
          <p>
            <span class="user-name">${!isSelf ? `${replier}` : "我"}
            <span class="opacity-60"> 回复 </span>
            ${target}</span>
            ${time ? `<span class="opacity-50 text-xs ml-1">${time}</span>` : ""}
            <br />
            ${content}
          </p>
        </div>
        `;
      } else {
        return "";
      }
    },
  });
}
