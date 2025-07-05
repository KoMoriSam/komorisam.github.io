import { useFetch } from "@vueuse/core";

export function useQuotesApi() {
  const getQuotes = async () => {
    const { data, error } = await useFetch(
      `https://www.mxnzp.com/api/daily_word/recommend?count=10&app_id=kvtghjtkt6tclvlf&app_secret=BhJ1vygt9FBVokES3z07GeHVj74na2OU`
    ).json();
    if (error.value) {
      throw new Error("获取每日一句失败");
    }
    return data.value;
  };
  return {
    getQuotes,
  };
}
