<template>
  <section class="prose prose-sm">
    <h2 class="text-primary font-black">
      {{ props.version }}
      <span class="badge badge-xs text-base-content/50 ml-1">
        {{ props.date }}
      </span>
      <div class="dropdown dropdown-center dropdown-hover">
        <div role="button" class="btn btn-circle btn-ghost btn-xs text-info">
          <i class="ri-information-line"></i>
        </div>
        <div
          class="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-48 shadow-sm"
        >
          <section class="card-body">
            <h2 class="card-title mt-0 mb-0">想查看详细更新日志？</h2>
            <a
              href="/changelog"
              @click.stop="handleViewLog"
              class="link link-primary no-underline"
            >
              点击此处<i class="ri-arrow-right-up-line"></i>
            </a>
          </section>
        </div>
      </div>
    </h2>

    <ul class="list-none p-0">
      <template
        v-for="([type, descriptions], typeIndex) in Object.entries(
          props.changes
        )"
        :key="typeIndex"
      >
        <li
          v-for="(description, descIndex) in descriptions"
          :key="`${type}-${descIndex}`"
        >
          <strong
            :class="`badge badge-soft badge-sm font-bold ${typeColor(type)}`"
          >
            {{ typeText(type) }}
          </strong>
          {{ description }}
        </li>
      </template>
    </ul>

    <p v-if="props.migration" class="mt-3 text-sm">
      <span
        :class="[
          'badge badge-xs',
          props.warning ? 'badge-warning' : 'badge-success',
        ]"
      >
        <i :class="props.warning ? 'ri-alert-line' : 'ri-check-line'"></i>
        {{ props.warning ? "请注意" : "放心食用" }}
      </span>
      {{ props.note || props.warning }}
    </p>
  </section>
</template>

<script setup>
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

import { typeColor, typeText } from "@/utils/type-changelog";
</script>
