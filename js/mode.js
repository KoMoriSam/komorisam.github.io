const systemTheme = window.matchMedia('(prefers-color-scheme: dark)'),
    root = document.documentElement,
    modeToggle = document.getElementById('mode-toggle'),
    autoToggle = document.getElementById('auto-toggle');

modeToggle.addEventListener('click', (e) => {
    autoOff();
    localStorage.setItem('cacheAuto', 'off');
    if (root.classList.contains('dark')) {
        lightMode();
        localStorage.setItem('cacheMode', 'light');
    } else {
        darkMode();
        localStorage.setItem('cacheMode', 'dark');
    }
});

autoToggle.addEventListener('click', (e) => {
    if (autoToggle.title === '自动模式') {
        localStorage.setItem('cacheAuto', 'off');
        autoOff();
    } else {
        localStorage.setItem('cacheAuto', 'on');
        autoOn();
    }
});

$(document).ready(function () {
    if (localStorage.getItem('cacheAuto')) {
        var cacheAuto = localStorage.getItem('cacheAuto');
        if (cacheAuto == 'on') {
            autoOn();
        } else {
            autoOff();
            if (localStorage.getItem('cacheMode')) {
                var cacheMode = localStorage.getItem('cacheMode');
                if (cacheMode == 'dark') {
                    darkMode();
                } else {
                    lightMode();
                }
            } else {
                autoOn();
            }
        }
    } else {
        autoOn();
    }
});

function autoOn() {
    autoToggle.classList.remove('ri-blur-off-line');
    autoToggle.classList.add('ri-drop-line');
    autoToggle.title = "自动模式";
    if (systemTheme.matches) {
        darkMode();
    } else {
        lightMode();
    }
    systemTheme.addEventListener('change', autoOn);
}

function autoOff() {
    autoToggle.classList.remove('ri-drop-line');
    autoToggle.classList.add('ri-blur-off-line');
    autoToggle.title = "手动模式";
    systemTheme.removeEventListener('change', autoOn);
}

function darkMode() {
    root.classList.add('dark');
    modeToggle.classList.remove('ri-sun-line');
    modeToggle.classList.add('ri-moon-line');
    modeToggle.title = "夜间模式";
}

function lightMode() {
    root.classList.remove('dark');
    modeToggle.classList.remove('ri-moon-line');
    modeToggle.classList.add('ri-sun-line');
    modeToggle.title = "日间模式";
}