<template>
  <li v-for="link in navLinks" :key="link.routeName">
    <router-link
      :to="link.to"
      class="btn m-1 lg:m-1.5"
      :class="route.name === link.to.name ? 'btn-primary' : 'btn-ghost'"
    >
      <i :class="link.icon"></i>
      {{ link.name }}
    </router-link>
  </li>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useNovelStore } from "@/stores/novelStore";

const route = useRoute();

// 状态管理
const novelStore = useNovelStore();

import { computed } from "vue";

const navLinks = computed(() => [
  {
    name: "主页",
    icon: "ri-home-5-line lg:text-xl",
    to: { name: "home" },
  },
  {
    name: "小说",
    icon: "ri-book-3-line lg:text-xl",
    to: { name: "novel" },
  },
  {
    name: "联系",
    icon: "ri-discuss-line lg:text-xl",
    to: { name: "contact" },
  },
  {
    name: "关于",
    icon: "ri-contacts-line lg:text-xl",
    to: { name: "about" },
  },
]);
</script>
