import { useFetch } from "@vueuse/core";
import CONFIG from "@/constants/config.js";

const BASE_URL = CONFIG.BASE_URL;

export function useChapterApi() {
  const fetchChapterList = async () => {
    const { data, error } = await useFetch(
      `${BASE_URL}/content/index.json`
    ).json();
    if (error.value) {
      throw new Error("获取章节列表失败");
    }
    return data.value;
  };

  const fetchChapterContent = async (path) => {
    const { data: markdownRaw, error } = await useFetch(
      `${BASE_URL}/${path}`
    ).text();
    if (error.value) {
      throw new Error("获取内容失败");
    }
    return markdownRaw.value;
  };

  return {
    fetchChapterList,
    fetchChapterContent,
  };
}
