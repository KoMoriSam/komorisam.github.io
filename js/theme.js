// 获取必要的 DOM 元素
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const root = document.documentElement;
const modeToggle = document.getElementById("mode-toggle");
const autoToggle = document.getElementById("auto-toggle");

// 主题模式映射
const modeConfig = {
  dark: {
    class: "dark",
    icon: "ri-moon-line",
    title: "夜间模式",
  },
  light: {
    class: "light",
    icon: "ri-sun-line",
    title: "日间模式",
  },
  light_green: {
    class: "light_green",
    icon: "ri-leaf-line",
    title: "护眼模式",
  },
  dark_green: {
    class: "dark_green",
    icon: "ri-eye-line",
    title: "暗黑护眼模式",
  },
};

// 初始化页面
$(document).ready(() => {
  // 启用自动模式或手动模式
  cache.auto === "on" ? enableAutoMode() : disableAutoMode();
});

// 自动模式切换
autoToggle?.addEventListener("click", () => {
  cache.auto = cache.auto === "on" ? "off" : "on";
  setCacheItem("cacheAuto", cache.auto);

  cache.auto === "on" ? enableAutoMode() : disableAutoMode();
});

// 手动模式切换
modeToggle?.addEventListener("click", () => {
  disableAutoMode(); // 关闭自动模式
  setCacheItem("cacheAuto", "off");

  // 获取下一个模式
  cache.mode = getNextMode(cache.mode);
  setCacheItem("cacheMode", cache.mode);

  // 应用新模式
  setThemeMode(cache.mode);
});

// 获取下一个模式
const getNextMode = (current) => {
  const modes = Object.keys(modeConfig);
  return modes[(modes.indexOf(current) + 1) % modes.length];
};

// 启用自动模式
function enableAutoMode() {
  updateAutoToggleUI(true);
  syncWithSystemTheme();
  systemTheme.addEventListener("change", syncWithSystemTheme);
  setCacheItem("cacheAuto", "on");
}

// 禁用自动模式
function disableAutoMode() {
  updateAutoToggleUI(false);
  systemTheme.removeEventListener("change", syncWithSystemTheme);
  setThemeMode(cache.mode);
}

// 更新自动模式 UI
const updateAutoToggleUI = (isAuto) => {
  autoToggle.classList.toggle("ri-drop-line", isAuto);
  autoToggle.classList.toggle("ri-blur-off-line", !isAuto);
  autoToggle.title = isAuto ? "自动模式" : "手动模式";
};

// 同步系统主题
function syncWithSystemTheme() {
  const mode = systemTheme.matches ? "dark" : "light";
  setThemeMode(mode);
}

// 设置主题模式
function setThemeMode(mode) {
  if (!modeConfig[mode]) {
    console.warn(`Unknown mode: ${mode}, defaulting to light.`);
    mode = "light";
  }

  // 移除所有模式类，仅保留当前模式
  root.classList.remove(...Object.values(modeConfig).map((item) => item.class));
  root.classList.add(modeConfig[mode].class);

  // 更新按钮图标（避免 className 赋值导致丢失其他样式）
  modeToggle.classList.remove(...Object.values(modeConfig).map((m) => m.icon));
  modeToggle.classList.add(modeConfig[mode].icon);
  modeToggle.title = modeConfig[mode].title;
}
