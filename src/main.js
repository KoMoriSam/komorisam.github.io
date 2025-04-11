import "@/assets/main.css";
import "nprogress/nprogress.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { lazyPlugin, fadeIn } from "./directive";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(lazyPlugin);

app.directive("fade-in", fadeIn);

app.mount("#app");
