const toggle = document.getElementById("header-toggle");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");

// 监听屏幕宽度
const mediaQueryMobile = window.matchMedia("(max-width: 767px)");
const mediaQueryLaptop = window.matchMedia("(min-width: 1024px)");

// 切换侧边栏状态
const toggleSidebar = (event) => {
  sidebar.classList.toggle("show-sidebar");
  main.classList.toggle("main-pd");

  if (mediaQueryLaptop.matches) {
    const isVisible = sidebar.classList.contains("show-sidebar");
    localStorage.setItem("sidebarState", isVisible ? "visible" : "hidden");
  }

  event.stopPropagation();

  // 只有在移动端绑定点击空白处隐藏事件
  if (mediaQueryMobile.matches) {
    document.addEventListener("click", closeSidebar);
  }
};

// 点击空白处收起侧边栏
const closeSidebar = (event) => {
  if (
    !mediaQueryMobile.matches ||
    sidebar.contains(event.target) ||
    toggle.contains(event.target)
  )
    return;

  sidebar.classList.remove("show-sidebar");
  main.classList.remove("main-pd");

  // 解绑事件，防止多次触发
  document.removeEventListener("click", closeSidebar);
};

// 屏幕大小变化时动态调整侧边栏状态
const handleScreenChange = () => {
  let savedState = localStorage.getItem("sidebarState");

  if (mediaQueryMobile.matches) {
    // 移动端：侧边栏始终隐藏
    sidebar.classList.remove("show-sidebar");
    main.classList.remove("main-pd");
  } else if (mediaQueryLaptop.matches) {
    // 笔记本端：默认展开，其次根据 `localStorage`
    const shouldShow = savedState === "visible";
    sidebar.classList.toggle("show-sidebar", shouldShow);
    main.classList.toggle("main-pd", shouldShow);
  } else {
    // 平板端：默认收起，不存储本地状态
    sidebar.classList.add("show-sidebar");
    main.classList.add("main-pd");
  }
};

// 初始化侧边栏状态
const initSidebar = () => {
  handleScreenChange();

  // 监听屏幕变化，实时更新侧边栏
  mediaQueryMobile.addEventListener("change", handleScreenChange);
  mediaQueryLaptop.addEventListener("change", handleScreenChange);
};

// 添加事件监听
toggle?.addEventListener("click", toggleSidebar);

// 页面加载时初始化侧边栏状态
initSidebar();

// 激活当前标签
document.querySelectorAll(".sidebar_link").forEach((link) => {
  link.addEventListener("click", function () {
    document
      .querySelectorAll(".sidebar_link")
      .forEach((l) => l.classList.remove("active-link"));
    this.classList.add("active-link");
  });
});

// 设置当前页面的激活状态
$(document).ready(function () {
  const path = window.location.pathname;
  const IdToPathMap = {
    home: "/archive/home/index.html",
    about: "/archive/about/index.html",
    novel: "/archive/novel/index.html",
    contact: "/archive/contact/index.html",
    test: "/archive/test/index.html",
  };
  Object.keys(IdToPathMap).forEach((id) => {
    if (IdToPathMap[id].includes(path)) {
      document.getElementById(id)?.classList.add("active-link");
    }
  });
});
