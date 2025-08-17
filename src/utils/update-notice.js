import { useStorage } from "@vueuse/core";
import { h } from "vue";

import UpdateDetail from "@/components/UpdateDetail.vue";

import { useModal } from "@/composables/useModal";
const modal = useModal();

import { useChangelogStore } from "@/stores/changelogStore";

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
  const { date, changes, note, warning } = latestLog;

  console.log("latestLog", latestLog);

  const updateVersion = () => {
    currentVersion.value = latestVersion;
  };

  const description = h(UpdateDetail, {
    version: latestVersion,
    date,
    changes,
    note,
    warning,
    onViewLog: updateVersion,
  });

  modal.show({
    title: "新版本更新！",
    description: description,
    buttonText: "我知道了",
    onSubmit: () => {
      updateVersion();
    },
  });
}
