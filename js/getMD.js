const fileSelect = document.getElementById("fileSelect"),
    latestFileSelect = document.getElementById("latestFileSelect"),
    novel = document.querySelector('.novel');
loading = document.getElementById("loading"),
    pathHead = 'page/novel/';

    fetch("page/novel/list.json")
    .then(response => response.json())
    .then(fileList => {
        populateSelect(fileSelect, fileList);

        // 过滤出包含阿拉伯数字的章节
        const numberedFiles = fileList.filter(fileName => /\d/.test(fileName));

        if (numberedFiles.length === 0) {
            console.warn("未找到包含阿拉伯数字编号的章节");
            return;
        }

        // 并行请求每个文件的 Last-Modified 时间
        return Promise.all(
            numberedFiles.map(fileName => 
                fetch(`${pathHead}${fileName}.md`, { method: 'HEAD' })
                    .then(response => {
                        const lastModified = response.headers.get('Last-Modified');
                        return lastModified ? { name: fileName, date: new Date(lastModified) } : null;
                    })
                    .catch(() => null) // 忽略无法获取 Last-Modified 的文件
            )
        );
    })
    .then(fileDataList => {
        // 过滤无效数据
        const validFiles = fileDataList.filter(file => file);
        if (validFiles.length === 0) {
            console.warn("未找到符合条件的最新章节");
            return;
        }

        // 选择修改日期最新的文件
        const latestFile = validFiles.reduce((latest, file) => 
            file.date > latest.date ? file : latest
        );

        // 设置最新章节
        latestFileSelect.appendChild(createOption(latestFile.name));
    })
    .catch(error => handleError('# *⚠️ 未找到章节列表 ⚠️*', "找不到章节列表！", error));

function populateSelect(selectElement, fileList) {
    fileList.forEach(fileName => {
        selectElement.appendChild(createOption(fileName));
    });
}

function populateLatestSelect(selectElement, fileList) {
    const latestOption = fileList.slice().reverse().find(fileName => /\d/.test(fileName));
    if (latestOption) {
        selectElement.appendChild(createOption(latestOption));
    } else {
        console.warn("未找到包含数字编号的章节！");
    }
}

function createOption(value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    return option;
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
