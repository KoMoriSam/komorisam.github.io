// 获取必要的 DOM 元素
const fontSizeToggle = document.querySelectorAll(".fontSize_toggle");
const fontStyleToggle = document.querySelectorAll(".fontStyle_toggle");
const targetElements = document.querySelectorAll(".novel");

// 初始化页面
$(document).ready(() => {
  applyFontSize(cache.fontSize);
  applyFontStyle(cache.fontStyle);
});

// 绑定字体大小按钮事件
fontSizeToggle.forEach((button) => {
  button.addEventListener("click", () => {
    cache.fontSize = button.dataset.fontSize || "medium";
    applyFontSize(cache.fontSize);
    setCacheItem("cacheFontSize", cache.fontSize);
  });
});

// 只对特定元素应用字体大小
function applyFontSize(size) {
  const fontSizeMap = {
    small: "1rem",
    medium: "1.25rem",
    large: "1.75rem",
    huge: "2.5rem",
  };
  targetElements.forEach((el) =>
    el.style.setProperty("--fsize-novel", fontSizeMap[size] || "1.25rem")
  );
}

// 绑定字体切换按钮事件
fontStyleToggle.forEach((button) => {
  button.addEventListener("click", () => {
    cache.fontStyle = button.dataset.fontStyle || "system-ui";
    applyFontStyle(cache.fontStyle);
    setCacheItem("cacheFontStyle", cache.fontStyle);
  });
});

// 只对特定元素应用字体样式
function applyFontStyle(style) {
  const fontFamilyMap = {
    song: 'ZhiSong, "STSong", "SimSun", serif',
    hei: 'XiHei, "STHeiti", "STXihei", "SimHei", sans-serif',
    kai: 'WenKai, "STKaiti", "KaiTi", cursive',
    fang: 'ZhuQue, "STFangsong", "FangSong", serif',
  };
  targetElements.forEach(
    (el) => (el.style.fontFamily = fontFamilyMap[style] || "system-ui")
  );
}
