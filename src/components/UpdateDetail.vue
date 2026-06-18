<template>
  <section class="prose prose-sm">
    <h2 class="text-primary font-black">
      {{ props.version }}
      <span class="badge badge-xs text-base-content/50 ml-1">
        {{ props.date }}
      </span>
    </h2>

    <ul class="list-none p-0">
      <li
        v-for="(item, index) in displayedItems"
        :key="index"
        class="grid grid-cols-[auto_1fr] gap-2 items-start"
      >
        <strong
          :class="`badge badge-soft badge-sm font-bold badge-${typeColor(item.type)} text-${typeColor(item.type)} translate-y-0.5`"
        >
          {{ typeText(item.type) }}
        </strong>
        {{ item.desc }}
      </li>
      <li v-if="remainingCount > 0" class="text-base-content/50 pt-1">
        <a
          href="/changelog"
          target="_blank"
          @click.stop="handleViewLog"
          class="btn btn-sm btn-outline no-underline"
        >
          <i class="ri-eye-line mr-1"></i>
          查看完整更新日志
          <i class="ri-arrow-right-up-line"></i>
        </a>
      </li>
    </ul>

    <p
      v-if="props.note || props.warning"
      class="mt-3 text-sm grid grid-cols-[auto_1fr] gap-2 items-start"
    >
      <span
        :class="[
          'badge badge-xs mr-1',
          props.warning ? 'badge-warning' : 'badge-success',
        ]"
      >
        <i :class="props.warning ? 'ri-alert-line' : 'ri-check-line'"></i>
        {{ props.warning ? "请注意" : "放心食用" }}
      </span>
      <span v-if="props.note" class="text-base-content/50 text-xs">
        {{ props.note }}
      </span>
      <span v-if="props.warning" class="text-warning text-xs">
        {{ props.warning }}
      </span>
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { typeColor, typeText } from "@/utils/type-changelog";

const MAX_VISIBLE = 8;

const props = defineProps({
  version: String,
  date: String,
  changes: Object,
  warning: String,
  note: String,
  onViewLog: Function,
});

const handleViewLog = (e) => {
  props.onViewLog?.();
};

const allItems = computed(() => {
  const items = [];
  if (props.changes) {
    for (const [type, descriptions] of Object.entries(props.changes)) {
      for (const desc of descriptions) {
        items.push({ type, desc });
      }
    }
  }
  return items;
});

const displayedItems = computed(() => allItems.value.slice(0, MAX_VISIBLE));

const remainingCount = computed(() => allItems.value.length - MAX_VISIBLE);
</script>
