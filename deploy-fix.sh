#!/bin/bash

# Vercel 部署修复 - 自动推送脚本

echo "🚀 开始推送修复到 GitHub..."
echo ""

# 切换到项目目录
cd /Users/lizhanhong/Downloads/AI应用/AI-attention-insight-02

# 检查 git 状态
echo "📊 当前修改的文件:"
git status --short

echo ""
echo "📝 即将提交以下修复:"
echo "  ✅ 添加 vercel.json (Vercel 构建配置)"
echo "  ✅ 修复 index.html (添加入口脚本)"
echo "  ✅ 添加 .env.example (环境变量示例)"
echo "  ✅ 添加 VERCEL_DEPLOY_GUIDE.md (部署指南)"
echo ""

# 添加所有修改
git add .

# 提交
git commit -m "fix: 修复 Vercel 部署空白页面问题

- 添加 vercel.json 配置 Vite 构建
- 修复 index.html 添加入口脚本引用
- 添加环境变量配置示例
- 添加详细的部署指南文档"

# 推送到 GitHub
echo ""
echo "⬆️  推送到 GitHub..."
git push origin main

echo ""
echo "✅ 推送完成!"
echo ""
echo "📋 下一步:"
echo "1. 等待 1-2 分钟让 Vercel 自动部署"
echo "2. 在 Vercel Dashboard 配置环境变量 GEMINI_API_KEY"
echo "3. 如果环境变量已配置,刷新你的网站即可看到效果"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "📖 详细说明请查看: VERCEL_DEPLOY_GUIDE.md"
