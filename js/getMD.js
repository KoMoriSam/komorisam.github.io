const fileSelect = document.getElementById("fileSelect"),
    latestFileSelect = document.getElementById("latestFileSelect"),
    novel = document.querySelector('.novel');
    loading = document.getElementById("loading"),
    pathHead = 'page/novel/';

    fetch("page/novel/list.json")
    .then((response) => response.json())
    .then((fileList) => {
        populateSelect(fileSelect, fileList);
        populateLatestSelect(latestFileSelect, fileList);
    })
    .catch(error => handleError('# *⚠️ 未找到章节列表 ⚠️*', "找不到章节列表！", error));

function populateSelect(selectElement, fileList) {
    fileList.forEach(file => {
        selectElement.appendChild(createOption(file));
    });
}

function populateLatestSelect(selectElement, fileList) {
    // 过滤带编号的文件并按修改时间排序
    const numberedFiles = fileList.filter(file => /\d/.test(file.name));
    if (numberedFiles.length > 0) {
        // 按修改时间降序排列
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
    
    // 仅带数字编号的章节显示更新时间
    let displayText = file.name;
    if (/\d/.test(file.name)) {
        displayText += formatDate(file.modified);
    }
    
    option.textContent = displayText;
    return option;
}

// 日期格式化函数
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从 0 开始，需要加 1
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0'); // 补零
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 补零

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
            .catch(error => handleError('# *⚠️ 未找到该章节或章节不存在 ⚠️*', "加载章节失败", error));
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
    loadFile(1, '已经到底啦', '未找到更新的章节');
}

function previousFile() {
    loadFile(-1, '顶到最前面啦', '未找到更早的章节');
}
