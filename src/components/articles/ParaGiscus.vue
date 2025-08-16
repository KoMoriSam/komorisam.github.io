<template>
  <Giscus
    :key="paragraphId"
    repo="KoMoriSam/komorisam.github.io"
    repo-id="R_kgDOJxn8KA"
    category="Ideas"
    category-id="DIC_kwDOJxn8KM4Cnp6p"
    mapping="specific"
    :term="paragraphId"
    strict="0"
    reactions-enabled="1"
    emit-metadata="1"
    input-position="bottom"
    :theme="giscusTheme"
    lang="zh-CN"
    loading="lazy"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import Giscus from "@giscus/vue";
import { useThemeStore } from "@/stores/themeStore";

const themeStore = useThemeStore();
const { giscusTheme } = storeToRefs(themeStore);

const props = defineProps({
  paragraphId: {
    type: String,
    required: true,
  },
});
</script>
