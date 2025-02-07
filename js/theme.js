// 获取必要的 DOM 元素
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;
const modeToggle = document.getElementById('mode-toggle');
const autoToggle = document.getElementById('auto-toggle');
const fontSizeToggle = document.querySelectorAll('.fontSize_toggle');
const fontStyleToggle = document.querySelectorAll('.fontStyle_toggle');
const targetElements = document.querySelectorAll('.novel');

// 主题模式映射
const modeConfig = {
    dark: { class: 'dark', icon: 'ri-moon-line', title: "夜间模式" },
    light: { class: 'light', icon: 'ri-sun-line', title: "日间模式" },
    light_green: { class: 'light_green', icon: 'ri-leaf-line', title: "护眼模式" },
    dark_green: { class: 'dark_green', icon: 'ri-eye-line', title: "暗黑护眼模式" },
};

// 读取本地存储，初始化缓存
const cache = {
    auto: localStorage.getItem('cacheAuto') || 'on',
    mode: localStorage.getItem('cacheMode') || 'light',
    fontSize: localStorage.getItem('cacheFontSize') || 'medium',
    fontStyle: localStorage.getItem('cacheFontStyle') || 'song',
};

// 初始化页面
$(document).ready(() => {
    applyFontSize(cache.fontSize);
    applyFontStyle(cache.fontStyle);

    // 启用自动模式或手动模式
    cache.auto === 'on' ? enableAutoMode() : disableAutoMode();
});

// 存储用户设置
const setCacheItem = (key, value) => localStorage.setItem(key, value);

// 自动模式切换
autoToggle?.addEventListener('click', () => {
    cache.auto = cache.auto === 'on' ? 'off' : 'on';
    setCacheItem('cacheAuto', cache.auto);

    cache.auto === 'on' ? enableAutoMode() : disableAutoMode();
});

// 手动模式切换
modeToggle?.addEventListener('click', () => {
    disableAutoMode(); // 关闭自动模式
    setCacheItem('cacheAuto', 'off');

    // 获取下一个模式
    cache.mode = getNextMode(cache.mode);
    setCacheItem('cacheMode', cache.mode);

    // 应用新模式
    setThemeMode(cache.mode);
});

// 获取下一个模式
const getNextMode = (current) => {
    const modes = Object.keys(modeConfig);
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
    if (!modeConfig[mode]) {
        console.warn(`Unknown mode: ${mode}, defaulting to light.`);
        mode = 'light';
    }

    // 移除所有模式类，仅保留当前模式
    root.classList.remove(...Object.values(modeConfig).map(item => item.class));
    root.classList.add(modeConfig[mode].class);

    // 更新按钮图标（避免 className 赋值导致丢失其他样式）
    modeToggle.classList.remove(...Object.values(modeConfig).map(m => m.icon));
    modeToggle.classList.add(modeConfig[mode].icon);
    modeToggle.title = modeConfig[mode].title;
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
    targetElements.forEach(el => el.style.setProperty('--fsize-novel', fontSizeMap[size] || '1.25rem'));
}

// 绑定字体切换按钮事件
fontStyleToggle.forEach(button => {
    button.addEventListener('click', () => {
        cache.fontStyle = button.dataset.fontStyle || 'system-ui';
        applyFontStyle(cache.fontStyle);
        setCacheItem('cacheFontStyle', cache.fontStyle);
    });
});

// 只对特定元素应用字体样式
function applyFontStyle(style) {
    const fontFamilyMap = {
        song: 'ZhiSong, "STSong", "SimSun", serif',
        hei: 'XiHei, "STHeiti", "STXihei", "SimHei", sans-serif',
        kai: 'WenKai, "STKaiti", "KaiTi", cursive',
        fang: 'ZhuQue, "STFangsong", "FangSong", serif'
    };
    targetElements.forEach(el => el.style.fontFamily = fontFamilyMap[style] || 'system-ui');
}
