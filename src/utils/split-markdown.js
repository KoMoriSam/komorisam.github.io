export function splitMarkdown(content) {
  const PAGE_SIZE = 1200;
  const ENGLISH_CHAR_WEIGHT = 0.6; // 英文字符的视觉权重
  const pages = [];
  let currentPage = "";
  let inCodeBlock = false;
  let inCustomContainer = false;
  let tempBuffer = "";

  const paras = content.split("\n");

  // 使用正则表达式判断字符类型
  const isEnglishChar = (char) => {
    // 匹配ASCII字符（英文字母、数字、标点等）
    // 包括半角符号但不包括全角符号
    return /^[\x00-\xFF]$/.test(char);
  };

  // 计算字符串的视觉长度（使用正则判断中英文）
  const visualLength = (str) => {
    let length = 0;
    for (const char of str) {
      if (isEnglishChar(char)) {
        length += ENGLISH_CHAR_WEIGHT;
      } else {
        length += 1; // 中文字符和其他非ASCII字符算1
      }
    }
    return length;
  };

  const flushPage = () => {
    if (currentPage.trim()) {
      pages.push(currentPage);
      currentPage = "";
    }
  };

  for (let i = 0; i < paras.length; i++) {
    const para = paras[i];

    // 检测代码块起止
    if (para.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }

    // 检测自定义容器起止
    if (para.trim().startsWith(":::")) {
      inCustomContainer = !inCustomContainer;
    }

    // 累积段内容（保证换行符）
    let candidate = currentPage.length > 0 ? currentPage + "\n" + para : para;

    // 如果是代码块或自定义容器内，不分页
    if (inCodeBlock || inCustomContainer) {
      currentPage = candidate;
      continue;
    }

    // 判断是否是表格行（包含 | 且不是纯空行）
    const isTableRow = para.includes("|") && para.trim().length > 0;

    if (isTableRow) {
      // 暂时缓存表格连续行
      tempBuffer += (tempBuffer ? "\n" : "") + para;
      // 如果下一个不是表格行或到结尾了，尝试整体加进去
      const nextLine = paras[i + 1] || "";
      const nextIsTable = nextLine.includes("|") && nextLine.trim().length > 0;

      if (!nextIsTable || i === paras.length - 1) {
        const tableCandidate =
          (currentPage ? currentPage + "\n" : "") + tempBuffer;
        if (visualLength(tableCandidate) > PAGE_SIZE) {
          flushPage();
          currentPage = tempBuffer;
        } else {
          currentPage = tableCandidate;
        }
        tempBuffer = "";
      }
      continue;
    }

    // 非代码块、非表格、非自定义容器，使用视觉长度进行分页判断
    if (visualLength(candidate) > PAGE_SIZE) {
      flushPage();
      currentPage = para;
    } else {
      currentPage = candidate;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}
