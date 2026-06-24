<template>
  <section class="menu w-full min-w-0 p-0">
    <ul class="w-full min-w-0">
      <li class="min-w-0">
        <details open class="min-w-0">
          <summary class="flex min-w-0 items-center gap-2 text-xl font-bold">
            <span class="min-w-0 flex-1 truncate">
              {{ title }}
            </span>

            <span class="flex shrink-0 items-center gap-1" @click.stop>
              <slot name="btn"></slot>
            </span>
          </summary>

          <ul class="min-w-0">
            <slot></slot>
          </ul>
        </details>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  title: String,
});
</script>
