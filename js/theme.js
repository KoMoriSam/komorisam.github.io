// 获取必要的 DOM 元素和系统主题状态
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;
const modeToggle = document.getElementById('mode-toggle');
const autoToggle = document.getElementById('auto-toggle');
const fontSizeToggle = document.querySelectorAll('.fontSize_toggle');
const fontStyleToggle = document.querySelectorAll('.fontStyle_toggle');
const targetElements = document.querySelectorAll('.output');

// 缓存存储的数据
const cache = {
    auto: localStorage.getItem('cacheAuto') || 'on',
    mode: localStorage.getItem('cacheMode') || 'light',
    fontSize: localStorage.getItem('cacheFontSize') || 'medium',
    fontStyle: localStorage.getItem('cacheFontStyle') || 'song',
};

// 初始化页面
$(document).ready(function () {
    applyFontSize(cache.fontSize);
    applyFontStyle(cache.fontStyle);

    cache.auto === 'on' ? enableAutoMode() : disableAutoMode();setThemeMode(cache.mode);
});

// 存储用户设置
const setCacheItem = (key, value) => localStorage.setItem(key, value);

// 自动模式切换按钮
autoToggle?.addEventListener('click', () => {
    cache.auto = cache.auto === 'on' ? 'off' : 'on';
    setCacheItem('cacheAuto', cache.auto);
    cache.auto === 'on' ? enableAutoMode() : disableAutoMode();
});

// 手动模式切换按钮
modeToggle?.addEventListener('click', () => {
    disableAutoMode();
    setCacheItem('cacheAuto', 'off');

    cache.mode = getNextMode(cache.mode);
    setThemeMode(cache.mode);
});

// 获取下一个模式
const getNextMode = (current) => {
    const modes = ['light', 'eye-care', 'dark'];
    return modes[(modes.indexOf(current) + 1) % modes.length];
};

// 启用自动模式
function enableAutoMode() {
    updateAutoToggleUI(true);
    syncWithSystemTheme();
    systemTheme.addEventListener('change', syncWithSystemTheme);
    setCacheItem('cacheAuto', 'on');
}

// 禁用自动模式
function disableAutoMode() {
    updateAutoToggleUI(false);
    systemTheme.removeEventListener('change', syncWithSystemTheme);
    setThemeMode(cache.mode);
}

// 更新自动模式 UI
const updateAutoToggleUI = (isAuto) => {
    autoToggle.classList.toggle('ri-drop-line', isAuto);
    autoToggle.classList.toggle('ri-blur-off-line', !isAuto);
    autoToggle.title = isAuto ? "自动模式" : "手动模式";
};

// 同步系统主题
function syncWithSystemTheme() {
    const mode = systemTheme.matches ? 'dark' : 'light';
    setThemeMode(mode);
}

// 设置主题模式
function setThemeMode(mode) {
    root.classList.remove('dark', 'eye-care', 'light');
    modeToggle.classList.remove('ri-sun-line', 'ri-moon-line', 'ri-eye-line');

    const modeConfig = {
        dark: { class: 'dark', icon: 'ri-moon-line', title: "夜间模式" },
        light: { class: 'light', icon: 'ri-sun-line', title: "日间模式" },
        'eye-care': { class: 'eye-care', icon: 'ri-eye-line', title: "护眼模式" },
    };

    if (modeConfig[mode]) {
        root.classList.add(modeConfig[mode].class);
        modeToggle.classList.add(modeConfig[mode].icon);
        modeToggle.title = modeConfig[mode].title;
    } else {
        console.warn(`Unknown mode: ${mode}, defaulting to light.`);
        setThemeMode('light');
    }

    cache.mode = mode;
    setCacheItem('cacheMode', mode);
}

// 绑定字体大小按钮事件
fontSizeToggle.forEach(button => {
    button.addEventListener('click', () => {
        cache.fontSize = button.dataset.fontSize || 'medium';
        applyFontSize(cache.fontSize);
        setCacheItem('cacheFontSize', cache.fontSize);
    });
});

// 只对特定元素应用字体大小
function applyFontSize(size) {
    const fontSizeMap = {
        small: '1rem',
        medium: '1.25rem',
        large: '1.75rem',
        huge: '2.5rem'
    };
    targetElements.forEach(el => el.style.setProperty('--novel-font-size', fontSizeMap[size]) || '5rem');
}

// 绑定字体切换按钮事件
fontStyleToggle.forEach(button => {
    button.addEventListener('click', () => {
        cache.fontStyle = button.dataset.fontStyle || 'sans-serif';
        applyFontStyle(cache.fontStyle);
        setCacheItem('cacheFontStyle', cache.fontStyle);
    });
});

// 只对特定元素应用字体样式
function applyFontStyle(style) {
    const fontFamilyMap = {
        song: '"STSong", "SimSun", serif',
        hei: '"STHeiti", "STXihei", "SimHei", sans-serif',
        kai: '"STKaiti", "KaiTi", cursive',
        fang: '"STFangsong", "FangSong", serif'
    };
    targetElements.forEach(el => el.style.fontFamily = fontFamilyMap[style] || 'sans-serif');
}
