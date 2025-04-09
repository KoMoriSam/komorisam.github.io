<p align="center">
  <a href="https://komorisam.github.io/">
    <img src="https://komorisam.github.io/assets/image/favicon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">✨ 基于 Vite + Vue3 重构的个人博客 ✨</h3>
  <p align="center">
    🎨 视觉支持 <a href="https://daisyui.com">daisyUI</a>
    <br />
    <br />
    <a href="https://github.com/KoMoriSam/komorisam.github.io">📂 查看源代码</a>
    ·
    <a href="https://github.com/KoMoriSam/komorisam.github.io/issues">🐞 报告Bug</a>
    ·
    <a href="https://github.com/KoMoriSam/komorisam.github.io/issues">🚀 提出新特性</a>
  </p>

---

## 🚀 快速开始

只需几步，即可在本地运行本博客项目：

```bash
# 1. 克隆项目
git clone https://github.com/KoMoriSam/komorisam.github.io.git

# 2. 进入项目目录
cd komorisam.github.io

# 3. 安装依赖
npm install

# 4. 启动本地开发服务器
npm run dev

# 5. 构建生产版本
npm run build
```

## 🗂️ 项目结构

项目目录结构一览，便于快速定位：

```bash
.
├── public/   # 静态资源目录
│   ├── archive/  # 归档的旧版网页
│   └── assets/   # 静态资源（图片、字体等）
├── src/
│   ├── assets/   # CSS 样式等资源
│   ├── components/   # Vue 组件
│   │   ├── layout/   # 布局相关组件
│   │   ├── novel/# 小说相关组件
│   │   ├── ui/   # 通用 UI 组件
│   └── views/# 页面视图
│   ├── Home.vue  # 主页
│   ├── About.vue # 关于页面
│   ├── Contact.vue   # 联系页面
│   ├── Novel.vue # 小说页面
│   └── NotFound.vue  # 404 页面
├── src/router/   # Vue Router 配置
│   └── index.js  # 路由定义
├── src/stores/   # Pinia 状态管理
│   ├── novel.js  # 小说相关状态
│   └── theme.js  # 主题相关状态
├── src/main.js   # 应用入口文件
├── vite.config.js# Vite 配置文件
└── package.json  # 项目依赖和脚本
```

---

## ✅ 使用到的框架

- ⚡ [Vite](https://vite.dev/)
- 🧩 [Vue3](https://vuejs.org/)

## 🧱 使用到的组件库

- 🌼 [daisyUI](https://daisyui.com/)

## 🔌 使用到的主要插件

- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🖼️ [Remix Icon](https://remixicon.com/)
- 📄 [vue-markdown-render](https://github.com/cloudacy/vue-markdown-render)

---

## 🤝 贡献指南

欢迎任何形式的贡献，包括但不限于：

- 🐞 报告 Bug
- ✨ 提出新特性
- 🧹 优化文档或代码结构

请通过 Issue 或 Pull Request 与我联系，在提交代码前请确保：

- 遵循统一的代码风格
- 功能已测试
- 提交信息清晰简洁

---

## 🧪 兼容性

该项目已在以下环境中测试通过：

- ✅ Chrome（最新）
- ✅ Firefox（最新）
- ✅ Microsoft Edge
- ✅ 移动端（iOS / Android）主流浏览器

---

## 📜 版权说明

该项目签署了 MIT 授权许可，详情请参阅 [📄 LICENSE](https://github.com/KoMoriSam/komorisam.github.io/blob/master/LICENSE)

---

## 🙏 鸣谢

- 📚 [Choose an Open Source License](https://choosealicense.com/)
- 🌐 [GitHub Pages](https://pages.github.com/)

---

## 🌍 多语言支持

📖 本项目支持中英文文档：

- 🌐 [English Version](https://github.com/KoMoriSam/komorisam.github.io/blob/main/README_en.md)
- 🇫🇷 [Version française](https://github.com/KoMoriSam/komorisam.github.io/blob/main/README_fr.md)
