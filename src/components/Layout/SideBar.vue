<template>
  <section class="drawer lg:drawer-open">
    <input id="novel-sidebar" type="checkbox" class="drawer-toggle" />
    <section
      class="drawer-content flex flex-wrap h-full w-full items-start justify-center gap-4 lg:pr-16 pb-16 lg:pb-12"
    >
      <slot name="content"></slot>
    </section>
    <aside class="drawer-side">
      <label
        for="novel-sidebar"
        aria-label="关闭侧边栏"
        class="drawer-overlay"
      ></label>
      <section
        class="menu bg-base-200 text-base-content min-h-full p-4 w-80 md:w-96 items-center"
      >
        <aside class="flex-1 flex flex-col mb-12 lg:mb-0 lg:sticky lg:top-12">
          <slot name="aside"></slot>
        </aside>
      </section>
    </aside>
  </section>
</template>
