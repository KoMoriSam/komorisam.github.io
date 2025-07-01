import { useFetch } from "@vueuse/core";

export function useServerApi() {
  const getServerInfo = async () => {
    const { data, error } = await useFetch(
      `https://list.mczfw.cn/api/frp-ice.com:31024`
    ).json();
    if (error.value) {
      throw new Error("获取服务器信息失败");
    }
    return data.value;
  };
  return {
    getServerInfo,
  };
}
