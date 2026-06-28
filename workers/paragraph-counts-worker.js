const CACHE_TTL_MS = 5 * 60 * 1000;
const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_USER_AGENT = "komorisam-paragraph-counts-worker/1.0";

const memoryCache = new Map();

function buildCorsHeaders(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function normalizeOrigin(value = "") {
  return String(value || "")
    .trim()
    .replace(/\/$/, "");
}

function resolveCorsOrigin(request, env) {
  const allowed = String(env.ALLOWED_ORIGIN || "*").trim();
  if (!allowed || allowed === "*") {
    return "*";
  }

  const requestOrigin = normalizeOrigin(request.headers.get("Origin") || "");
  const allowedOrigins = allowed
    .split(",")
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);

  if (!allowedOrigins.length) {
    return "*";
  }

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0];
}

function jsonResponse(body, status = 200, corsOrigin = "*") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...buildCorsHeaders(corsOrigin),
    },
  });
}

function getSourceConfig(env, sourceType) {
  if (sourceType === "novel") {
    return {
      owner: env.NOVEL_REPO_OWNER,
      repo: env.NOVEL_REPO_NAME,
      categoryId: env.NOVEL_CATEGORY_ID,
      maxPages: Number(env.NOVEL_MAX_PAGES || env.MAX_PAGES || 20),
    };
  }

  return {
    owner: env.ARTICLE_REPO_OWNER,
    repo: env.ARTICLE_REPO_NAME,
    categoryId: env.ARTICLE_CATEGORY_ID,
    maxPages: Number(env.ARTICLE_MAX_PAGES || env.MAX_PAGES || 20),
  };
}

async function fetchDiscussionPage({ token, owner, repo, categoryId, cursor }) {
  const query = `
    query($owner: String!, $repo: String!, $categoryId: ID!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        discussions(first: 100, after: $cursor, categoryId: $categoryId, orderBy: {field: UPDATED_AT, direction: DESC}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            title
            comments {
              totalCount
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "User-Agent": GITHUB_USER_AGENT,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        owner,
        repo,
        categoryId,
        cursor,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `GitHub GraphQL 请求失败：${response.status}${detail ? ` | ${detail}` : ""}`,
    );
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    const message = payload.errors.map((error) => error.message).join("; ");
    throw new Error(`GitHub GraphQL 返回错误：${message}`);
  }

  return payload.data?.repository?.discussions;
}

async function fetchAllDiscussionCounts({
  token,
  owner,
  repo,
  categoryId,
  maxPages,
}) {
  const counts = {};
  let cursor = null;
  let page = 0;

  while (page < maxPages) {
    page += 1;
    const discussions = await fetchDiscussionPage({
      token,
      owner,
      repo,
      categoryId,
      cursor,
    });

    const nodes = discussions?.nodes || [];
    nodes.forEach((node) => {
      if (!node?.title) return;
      const count = Number(node?.comments?.totalCount ?? 0);
      counts[node.title] = Number.isFinite(count) ? Math.max(0, count) : 0;
    });

    if (!discussions?.pageInfo?.hasNextPage) {
      break;
    }

    cursor = discussions.pageInfo.endCursor;
    if (!cursor) {
      break;
    }
  }

  return counts;
}

async function getCountsMap(env, sourceType) {
  const cacheKey = sourceType;
  const now = Date.now();
  const cached = memoryCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.counts;
  }

  const sourceConfig = getSourceConfig(env, sourceType);
  const { owner, repo, categoryId, maxPages } = sourceConfig;

  if (!owner || !repo || !categoryId) {
    throw new Error("缺少仓库或分类配置");
  }

  if (!env.GITHUB_TOKEN) {
    throw new Error("缺少 GITHUB_TOKEN");
  }

  const counts = await fetchAllDiscussionCounts({
    token: env.GITHUB_TOKEN,
    owner,
    repo,
    categoryId,
    maxPages,
  });

  memoryCache.set(cacheKey, {
    counts,
    expiresAt: now + CACHE_TTL_MS,
  });

  return counts;
}

export default {
  async fetch(request, env) {
    const allowedOrigin = resolveCorsOrigin(request, env);

    if (request.method === "GET") {
      return jsonResponse(
        {
          ok: true,
          service: "paragraph-counts-api",
          message: "Use POST with sourceType and paragraphIds.",
        },
        200,
        allowedOrigin,
      );
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: buildCorsHeaders(allowedOrigin),
      });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method Not Allowed" }, 405, allowedOrigin);
    }

    try {
      const body = await request.json();
      const sourceType = body?.sourceType === "novel" ? "novel" : "article";
      const paragraphIds = [
        ...new Set((body?.paragraphIds || []).filter(Boolean)),
      ];

      if (!paragraphIds.length) {
        return jsonResponse({ counts: {} }, 200, allowedOrigin);
      }

      const allCounts = await getCountsMap(env, sourceType);
      const counts = {};

      paragraphIds.forEach((id) => {
        const value = Number(allCounts[id] ?? 0);
        counts[id] = Number.isFinite(value) ? Math.max(0, value) : 0;
      });

      return jsonResponse(
        {
          sourceType,
          counts,
          cachedAt: Date.now(),
        },
        200,
        allowedOrigin,
      );
    } catch (error) {
      return jsonResponse(
        {
          error: "段评批量接口执行失败",
          message: String(error?.message || error),
        },
        500,
        allowedOrigin,
      );
    }
  },
};
