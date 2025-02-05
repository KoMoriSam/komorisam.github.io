const fileSelect = document.getElementById("fileSelect");
const latestFileSelect = document.getElementById("latestFileSelect");
const novel = document.querySelector('.novel');
const loading = document.getElementById("loading");
const refreshButton = document.getElementById("refreshButton"); // 获取刷新按钮
const pathHead = 'page/novel/';

const ERROR_MESSAGES = {
    NO_CHAPTER_LIST: '# *⚠️ 未找到章节列表 ⚠️*',
    CHAPTER_NOT_FOUND: '# *⚠️ 未找到该章节或章节不存在 ⚠️*',
    NO_NEWER_CHAPTER: '已经到底啦',
    NO_OLDER_CHAPTER: '顶到最前面啦'
};

latestFileSelect.addEventListener("mousedown", e => e.preventDefault());

(async function fetchChapters() {
    try {
        const response = await fetch("page/novel/list.json");
        const fileList = await response.json();
        populateSelect(fileSelect, fileList);
        populateSelect(latestFileSelect, fileList, true);

        // 尝试恢复用户上次选择的章节
        const savedChapter = localStorage.getItem("selectedChapter");
        if (savedChapter) {
            fileSelect.value = savedChapter;
        }

        // 加载已选章节（如果有）
        loadFile();
    } catch (error) {
        handleError(ERROR_MESSAGES.NO_CHAPTER_LIST, "找不到章节列表！", error);
    }
})();

function populateSelect(selectElement, fileList, latest = false) {
    const fragment = document.createDocumentFragment();
    let latestFile = null;

    fileList.forEach(file => {
        if (/\d/.test(file.name)) {
            latestFile = latestFile && new Date(latestFile.modified) > new Date(file.modified) ? latestFile : file;
        }
        fragment.appendChild(createOption(file));
    });

    selectElement.appendChild(latest ? createOption(latestFile) : fragment);
}

function createOption(file) {
    const option = document.createElement("option");
    option.value = file.name;
    option.textContent = file.name + (/\d/.test(file.name) ? formatDate(file.modified) : '');
    return option;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return ` (${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')})`;
}

async function loadFile(step = 0, errorMsg = '', consoleMsg = '', forceReload = false) {
    try {
        if (step !== 0) {
            const newIndex = fileSelect.selectedIndex + step;
            if (newIndex < 0 || newIndex >= fileSelect.options.length) return handleError(errorMsg, consoleMsg);
            fileSelect.selectedIndex = newIndex;
        }

        const fileName = fileSelect.value;
        if (!fileName) return (novel.innerHTML = "");

        // 如果不是强制刷新，优先使用缓存
        const cachedContent = localStorage.getItem(`chapter_${fileName}`);
        if (cachedContent && !forceReload) {
            updateTitle(fileName);
            displayMessage(cachedContent, false); // 使用过渡动画但不显示加载提示
            return;
        }

        // 保存用户的章节选择
        localStorage.setItem("selectedChapter", fileName);

        updateTitle(fileName);
        displayMessage("## 别急，正在加载！", true);

        const response = await fetch(`${pathHead}${fileName}.md`, { cache: "reload" }); // 强制请求新文件
        if (!response.ok) throw new Error("服务器未存档");

        const content = await response.text();
        localStorage.setItem(`chapter_${fileName}`, content); // 缓存章节内容
        setTimeout(() => displayMessage(content, false), 300); // 增加短暂延迟，避免突兀
    } catch (error) {
        handleError(ERROR_MESSAGES.CHAPTER_NOT_FOUND, "加载章节失败", error);
    }
}

function handleError(displayMsg, consoleMsg, error = '') {
    displayMessage(displayMsg);
    console.error(consoleMsg, error);
}

function displayMessage(content, isLoading = false) {
    loading.classList.toggle('loading', isLoading);

    novel.style.opacity = 0; // 先让内容透明
    novel.innerHTML = marked.parse(content);

    setTimeout(() => {
        novel.style.transition = "opacity 0.3s ease-in-out"; // 平滑渐变
        novel.style.opacity = 1;
    }, 50); // 50ms 之后开始淡入，避免瞬间闪现
}

function updateTitle(fileName) {
    document.title = `${fileName.includes('·') ? '小说' : fileName} | KoMoriSam`;
}

// 强制刷新函数
function forceRefresh() {
    const fileName = fileSelect.value;
    if (!fileName) return;

    localStorage.removeItem(`chapter_${fileName}`); // 清除缓存
    loadFile(0, '', '', true); // 重新加载文件，并强制从服务器获取最新内容
}

// 绑定刷新按钮事件
refreshButton.addEventListener("click", forceRefresh);

// 章节切换功能
const latestFile = () => (fileSelect.value = latestFileSelect.value, loadFile());
const firstFile = () => (fileSelect.selectedIndex = 3, loadFile());
const nextFile = () => loadFile(1, ERROR_MESSAGES.NO_NEWER_CHAPTER, '未找到更新的章节');
const previousFile = () => loadFile(-1, ERROR_MESSAGES.NO_OLDER_CHAPTER, '未找到更早的章节');
