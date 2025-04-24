<template>
  <StyleMenu title="正文字体" configKey="fontStyle">
    <div class="join">
      <button
        v-for="font in FONTS"
        :key="font.style"
        :class="{
          'btn btn-info join-item': true,
          [font.style]: true,
          'btn-soft': styleConfigs.fontStyle !== font.style,
        }"
        @click="store.setStyle('fontStyle', font.style)"
      >
        {{ font.name }}
      </button>
    </div>
  </StyleMenu>

  <StyleMenu title="字体大小" configKey="fontSize">
    <NumberController
      :modelValue="styleConfigs.fontSize"
      :step="1"
      :places="0"
      :min="16"
      :max="32"
      @update:modelValue="(val) => store.setStyle('fontSize', val)"
    />
  </StyleMenu>

  <StyleMenu title="字间距" configKey="fontGap">
    <NumberController
      :modelValue="styleConfigs.fontGap"
      :step="0.01"
      :places="2"
      :min="-1"
      :max="1"
      @update:modelValue="(val) => store.setStyle('fontGap', val)"
    />
  </StyleMenu>

  <StyleMenu title="行间距" configKey="lineHeight">
    <NumberController
      :modelValue="styleConfigs.lineHeight"
      :step="0.1"
      :places="1"
      :min="1"
      :max="3"
      @update:modelValue="(val) => store.setStyle('lineHeight', val)"
    />
  </StyleMenu>

  <StyleMenu title="段间距" configKey="paraHeight">
    <NumberController
      :modelValue="styleConfigs.paraHeight"
      :step="0.1"
      :places="1"
      :min="1"
      :max="3"
      @update:modelValue="(val) => store.setStyle('paraHeight', val)"
    />
  </StyleMenu>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useReaderStore } from "@/stores/readerStore";
import { FONTS } from "@/constants/reader";

import StyleMenu from "@/components/novel/StyleMenu.vue";
import NumberController from "@/components/ui/input/NumberController.vue";

const store = useReaderStore();
const { styleConfigs } = storeToRefs(store);
</script>
