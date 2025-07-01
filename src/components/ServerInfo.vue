<template>
  <section v-if="serverInfo" class="prose prose-sm">
    <div
      class="stats stats-vertical lg:stats-horizontal bg-primary-content text-primary shadow"
    >
      <div class="stat">
        <div class="stat-title">
          <i class="ri-hard-drive-3-line"></i>
          服务器
        </div>
        <div class="stat-value text-xs">
          <img
            :src="serverInfo.logo"
            alt="Logo of Server"
            class="mask mask-circle w-12"
            title="服务器 Logo"
            v-fade-in
          />
        </div>
        <div class="stat-desc">{{ serverInfo.city }}</div>
      </div>
      <div class="stat">
        <div class="stat-title">
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
        </div>
        <div class="stat-value my-5">
          {{ serverInfo.ping === null ? "离线" : "在线" }}
        </div>
        <div class="stat-desc">{{ serverInfo.motd }}</div>
      </div>

      <div class="stat" v-if="serverInfo.ping !== null">
        <div class="stat-title">
          <i class="ri-user-3-line"></i>
          在线人数
        </div>
        <div class="stat-value my-5">
          {{ serverInfo.p }} / {{ serverInfo.mp }}
        </div>
        <div class="stat-desc">
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
        </div>
      </div>

      <div class="stat" v-if="serverInfo.ping !== null">
        <div class="stat-title">
          <i class="ri-timer-line"></i>
          网络延迟
        </div>
        <div class="stat-value my-5">{{ serverInfo.ping }} ms</div>
        <div class="stat-desc">
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
        </div>
      </div>
    </div>
  </section>

  <Loading :size="`h-42`" v-else />
</template>

<script setup>
import Loading from "@/components/base/Loading.vue";

import { ref, onMounted } from "vue";
import { useServerApi } from "@/services/api-server";
const { getServerInfo } = useServerApi();
const serverInfo = ref(null);
onMounted(async () => {
  const isPrerenderBot = /HeadlessChrome|Prerender/i.test(navigator.userAgent);
  if (isPrerenderBot) return;
  serverInfo.value = await getServerInfo();
  console.log("Server Info:", serverInfo.value);
});
</script>
