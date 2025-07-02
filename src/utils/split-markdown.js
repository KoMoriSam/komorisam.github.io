export function splitMarkdown(content) {
  const PAGE_SIZE = 1200;
  const ENGLISH_CHAR_WEIGHT = 0.6;
  const pages = [];
  let currentPage = "";
  let inCodeBlock = false;
  let inCustomContainer = false;
  let tempBuffer = "";
  let pendingClosure = false;

  const paras = content.split("\n");

  const isEnglishChar = (char) => /^[\x00-\xFF]$/.test(char);
  const visualLength = (str) => {
    let length = 0;
    for (const char of str) {
      length += isEnglishChar(char) ? ENGLISH_CHAR_WEIGHT : 1;
    }
    return length;
  };

  const flushPage = () => {
    if (currentPage.trim()) {
      pages.push(currentPage);
      currentPage = "";
    }
  };

  const isHeading = (line) => /^#{1,6}\s/.test(line.trim());

  for (let i = 0; i < paras.length; i++) {
    const para = paras[i];

    if (para.trim().startsWith("```")) {
      if (inCodeBlock) pendingClosure = true;
      inCodeBlock = !inCodeBlock;
    }

    if (para.trim().startsWith(":::")) {
      if (inCustomContainer) pendingClosure = true;
      inCustomContainer = !inCustomContainer;
    }

    const candidate = currentPage.length > 0 ? currentPage + "\n" + para : para;

    if (inCodeBlock || inCustomContainer) {
      currentPage = candidate;
      continue;
    }

    const isTableRow = para.includes("|") && para.trim().length > 0;

    if (isTableRow) {
      tempBuffer += (tempBuffer ? "\n" : "") + para;
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

    if (visualLength(candidate) > PAGE_SIZE) {
      if (pendingClosure) {
        currentPage = candidate;
        pendingClosure = false;
      } else {
        flushPage();
        currentPage = para;
      }
    } else {
      currentPage = candidate;
      if (pendingClosure && (para.trim() === "```" || para.trim() === ":::")) {
        pendingClosure = false;
      }
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  // 后处理：确保非最后一页不以标题结尾
  for (let i = 0; i < pages.length - 1; i++) {
    const lines = pages[i].trimEnd().split("\n");
    const lastLine = lines[lines.length - 1];

    if (isHeading(lastLine)) {
      const movedHeading = lines.pop();
      pages[i] = lines.join("\n").trimEnd();
      pages[i + 1] = movedHeading + "\n" + pages[i + 1];
    }
  }

  return pages;
}
