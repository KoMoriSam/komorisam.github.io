const fileSelect = document.getElementById("fileSelect"),
    latestFileSelect = document.getElementById("latestFileSelect"),
    novel = document.querySelector('.novel'),
    loading = document.getElementById("loading"),
    pathHead = 'page/novel/';

const ERROR_MESSAGES = {
    NO_CHAPTER_LIST: '# *⚠️ 未找到章节列表 ⚠️*',
    CHAPTER_NOT_FOUND: '# *⚠️ 未找到该章节或章节不存在 ⚠️*',
    NO_NEWER_CHAPTER: '已经到底啦',
    NO_OLDER_CHAPTER: '顶到最前面啦'
};

latestFileSelect.addEventListener("mousedown", function (e) {
    e.preventDefault();
});

fetch("page/novel/list.json")
    .then(response => response.json())
    .then(fileList => {
        populateSelect(fileSelect, fileList);
        populateLatestSelect(latestFileSelect, fileList);
    })
    .catch(error => handleError(ERROR_MESSAGES.NO_CHAPTER_LIST, "找不到章节列表！", error));

function populateSelect(selectElement, fileList) {
    const fragment = document.createDocumentFragment();
    fileList.forEach(file => {
        fragment.appendChild(createOption(file));
    });
    selectElement.appendChild(fragment);
}

function populateLatestSelect(selectElement, fileList) {
    const numberedFiles = fileList.filter(file => /\d/.test(file.name));
    if (numberedFiles.length > 0) {
        const sortedFiles = [...numberedFiles].sort((a, b) =>
            new Date(b.modified) - new Date(a.modified)
        );
        selectElement.appendChild(createOption(sortedFiles[0]));
    } else {
        console.warn("未找到包含数字编号的章节！");
    }
}

function createOption(file) {
    const option = document.createElement("option");
    option.value = file.name;
    option.textContent = /\d/.test(file.name) ? `${file.name}${formatDate(file.modified)}` : file.name;
    return option;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return ` (${year}-${month}-${day} ${hours}:${minutes})`;
}

function loadFile(step = 0, errorMsg = '', consoleMsg = '') {
    try {
        if (step !== 0) {
            const newIndex = fileSelect.selectedIndex + step;
            if (newIndex < 0 || newIndex >= fileSelect.options.length) {
                throw new Error(errorMsg);
            }
            fileSelect.selectedIndex = newIndex;
        }

        const fileName = fileSelect.value;
        if (!fileName) {
            novel.innerHTML = "";
            return;
        }

        updateTitle(fileName);
        fetch(`${pathHead}${fileName}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("服务器未存档");
                }
                return response.text();
            })
            .then(content => {
                displayMessage("## 别急，正在加载！");
                setTimeout(() => displayMessage(content), 1000);
            })
            .catch(error => handleError(ERROR_MESSAGES.CHAPTER_NOT_FOUND, "加载章节失败", error));
    } catch (error) {
        handleError(`# *⚠️ ${errorMsg} ⚠️*`, consoleMsg, error);
    }
}

function handleError(displayMsg, consoleMsg, error) {
    displayMessage(displayMsg);
    console.error(consoleMsg, error);
}

function displayMessage(content) {
    loading.classList.toggle('loading', content.includes("加载！"));
    novel.innerHTML = marked.parse(content);
}

function updateTitle(fileName) {
    const titleSuffix = fileName.includes('·') ? '小说' : fileName;
    document.title = `${titleSuffix} | KoMoriSam`;
}

function latestFile() {
    fileSelect.value = latestFileSelect.value;
    loadFile();
}

function firstFile() {
    fileSelect.selectedIndex = 3;
    loadFile();
}

function nextFile() {
    loadFile(1, ERROR_MESSAGES.NO_NEWER_CHAPTER, '未找到更新的章节');
}

function previousFile() {
    loadFile(-1, ERROR_MESSAGES.NO_OLDER_CHAPTER, '未找到更早的章节');
}