import { watch, onMounted, onActivated } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useNovelStore } from "@/stores/novelStore";

export function useChapterSetup() {
  const route = useRoute();
  const novelStore = useNovelStore();

  const { currentComponent } = storeToRefs(novelStore);

  // 监听路由参数变化
  const watchRouteParams = () => {
    watch(
      () => route.query.chapter,
      async (newId) => {
        if (newId !== novelStore.currentChapterUuid) {
          await novelStore.setChapter(newId);
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

  // 监听当前组件变化
  const watchCurrentComponent = () => {
    watch(
      () => currentComponent.value,
      () => {
        console.log("currentComponent changed:", currentComponent.value);
        novelStore.updateTitle();
      }
    );
  };

  // 初始化加载
  const initialize = async () => {
    try {
      await novelStore.setChapterList();
      if (route.query.chapter) {
        await novelStore.setChapter(route.query.chapter);
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
      () => [novelStore.currentChapterUuid, novelStore.currentChapterPage],
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
    watchCurrentComponent();
    handleActivation();
  };

  onMounted(initialize);

  return {
    setupWatchers,
  };
}
