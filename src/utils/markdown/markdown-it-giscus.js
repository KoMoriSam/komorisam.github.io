import ParaGiscus from "@/components/reader/ParaGiscus.vue";
import { h } from "vue";
import { useModal } from "@/composables/useModal";
import { useGlobalEventListener } from "@/composables/useGlobalEventListener";
import { useParagraphCommentsStorage } from "@/utils/storage/new-paragraph-comments";

export const useParagraphComments = () => {
  const modal = useModal();
  const MAX_TITLE_LENGTH = 36;
  const { getCount, setCount } = useParagraphCommentsStorage();

  const updateCountIndicators = (paragraphId, sourceType, count) => {
    const indicators = document.querySelectorAll(
      ".comment-trigger .paragraph-comment-count",
    );

    indicators.forEach((node) => {
      if (
        node.dataset.paragraphId !== paragraphId ||
        node.dataset.sourceType !== sourceType
      ) {
        return;
      }

      if (count > 0) {
        node.classList.remove("hidden");
        node.textContent = `${count}`;
        node.closest(".comment-trigger")?.classList.add("has-count");
      } else {
        node.classList.add("hidden");
        node.textContent = "";
        node.closest(".comment-trigger")?.classList.remove("has-count");
      }
    });
  };

  const handleCommentClick = (e) => {
    const trigger = e.target.closest("[data-paragraph-id]");
    if (!trigger) return;

    e.preventDefault();
    e.stopPropagation();

    const paragraphId = trigger.dataset.paragraphId;
    const sourceType = trigger.dataset.sourceType || "article";
    if (!paragraphId) {
      console.error("段落 ID 未找到");
      return;
    }

    const paragraphElement = document.getElementById(paragraphId);
    let paragraphText = "当前段评";

    if (paragraphElement) {
      const clonedElement = paragraphElement.cloneNode(true);
      clonedElement
        .querySelectorAll(".comment-trigger")
        .forEach((element) => element.remove());
      paragraphText = clonedElement.textContent?.trim() || "当前段评";
    }
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

    modal.info(titleNode, h(ParaGiscus, { paragraphId, sourceType }));
  };

  const handleParagraphMetadata = (event) => {
    const paragraphId = event?.detail?.paragraphId;
    const sourceType = event?.detail?.sourceType || "article";
    const count = Number(event?.detail?.totalCommentCount ?? 0);

    if (!paragraphId || !Number.isFinite(count)) {
      return;
    }

    setCount(paragraphId, count, sourceType);
    updateCountIndicators(paragraphId, sourceType, count);
  };

  const { addEventListener } = useGlobalEventListener(
    "click",
    handleCommentClick,
    true,
  );

  const { addEventListener: addParagraphMetadataListener } =
    useGlobalEventListener(
      "paragraph-comment-metadata",
      handleParagraphMetadata,
      false,
    );

  const paragraphPlugin = (uuid, page, sourceType = "article") => {
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
        const count = getCount(paragraphId, sourceType);
        const countClass =
          count > 0
            ? "paragraph-comment-count"
            : "paragraph-comment-count hidden";
        const triggerClass =
          count > 0 ? "comment-trigger has-count" : "comment-trigger";

        return `<button class="${triggerClass}" data-paragraph-id="${paragraphId}" data-source-type="${sourceType}" aria-label="打开段评"><i class="ri-chat-3-line"></i><span class="${countClass}" data-paragraph-id="${paragraphId}" data-source-type="${sourceType}" aria-label="当前段评评论数">${count > 0 ? `${count}` : ""}</span></button></p>`;
      };
    };
  };

  addEventListener();
  addParagraphMetadataListener();

  return paragraphPlugin;
};
