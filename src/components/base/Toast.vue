<!-- src/components/Toast.vue -->
<template>
  <div v-if="toasts.length > 0" class="toast z-[1000]" :class="positionClass">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="alert transition-opacity duration-300 shadow-sm"
        :class="[
          `alert-${toast.type}`,
          {
            'alert-soft': toast.soft !== false,
            'opacity-0': toast.fading,
          },
        ]"
      >
        <i v-if="toast.icon" :class="toast.icon"></i>
        <span class="flex-1">{{ toast.message }}</span>
        <button
          v-if="toast.closable"
          class="btn btn-circle btn-ghost btn-xs ml-2"
          @click="handleClose(toast)"
        >
          <i class="ri-close-line"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { TOAST_POSITIONS, DEFAULT_POSITION } from "@/constants/toast";

const props = defineProps({
  toasts: {
    type: Array,
    required: true,
    default: () => [],
  },
  position: {
    type: String,
    default: DEFAULT_POSITION,
  },
});

const emit = defineEmits(["remove"]);

const positionClass = computed(() => {
  return TOAST_POSITIONS[props.position] || props.position;
});

const handleClose = (toast) => {
  emit("remove", toast.id, toast.position || props.position);
};
</script>
