// 获取必要的 DOM 元素和系统主题状态
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;
const modeToggle = document.getElementById('mode-toggle');
const autoToggle = document.getElementById('auto-toggle');
const fontSizeToggle = document.getElementById('font-size-toggle');

// 初始化：页面加载时执行
$(document).ready(function () {
    const cacheAuto = localStorage.getItem('cacheAuto') || 'on';
    const cacheMode = localStorage.getItem('cacheMode');
    const cacheFontSize = localStorage.getItem('cacheFontSize') || 'medium';

    // 应用字体大小
    applyFontSize(cacheFontSize);

    if (cacheAuto === 'on') {
        enableAutoMode();
    } else {
        disableAutoMode();
        if (cacheMode === 'dark') {
            applyDarkMode();
        } else if (cacheMode === 'light') {
            applyLightMode();
        } else if (cacheMode === 'eye-care') {
            applyEyeCareMode();
        } else {
            enableAutoMode();
        }
    }
});

// 自动模式切换按钮事件
autoToggle.addEventListener('click', () => {
    const isAutoMode = autoToggle.title === '自动模式';
    if (isAutoMode) {
        localStorage.setItem('cacheAuto', 'off');
        disableAutoMode();
    } else {
        localStorage.setItem('cacheAuto', 'on');
        enableAutoMode();
    }
});

// 手动模式切换按钮事件
modeToggle.addEventListener('click', () => {
    disableAutoMode();
    localStorage.setItem('cacheAuto', 'off');

    if (root.classList.contains('dark')) {
        applyLightMode();
        localStorage.setItem('cacheMode', 'light');
    } else if (root.classList.contains('eye-care')) {
        applyDarkMode();
        localStorage.setItem('cacheMode', 'dark');
    } else {
        applyEyeCareMode();
        localStorage.setItem('cacheMode', 'eye-care');
    }
});

// 启用自动模式
function enableAutoMode() {
    autoToggle.classList.remove('ri-blur-off-line');
    autoToggle.classList.add('ri-drop-line');
    autoToggle.title = "自动模式";
    syncWithSystemTheme();
    systemTheme.addEventListener('change', syncWithSystemTheme);
}

// 禁用自动模式
function disableAutoMode() {
    autoToggle.classList.remove('ri-drop-line');
    autoToggle.classList.add('ri-blur-off-line');
    autoToggle.title = "手动模式";
    systemTheme.removeEventListener('change', syncWithSystemTheme);
}

// 同步系统主题
function syncWithSystemTheme() {
    if (systemTheme.matches) {
        applyDarkMode();
    } else {
        applyLightMode();
    }
}

// 应用夜间模式
function applyDarkMode() {
    root.classList.add('dark');
    root.classList.remove('eye-care');
    modeToggle.classList.remove('ri-sun-line', 'ri-eye-line');
    modeToggle.classList.add('ri-moon-line');
    modeToggle.title = "夜间模式";
}

// 应用日间模式
function applyLightMode() {
    root.classList.remove('dark', 'eye-care');
    modeToggle.classList.remove('ri-moon-line', 'ri-eye-line');
    modeToggle.classList.add('ri-sun-line');
    modeToggle.title = "日间模式";
}

// 应用护眼模式
function applyEyeCareMode() {
    root.classList.add('eye-care');
    root.classList.remove('dark');
    modeToggle.classList.remove('ri-sun-line', 'ri-moon-line');
    modeToggle.classList.add('ri-eye-line');
    modeToggle.title = "护眼模式";
}

// 应用字体大小
function applyFontSize(size) {
    root.setAttribute('data-font-size', size);
    fontSizeToggle.title = size === 'small' ? '小字体' : size === 'large' ? '大字体' : '中字体';
}


// 字体大小切换按钮事件
fontSizeToggle.addEventListener('click', () => {
    const currentSize = root.getAttribute('data-font-size') || 'medium';

    let newSize;
    if (currentSize === 'small') {
        newSize = 'medium';
    } else if (currentSize === 'medium') {
        newSize = 'large';
    } else {
        newSize = 'small';
    }

    applyFontSize(newSize);
    localStorage.setItem('cacheFontSize', newSize);
});