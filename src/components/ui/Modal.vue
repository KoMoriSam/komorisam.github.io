<template>
  <dialog
    v-if="visible"
    class="modal modal-bottom sm:modal-middle"
    :open="visible"
    @keydown.esc="handleSubmit"
  >
    <section ref="modalRef" class="modal-box">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <section class="py-4">
        <slot name="description">
          <p>{{ description }}</p>
          <!-- fallback -->
        </slot>
      </section>
      <form class="modal-action" method="dialog" @submit.prevent="handleSubmit">
        <button class="btn" type="submit">
          {{ buttonText }}
        </button>
      </form>
    </section>
  </dialog>
</template>

<script setup>
import { ref, h } from "vue";
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
  title: {
    type: String,
    default: "Hello!",
  },
  description: {
    type: [String, Object],
    default: h("p", "这是一个默认的描述文本。"),
  },
  buttonText: {
    type: String,
    default: "关闭",
  },
  visible: {
    // 添加 visible prop
    type: Boolean,
    default: false,
  },
  onSubmit: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits(["close"]);

const modalRef = ref(null);

// 关闭Modal
const close = () => {
  emit("close");
};

// 处理提交
const handleSubmit = () => {
  props.onSubmit();
  close();
};

// 点击外部关闭
onClickOutside(modalRef, () => {
  handleSubmit();
});

// 暴露方法给父组件
defineExpose({
  close,
});
</script>
