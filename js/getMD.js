const fileSelect = document.getElementById("fileSelect"),
    latestFileSelect = document.getElementById("latestFileSelect"),
    output = document.getElementById("output"),
    loading = document.getElementById("loading"),
    pathHead = 'page/novel/';

fetch("page/novel/list.json")
    .then((response) => response.json())
    .then((fileList) => {
        populateFileSelect(fileSelect, fileList);
        setLatestFileSelect(latestFileSelect, fileList);
    })
    .catch(handleFetchError);

function populateFileSelect(selectElement, fileList) {
    fileList.forEach((fileName) => {
        const option = document.createElement("option");
        option.value = fileName;
        option.textContent = fileName;
        selectElement.appendChild(option);
    });
}

function setLatestFileSelect(selectElement, fileList) {
    const latestOption = fileList.slice().reverse().find((fileName) => /\d/.test(fileName));
    if (latestOption) {
        const option = document.createElement("option");
        option.value = latestOption;
        option.textContent = latestOption;
        selectElement.appendChild(option);
    } else {
        console.warn("未找到包含数字编号的章节。");
    }
}

function handleFetchError(error) {
    output.innerHTML = marked.parse('# *⚠️未找到章节列表⚠️*');
    console.error("找不到章节列表！", error);
}

function loadAndNavigateFile(step = 0, errorMsg = '', consoleMsg = '') {
    const currentIndex = fileSelect.selectedIndex;
    const newIndex = currentIndex + step;

    if (step !== 0) {
        if (newIndex < 0 || newIndex >= fileSelect.options.length) {
            output.innerHTML = marked.parse(`# *⚠️${errorMsg}⚠️*`);
            console.error(consoleMsg);
            return;
        }
        fileSelect.value = fileSelect.options[newIndex].value;
    }

    const selectedFileName = `${pathHead}${fileSelect.value}.md`;
    if (!selectedFileName) {
        output.innerHTML = "";
        return;
    }

    titlePage();

    fetch(selectedFileName)
        .then((response) => {
            if (!response.ok) {
                throw new Error("服务器未存档");
            }
            return response.text();
        })
        .then((markdownContent) => {
            showLoadingMessage("## 别急，正在加载！");
            setTimeout(() => {
                hideLoadingMessage(markdownContent);
            }, 1000);
        })
        .catch((error) => {
            output.innerHTML = marked.parse(`# *⚠️ 未找到该章节或章节不存在 ⚠️*`);
            console.error("加载章节失败", error);
        });
}

function showLoadingMessage(message) {
    loading.classList.add('loading');
    output.innerHTML = marked.parse(message);
}

function hideLoadingMessage(content) {
    loading.classList.remove('loading');
    output.innerHTML = marked.parse(content);
}

function titlePage() {
    const titleSuffix = fileSelect.value.includes('·') ? '小说' : fileSelect.value;
    document.title = `${titleSuffix} | KoMoriSam`;
}

function latestFile() {
    fileSelect.value = latestFileSelect.value;
    loadAndNavigateFile();
}

function firstFile() {
    fileSelect.value = fileSelect.options[3]?.value || "";
    loadAndNavigateFile();
}

function nextFile() {
    loadAndNavigateFile(1, '已经到底啦', '未找到更新的章节');
}

function previousFile() {
    loadAndNavigateFile(-1, '顶到最前面啦', '未找到更早的章节');
}
