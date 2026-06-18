export function typeColor(type) {
  switch (type) {
    case "feature":
      return "primary";
    case "fix":
      return "error";
    case "improve":
      return "secondary";
    case "performance":
      return "success";
    case "refactor":
      return "warning";
    default:
      return "info";
  }
}

export function typeText(type) {
  switch (type) {
    case "feature":
      return "功能";
    case "fix":
      return "修复";
    case "improve":
      return "改进";
    case "performance":
      return "优化";
    case "refactor":
      return "重构";
    default:
      return "其他";
  }
}
