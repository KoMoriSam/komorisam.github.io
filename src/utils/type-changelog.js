export function typeColor(type) {
  switch (type) {
    case "feature":
      return "badge-primary";
    case "bugfix":
      return "badge-error";
    case "ui":
      return "badge-secondary";
    case "performance":
      return "badge-success";
    case "refactor":
      return "badge-warning";
    default:
      return "badge-info";
  }
}

export function typeText(type) {
  switch (type) {
    case "feature":
      return "功能";
    case "bugfix":
      return "修复";
    case "ui":
      return "界面";
    case "performance":
      return "优化";
    case "refactor":
      return "重构";
    default:
      return "其他";
  }
}
