<template>
  <section class="flex justify-between gap-2">
    <a
      :class="['btn justify-start font-bold flex-2', additionalClasses]"
      @click="onClick"
    >
      <span class="badge badge-sm mr-4">
        {{ badgeText }}
      </span>
      {{ content }}
    </a>
    <slot></slot>
  </section>
</template>

<script setup>
const props = defineProps({
  badgeText: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  additionalClasses: {
    type: String,
    default: "",
  },
  onClick: {
    type: Function,
    default: null,
  },
});
</script>
