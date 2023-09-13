const fileSelect = document.getElementById("fileSelect");
const latestFileSelect = document.getElementById("latestFileSelect");
const output = document.getElementById("output");

fetch("media/novel/list.json")
    .then((response) => response.json())
    .then((fileList) => {
        fileList.forEach((fileName) => {
            const option = document.createElement("option");
            option.value = fileName;
            option.textContent = fileName;
            fileSelect.appendChild(option);
        });
        latestOption = fileList.slice(-2)[0];
        const option = document.createElement("option");
        option.value = latestOption;
        option.textContent = latestOption;
        latestFileSelect.appendChild(option);
    })
    .catch((error) => {
        output.innerHTML = marked.parse('# *⚠️未找到章节列表⚠️*');
        console.error("找不到章节列表！", error);
    });

function outputFile(fileName, msg1, msg2) {
    if (fileName) {
        fetch(fileName)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("服务器未存档");
                }
                return response.text();
            })
            .then((markdownContent) => {
                output.innerHTML = marked.parse(markdownContent);
            })
            .catch((error) => {
                output.innerHTML = marked.parse(`# *⚠️ ${msg1} ⚠️*`);
                console.error(`${msg2}`, error);
            });
    } else {
        output.innerHTML = "";
    }
};

function titlePage() {
    if (fileSelect.value.includes('————')) {
        document.title = '小说 | KoMoriSam';
    } else {
        document.title = fileSelect.value + ' | KoMoriSam';
    }
};

function loadFile() {
    var selectedFileName = 'media/novel/' + fileSelect.value + '.md';
    titlePage();

    outputFile(selectedFileName, '未找到该章节或章节不存在，请重新选择', '未找到该章节');
};

function latestFile() {
    var latestFileName = 'media/novel/' + latestOption + '.md';
    fileSelect.value = latestOption;
    titlePage();

    outputFile(latestFileName, '获取最新章节失败', '获取最新章节失败');
};

function firstFile() {
    fileSelect.value = fileSelect.options[1].value;
    var selectedFileName = 'media/novel/' + fileSelect.value + '.md';
    titlePage();

    outputFile(selectedFileName, '获取最初章节失败', '获取最初章节失败');
};

function nextFile() {
    var index = fileSelect.selectedIndex;
    try {
        fileSelect.value = fileSelect.options[index + 1].value;
        var selectedFileName = 'media/novel/' + fileSelect.value + '.md';
        titlePage();

        outputFile(selectedFileName, '未找到该章节或章节不存在，请重新选择', '未找到该章节');

    } catch (error) {
        output.innerHTML = marked.parse('# *⚠️已经到底啦⚠️*');
        console.error("已经到底啦！", error);
    }
};

function previousFile() {
    var index = fileSelect.selectedIndex;
    try {
        fileSelect.value = fileSelect.options[index - 1].value;
        var selectedFileName = 'media/novel/' + fileSelect.value + '.md';
        titlePage();

        outputFile(selectedFileName, '未找到该章节或章节不存在，请重新选择', '未找到该章节');

    } catch (error) {
        output.innerHTML = marked.parse('# *⚠️顶到最前面啦⚠️*');
        console.error("顶到最前面啦！", error);
    }
};