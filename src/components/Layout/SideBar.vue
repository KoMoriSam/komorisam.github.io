<template>
  <section class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <section
      class="drawer-content flex flex-wrap h-full w-full items-start justify-center gap-4 lg:pr-16 pb-16 lg:pb-12"
    >
      <slot name="content"></slot>
    </section>
    <aside class="drawer-side">
      <label
        for="my-drawer-2"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul
        class="menu bg-base-200 text-base-content min-h-full p-4 w-80 md:w-96 items-center"
      >
        <aside class="flex-1 flex flex-col lg:sticky lg:top-12">
          <slot name="aside"></slot>
        </aside>
      </ul>
    </aside>
  </section>
</template>
