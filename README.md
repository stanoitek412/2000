# 即付 Instant Pay

> 🎉 imToken 10 周年 AI 共创活动 · Bitrefill 合作伙伴赛道参赛作品

**「让你的钱包成为电商助手」**

---

## 📖 项目简介

**即付（Instant Pay）** 是一个交互完整、可直接演示的"钱包电商助手"原型。用户可以在钱包内浏览 Bitrefill 商品、搜索、查看详情，并通过自然语言意图下单，最终使用 Token Core 自托管签名完成支付流程。

虽然使用 Mock 数据，但整个交互流程真实流畅，像真实电商助手一样好用。

### 中文简介

即付是一个基于 Token Core（tcx-wasm）和 Token UI Security 设计理念构建的钱包电商助手原型。它展示了下一代钱包的形态——用户可以通过自然语言与 AI 助手交互，快速找到并购买 Bitrefill 上的礼品卡和话费充值服务。所有密钥管理和交易签名均在浏览器端使用 tcx-wasm 完成，用户始终拥有完全的资产控制权。

### English Introduction

Instant Pay is a wallet e-commerce assistant prototype built with Token Core (tcx-wasm) and Token UI Security design principles. It showcases the next generation of wallet interaction — users can interact with an AI assistant through natural language to quickly find and purchase gift cards and mobile top-up services on Bitrefill. All key management and transaction signing are completed in the browser using tcx-wasm, ensuring users always have full asset sovereignty.

---

## ✨ 核心功能

### 1. 商品浏览系统
- 6 大商品分类（礼品卡、话费充值、游戏、娱乐、购物、美食）
- 20+ 高质量 Mock 商品（Steam、Amazon、Google Play、Spotify 等）
- 实时搜索功能
- 商品详情页（价格、支持地区、描述、兑换说明）

### 2. AI 意图交互
- 自然语言输入意图（如"给我买一张 100 美元的 Amazon 礼品卡"）
- AI 解析意图并推荐/选中对应商品
- 支持购买、搜索、浏览等多种意图识别
- 直接从 AI 对话中添加商品到购物车

### 3. 完整支付流程
- 购物车管理
- 支付前多层安全审查（深度使用 Token UI Security 材料）
- Token Core 自托管签名（tcx-wasm）
- 支付成功页（显示 Mock 兑换码）

### 4. Token Core 核心能力
- 使用 tcx-wasm 创建钱包（生成助记词）
- 使用 tcx-wasm 导入钱包
- 使用 tcx-wasm 进行交易签名（完整展示签名过程）

### 5. 安全与主权设计
- 每一步都有清晰风险提示
- 强调用户拥有完全控制权
- 安全检查清单（参考 Token UI Security SKILL.md）
- 签名前交易解码与展示

---

## 🛠 技术栈

- **框架**: Vite + React + TypeScript
- **状态管理**: Zustand
- **路由**: React Router DOM
- **图标**: Lucide React
- **核心依赖**: @consenlabs/tcx-wasm

---

## 📁 项目结构

```
src/
├── components/
│   ├── ai/           # AI 意图交互组件
│   ├── layout/       # 布局组件（Header, BottomNav, Layout）
│   ├── payment/      # 支付流程组件（Cart, SecurityReview, PaymentConfirm, PaymentSuccess）
│   ├── product/      # 商品组件（ProductCard, ProductGrid, ProductDetail, CategoryTabs）
│   ├── security/     # 安全组件（RiskBanner, SecurityChecklist）
│   └── wallet/       # 钱包组件（WalletCreate, WalletImport, SigningDemo）
├── data/             # Mock 商品数据
├── lib/              # 工具库（tcx-wasm 封装, 意图解析器）
├── pages/            # 页面组件
├── store/            # Zustand 状态管理
└── index.css         # 全局样式（Token UI 设计系统）
```

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 🔐 安全设计

本项目深度参考了 Token UI Security 材料中的安全设计理念：

1. **密钥本地存储** — 所有密钥材料使用 tcx-wasm 在设备本地生成和管理
2. **自托管签名** — 交易签名完全在浏览器端 WASM 环境中完成
3. **透明交易解码** — 签名前完整展示交易详情，防止盲签
4. **多层安全审查** — 支付前强制完成安全检查清单
5. **风险实时提示** — 每一步操作都提供清晰的风险提示
6. **用户完全控制** — 用户拥有完全的资产控制权

---

## 📝 参考资源

- [Token Core (tcx-wasm)](https://github.com/consenlabs/token-core-monorepo) — 钱包创建、密钥管理、交易签名
- [Token UI](https://github.com/consenlabs/token-ui) — 设计系统、Security 材料
- [Bitrefill](https://www.bitrefill.com/) — 商品数据参考

---

## ⚠️ 免责声明

**本项目为演示项目，使用 Mock 数据，非真实交易。** 所有商品信息、价格、兑换码均为模拟数据，不代表真实商品或服务。请勿将本项目的任何代码用于处理真实资产。

---

## 📄 License

MIT

---

> Built with ❤️ for imToken 10th Anniversary AI Co-creation Event
