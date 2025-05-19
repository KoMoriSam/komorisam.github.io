import { computed } from "vue";

export const useNovelGetters = (state) => {
  const isRecent = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 14 * 24 * 60 * 60 * 1000; // 14 天内
  };

  return {
    currentChapter: computed(() => {
      return state.flatChapters.value.find(
        (chapter) => chapter.uuid === state.currentChapterUuid.value
      );
    }),

    currentChapterIndex: computed(() => {
      return state.flatChapters.value.findIndex(
        (chapter) => chapter.uuid === state.currentChapterUuid.value
      );
    }),

    latestChapter: computed(() => {
      const recentChapters = state.flatChapters.value.filter((chapter) =>
        isRecent(chapter.date)
      );

      if (recentChapters.length > 0) {
        return recentChapters[recentChapters.length - 1];
      }

      return state.flatChapters.value[state.flatChapters.value.length - 1];
    }),

    totalPages: computed(() => {
      const content = state.currentChapterContent.value;
      return content.length;
    }),

    currentPageContent: computed(
      () =>
        state.currentChapterContent.value[state.currentChapterPage.value - 1] ||
        ""
    ),
  };
};
