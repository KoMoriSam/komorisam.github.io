<template>
  <StyleMenu title="正文字体" configKey="fontStyle">
    <div class="join">
      <button
        v-for="font in fontList"
        :key="font"
        class="btn btn-info join-item"
        :class="`${font.style} ${
          novelStore.styleConfigs.fontStyle === font.style ? '' : 'btn-soft'
        }`"
        @click="novelStore.setStyle('fontStyle', font.style)"
      >
        {{ font.name }}
      </button>
    </div>
  </StyleMenu>

  <StyleMenu title="字体大小" configKey="fontSize">
    <NumberController
      v-model="novelStore.styleConfigs.fontSize"
      :step="1"
      :places="0"
      :min="16"
      :max="32"
    />
  </StyleMenu>

  <StyleMenu title="字间距" configKey="fontGap">
    <NumberController
      v-model="novelStore.styleConfigs.fontGap"
      :step="0.01"
      :places="2"
      :min="-1"
      :max="1"
    />
  </StyleMenu>

  <StyleMenu title="行间距" configKey="lineHeight">
    <NumberController
      v-model="novelStore.styleConfigs.lineHeight"
      :step="0.1"
      :places="1"
      :min="1"
      :max="3"
    />
  </StyleMenu>

  <StyleMenu title="段间距" configKey="paraHeight">
    <NumberController
      v-model="novelStore.styleConfigs.paraHeight"
      :step="0.1"
      :places="1"
      :min="1"
      :max="3"
    />
  </StyleMenu>
</template>

<script setup>
import { ref } from "vue";
import { useNovelStore } from "@/stores/novel";

import StyleMenu from "@/components/novel/StyleMenu.vue";
import NumberController from "@/components/ui/input/NumberController.vue";

const novelStore = useNovelStore();

const fontList = ref([
  { name: "宋体", style: "font-song" },
  { name: "黑体", style: "font-hei" },
  { name: "楷书", style: "font-kai" },
  { name: "仿宋", style: "font-fang" },
]);
</script>
