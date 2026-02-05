#!/bin/bash

# 🚨 紧急推送脚本 - Vercel 部署修复
# 
# 问题: 修复文件还没有推送到 GitHub,所以 Vercel 还是空白!
# 解决: 运行此脚本推送修复

clear

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║           🚨 紧急: 修复还未推送到 GitHub!                 ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ 修复文件已在本地准备好"
echo "❌ 但还没有推送到 GitHub"
echo "❌ 所以 Vercel 看不到修复,页面还是空白"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /Users/lizhanhong/Downloads/AI应用/AI-attention-insight-02

# 检查未推送的提交
COMMITS=$(git log origin/main..HEAD --oneline | wc -l | tr -d ' ')
echo "📝 待推送的提交数: $COMMITS"
echo ""
echo "提交列表:"
git log origin/main..HEAD --oneline
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "请选择推送方式:"
echo ""
echo "  1) GitHub CLI (gh) - 如果已安装"
echo "  2) 打开 GitHub Desktop"
echo "  3) 打开 VS Code"
echo "  4) 生成推送命令(手动复制)"
echo "  5) 查看详细帮助"
echo "  6) 退出"
echo ""
read -p "输入选项 (1-6): " choice

case $choice in
    1)
        echo ""
        echo "检查 GitHub CLI..."
        if command -v gh &> /dev/null; then
            echo "✅ 已安装 GitHub CLI"
            echo ""
            echo "尝试推送..."
            git push origin main
        else
            echo "❌ 未安装 GitHub CLI"
            echo ""
            echo "安装方法: brew install gh"
            echo "或访问: https://cli.github.com"
        fi
        ;;
        
    2)
        echo ""
        echo "🚀 打开 GitHub Desktop..."
        open -a "GitHub Desktop" /Users/lizhanhong/Downloads/AI应用/AI-attention-insight-02
        echo ""
        echo "在 GitHub Desktop 中:"
        echo "  1. 选择仓库 AI-attention-insight-02"
        echo "  2. 点击右上角 'Push origin' 按钮"
        echo "  3. ✅ 完成!"
        ;;
        
    3)
        echo ""
        echo "🚀 打开 VS Code..."
        code /Users/lizhanhong/Downloads/AI应用/AI-attention-insight-02
        echo ""
        echo "在 VS Code 中:"
        echo "  1. 点击左侧'源代码管理'图标"
        echo "  2. 点击 '...' → Push"
        echo "  3. 按提示登录 GitHub"
        echo "  4. ✅ 完成!"
        ;;
        
    4)
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📋 复制以下命令到终端运行:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "cd /Users/lizhanhong/Downloads/AI应用/AI-attention-insight-02"
        echo "git push origin main"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "⚠️  如果要求输入密码,使用 Personal Access Token:"
        echo ""
        echo "   Username: zhan20046-cloud"
        echo "   Password: [你的 Personal Access Token]"
        echo ""
        echo "🔑 获取 Token: https://github.com/settings/tokens"
        echo "   1. 点击 'Generate new token (classic)'"
        echo "   2. 勾选 'repo' 权限"
        echo "   3. 生成并复制 token"
        echo ""
        ;;
        
    5)
        echo ""
        open QUICK_START.md 2>/dev/null || cat QUICK_START.md
        ;;
        
    6)
        echo ""
        echo "已退出"
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏭️  推送成功后:"
echo ""
echo "  1. 等待 1-2 分钟 Vercel 自动构建"
echo "  2. 在 Vercel 配置环境变量 GEMINI_API_KEY"
echo "  3. 重新部署"
echo "  4. 刷新网站,应该就能正常显示了!"
echo ""
echo "🔗 Vercel: https://vercel.com/dashboard"
echo ""
