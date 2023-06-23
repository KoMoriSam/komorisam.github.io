// 导航栏强调色
$(document).ready(function() {    // 等待页面加载完成
    var path = window.location.pathname;  // 获取当前页面路径
    // 根据路径更改导航栏标题背景色
    if (path === '/' || path === '/index.html') {
      $('#home').addClass('active');
    } else if (path === '/about.html') {
      $('#about').addClass('active');
    } else if (path === '/project.html') {
      $('#project').addClass('active');
    } else if (path === '/contact.html') {
      $('#contact').addClass('active');
    } else if (path === '/test.html') {
      $('#test').addClass('active');
    }
  });