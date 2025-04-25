import { useStorage } from "@vueuse/core";
import { createApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { useModal } from "@/composables/useModal";

const modal = useModal();

import { useCleanStorage } from "@/utils/clean-storage";
import { useChangelogStore } from "@/stores/changelogStore";
import { typeColor, typeText } from "@/utils/type-changelog";

function UpdateDetail(props) {
  return h("section", { class: "prose prose-sm" }, [
    h("h4", { class: "mt-0" }, [
      h("span", { class: "text-primary" }, props.version),
      " ",
      props.title,
      " ",
      h(
        "span",
        { class: "badge badge-xs text-base-content/50" },
        props.releaseDate
      ),
      h("div", { class: "dropdown dropdown-end md:dropdown-center" }, [
        h(
          "div",
          {
            tabindex: "0",
            role: "button",
            class: "btn btn-circle btn-ghost btn-xs text-info",
          },
          h("i", { class: "ri-information-line" })
        ),
        h(
          "div",
          {
            tabindex: "0",
            class:
              "card card-sm dropdown-content bg-base-100 rounded-box z-1 w-48 shadow-sm",
          },
          [
            h("div", { tabindex: "0", class: "card-body" }, [
              h(
                "h2",
                { class: "card-title mt-0 mb-0" },
                "想查看详细更新日志？"
              ),
              h(
                "a",
                {
                  target: "_blank",
                  href: "/changelog",
                  class: "link link-primary no-underline",
                },
                ["点击此处", h("i", { class: "ri-arrow-right-up-line" })]
              ),
            ]),
          ]
        ),
      ]),
    ]),
    h(
      "ul",
      props.changelog.map((change, index) =>
        h("li", { key: index }, [
          h(
            "strong",
            {
              class: `badge badge-soft badge-sm ${typeColor(change.type)}`,
            },
            typeText(change.type)
          ),
          " ",
          change.description,
          change.impact
            ? h("span", { class: "ml-2" }, [
                h(
                  "span",
                  { class: "badge badge-xs text-base-content/50" },
                  `影响 ${change.impact}`
                ),
              ])
            : null,
        ])
      )
    ),
    props.migration
      ? h("p", { class: "mt-3 text-sm" }, [
          h(
            "span",
            {
              class: [
                "badge badge-xs",
                props.migration.required ? "badge-warning" : "badge-success",
              ],
            },
            [
              h("i", {
                class: props.migration.required
                  ? "ri-alert-line"
                  : "ri-check-line",
              }),
              props.migration.required ? "包含迁移操作" : "无迁移操作",
            ]
          ),
          " ",
          props.migration.note || "",
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

  modal.show({
    title: "新版本更新！",
    description: description,
    buttonText: "我知道了",
    onSubmit: () => {
      updateVersion();
    },
  });
}
