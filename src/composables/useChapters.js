import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useScrollTo } from "@/composables/useScrollTo";
import { useToast } from "@/composables/useToast";

import { useNovelStore } from "@/stores/novelStore";

export function useChapters() {
  const toast = useToast({ position: "center", closable: false });

  const { scrollToTop } = useScrollTo();

  const novelStore = useNovelStore();
  const {
    currentComponent,
    currentChapter,
    currentChapterUuid,
    currentChapterIndex,
    latestChapter,
    flatChapterList,
    readChapterList,
  } = storeToRefs(novelStore);

  const router = useRouter();

  const handleChapter = (uuid) => {
    router.push({
      query: { chapter: uuid, page: 1 },
    });
    scrollToTop(80);
  };

  const handleFirstChapter = () => {
    if (
      currentChapterIndex.value === 0 &&
      currentComponent.value === "Reader"
    ) {
      toast.info("已经是第一章啦！");
    } else {
      handleChapter("7d5e9b50-a9cb-428a-9264-903046354e22");
    }
  };

  const handleAnyChapter = (uuid) => {
    if (
      uuid === currentChapterUuid.value &&
      currentComponent.value === "Reader"
    ) {
      toast.info("已经是当前章啦！");
    } else {
      handleChapter(uuid);
    }
  };

  const handleRecentChapter = () => {
    if (
      latestChapter.value.uuid === currentChapterUuid.value &&
      currentComponent.value === "Reader"
    ) {
      toast.info("已经是最新章啦！");
    } else {
      handleChapter(latestChapter.value.uuid);
    }
  };

  const hasPrevious = computed(() => currentChapterIndex.value > 0);

  const hasNext = computed(
    () => currentChapterIndex.value + 1 < flatChapterList.value.length
  );

  const handlePrev = () => {
    handleChapter(flatChapterList.value[currentChapterIndex.value - 1].uuid);
  };

  const handleNext = () => {
    handleChapter(flatChapterList.value[currentChapterIndex.value + 1].uuid);
  };

  const handleAnyPage = (index) => {
    router.push({
      query: { chapter: currentChapter.value.uuid, page: index },
    });
    scrollToTop(80);
  };

  const isRecent = (uuid, dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 14 * 24 * 60 * 60 * 1000 || uuid === latestChapter.value.uuid; // 14 天内和最新章
  };

  const isRead = computed(() => (uuid) => {
    return readChapterList.value.some((g) => g.uuid === uuid);
  });

  return {
    hasPrevious,
    hasNext,
    isRead,
    handleFirstChapter,
    handleAnyChapter,
    handleRecentChapter,
    handlePrev,
    handleNext,
    handleAnyPage,
    isRecent,
  };
}
