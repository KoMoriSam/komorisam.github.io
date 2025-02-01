const fileSelect = document.getElementById("fileSelect");
const latestFileSelect = document.getElementById("latestFileSelect");
const novel = document.querySelector('.novel');
const loading = document.getElementById("loading");
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

async function loadFile(step = 0, errorMsg = '', consoleMsg = '') {
    try {
        if (step !== 0) {
            const newIndex = fileSelect.selectedIndex + step;
            if (newIndex < 0 || newIndex >= fileSelect.options.length) return handleError(errorMsg, consoleMsg);
            fileSelect.selectedIndex = newIndex;
        }

        const fileName = fileSelect.value;
        if (!fileName) return (novel.innerHTML = "");

        updateTitle(fileName);
        displayMessage("## 别急，正在加载！");

        const response = await fetch(`${pathHead}${fileName}.md`);
        if (!response.ok) throw new Error("服务器未存档");

        const content = await response.text();
        setTimeout(() => displayMessage(content), 1000);
    } catch (error) {
        handleError(ERROR_MESSAGES.CHAPTER_NOT_FOUND, "加载章节失败", error);
    }
}

function handleError(displayMsg, consoleMsg, error = '') {
    displayMessage(displayMsg);
    console.error(consoleMsg, error);
}

function displayMessage(content) {
    loading.classList.toggle('loading', content.includes("加载！"));
    novel.innerHTML = marked.parse(content);
}

function updateTitle(fileName) {
    document.title = `${fileName.includes('·') ? '小说' : fileName} | KoMoriSam`;
}

// 章节切换功能
const latestFile = () => (fileSelect.value = latestFileSelect.value, loadFile());
const firstFile = () => (fileSelect.selectedIndex = 3, loadFile());
const nextFile = () => loadFile(1, ERROR_MESSAGES.NO_NEWER_CHAPTER, '未找到更新的章节');
const previousFile = () => loadFile(-1, ERROR_MESSAGES.NO_OLDER_CHAPTER, '未找到更早的章节');
