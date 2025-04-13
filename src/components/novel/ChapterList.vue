<template>
  <Submenu title="章节目录">
    <template #btn>
      <button
        class="btn btn-info btn-square btn-sm btn-soft ml-auto"
        @click="novelStore.refreshChapterList()"
        :disabled="isLoadingList"
      >
        <div class="tooltip" data-tip="刷新章节目录">
          <i class="ri-refresh-line m-2"></i>
        </div>
      </button>
      <button
        class="btn btn-info btn-square btn-sm btn-soft"
        @click="novelStore.refreshReadChapterList()"
        :disabled="isLoadingList"
      >
        <div class="tooltip" data-tip="清除阅读记录">
          <i class="ri-delete-bin-6-line"></i>
        </div>
      </button>
    </template>
    <Loading v-if="isLoadingList" />

    <li v-else v-for="group in chapterList" :key="group.label">
      <details open>
        <summary class="font-bold">{{ group.label }}</summary>
        <ul v-if="group.options">
          <li v-for="chapter in group.options" :key="chapter?.id">
            <a
              v-if="chapter"
              @click="handleClick(chapter.id)"
              :class="{
                'menu-active':
                  currentPage !== 'BookDetail' &&
                  chapter.id === currentChapterId,
              }"
            >
              <!-- 章节状态指示 -->
              <span v-if="isRead(chapter.id)" class="badge badge-xs">
                <i class="status status-accent"></i>
                已读
              </span>

              <span v-else class="badge badge-xs">
                <i class="status status-info animate-bounce"></i>
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
import { storeToRefs } from "pinia";

import { useNovelStore } from "@/stores/novel";

import { useChapters } from "@/composables/chapters";

import Loading from "@/components/base/Loading.vue";
import Submenu from "@/components/ui/menu/Submenu.vue";

const novelStore = useNovelStore();
const { isLoadingList, chapterList, currentChapterId } =
  storeToRefs(novelStore);

const { isRead, handleAnyChapter, formatDate, isRecent } = useChapters();

const handleClick = (newId) => {
  handleAnyChapter(newId);
  if (props.currentPage === "BookDetail") {
    props.togglePage();
  }
};
const props = defineProps({
  togglePage: {
    type: Function,
  },
  currentPage: {
    type: String,
  },
});
</script>
