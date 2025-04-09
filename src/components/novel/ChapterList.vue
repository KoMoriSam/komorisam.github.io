<template>
  <Submenu title="章节目录">
    <Loading v-if="novelStore.isLoadingList" />

    <li v-else v-for="group in novelStore.chapterList" :key="group.label">
      <details open>
        <summary class="font-bold">{{ group.label }}</summary>
        <ul v-if="group.options">
          <li v-for="chapter in group.options" :key="chapter?.id">
            <a
              v-if="chapter"
              @click="handleClick(chapter.id)"
              :class="{
                'menu-active':
                  currentComponent !== 'BookDetail' &&
                  chapter.id === novelStore.currentChapterId,
              }"
            >
              <!-- 章节状态指示 -->
              <span v-if="isRead(chapter.id)" class="badge badge-xs">
                <i class="status status-accent"></i>
                已读
              </span>

              <span v-else class="badge badge-xs">
                <i class="status status-primary animate-bounce"></i>
                未读
              </span>

              <!-- 章节名称 -->
              <div
                class="tooltip tooltip-bottom tooltip-info"
                :data-tip="`更新时间：${formatDate(chapter.updated)}`"
              >
                <span class="mr-2">{{ chapter?.name || "未知章节" }}</span>

                <span
                  v-if="
                    isRecent(chapter.id, chapter.updated) && !isRead(chapter.id)
                  "
                  class="badge badge-xs badge-warning"
                >
                  NEW
                </span>
              </div>
            </a>
          </li>
        </ul>
      </details>
    </li>
  </Submenu>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useNovelStore } from "@/stores/novel";

import Loading from "@/components/ui/Loading.vue";
import Submenu from "@/components/ui/menu/Submenu.vue";

const novelStore = useNovelStore();
const props = defineProps({
  toggleComponent: {
    type: Function,
  },
  currentComponent: {
    type: String,
  },
});

const router = useRouter();

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isRecent = (id, dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 14 * 24 * 60 * 60 * 1000 || id === novelStore.latestChapter.id; // 14 天内和最新章
};

const isRead = computed(() => (id) => {
  return novelStore.readChapterList.some((g) => g.chapter.id === id);
});

const handleChange = (newId) => {
  router.push({ query: { chapter: newId, page: 1 } });
  window.scrollTo({ top: 200, behavior: "smooth" });
};

const handleClick = (newId) => {
  handleChange(newId);
  if (props.currentComponent === "BookDetail") {
    props.toggleComponent();
  }
};
</script>
