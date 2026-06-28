import CONFIG from "@/constants/config";

const { GISCUS } = CONFIG;
const { paragraphCountsApi } = GISCUS;

const normalizeEndpoint = (value = "") => String(value || "").trim();

const ENDPOINT = normalizeEndpoint(paragraphCountsApi.endpoint);
const TIMEOUT = Number(paragraphCountsApi.timeout || 8000);

export const hasParagraphCountsApi = Boolean(ENDPOINT);

export async function fetchParagraphCountsBatch({
  sourceType = "article",
  paragraphIds = [],
}) {
  if (!hasParagraphCountsApi) {
    return null;
  }

  const ids = [...new Set((paragraphIds || []).filter(Boolean))];
  if (!ids.length) {
    return {};
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceType,
        paragraphIds: ids,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`段评批量接口请求失败：${response.status}`);
    }

    const payload = await response.json();
    const counts = payload?.counts;

    if (!counts || typeof counts !== "object") {
      return {};
    }

    const normalized = {};
    ids.forEach((id) => {
      const count = Number(counts[id] ?? 0);
      normalized[id] = Number.isFinite(count) ? Math.max(0, count) : 0;
    });

    return normalized;
  } finally {
    clearTimeout(timeout);
  }
}
