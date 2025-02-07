/*=============== 侧边栏收放 ===============*/
const toggle = document.getElementById('header-toggle'),
  sidebar = document.getElementById('sidebar'),
  main = document.getElementById('main');

const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches;

// 切换侧边栏状态
const toggleSidebar = (event) => {
  const isLarge = window.matchMedia('(min-width: 1024px)').matches;
  sidebar.classList.toggle('show-sidebar');
  main.classList.toggle('main-pd');

  if (isLarge) {
    const currentState = sidebar.classList.contains('show-sidebar') ? 'visible' : 'hidden';
    localStorage.setItem('sidebarState', currentState);
  }

  event.stopPropagation(); // 防止触发 document 事件
};

// 点击空白处收起侧边栏
const closeSidebar = (event) => {
  if (!sidebar.contains(event.target) && !toggle.contains(event.target)) {
    sidebar.classList.remove('show-sidebar');
    main.classList.remove('main-pd');

    if (window.matchMedia('(min-width: 1024px)').matches) {
      localStorage.setItem('sidebarState', 'hidden'); // 大屏用户记忆隐藏状态
    }
  }
};

// 初始化侧边栏状态（大屏用户取反，小屏用户默认隐藏）
const initSidebar = () => {
  const isLarge = window.matchMedia('(min-width: 1024px)').matches;
  let savedState = localStorage.getItem('sidebarState');

  if (isLarge) {
    // 大屏用户：如果有存储的状态，取反它
    if (savedState === 'hidden') {
      sidebar.classList.remove('show-sidebar');
      main.classList.remove('main-pd');
    } else {
      sidebar.classList.add('show-sidebar');
      main.classList.add('main-pd');
    }
  } else {
    // 小屏用户：刷新后始终隐藏
    sidebar.classList.remove('show-sidebar');
    main.classList.remove('main-pd');
  }
};

// 添加事件监听
toggle?.addEventListener('click', toggleSidebar);
document.addEventListener('click', closeSidebar);

// 页面加载时初始化侧边栏状态
initSidebar();

/*=============== 激活当前标签 ===============*/
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
    if (IdToPathMap[id].includes(path)) $('#' + id).addClass('active-link');
  });
});
