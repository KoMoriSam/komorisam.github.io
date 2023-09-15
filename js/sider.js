/*=============== 侧边栏收放 ===============*/
const screenWidth = window.matchMedia('screen and (min-width: 1024px)');

const toggle = document.getElementById('header-toggle'),
  sidebar = document.getElementById('sidebar'),
  main = document.getElementById('main');

if (toggle && sidebar && main) {
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('show-sidebar');
    main.classList.toggle('main-pd');
    if (sidebar.classList.contains('show-sidebar')) {
      localStorage.setItem('cacheShow', 'on');
    } else {
      localStorage.setItem('cacheShow', 'off');
    }
  })
}

function showSidebar(change) {
  sidebar.classList.toggle('show-sidebar', change == 'add');
  main.classList.toggle('main-pd', change == 'add');
}

$(document).ready(function () {
  if (screenWidth.matches) {
    if (localStorage.getItem('cacheShow')) {
      var cacheShow = localStorage.getItem('cacheShow');
      if (cacheShow == 'off') {
        showSidebar('remove');
      } else {
        showSidebar('add');
      }
    }
  } else {
    showSidebar('remove');
  }
});


/*=============== 激活标签 ===============*/
const sidebarLink = document.querySelectorAll('.sidebar_link')

function linkColor() {
  sidebarLink.forEach(l => l.classList.remove('active-link'))
  this.classList.add('active-link')
}

sidebarLink.forEach(l => l.addEventListener('click', linkColor))

$(document).ready(function () {
  var path = window.location.pathname;
  var IdToPathMap = {
    'home': ['/', '/index.html'],
    'about': ['/about.html', '/about'],
    'novel': ['/novel.html', '/novel'],
    'contact': ['/contact.html', '/contact'],
    'test': ['/test.html', '/test']
  };
  var pageId = Object.keys(IdToPathMap).find(function (key) {
    return IdToPathMap[key].includes(path);
  }) || 'default';
  $('#' + pageId).addClass('active-link');
});

