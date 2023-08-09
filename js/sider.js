/*=============== SHOW SIDEBAR ===============*/
const showSidebar = (toggleId, sidebarId, mainId) =>{
  const toggle = document.getElementById(toggleId),
  sidebar = document.getElementById(sidebarId),
  main = document.getElementById(mainId)

  if(toggle && sidebar && main){
      toggle.addEventListener('click', ()=>{
          /* Show sidebar */
          sidebar.classList.toggle('show-sidebar')
          /* Add padding main */
          main.classList.toggle('main-pd')
          // toggle.classList.toggle('header-active')
      })
  }
}
showSidebar('header-toggle','sidebar', 'main')

/*=============== LINK ACTIVE ===============*/
const sidebarLink = document.querySelectorAll('.sidebar_link')

function linkColor(){
   sidebarLink.forEach(l => l.classList.remove('active-link'))
   this.classList.add('active-link')
}

sidebarLink.forEach(l => l.addEventListener('click', linkColor))


$(document).ready(function () {    // 等待页面加载完成
  var path = window.location.pathname;  // 获取当前页面路径
  // 根据路径更改导航栏标题背景色
  if (path === '/' || path === '/index.html') {
    $('#home').addClass('active-link');
  } else if (path === '/about.html') {
    $('#about').addClass('active-link');
  } else if (path === '/project.html') {
    $('#project').addClass('active-link');
  } else if (path === '/contact.html') {
    $('#contact').addClass('active-link');
  } else if (path === '/test.html') {
    $('#test').addClass('active-link');
  }
});

