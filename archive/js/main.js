const defaults = {
  fontSize: "medium",
  fontStyle: "system-ui",
  auto: "on",
  mode: "light",
  nowChapter: "",
  chapters: {},
};

const cache = new Proxy(
  {},
  {
    get: (_, key) => {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value ?? defaults[key]; // 确保默认值生效
    },
    set: (_, key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    },
    deleteProperty: (_, key) => {
      localStorage.removeItem(key);
      return true;
    },
  }
);
