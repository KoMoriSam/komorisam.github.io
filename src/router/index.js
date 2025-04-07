import NProgress from "nprogress";
NProgress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
      meta: { title: "主页 | KoMoriSam" },
    },
    {
      path: "/home",
      redirect: () => ({
        name: "home",
      }),
    },
    {
      path: "/novel",
      name: "novel",
      component: () => import("@/views/Novel.vue"),
      meta: { title: "向远方 | KoMoriSam" },
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("@/views/Contact.vue"),
      meta: { title: "联系 | KoMoriSam" },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/About.vue"),
      meta: { title: "关于 | KoMoriSam" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
      meta: { title: "404! | KoMoriSam" },
    },
  ],
});

export default router;

router.beforeEach((to, from, next) => {
  NProgress.start();
  document.title = to.meta.title || "Welcome KoMoriSam's Website!";

  next();
});

router.afterEach((to, from) => {
  NProgress.done();
});
