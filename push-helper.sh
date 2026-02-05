#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║         🚀 Vercel 部署修复 - 推送助手                     ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 切换到项目目录
cd /Users/lizhanhong/Downloads/AI应用/AI-attention-insight-02

echo -e "${YELLOW}📊 检查当前 Git 状态...${NC}"
echo ""

# 检查是否有未推送的提交
COMMITS_AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")

if [ "$COMMITS_AHEAD" -eq 0 ]; then
    echo -e "${RED}❌ 没有需要推送的提交${NC}"
    echo ""
    echo "所有更改已经推送到 GitHub"
    exit 0
fi

echo -e "${GREEN}✅ 发现 $COMMITS_AHEAD 个未推送的提交${NC}"
echo ""

echo -e "${BLUE}📝 准备推送的提交:${NC}"
git log origin/main..HEAD --oneline
echo ""

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🔐 需要 GitHub 认证${NC}"
echo ""
echo -e "请选择认证方式:"
echo ""
echo -e "  ${GREEN}1)${NC} GitHub Personal Access Token (推荐)"
echo -e "  ${GREEN}2)${NC} SSH 密钥 (如果已配置)"
echo -e "  ${GREEN}3)${NC} 手动操作指南"
echo -e "  ${GREEN}4)${NC} 退出"
echo ""
echo -ne "${YELLOW}请输入选项 (1-4): ${NC}"
read choice

echo ""

case $choice in
    1)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}📌 使用 Personal Access Token${NC}"
        echo ""
        echo "1. 访问: https://github.com/settings/tokens"
        echo "2. 点击 'Generate new token (classic)'"
        echo "3. 勾选 'repo' 权限"
        echo "4. 生成并复制 token"
        echo ""
        echo -e "${RED}⚠️  Token 只显示一次,请妥善保存!${NC}"
        echo ""
        echo -ne "${YELLOW}按 Enter 键继续推送...${NC}"
        read
        
        echo ""
        echo -e "${BLUE}🚀 开始推送到 GitHub...${NC}"
        echo ""
        
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${GREEN}✅ 推送成功!${NC}"
            echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        else
            echo ""
            echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${RED}❌ 推送失败${NC}"
            echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo ""
            echo "请查看 HOW_TO_PUSH.md 获取详细帮助"
            exit 1
        fi
        ;;
        
    2)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}🔑 使用 SSH 密钥${NC}"
        echo ""
        
        # 切换到 SSH URL
        CURRENT_URL=$(git remote get-url origin)
        if [[ $CURRENT_URL == https://* ]]; then
            echo "切换远程仓库地址到 SSH..."
            git remote set-url origin git@github.com:zhan20046-cloud/AI-attention-insight-02.git
            echo -e "${GREEN}✅ 已切换到 SSH 地址${NC}"
        fi
        
        echo ""
        echo -e "${BLUE}🚀 开始推送到 GitHub...${NC}"
        echo ""
        
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${GREEN}✅ 推送成功!${NC}"
            echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        else
            echo ""
            echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${RED}❌ 推送失败${NC}"
            echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo ""
            echo "可能 SSH 密钥未配置,请查看 HOW_TO_PUSH.md"
            exit 1
        fi
        ;;
        
    3)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}📖 手动操作指南${NC}"
        echo ""
        echo -e "${GREEN}方式 1: 使用终端命令${NC}"
        echo "  cd /Users/lizhanhong/Downloads/AI应用/AI-attention-insight-02"
        echo "  git push origin main"
        echo ""
        echo -e "${GREEN}方式 2: 使用 GitHub Desktop${NC}"
        echo "  1. 打开 GitHub Desktop"
        echo "  2. 选择仓库 AI-attention-insight-02"
        echo "  3. 点击 'Push origin' 按钮"
        echo ""
        echo -e "${GREEN}方式 3: 使用 VS Code${NC}"
        echo "  1. 打开 VS Code"
        echo "  2. 打开项目文件夹"
        echo "  3. 点击源代码管理图标"
        echo "  4. 点击 '...' → Push"
        echo ""
        echo "详细说明请查看: HOW_TO_PUSH.md"
        echo ""
        ;;
        
    4)
        echo -e "${YELLOW}👋 已退出${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}❌ 无效的选项${NC}"
        exit 1
        ;;
esac

# 如果推送成功,显示后续步骤
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}║               🎉 推送成功! 后续步骤:                       ║${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}1️⃣  等待 Vercel 自动构建 (约 1-2 分钟)${NC}"
    echo "    访问: https://vercel.com/dashboard"
    echo ""
    echo -e "${YELLOW}2️⃣  配置环境变量 (重要!)${NC}"
    echo "    Settings → Environment Variables"
    echo "    添加: GEMINI_API_KEY = (你的 API Key)"
    echo ""
    echo -e "${YELLOW}3️⃣  触发重新部署${NC}"
    echo "    Deployments → 选择最新部署 → Redeploy"
    echo ""
    echo -e "${YELLOW}4️⃣  访问你的网站测试${NC}"
    echo ""
    echo -e "${GREEN}📖 详细说明: VERCEL_DEPLOY_GUIDE.md${NC}"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
fi
