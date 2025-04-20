<template>
  <section class="prose prose-sm">
    <h4 class="mt-0">
      <span class="text-primary">{{ version }}</span>
      {{ title }}
      <span class="badge badge-xs text-base-content/50">
        {{ releaseDate }}
      </span>
      <div class="dropdown dropdown-end md:dropdown-center">
        <div
          tabindex="0"
          role="button"
          class="btn btn-circle btn-ghost btn-xs text-info"
        >
          <i class="ri-information-line"></i>
        </div>
        <div
          tabindex="0"
          class="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-48 shadow-sm"
        >
          <div tabindex="0" class="card-body">
            <h2 class="card-title mt-0 mb-0">想查看详细更新日志？</h2>
            <a
              target="_blank"
              href="/changelog"
              class="link link-primary no-underline"
            >
              点击此处
              <i class="ri-arrow-right-up-line"></i>
            </a>
          </div>
        </div>
      </div>
    </h4>
    <ul>
      <li v-for="(change, index) in changelog" :key="index">
        <strong
          class="badge badge-soft badge-sm"
          :class="typeColor(change.type)"
        >
          {{ change.type }}
        </strong>
        {{ change.description }}
        <span v-if="change.impact" class="ml-2">
          <span class="badge badge-xs text-base-content/50">
            影响 {{ change.impact }}
          </span>
        </span>
      </li>
    </ul>

    <p v-if="migration" class="mt-3 text-sm">
      <span
        :class="[
          'badge badge-xs',
          migration.required ? 'badge-warning' : 'badge-success',
        ]"
      >
        <i :class="migration.required ? 'ri-alert-line' : 'ri-check-line'"></i>
        {{ migration.required ? "包含迁移操作" : "无迁移操作" }}
      </span>
      {{ migration.note || "" }}
    </p>
  </section>
</template>

<script setup>
defineProps({
  version: { type: String, required: true },
  title: { type: String, required: true },
  releaseDate: { type: String, required: true },
  changelog: { type: Array, required: true },
  migration: { type: Object, default: () => ({}) },
});

function typeColor(type) {
  switch (type) {
    case "feature":
      return "badge-warning";
    case "bugfix":
      return "badge-error";
    case "ui":
      return "badge-secondary";
    case "performance":
      return "badge-success";
    case "refactor":
      return "badge-primary";
    default:
      return "badge-info";
  }
}
</script>
