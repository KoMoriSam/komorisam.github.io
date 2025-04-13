import { watch, onMounted, onActivated } from "vue";
import { useRoute } from "vue-router";

import { useNovelStore } from "@/stores/novel";

export function useChapterSetup() {
  const route = useRoute();
  const novelStore = useNovelStore();

  // 监听路由参数变化
  const watchRouteParams = () => {
    watch(
      () => route.query.chapter,
      async (newId) => {
        if (newId !== novelStore.currentChapterId.value) {
          await novelStore.setChapter(Number(newId));
        }
      }
    );

    watch(
      () => route.query.page,
      (newPage) => {
        if (newPage) {
          novelStore.setPage(Number(newPage));
        }
      }
    );
  };

  // 初始化加载
  const initialize = async () => {
    try {
      await novelStore.setChapterList();
      if (route.query.chapter) {
        await novelStore.setChapter(Number(route.query.chapter));
      }
      novelStore.updateTitle();
      if (route.query.page) {
        novelStore.setPage(Number(route.query.page));
      }
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  };

  // 监听章节变化，自动更新标题
  const watchChapterChanges = () => {
    watch(
      () => [
        novelStore.currentChapterId.value,
        novelStore.currentChapterPage.value,
      ],
      () => {
        novelStore.updateTitle();
      }
    );
  };

  // 在组件挂载或激活时重新更新标题
  const handleActivation = () => {
    onActivated(() => {
      novelStore.updateTitle();
    });
  };

  // 调用所有监听和初始化逻辑
  const setupWatchers = () => {
    watchRouteParams();
    watchChapterChanges();
    handleActivation();
  };

  onMounted(initialize);

  return {
    setupWatchers,
  };
}
