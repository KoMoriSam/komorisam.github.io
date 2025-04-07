<template>
  <main class="menu w-fit">
    <ul>
      <li>
        <details open>
          <summary class="font-bold text-xl">{{ title }}</summary>
          <ul>
            <slot></slot>
          </ul>
        </details>
      </li>
    </ul>
  </main>
</template>

<script setup>
const props = defineProps({ title: String });
</script>
