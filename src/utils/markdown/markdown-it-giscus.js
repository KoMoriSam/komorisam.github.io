import ParaGiscus from "@/components/articles/ParaGiscus.vue";
import { h } from "vue";
import { useModal } from "@/composables/useModal";
import { onUnmounted } from "vue";

export const useParagraphComments = () => {
  const modal = useModal();
  let isListenerAdded = false;

  const handleCommentClick = (e) => {
    const trigger = e.target.closest(".comment-trigger");
    if (!trigger) return;

    e.preventDefault();
    e.stopPropagation();

    const paragraphId = trigger.dataset.paragraphId;
    if (!paragraphId) {
      console.error("No paragraphId found on trigger");
      return;
    }

    modal.info("当前段评", h(ParaGiscus, { paragraphId }));
  };

  const setupCommentTriggers = () => {
    if (isListenerAdded) return;

    // 使用capture阶段确保能捕获到事件
    document.addEventListener("click", handleCommentClick, true);
    isListenerAdded = true;

    // 添加清理逻辑
    onUnmounted(() => {
      document.removeEventListener("click", handleCommentClick, true);
      isListenerAdded = false;
    });
  };

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
        self
      ) {
        const paragraphId = `${uuid}-${page}-${idx}`;
        tokens[idx].attrSet("id", paragraphId);
        tokens[idx].attrSet("class", "group relative");
        return defaultRender(tokens, idx, options, env, self);
      };

      md.renderer.rules.paragraph_close = function (
        tokens,
        idx,
        options,
        env,
        self
      ) {
        const paragraphId = `${uuid}-${page}-${idx - 2}`;

        return `
          <button class="comment-trigger md:opacity-0 group-hover:opacity-100 transition-opacity btn btn-primary btn-circle btn-soft btn-xs text-xs absolute bottom-1 right-1" data-paragraph-id="${paragraphId}">
            <i class="ri-chat-3-line"></i>
          </button>
          </p>
        `;
      };
    };
  };

  setupCommentTriggers();

  return paragraphPlugin;
};
