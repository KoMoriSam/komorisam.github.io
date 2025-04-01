const chSelect = document.getElementById("select-list");
const latestChSelect = document.getElementById("select-lastestCh");
const novel = document.querySelector(".novel");
const loading = document.getElementById("loading");
const refreshButton = document.getElementById("refreshButton");
const pathHead = "page/novel/";

const ERROR_MESSAGES = {
  NO_CHAPTER_LIST: "# *⚠️ 未找到章节列表 ⚠️*",
  CHAPTER_NOT_FOUND: "# *⚠️ 未找到该章节或章节不存在 ⚠️*",
  NO_NEWER_CHAPTER: "已经到底啦",
  NO_OLDER_CHAPTER: "顶到最前面啦",
};

latestChSelect.addEventListener("mousedown", (e) => e.preventDefault());

// 初始化
async function init(forceReload = false) {
  try {
    const response = await fetch("../../assets/markdown/novel/list.json", {
      cache: "reload",
    });
    const fileList = await response.json();
    if (!Array.isArray(fileList) || fileList.length === 0)
      throw new Error("章节列表为空");

    console.log(forceReload ? "章节列表已刷新" : "章节列表已加载");

    // 清理章节缓存
    if (forceReload) {
      chSelect.innerHTML = "";
      latestChSelect.innerHTML = "";
      fileList.forEach((file) => delete cache[`chapter_${file.name}`]);
    }

    populateSelect(chSelect, fileList);
    populateSelect(latestChSelect, fileList, true);

    // 确保加载正确的章节
    const savedChapter = cache.nowChapter; // 获取当前选中的章节
    if (fileList.some((file) => file.name === savedChapter)) {
      chSelect.value = savedChapter;
    } else if (
      !fileList.some((file) => file.name === savedChapter) &&
      forceReload
    ) {
      chSelect.value = latestChSelect.value;
    } else {
      chSelect.value = chSelect.options[0].value;
    }

    loadFile(0, "", "", forceReload);
  } catch (error) {
    handleError(ERROR_MESSAGES.NO_CHAPTER_LIST, "加载章节列表失败", error);
  }
}

function populateSelect(selectElement, fileList, latest = false) {
  const fragment = document.createDocumentFragment();
  let latestFile = null;

  fileList.forEach((file) => {
    if (/\d/.test(file.name)) {
      latestFile =
        !latestFile || new Date(file.modified) > new Date(latestFile.modified)
          ? file
          : latestFile;
    }
    fragment.appendChild(createOption(file));
  });

  selectElement.appendChild(latest ? createOption(latestFile) : fragment);
}

function createOption(file) {
  const option = document.createElement("option");
  option.value = file.name;
  option.textContent = `${file.name} ${
    /\d/.test(file.name) ? formatDate(file.modified) : ""
  }`;
  return option;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `(${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")})`;
}

async function loadFile(
  step = 0,
  errorMsg = "",
  consoleMsg = "",
  forceReload = false
) {
  try {
    if (step !== 0) {
      const newIndex = chSelect.selectedIndex + step;
      if (newIndex < 0 || newIndex >= chSelect.options.length)
        return handleError(errorMsg, consoleMsg);
      chSelect.selectedIndex = newIndex;
    }

    const fileName = chSelect.value;
    if (!fileName) return (novel.innerHTML = "");

    if (!forceReload) {
      const cachedContent = cache[`chapter_${fileName}`];
      if (cachedContent) return displayMessage(cachedContent);
    }

    cache.nowChapter = fileName;
    updateTitle(fileName);
    displayMessage("## 别急，正在加载！", true);

    const response = await fetch(`${pathHead}${fileName}.md`, {
      cache: "reload",
    });
    if (!response.ok) throw new Error("服务器未存档");

    const content = await response.text();
    cache[`chapter_${fileName}`] = content;
    setTimeout(() => displayMessage(content), 300);
  } catch (error) {
    handleError(ERROR_MESSAGES.CHAPTER_NOT_FOUND, "加载章节失败", error);
  }
}

function handleError(displayMsg, consoleMsg, error = "") {
  displayMessage(displayMsg);
  console.error(consoleMsg, error);
}

function displayMessage(content, isLoading = false) {
  loading.classList.toggle("loading", isLoading);
  novel.style.opacity = 0;
  novel.innerHTML = marked.parse(content);

  setTimeout(() => {
    novel.style.transition = "opacity 0.5s ease-out";
    novel.style.opacity = 1;
  }, 50);
}

function updateTitle(fileName) {
  document.title = `${fileName.includes("·") ? "小说" : fileName} | KoMoriSam`;
}

// 事件绑定
refreshButton.addEventListener("click", () => init(true));

document.getElementById("first-ch")?.addEventListener("click", () => {
  chSelect.selectedIndex = 3;
  loadFile();
});

document.querySelectorAll(".lastest-ch")?.forEach((e) => {
  e.addEventListener("click", () => {
    if (latestChSelect.value == chSelect.value) {
      alert("已经是最新章节啦！");
    } else {
      chSelect.value = latestChSelect.value;
      loadFile();
    }
  });
});

document.getElementById("next-ch")?.addEventListener("click", () => {
  loadFile(1, ERROR_MESSAGES.NO_NEWER_CHAPTER, "未找到更新的章节");
});

document.getElementById("prev-ch")?.addEventListener("click", () => {
  loadFile(-1, ERROR_MESSAGES.NO_OLDER_CHAPTER, "未找到更早的章节");
});

init();
