<template>
  <input
    type="range"
    :min="min"
    :max="max"
    :step="step"
    class="range range-info join-item text-center"
    :value="modelValue"
    @input="updateValue($event.target.value)"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: Number, // v-model 绑定的值
  step: { type: Number, default: 1 },
  places: { type: Number, default: 2 },
  min: Number, // 可选最小值
  max: Number, // 可选最大值
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (val) => {
  let num = parseFloat(val);
  if (isNaN(num)) num = props.min !== undefined ? props.min : 0;

  emit("update:modelValue", num);
};
</script>
