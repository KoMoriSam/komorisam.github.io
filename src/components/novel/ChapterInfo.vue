<template>
  <ul>
    <li
      :class="['btn text-left justify-start font-bold', additionalClasses]"
      @click="onClick"
    >
      <span class="badge badge-sm mr-4">
        {{ badgeText }}
      </span>
      {{ content }}
    </li>
  </ul>
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
