<template>
  <section class="flex justify-between gap-2">
    <a
      :class="[
        'btn justify-start font-bold flex-2 gap-2 md:gap-4 truncate group',
        additionalClasses,
      ]"
      @click="onClick"
    >
      <!-- <span class="badge badge-secondary badge-xs group-hover:badge-soft">
        {{ badge }}
      </span> -->
      <i class="ri-star-fill text-2xl md:text-lg"></i>
      <slot name="content"></slot>
    </a>
    <slot name="aside"></slot>
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
