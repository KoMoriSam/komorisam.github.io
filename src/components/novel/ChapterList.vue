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

    <li v-else v-for="volume in chapterList" :key="volume.volumeInfo.uuid">
      <details open>
        <summary class="font-bold">{{ volume.volumeInfo.title }}</summary>
        <ul v-if="volume.chapters && volume.chapters.length > 0">
          <li v-for="chapter in volume.chapters" :key="chapter.uuid">
            <a
              v-if="chapter"
              @click="handleClick(chapter.uuid)"
              class="block"
              :class="{
                'menu-active':
                  currentPage !== 'BookDetail' &&
                  chapter.uuid === currentChapterUuid,
              }"
            >
              <!-- 章节名称 -->

              <span class="mr-2">{{ chapter.title }}</span>

              <span
                v-if="
                  isRecent(chapter.uuid, chapter.date) && !isRead(chapter.uuid)
                "
                class="badge badge-xs badge-warning"
              >
                NEW </span
              ><br />
              <!-- 章节状态指示 -->
              <div class="flex items-center gap-1 flex-wrap">
                <span v-if="isRead(chapter.uuid)" class="badge badge-xs">
                  <i class="status status-accent"></i>
                  已读
                </span>
                <span v-else class="badge badge-xs">
                  <i class="status status-info animate-bounce"></i>
                  未读
                </span>
                <span class="badge badge-xs">
                  <i class="ri-time-line"></i>
                  {{ formatDate(chapter.date) }}
                </span>
                <br />
                <span class="badge badge-xs">
                  <i class="ri-file-text-line"></i>
                  {{ chapter.length }} 字
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
const { isLoadingList, chapterList, currentChapterUuid } =
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
