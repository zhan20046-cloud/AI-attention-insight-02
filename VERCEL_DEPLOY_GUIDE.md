# Vercel 部署指南

## 🚀 部署步骤

### 1. 推送代码到 GitHub

```bash
cd /Users/lizhanhong/Downloads/AI应用/AI-attention-insight-02
git add .
git commit -m "fix: 添加 Vercel 配置和修复构建问题"
git push origin main
```

### 2. 在 Vercel 中配置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 `AI-attention-insight-02`
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量:

   | Key | Value |
   |-----|-------|
   | `GEMINI_API_KEY` | 你的 Gemini API Key |

5. 确保在 **Production**, **Preview**, **Development** 三个环境都勾选

### 3. 触发重新部署

有两种方式:

**方式 A: 通过 Git 推送触发**
```bash
git commit --allow-empty -m "redeploy: 触发 Vercel 重新部署"
git push
```

**方式 B: 在 Vercel Dashboard 手动触发**
1. 进入你的项目
2. 点击 **Deployments** 标签
3. 点击右上角的 **Redeploy** 按钮

---

## 📋 修复内容说明

### 1. ✅ 创建了 `vercel.json`

告诉 Vercel 这是一个 Vite 项目,配置了:
- 构建命令: `npm run build`
- 输出目录: `dist`
- 安装命令: `npm install`

### 2. ✅ 修复了 `index.html`

添加了缺失的入口脚本:
```html
<script type="module" src="/index.tsx"></script>
```

这样 Vite 才能正确加载你的 React 应用。

### 3. ✅ 创建了 `.env.example`

提供了环境变量配置模板。

---

## 🔍 问题原因分析

### 为什么页面是空白的?

1. **缺少入口脚本**: `index.html` 中没有引用 `index.tsx`,React 应用无法加载
2. **Vercel 不知道如何构建**: 没有 `vercel.json`,Vercel 可能使用了错误的构建方式
3. **环境变量未配置**: 如果 API Key 未设置,应用可能无法正常工作

### importmap 的问题

你的 `index.html` 使用了 importmap:
```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.2.3",
    ...
  }
}
</script>
```

**但这在 Vite 构建时不需要!** Vite 会自动处理模块打包。这些 importmap 可能导致冲突。

---

## ⚠️ 可选: 移除 importmap (推荐)

如果部署后仍有问题,建议移除 `index.html` 中的 importmap 部分:

### 修改前:
```html
<script type="importmap">
{
  "imports": {
    "@google/genai": "https://esm.sh/@google/genai@^1.37.0",
    ...
  }
}
</script>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
</body>
```

### 修改后:
```html
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
</body>
```

Vite 会通过 `package.json` 中的依赖自动处理这些模块。

---

## 🧪 本地测试

在推送到 GitHub 之前,先本地测试:

```bash
# 1. 安装依赖
npm install

# 2. 创建本地环境变量文件
cp .env.example .env.local

# 3. 编辑 .env.local,填入你的 API Key
nano .env.local
# 或
code .env.local

# 4. 运行开发服务器
npm run dev

# 5. 构建测试(模拟 Vercel 构建)
npm run build

# 6. 预览构建结果
npm run preview
```

如果 `npm run preview` 能正常显示页面,那么 Vercel 部署也应该没问题。

---

## 📊 Vercel 构建日志检查

部署后,检查构建日志:

1. 进入 Vercel Dashboard
2. 点击最新的 Deployment
3. 查看 **Build Logs**
4. 确认:
   - ✅ `npm install` 成功
   - ✅ `npm run build` 成功
   - ✅ 输出到 `dist` 目录
   - ✅ 没有错误信息

---

## 🎯 关于 Tailwind CSS CDN

你目前使用的是:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

**这可以工作,但不推荐用于生产环境。** 如果你想移除这个警告:

### 选项 1: 忽略警告(最简单)

CDN 版本功能完整,只是性能不如编译版本。如果应用速度可接受,可以继续使用。

### 选项 2: 安装 Tailwind CSS(推荐)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

然后修改 `index.html`:
```html
<!-- 删除 CDN -->
<!-- <script src="https://cdn.tailwindcss.com"></script> -->
```

创建 `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

在 `index.tsx` 中导入:
```typescript
import './index.css';
```

---

## 📱 部署后测试

1. 访问 Vercel 提供的 URL
2. 打开浏览器开发者工具 (F12)
3. 检查 Console 是否有错误
4. 检查 Network 标签,确认所有资源加载成功

---

## 🆘 如果仍然有问题

请提供:
1. Vercel 构建日志截图
2. 浏览器控制台错误信息
3. Network 标签中失败的请求

我会继续帮你排查!

---

## ✅ 快速命令参考

```bash
# 推送更新
git add .
git commit -m "fix: Vercel 部署配置"
git push

# 本地测试
npm install
npm run dev          # 开发模式
npm run build        # 构建
npm run preview      # 预览构建结果

# 强制重新部署
git commit --allow-empty -m "redeploy"
git push
```
