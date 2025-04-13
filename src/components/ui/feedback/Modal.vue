<template>
  <dialog
    id="my_modal_5"
    class="modal modal-bottom sm:modal-middle"
    :open="visible"
  >
    <section class="modal-box">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <p class="py-4">按下 ESC 键或点击按钮以关闭</p>
      <form class="modal-action" method="dialog" @submit.prevent="closeModal">
        <button class="btn">关闭</button>
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
