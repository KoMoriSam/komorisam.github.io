<template>
  <dialog class="modal modal-bottom sm:modal-middle" :open="visible">
    <section class="modal-box">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <section class="py-4" v-html="description"></section>
      <form class="modal-action" method="dialog" @submit.prevent="handleSubmit">
        <button class="btn" type="submit">{{ buttonText }}</button>
      </form>
    </section>
  </dialog>
</template>

<script setup>
const props = defineProps({
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
  onSubmit: {
    type: Function,
    default: () => {},
  },
});

const handleSubmit = () => {
  props.onSubmit();
};
</script>
