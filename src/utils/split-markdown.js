export function splitMarkdown(content) {
  const PAGE_SIZE = 1200;
  const pages = [];
  let currentPage = "";
  let inCodeBlock = false;
  let tempBuffer = "";

  const paras = content.split("\n");

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

    // 累积段内容（保证换行符）
    let candidate = currentPage.length > 0 ? currentPage + "\n" + para : para;

    // 如果是代码块内，不分页
    if (inCodeBlock) {
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
        if (tableCandidate.length > PAGE_SIZE) {
          flushPage();
          currentPage = tempBuffer;
        } else {
          currentPage = tableCandidate;
        }
        tempBuffer = "";
      }
      continue;
    }

    // 非代码块、非表格，正常分页判断
    if (candidate.length > PAGE_SIZE) {
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
