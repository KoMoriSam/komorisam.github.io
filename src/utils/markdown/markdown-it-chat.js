// ✅ 完整 Chat Markdown 插件系统
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
                    footer.includes(keyword)
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
        <span class="badge">
          ${extra}
        </span>`;
      } else if (status) {
        infoLine = `
        <span class="badge badge-soft ${status.class}">
          ${status.text}
        </span>`;
      }

      if (token.nesting === 1) {
        return `
        <div class="chat-bar">
          <div class="chat-image avatar">
            <div class="w-10 rounded-full">
              <img alt="${title}" src="${avatar}"/>
            </div>
          </div>
          <span class="font-bold">
            ${title}
          </span>
          ${infoLine}
        </div>\n`;
      } else {
        return "";
      }
    },
  });
}
