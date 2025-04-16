<template>
  <dialog
    id="my_modal_5"
    class="modal modal-bottom sm:modal-middle"
    :open="visible"
  >
    <section class="modal-box">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <p class="py-4" v-html="description"></p>
      <form class="modal-action" method="dialog" @submit.prevent="closeModal">
        <button class="btn">{{ buttonText }}</button>
      </form>
    </section>
  </dialog>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Hello!",
  },
  description: {
    type: String,
    default: "按下 <kbd class='kbd'>ESC</kbd> 键或点击按钮以关闭。",
  },
  buttonText: {
    type: String,
    default: "关闭",
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};
</script>
