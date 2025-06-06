<template>
  <main class="m-12">
    <article class="mx-auto prose">
      <h1>
        更新日志
        <router-link class="btn btn-xs no-underline mb-px" to="/">
          返回主页
        </router-link>
      </h1>

      <Loading v-if="isLoading" />
      <div v-else-if="error" class="text-error">{{ error }}</div>

      <template v-else>
        <section v-for="(item, version) in log" :key="version">
          <h2 class="mt-0">
            <span class="text-primary">{{ version }}</span> - {{ item.title }}
            <span class="badge badge-sm text-base-content/50 mb-1">
              {{ item.releaseDate }}
            </span>
          </h2>

          <ul>
            <li v-for="(change, index) in item.changelog" :key="index">
              <strong class="badge badge-soft" :class="typeColor(change.type)">
                {{ typeText(change.type) }}
              </strong>
              {{ change.description }}
              <span v-if="change.impact" class="ml-2">
                <span class="badge badge-xs text-base-content/50">
                  影响 {{ change.impact }}
                </span>
              </span>
            </li>
          </ul>

          <p v-if="item.migration" class="mt-3 text-sm">
            <span
              :class="[
                'badge badge-xs',
                item.migration.required ? 'badge-warning' : 'badge-success',
              ]"
            >
              <i
                :class="
                  item.migration.required ? 'ri-alert-line' : 'ri-check-line'
                "
              ></i>
              {{ item.migration.required ? "包含迁移操作" : "无迁移操作" }}
            </span>
            {{ item.migration.note || "" }}
          </p>
          <div class="divider"></div>
        </section>
      </template>
    </article>
  </main>
  <ToTop />
</template>

<script setup>
import { useChangelogStore } from "@/stores/changelogStore";
import { onMounted, computed } from "vue";

import Loading from "@/components/base/Loading.vue";
import ToTop from "@/components/base/ToTop.vue";

const store = useChangelogStore();
const log = computed(() => store.data);
const isLoading = computed(() => store.loading);
const error = computed(() => store.error);

// 获取数据
onMounted(async () => {
  if (Object.keys(store.data).length === 0) {
    await store.fetchChangelog();
  }
});

import { typeColor, typeText } from "@/utils/type-changelog";
</script>
