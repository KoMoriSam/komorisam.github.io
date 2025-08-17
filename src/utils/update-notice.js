import { useStorage } from "@vueuse/core";
import { h } from "vue";

import { useModal } from "@/composables/useModal";

const modal = useModal();

import { useDiscardStorage } from "@/utils/discard-storage";
import { useChangelogStore } from "@/stores/changelogStore";
import UpdateDetail from "@/components/UpdateDetail.vue";

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
  const {
    date: releaseDate,
    changes: changelog,
    note: migrationNote,
  } = latestLog;

  const migration = migrationNote
    ? { required: true, note: migrationNote }
    : null;

  const updateVersion = () => {
    if (migration?.required) {
      useDiscardStorage();
    }
    currentVersion.value = latestVersion;
  };

  const description = h(UpdateDetail, {
    version: latestVersion,
    releaseDate,
    changelog,
    migration,
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
