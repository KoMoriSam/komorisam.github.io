/*=============== 侧边栏收放 ===============*/
const showSidebar = (toggleId, sidebarId, mainId) =>{
  const toggle = document.getElementById(toggleId),
  sidebar = document.getElementById(sidebarId),
  main = document.getElementById(mainId)

  if(toggle && sidebar && main){
      toggle.addEventListener('click', ()=>{
          sidebar.classList.toggle('show-sidebar')
          main.classList.toggle('main-pd')
      })
  }
}
showSidebar('header-toggle','sidebar', 'main')

/*=============== 激活标签 ===============*/
const sidebarLink = document.querySelectorAll('.sidebar_link')

function linkColor(){
   sidebarLink.forEach(l => l.classList.remove('active-link'))
   this.classList.add('active-link')
}

sidebarLink.forEach(l => l.addEventListener('click', linkColor))

$(document).ready(function () {
  var path = window.location.pathname;
  var pathToIdMap = {
    '/': 'home',
    '/index.html': 'home',
    '/about.html': 'about',
    '/novel.html': 'novel',
    '/contact.html': 'contact',
    '/test.html': 'test'
  };
  var pageId = pathToIdMap[path] || 'default';
  $('#' + pageId).addClass('active-link');
});

