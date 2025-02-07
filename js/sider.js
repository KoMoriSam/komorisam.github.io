const toggle = document.getElementById('header-toggle');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

// 计算是否为大屏
const isLargeDevice = () => window.matchMedia('(min-width: 1024px)').matches;

// 切换侧边栏状态
const toggleSidebar = (event) => {
  sidebar.classList.toggle('show-sidebar');
  main.classList.toggle('main-pd');

  if (isLargeDevice()) {
    const currentState = sidebar.classList.contains('show-sidebar') ? 'visible' : 'hidden';
    if (localStorage.getItem('sidebarState') !== currentState) {
      localStorage.setItem('sidebarState', currentState);
    }
  }

  event.stopPropagation();
  // 只有在小屏时才绑定点击空白处隐藏事件
  if (!isLargeDevice()) {
    document.addEventListener('click', closeSidebar);
  }
};

// 点击空白处收起侧边栏
const closeSidebar = (event) => {
  if (isLargeDevice() || sidebar.contains(event.target) || toggle.contains(event.target)) return;

  sidebar.classList.remove('show-sidebar');
  main.classList.remove('main-pd');

  document.removeEventListener('click', closeSidebar); // 解绑事件，防止多次触发
};

// 初始化侧边栏状态
const initSidebar = () => {
  let savedState = localStorage.getItem('sidebarState');

  if (isLargeDevice()) {
    sidebar.classList.toggle('show-sidebar', savedState !== 'hidden');
    main.classList.toggle('main-pd', savedState !== 'hidden');
  } else {
    sidebar.classList.remove('show-sidebar');
    main.classList.remove('main-pd');
  }
};

// 添加事件监听
toggle?.addEventListener('click', toggleSidebar);

// 页面加载时初始化侧边栏状态
initSidebar();

// 激活当前标签
document.querySelectorAll('.sidebar_link').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.sidebar_link').forEach(l => l.classList.remove('active-link'));
    this.classList.add('active-link');
  });
});

// 设置当前页面的激活状态
$(document).ready(function () {
  const path = window.location.pathname;
  const IdToPathMap = {
    home: ['/', '/index.html'],
    about: ['/about.html', '/about'],
    novel: ['/novel.html', '/novel'],
    contact: ['/contact.html', '/contact'],
    test: ['/test.html', '/test']
  };
  Object.keys(IdToPathMap).forEach(id => {
    if (IdToPathMap[id].includes(path)) {
      document.getElementById(id)?.classList.add('active-link');
    }
  });
});
