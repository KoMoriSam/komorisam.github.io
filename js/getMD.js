// const fileInput = document.getElementById("fileInput");
// const output = document.getElementById("output");

// fileInput.addEventListener("change", (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//         const reader = new FileReader();

//         reader.onload = function (event) {
//             const markdownContent = event.target.result;
//             output.innerHTML = marked.parse(markdownContent);
//         };

//         reader.readAsText(selectedFile);
//     } else {
//         output.innerHTML = "";
//     }
// });

const fileSelect = document.getElementById("fileSelect");
const loadFileButton = document.getElementById("loadFile");
const latestFileSelect = document.getElementById("latestFileSelect");
const latestFileButton = document.getElementById("latestFile");
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
        latestFile = fileList.slice(-1)[0];
        const option = document.createElement("option");
        option.value = latestFile;
        option.textContent = latestFile;
        latestFileSelect.appendChild(option);
    })
    .catch((error) => {
        output.innerHTML = marked.parse('# *⚠️未找到章节列表⚠️*');
        console.error("找不到章节列表！", error);
    });

loadFileButton.addEventListener("click", () => {
    const selectedFileName = 'media/novel/' + fileSelect.value + '.md';

    if (selectedFileName) {
        fetch(selectedFileName)
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
                output.innerHTML = marked.parse('# *⚠️未找到该章节 请重新选择⚠️*');
                console.error("未找到该章节！", error);
            });
    } else {
        output.innerHTML = "";
    }
});

latestFileButton.addEventListener("click", () => {
    const latestFileName = 'media/novel/' + latestFile + '.md';

    if (latestFileName) {
        fetch(latestFileName)
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
                output.innerHTML = marked.parse('# *⚠️获取最新章节失败⚠️*');
                console.error("获取最新章节失败！", error);
            });
    } else {
        output.innerHTML = "";
    }
});