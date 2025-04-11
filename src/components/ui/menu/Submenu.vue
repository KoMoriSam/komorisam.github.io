<template>
  <section class="menu w-fit">
    <ul>
      <li>
        <details open>
          <summary class="font-bold text-xl flex">
            {{ title }}
            <slot name="btn"></slot>
          </summary>

          <ul>
            <slot></slot>
          </ul>
        </details>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({ title: String });
</script>
