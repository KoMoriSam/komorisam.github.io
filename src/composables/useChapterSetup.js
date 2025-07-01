import { watch, onMounted, onActivated, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useNovelStore } from "@/stores/novelStore";

import { useToast } from "@/composables/useToast";

import { scrollToHash } from "@/utils/scrollto-hash";

export function useChapterSetup() {
  const route = useRoute();
  const router = useRouter();

  const toast = useToast({ closable: false, position: "center" });

  const novelStore = useNovelStore();

  const {
    currentComponent,
    currentChapterUuid,
    currentChapterPage,
    isLoadingContent,
  } = storeToRefs(novelStore);

  // 检查并补充路由参数
  const checkAndSupplementRouteParams = () => {
    watch(
      () => currentComponent.value,
      async (newComponent) => {
        if (newComponent !== "Reader") return;
        if (route.query.chapter) {
          await novelStore.setChapter(route.query.chapter);
          if (route.query.page) {
            novelStore.setPage(Number(route.query.page));
          } else {
            novelStore.setPage(1);
          }
          toast.success("已继续上次阅读！");
          return;
        }
        if (!route.query.chapter) {
          if (currentChapterUuid.value) {
            toast.success("已继续上次阅读！");
            router.push({
              query: {
                chapter: currentChapterUuid.value,
                page: currentChapterPage.value,
              },
            });
            return;
          }
        }
      },
      { immediate: true }
    );
  };

  // 监听路由参数变化
  const watchRouteParams = () => {
    watch(
      () => route.query.chapter,
      async (newId) => {
        if (newId) {
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
      await novelStore.setChapters();
      checkAndSupplementRouteParams();
      novelStore.updateTitle();
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

  const watchHash = () => {
    watch(
      () => isLoadingContent.value,
      async (loading) => {
        if (!loading) {
          await nextTick();
          scrollToHash();
        }
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
    watchHash();
    handleActivation();
  };

  onMounted(() => {
    initialize();
  });

  return {
    setupWatchers,
  };
}
