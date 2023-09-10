// 获取系统亮暗模式
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

// 获取网页根元素
const root = document.documentElement;

// 获取切换按钮
const modeToggle = document.getElementById('mode-toggle');

modeToggle.addEventListener('click', (e) => {
    if (root.hasAttribute('data-theme')) {
        lightMode();
        localStorage.setItem('cacheMode', 'light');
    } else {
        darkMode();  
        localStorage.setItem('cacheMode', 'dark');
    }
});

$(document).ready(function () {
    if (localStorage.getItem('cacheMode')) {
        var cacheMode = localStorage.getItem('cacheMode');
        if (cacheMode == 'dark') {
            darkMode();    
        } else {
            lightMode();
        }
    } else {
        setThemeBySystem();
    }
});

function setThemeBySystem() {
    if (systemTheme.matches) {
        darkMode();
    } else {
        lightMode();
    }
}

function darkMode() {
    root.setAttribute('data-theme', 'dark');
    modeToggle.classList.remove('ri-sun-line');
    modeToggle.classList.add('ri-moon-line');
    modeToggle.title = "夜间模式";
}

function lightMode() {
    root.removeAttribute('data-theme');
    modeToggle.classList.remove('ri-moon-line');
    modeToggle.classList.add('ri-sun-line');
    modeToggle.title = "日间模式";
}

systemTheme.addEventListener('change', setThemeBySystem);