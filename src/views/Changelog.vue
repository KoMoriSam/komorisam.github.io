<template>
  <main class="m-12">
    <article class="mx-auto prose">
      <h1>
        更新日志
        <router-link class="btn btn-xs no-underline mb-px" to="/">
          返回主页
        </router-link>
      </h1>

      <Loading :size="`my-32`" v-if="isLoading" />
      <div v-else-if="error" class="text-error">{{ error }}</div>

      <template v-else>
        <ul
          class="timeline timeline-snap-icon timeline-compact timeline-vertical p-0"
        >
          <li
            class="m-0! p-0!"
            v-for="(item, version, index) in log"
            :key="version"
          >
            <hr v-if="index !== 0" />
            <div class="timeline-middle">
              <i
                class="ri-checkbox-circle-fill text-xl"
                :class="index === 0 ? 'text-primary' : ''"
              ></i>
            </div>
            <div class="timeline-end m-0">
              <time class="badge badge-outline font-mono mt-2">
                {{ item.releaseDate }}
              </time>
              <h2 class="my-2!">
                <strong
                  class="badge badge-lg"
                  :class="index === 0 ? 'badge-primary' : ''"
                >
                  {{ version }}
                </strong>
                {{ item.title }}
              </h2>
              <ul class="pl-3">
                <li
                  class="list-none"
                  v-for="(change, index) in item.changelog"
                  :key="index"
                >
                  <strong
                    class="badge badge-soft"
                    :class="typeColor(change.type)"
                  >
                    {{ typeText(change.type) }}
                  </strong>
                  {{ change.description }}
                </li>
              </ul>
              <p v-if="item.migration" class="mt-3 text-sm">
                <span
                  :class="[
                    'badge badge-sm',
                    item.migration.required ? 'badge-warning' : 'badge-success',
                  ]"
                >
                  <i
                    :class="
                      item.migration.required
                        ? 'ri-alert-line'
                        : 'ri-check-line'
                    "
                  ></i>
                  {{ item.migration.required ? "包含迁移操作" : "无迁移操作" }}
                </span>
              </p>
              <p class="text-base-content/50 text-sm">
                <i v-if="item.migration.note" class="ri-information-line"></i>
                {{ item.migration.note || "" }}
              </p>
            </div>
            <hr v-if="index !== Object.keys(log).length - 1" />
          </li>
        </ul>
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
