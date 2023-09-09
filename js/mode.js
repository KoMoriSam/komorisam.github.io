// 获取系统亮暗模式
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

// 获取网页根元素
const root = document.documentElement;

// 获取切换按钮
const modeToggle = document.getElementById('mode-toggle');

modeToggle.addEventListener('click', (e) => {
    if (root.hasAttribute('data-theme')) {
        root.removeAttribute('data-theme');
        modeToggle.classList.remove('ri-moon-line');
        modeToggle.classList.add('ri-sun-line');
        modeToggle.title = "日间模式";
    } else {
        root.setAttribute('data-theme', 'dark');
        modeToggle.classList.remove('ri-sun-line');
        modeToggle.classList.add('ri-moon-line');
        modeToggle.title = "夜间模式";
    }
});

$(document).ready(function () {
    setThemeBySystem();
});

function setThemeBySystem() {
    if (systemTheme.matches) {
        // 如果系统是暗模式，设置网页为暗模式
        root.setAttribute('data-theme', 'dark');
        modeToggle.classList.toggle('ri-moon-line');
        modeToggle.title = "夜间模式";
    } else {
        // 如果系统是亮模式，设置网页为亮模式
        root.removeAttribute('data-theme');
        modeToggle.classList.toggle('ri-sun-line');
        modeToggle.title = "日间模式";
    }
}

systemTheme.addEventListener('change', setThemeBySystem);