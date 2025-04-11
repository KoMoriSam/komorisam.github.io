<template>
  <label
    :class="[
      'lg:btn lg:btn-soft lg:btn-square lg:btn-lg lg:drawer-button lg:z-1 lg:fixed lg:shadow-sm lg:right-6',
      positionClasses,
      buttonClass,
    ]"
    @click="onClick"
    :aria-label="label"
  >
    <div class="lg:tooltip lg:tooltip-left" :data-tip="label">
      <i :class="['m-4', icon]"></i>
    </div>
    <span class="dock-label lg:hidden">{{ label }}</span>
  </label>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  positionClasses: {
    type: String,
    default: "",
  },
  buttonClass: {
    type: String,
    default: "lg:btn-primary",
  },
  onClick: {
    type: Function,
    required: true,
  },
});
</script>
