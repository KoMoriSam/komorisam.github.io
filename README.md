<p align="center">
  <a href="https://komorisam.github.io/">
    <img src="https://komorisam.github.io/favicon.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">✨ 基于 Vite + Vue3 重构的个人博客 ✨</h1>
  <p align="center">
    🎨 视觉支持 <a href="https://daisyui.com">daisyUI</a>
    <br />
    <br />
    <span>
      📂 <a href="https://github.com/KoMoriSam/komorisam.github.io">查看源代码</a>
    </span>
    ·
    <span>
      🐞 <a href="https://github.com/KoMoriSam/komorisam.github.io/issues">报告 Bug</a>
    </span>
    ·
    <span>
      🚀 <a href="https://github.com/KoMoriSam/komorisam.github.io/issues">提出新特性</a>
    </span>
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
KoMoriSam  
├─ 📁src                    # 主源代码目录  
│  ├─ 📁assets              # 静态资源（图片、字体、CSS 文件）  
│  ├─ 📁components          # Vue 组件（按功能/用途分类）  
│  │  ├─ 📁base             # 基础/可复用组件（按钮、输入框等）  
│  │  ├─ 📁layout           # 布局组件（页眉、页脚、侧边栏）  
│  │  ├─ 📁novel            # 小说相关组件  
│  │  └─ 📁ui               # UI 组件（卡片、弹窗等）  
│  ├─ 📁composables         # Vue 3 组合式函数（可复用逻辑）  
│  ├─ 📁constants           # 常量值和配置  
│  ├─ 📁directive           # 自定义 Vue 指令  
│  ├─ 📁router              # Vue Router 路由配置  
│  ├─ 📁services            # API 服务和业务逻辑  
│  ├─ 📁stores              # Pinia 状态管理存储  
│  ├─ 📁utils               # 工具/辅助函数  
│  ├─ 📁views               # 页面级组件（路由组件）  
│  ├─ 📄App.vue             # 根 Vue 组件  
│  ├─ 📄config.js           # 应用配置  
│  └─ 📄main.js             # 应用入口（创建 Vue 实例）  
├─ 📄index.html             # 主 HTML 模板  
├─ 📄package.json           # 项目元数据和依赖  
└─ 📄vite.config.js         # Vite 构建工具配置  
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

该项目签署了 MIT 授权许可，详情请参阅 📄 [LICENSE](https://github.com/KoMoriSam/komorisam.github.io/blob/master/LICENSE)

---

## 🙏 鸣谢

- 📚 [Choose an Open Source License](https://choosealicense.com/)
- 🌐 [GitHub Pages](https://pages.github.com/)

---

## 🌍 多语言支持

📖 本 `README.md` 支持多语言：

- 🌐 [English Version](https://github.com/KoMoriSam/komorisam.github.io/blob/main/README_en.md)
- 🇫🇷 [Version française](https://github.com/KoMoriSam/komorisam.github.io/blob/main/README_fr.md)
