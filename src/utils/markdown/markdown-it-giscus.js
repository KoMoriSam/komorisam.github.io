import ParaGiscus from "@/components/articles/ParaGiscus.vue";
import { h } from "vue";
import { useModal } from "@/composables/useModal";
import { useGlobalEventListener } from "@/composables/useGlobalEventListener";

export const useParagraphComments = () => {
  const modal = useModal();
  const MAX_TITLE_LENGTH = 36;

  const handleCommentClick = (e) => {
    const trigger = e.target.closest(".comment-trigger");
    if (!trigger) return;

    e.preventDefault();
    e.stopPropagation();

    const paragraphId = trigger.dataset.paragraphId;
    if (!paragraphId) {
      console.error("段落 ID 未找到");
      return;
    }

    const paragraphElement = document.getElementById(paragraphId);
    const paragraphText = paragraphElement?.textContent?.trim() || "当前段评";
    const truncatedTitle =
      paragraphText.length > MAX_TITLE_LENGTH
        ? `${paragraphText.slice(0, MAX_TITLE_LENGTH)}...`
        : paragraphText;
    const titleNode = h("div", { class: "space-y-1" }, [
      h("p", { class: "text-xs font-medium opacity-60" }, "当前段评"),
      h(
        "p",
        { class: "text-sm font-semibold font-serif leading-snug break-all" },
        truncatedTitle,
      ),
    ]);

    modal.info(titleNode, h(ParaGiscus, { paragraphId }));
  };

  const { addEventListener } = useGlobalEventListener(
    "click",
    handleCommentClick,
    true,
  );

  const paragraphPlugin = (uuid, page) => {
    return (md) => {
      if (!md.renderer.rules) {
        md.renderer.rules = {};
      }

      const defaultRender =
        md.renderer.rules.paragraph_open ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options);
        };

      md.renderer.rules.paragraph_open = function (
        tokens,
        idx,
        options,
        env,
        self,
      ) {
        const paragraphId = `${uuid}-${page}-${idx}`;
        tokens[idx].attrSet("id", paragraphId);
        tokens[idx].attrSet("class", "group");
        tokens[idx].attrSet("tabindex", "0");
        return defaultRender(tokens, idx, options, env, self);
      };

      md.renderer.rules.paragraph_close = function (
        tokens,
        idx,
        options,
        env,
        self,
      ) {
        if (tokens[idx].hidden) {
          return "";
        }
        const paragraphId = `${uuid}-${page}-${idx - 2}`;

        return `<button class="comment-trigger" data-paragraph-id="${paragraphId}"><i class="ri-chat-3-line"></i></button></p>`;
      };
    };
  };

  addEventListener();

  return paragraphPlugin;
};
