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
const output = document.getElementById("output");

// Fetch the list of available Markdown files from the server
fetch("media/novel/list.json") // Replace with the actual endpoint to fetch the list
    .then((response) => response.json())
    .then((fileList) => {
        fileList.forEach((fileName) => {
            const option = document.createElement("option");
            option.value = fileName;
            option.textContent = fileName;
            fileSelect.appendChild(option);
        });
    })
    .catch((error) => {
        console.error("Error fetching the list of Markdown files:", error);
    });

loadFileButton.addEventListener("click", () => {
    const selectedFileName = 'media/novel/' + fileSelect.value;

    if (selectedFileName) {
        fetch(selectedFileName)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((markdownContent) => {
                output.innerHTML = marked.parse(markdownContent);
            })
            .catch((error) => {
                console.error("Error fetching or parsing the Markdown file:", error);
            });
    } else {
        output.innerHTML = "";
    }
});