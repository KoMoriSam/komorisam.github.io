import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";

import seoPrerender from "vite-plugin-seo-prerender";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    legacy({
      targets: ["ie>=11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    // 预渲染
    seoPrerender({
      // 要渲染的路由
      routes: ["/", "/novel", "/about", "/contact"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
