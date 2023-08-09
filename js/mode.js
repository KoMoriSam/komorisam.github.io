// 获取系统亮暗模式
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

// 获取网页根元素
const root = document.documentElement;

// 获取切换按钮
const darkToggle = document.getElementById('dark-toggle');
const lightToggle = document.getElementById('light-toggle');

// 定义一个函数，根据系统亮暗模式设置网页亮暗模式
function setThemeBySystem() {
    if (systemTheme.matches) {
        // 如果系统是暗模式，设置网页为暗模式
        root.setAttribute('data-theme', 'dark');
        darkToggle.classList.toggle('header-active');
    } else {
        // 如果系统是亮模式，设置网页为亮模式
        root.removeAttribute('data-theme');
        lightToggle.classList.toggle('header-active');
    }
}

// 定义一个函数，根据用户点击切换网页亮暗模式
function toggleThemeByUser() {
    if (root.hasAttribute('data-theme')) {
        // 如果网页是暗模式，切换为亮模式
        root.removeAttribute('data-theme');
        lightToggle.classList.toggle('header-active');
        darkToggle.classList.toggle('header-active');        
    } else {
        // 如果网页是亮模式，切换为暗模式
        root.setAttribute('data-theme', 'dark');
        darkToggle.classList.toggle('header-active');
        lightToggle.classList.toggle('header-active');
    }
}

// 在网页加载时，根据系统亮暗模式设置网页亮暗模式
window.addEventListener('load', setThemeBySystem);

// 当系统亮暗模式改变时，根据系统亮暗模式设置网页亮暗模式
systemTheme.addEventListener('change', setThemeBySystem);

// 当用户点击切换按钮时，根据用户点击切换网页亮暗模式
darkToggle.addEventListener('click', toggleThemeByUser);
lightToggle.addEventListener('click', toggleThemeByUser);