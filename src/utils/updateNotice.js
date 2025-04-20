import { useStorage } from "@vueuse/core";
import { createApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import UpdateDetail from "@/components/UpdateDetail.vue";

import { showMsg } from "@/utils/showMsg";
import { useCleanStorage } from "@/utils/cleanStorage";

import { useChangelogStore } from "@/stores/changelog";

export async function checkUpdateNotice() {
  const VERSION_KEY = "APP_VERSION";
  const currentVersion = useStorage(VERSION_KEY, "0.0.0");
  const changelogStore = useChangelogStore();

  // 获取 changelog 数据
  await changelogStore.fetchChangelog();

  if (Object.keys(changelogStore.data).length === 0) return;

  const latestVersion = changelogStore.getLatestVersion();
  if (!latestVersion || latestVersion === currentVersion.value) return;

  const latestLog = changelogStore.getVersionInfo(latestVersion);
  const { title, releaseDate, migration, changelog: changes } = latestLog;

  const updateVersion = () => {
    if (migration?.required) {
      useCleanStorage();
    }
    currentVersion.value = latestVersion;
  };

  const app = createApp({
    render() {
      return h(UpdateDetail, {
        version: latestVersion,
        releaseDate,
        title,
        changelog: changes,
        migration,
      });
    },
  });

  const description = await renderToString(app);

  showMsg("新版本更新！", description, {
    buttonText: "我知道了",
    onSubmit: updateVersion,
  });
}
