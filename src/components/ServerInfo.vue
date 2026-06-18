<template>
  <section class="not-prose w-auto">
    <!-- 搜索栏 -->
    <fieldset
      class="fieldset bg-base-200/60 border-base-300 rounded-box border w-full p-4 sm:p-5 mb-6"
    >
      <legend class="fieldset-legend">查询服务器状态</legend>
      <div class="join">
        <div class="flex-1 grid w-full">
          <label class="input validator w-full join-item [grid-row:1]">
            <i class="ri-server-line"></i>
            <input
              v-model="serverAddress"
              type="text"
              :placeholder="`${defaultServer}`"
              pattern="^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?$|^(?:localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d{1,5})?$"
              title="请输入有效的服务器地址，如：mc.example.com:25565"
              @keydown.enter="fetchInfo"
            />
            <button
              class="btn btn-ghost btn-xs btn-square -mr-1"
              title="从剪贴板粘贴"
              @click.prevent="pasteAndFetch"
            >
              <i class="ri-clipboard-line"></i>
            </button>
          </label>
          <p class="label label-hint [grid-area:2/1]">
            <i class="ri-information-line"></i>
            <span class="text-rotate">
              <span>
                <span> 请输入服务器地址 </span>
                <span> 默认端口为 25565 </span>
              </span>
            </span>
          </p>
          <p class="validator-hint [grid-area:2/1] mt-0 text-wrap">
            <i class="ri-error-warning-line"></i>
            请输入有效的服务器地址！
          </p>
        </div>
        <button
          class="btn btn-primary sm:flex-shrink-0 sm:w-auto join-item"
          @click="fetchInfo"
          :disabled="loading"
        >
          <span class="flex gap-1 items-center">
            <span
              v-if="loading"
              class="loading loading-spinner loading-xs"
            ></span>
            <i v-else class="ri-search-line w-4"></i>查询
          </span>
        </button>
      </div>
    </fieldset>

    <!-- 服务器信息卡片网格 -->
    <section
      v-if="serverInfo"
      class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      aria-label="服务器信息卡片"
    >
      <!-- 卡片：服务器 -->
      <article
        class="rounded-box bg-base-200/60 text-base-content border border-base-300 p-5 flex flex-col items-center gap-2"
      >
        <h3
          class="text-sm text-base-content/75 flex items-center gap-2 self-start"
        >
          <i class="ri-hard-drive-3-line"></i>
          服务器
        </h3>
        <img
          v-if="serverInfo.logo"
          :src="serverInfo.logo"
          alt="Logo of Server"
          class="mask mask-squircle w-16 h-16"
          title="服务器 Logo"
          v-fade-in
        />
        <div
          v-else
          class="mask mask-squircle w-16 h-16 bg-base-300 flex items-center justify-center"
          title="服务器离线"
        >
          <i class="ri-server-fill text-3xl text-base-content/40"></i>
        </div>
        <p class="text-sm text-base-content/75">{{ serverInfo.version }}</p>
        <p class="text-sm text-base-content/75">{{ serverInfo.city }}</p>
      </article>

      <!-- 卡片：当前状态 -->
      <article
        class="rounded-box bg-base-200/60 text-base-content border border-base-300 p-5 flex flex-col gap-2"
      >
        <h3 class="text-sm text-base-content/75 flex items-center gap-2">
          <div
            v-if="serverInfo.ping === null"
            class="inline-grid *:[grid-area:1/1]"
          >
            <div class="status status-error animate-ping"></div>
            <div class="status status-error"></div>
          </div>
          <div v-else class="inline-grid *:[grid-area:1/1]">
            <div class="status status-success animate-ping"></div>
            <div class="status status-success"></div>
          </div>
          当前状态
        </h3>
        <p class="text-2xl font-bold my-3">
          {{ serverInfo.ping === null ? "离线或不存在" : "在线" }}
        </p>
        <p class="text-rotate text-sm text-base-content/75">
          <span v-if="serverInfo.ping === null">
            <span>
              <i class="ri-link"></i>
              {{ queriedAddress }}
            </span>
            <span>
              <i class="ri-information-line"></i>
              请联系相关管理员或检查地址是否正确
            </span>
          </span>
        </p>
      </article>

      <!-- 卡片：在线人数 -->
      <article
        v-if="serverInfo.ping !== null"
        class="rounded-box bg-base-200/60 text-base-content border border-base-300 p-5 flex flex-col gap-2"
      >
        <h3 class="text-sm text-base-content/75 flex items-center gap-2">
          <i class="ri-user-3-line"></i>
          在线人数
        </h3>
        <p class="text-2xl font-bold my-3">
          {{ serverInfo.p }} / {{ serverInfo.mp }}
        </p>
        <p class="text-sm text-base-content/75">
          <span
            class="badge badge-sm badge-error"
            v-if="serverInfo.p / serverInfo.mp >= 0.75"
          >
            忙碌
          </span>
          <span
            class="badge badge-sm badge-warning"
            v-else-if="serverInfo.p / serverInfo.mp >= 0.4"
          >
            活跃
          </span>
          <span class="badge badge-sm badge-success" v-else>空闲</span>
        </p>
      </article>

      <!-- 卡片：网络延迟 -->
      <article
        v-if="serverInfo.ping !== null"
        class="rounded-box bg-base-200/60 text-base-content border border-base-300 p-5 flex flex-col gap-2"
      >
        <h3 class="text-sm text-base-content/75 flex items-center gap-2">
          <i class="ri-timer-line"></i>
          网络延迟
        </h3>
        <p class="text-2xl font-bold my-3">{{ serverInfo.ping }} ms</p>
        <p class="text-sm text-base-content/75">
          <span
            class="badge badge-sm badge-error"
            v-if="serverInfo.ping > 200 || serverInfo.ping === null"
          >
            高
          </span>
          <span
            class="badge badge-sm badge-warning"
            v-else-if="serverInfo.ping > 100"
          >
            中
          </span>
          <span class="badge badge-sm badge-success" v-else>低</span>
        </p>
      </article>
    </section>

    <Loading v-else :size="`h-42`" />
  </section>
</template>

<script setup>
import Loading from "@/components/base/Loading.vue";

import { ref, onMounted } from "vue";
import { useServerApi } from "@/services/api-server";
import { useToast } from "@/composables/useToast";
const { getServerInfo, DEFAULT_SERVER } = useServerApi();
const toast = useToast();

const defaultServer = DEFAULT_SERVER;
const serverAddress = ref("");
const queriedAddress = ref("");
const serverInfo = ref(null);
const loading = ref(false);

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      serverAddress.value = text.trim();
    } else {
      toast.info("剪贴板为空");
    }
  } catch (e) {
    console.error("无法读取剪贴板:", e);
    toast.error("无法读取剪贴板，请手动输入");
  }
};

const pasteAndFetch = async () => {
  await pasteFromClipboard();
  if (!serverAddress.value) return;
  fetchInfo();
};

const fetchInfo = async () => {
  loading.value = true;
  const address = serverAddress.value || undefined;
  try {
    const data = await getServerInfo(address);
    if (!data || Array.isArray(data) || !("ping" in data)) {
      toast.error("查询失败：未获取到服务器数据");
      return;
    }
    if (data.error) {
      toast.error(data.error);
      return;
    }
    queriedAddress.value = address || defaultServer;
    serverInfo.value = data;
  } catch (e) {
    console.error(e);
    toast.error("查询失败，请检查地址是否正确");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const isPrerenderBot = /HeadlessChrome|Prerender/i.test(navigator.userAgent);
  if (isPrerenderBot) return;
  fetchInfo();
});
</script>
