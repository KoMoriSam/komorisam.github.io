// 存储用户设置
const getCacheItem = (key) => localStorage.getItem(key);
const setCacheItem = (key, value) => localStorage.setItem(key, value);
const removeCacheItem = (key) => localStorage.removeItem(key);

// 读取本地存储，初始化缓存
const cache = {
  fontSize: getCacheItem("cacheFontSize") || "medium",
  fontStyle: getCacheItem("cacheFontStyle") || "song",
  auto: getCacheItem("cacheAuto") || "on",
  mode: getCacheItem("cacheMode") || "light",
  nowChapter: getCacheItem("nowChapter") || "",
  chapters: {},
};
