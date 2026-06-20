<template>
  <Giscus
    :key="paragraphId"
    :repo="GISCUS.repo"
    :repo-id="GISCUS.repoId"
    :category="GISCUS.categories.ideas.name"
    :category-id="GISCUS.categories.ideas.id"
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

import CONFIG from "@/constants/config";
const { GISCUS } = CONFIG;

const themeStore = useThemeStore();
const { giscusTheme } = storeToRefs(themeStore);

const props = defineProps({
  paragraphId: {
    type: String,
    required: true,
  },
});
</script>
