import { useFetch } from "@vueuse/core";
import fm from "front-matter";

const BASE_URL = import.meta.env.VITE_API_ARTICLE_URL;
const OBSIDIAN_LINK_REGEX = /^\[\[(.+)\]\]$/;
const OBSIDIAN_IMAGE_REGEX = /!\[\[([^\]]+)\]\]/g;

const escapeHtmlAttr = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

const normalizeImageSrc = (rawTarget = "") => {
  const target = String(rawTarget || "").trim();
  if (!target) return "";

  if (
    target.startsWith("/") ||
    target.startsWith("data:") ||
    /^(https?:)?\/\//i.test(target)
  ) {
    return target;
  }

  if (target.includes("/")) {
    return `/mock/article/${encodeURI(target)}`;
  }

  return `/mock/article/images/${encodeURI(target)}`;
};

const normalizeBanner = (banner) => {
  const value = String(banner || "").trim();
  if (!value) return "";

  const match = value.match(OBSIDIAN_LINK_REGEX);
  const target = (match ? match[1] : value).split("|")[0]?.trim() || "";

  return normalizeImageSrc(target);
};

const formatImageWidth = (raw = "") => {
  const value = String(raw || "").trim();
  if (!value || value === "%") return "";

  if (/^\d+(\.\d+)?$/.test(value)) {
    return `${value}px`;
  }

  if (/^\d+(\.\d+)?%$/.test(value)) {
    return value;
  }

  return "";
};

const normalizeObsidianImages = (markdown = "") => {
  return String(markdown || "").replaceAll(OBSIDIAN_IMAGE_REGEX, (_, inner) => {
    const parts = String(inner)
      .split("|")
      .map((item) => item.trim());

    const rawTarget = parts.shift() || "";
    const src = normalizeImageSrc(rawTarget);
    if (!src) return "";

    let align = "";
    if (["left", "center", "right"].includes((parts[0] || "").toLowerCase())) {
      align = (parts.shift() || "").toLowerCase();
    }

    const [rawAlt = "", rawWidth = ""] = parts;
    const alt = rawAlt === "%" ? "" : rawAlt;
    const width = formatImageWidth(
      rawWidth || (parts.length === 1 ? rawAlt : ""),
    );

    const styleTokens = ["max-width:100%", "height:auto"];
    if (width) {
      styleTokens.push(`width:${width}`);
    }

    const alignClass =
      align === "center"
        ? "mx-auto block"
        : align === "right"
          ? "ml-auto block"
          : align === "left"
            ? "mr-auto block"
            : "";

    return `<img class="${alignClass}" src=\"${escapeHtmlAttr(src)}\" alt=\"${escapeHtmlAttr(alt)}\" loading=\"lazy\" style=\"${styleTokens.join(";")};\" />`;
  });
};

const normalizeArticleMeta = (article = {}) => {
  if (!article || typeof article !== "object") return article;

  return {
    ...article,
    banner: normalizeBanner(article.banner),
  };
};

/**
 * 文章 API 服务
 * - 开发环境：读取 /mock/article（本地静态文件）
 * - 生产环境：由 VITE_API_ARTICLE_URL 环境变量指定
 */
export function useArticleApi() {
  /**
   * 获取文章列表（索引）
   * 索引为扁平数组；兼容旧的嵌套格式 { tagName: { articles: [...] } }
   * @returns {Promise<Array<{id, title, summary, date, tags, path, banner?}>>}
   */
  const fetchArticleList = async () => {
    const { data, error } = await useFetch(`${BASE_URL}/index.json`).json();
    if (error.value) {
      throw new Error("获取文章列表失败");
    }
    const raw = data.value;
    // 扁平格式：直接返回
    if (Array.isArray(raw)) return raw.map(normalizeArticleMeta);
    // 兼容旧嵌套格式：{ 标签: { articles: [...] } }
    const flat = [];
    for (const tag of Object.values(raw)) {
      if (tag.articles) flat.push(...tag.articles);
    }
    return flat.map(normalizeArticleMeta);
  };

  /**
   * 获取单篇文章的 Markdown 内容（已剥离 frontmatter）
   * @param {string} path - 文章文件路径（扁平结构下即文件名，如 "2024-07-07.md"）
   * @returns {Promise<string>}
   */
  const fetchArticleContent = async (path) => {
    const { data, error } = await useFetch(`${BASE_URL}/${path}`).text();
    if (error.value) {
      throw new Error("获取文章内容失败");
    }
    const raw = data.value;
    const parsed = fm(raw);
    return normalizeObsidianImages(parsed.body);
  };

  return {
    fetchArticleList,
    fetchArticleContent,
  };
}
