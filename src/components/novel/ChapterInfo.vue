<template>
  <section class="flex justify-between gap-2">
    <a
      :class="[
        'btn justify-start font-bold flex-2 gap-2 md:gap-4 truncate',
        additionalClasses,
      ]"
      @click="onClick"
    >
      <span class="badge badge-sm">
        {{ badge }}
      </span>
      {{ content }}
    </a>
    <slot></slot>
  </section>
</template>

<script setup>
defineProps({
  badge: {
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
