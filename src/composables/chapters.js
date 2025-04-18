import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useScrollTo } from "@/composables/scrollTo";

import { useNovelStore } from "@/stores/novel";

export function useChapters() {
  const { scrollToTop } = useScrollTo();

  const novelStore = useNovelStore();
  const {
    currentChapter,
    currentChapterUuid,
    currentChapterIndex,
    latestChapter,
    flatChapterList,
    readChapterList,
  } = storeToRefs(novelStore);

  const router = useRouter();

  const showModal = ref(false);
  const handleModalClose = () => {
    showModal.value = false;
  };

  const handleChapter = (uuid) => {
    router.push({
      query: { chapter: uuid, page: 1 },
    });
    scrollToTop(80);
  };

  const handleFirstChapter = () => {
    if (currentChapterUuid.value === "7d5e9b50-a9cb-428a-9264-903046354e22") {
      showModal.value = true;
    } else {
      handleChapter("7d5e9b50-a9cb-428a-9264-903046354e22");
    }
  };

  const handleAnyChapter = (uuid) => {
    if (uuid === currentChapterUuid.value) {
      showModal.value = true;
    } else {
      handleChapter(uuid);
    }
  };

  const handleRecentChapter = () => {
    if (latestChapter.value.uuid === currentChapterUuid.value) {
      showModal.value = true;
    } else {
      handleChapter(latestChapter.value.uuid);
    }
  };

  const hasPrevious = computed(() => currentChapterIndex.value > 0);

  const hasNext = computed(
    () => currentChapterIndex.value + 1 < flatChapterList.value.length
  );

  const handlePrev = () => {
    router.push({
      query: {
        chapter: flatChapterList.value[currentChapterIndex.value - 1].uuid,
        page: 1,
      },
    });
    scrollToTop(80);
  };

  const handleNext = () => {
    router.push({
      query: {
        chapter: flatChapterList.value[currentChapterIndex.value + 1].uuid,
        page: 1,
      },
    });
    scrollToTop(80);
  };

  const handleAnyPage = (index) => {
    router.push({
      query: { chapter: currentChapter.value.uuid, page: index },
    });
    scrollToTop(80);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isRecent = (uuid, dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 14 * 24 * 60 * 60 * 1000 || uuid === latestChapter.value.uuid; // 14 天内和最新章
  };

  const isRead = computed(() => (uuid) => {
    return readChapterList.value.some((g) => g.uuid === uuid);
  });

  return {
    showModal,
    hasPrevious,
    hasNext,
    isRead,
    handleModalClose,
    handleFirstChapter,
    handleAnyChapter,
    handleRecentChapter,
    handlePrev,
    handleNext,
    handleAnyPage,
    formatDate,
    isRecent,
  };
}
