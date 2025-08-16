import { useStorage } from "@vueuse/core";
import { h } from "vue";

import { useModal } from "@/composables/useModal";

const modal = useModal();

import { useDiscardStorage } from "@/utils/discard-storage";
import { useChangelogStore } from "@/stores/changelogStore";
import { typeColor, typeText } from "@/utils/type-changelog";

function UpdateDetail(props) {
  return h("section", { class: "prose prose-sm" }, [
    h("span", { class: "text-primary font-bold" }, props.version),
    h(
      "span",
      { class: "badge badge-xs text-base-content/50" },
      props.releaseDate,
      h("div", { class: "dropdown dropdown-center dropdown-hover" }, [
        h(
          "div",
          {
            role: "button",
            class: "btn btn-circle btn-ghost btn-xs text-info",
          },
          h("i", { class: "ri-information-line" })
        ),
        h(
          "div",
          {
            class:
              "card card-sm dropdown-content bg-base-100 rounded-box z-1 w-48 shadow-sm",
          },
          [
            h("div", { class: "card-body" }, [
              h(
                "h2",
                { class: "card-title mt-0 mb-0" },
                "想查看详细更新日志？"
              ),
              h(
                "a",
                {
                  href: "/changelog",
                  onClick: (e) => {
                    e.stopPropagation(); // 避免冒泡干扰弹窗
                    props.onViewLog?.(); // 调用传入的函数
                  },
                  class: "link link-primary no-underline",
                },
                ["点击此处", h("i", { class: "ri-arrow-right-up-line" })]
              ),
            ]),
          ]
        ),
      ])
    ),
    h(
      "ul",
      {
        class: `list-none p-0`,
      },
      Object.entries(props.changelog).map(([type, descriptions]) =>
        descriptions.map((description, index) =>
          h("li", { key: `${type}-${index}` }, [
            h(
              "strong",
              {
                class: `badge badge-soft badge-sm ${typeColor(type)}`,
              },
              typeText(type)
            ),
            " ",
            description,
          ])
        )
      )
    ),
    props.migration
      ? h("p", { class: "mt-3 text-sm" }, [
          h(
            "span",
            {
              class: [
                "badge badge-xs",
                props.warning ? "badge-warning" : "badge-success",
              ],
            },
            [
              h("i", {
                class: props.warning ? "ri-alert-line" : "ri-check-line",
              }),
              props.warning ? "请注意" : "放心食用",
            ]
          ),
          " ",
          props.note || props.warning,
        ])
      : null,
  ]);
}

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
