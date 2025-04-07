<template>
  <Menu title="正文字体">
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
  </Menu>

  <Menu title="字体大小">
    <NumberController
      v-model="novelStore.styleConfigs.fontSize"
      :step="1"
      :places="0"
      :min="16"
      :max="32"
    />
  </Menu>

  <Menu title="字间距">
    <NumberController
      v-model="novelStore.styleConfigs.fontGap"
      :step="0.01"
      :places="2"
      :min="-1"
      :max="1"
    />
  </Menu>

  <Menu title="行间距">
    <NumberController
      v-model="novelStore.styleConfigs.lineHeight"
      :step="0.1"
      :places="1"
      :min="1"
      :max="3"
    />
  </Menu>

  <Menu title="段间距">
    <NumberController
      v-model="novelStore.styleConfigs.paraHeight"
      :step="0.1"
      :places="1"
      :min="1"
      :max="3"
    />
  </Menu>

  <button
    class="btn btn-info btn-wide mt-4"
    @click="novelStore.setDefaultStyle()"
  >
    恢复默认值
  </button>
</template>

<script setup>
import { ref } from "vue";
import { useNovelStore } from "@/stores/novel";

import Menu from "@/components/ui/menu/Menu.vue";
import NumberController from "@/components/ui/input/NumberController.vue";

const novelStore = useNovelStore();

const fontList = ref([
  { name: "宋体", style: "font-song" },
  { name: "黑体", style: "font-hei" },
  { name: "楷书", style: "font-kai" },
  { name: "仿宋", style: "font-fang" },
]);

console.log(novelStore.styleConfigs.fontSize);
</script>
