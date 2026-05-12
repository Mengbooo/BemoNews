---
doc_id: technical-design-ai-intelligence-design-system-vercel
title: AI Intelligence 设计规范（Vercel 风格）
category: technical-design
status: stable
is_iterating: false
updated_at: 2026-05-12
source_path: 02-technical-design/ai-intelligence-design-system-vercel.md
related_docs:
  - README.md
  - 01-planning/core-plans/2026-04-14-ai-daily-news-design.md
  - 02-technical-design/ai-intelligence-design-system-vercel-rebuild.md
tags:
  - technical-design
  - design-system
  - vercel-style
  - dark-theme
  - ui-spec
  - vercel
summary: AI Intelligence 页面设计规范，定义了 Vercel 风格下的色彩、排版、栅格、组件和响应式规则。
---
# AI Intelligence 设计规范（Vercel 风格）

基于已生成的桌面端与移动端设计图整理，适用于官网、资讯聚合站、AI Briefing 产品页面与后台内容型产品。

## 1. 设计理念

- 极简优先：减少视觉噪音，突出内容与信息层级
- 内容驱动：以信息可读性为先，弱化无效装饰
- 一致性：统一色彩、圆角、阴影、间距、交互反馈
- 高对比暗色模式：保证夜间浏览的舒适性与识别度
- 技术感与未来感并存：参考 Vercel 的克制、精确、现代化表达

## 2. 色彩规范

### 2.1 核心色板

```css
--bg-primary: #0A0A0A;
--bg-secondary: #111111;
--bg-tertiary: #171717;
--bg-elevated: #1C1C1E;

--text-primary: #FFFFFF;
--text-secondary: #A1A1AA;
--text-tertiary: #71717A;

--border-default: #27272A;
--border-subtle: rgba(255, 255, 255, 0.08);

--accent-primary: #FFFFFF;
--accent-hover: #E4E4E7;
--accent-inverse: #000000;

--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### 2.2 使用建议

- 页面背景使用 `--bg-primary`
- 卡片与模块背景使用 `--bg-secondary`
- Hover 或选中态使用 `--bg-tertiary`
- 主标题用 `--text-primary`
- 正文说明用 `--text-secondary`
- 元信息、时间、标签辅助文字用 `--text-tertiary`
- 分割线和描边统一使用 `--border-default`

### 2.3 渐变与光感

```css
--gradient-primary: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%);
--gradient-glow: radial-gradient(circle at top right, rgba(255,255,255,0.12), transparent 45%);
```

用于 Hero 区、特色卡片、订阅区背景微光，不建议大面积高饱和使用。

## 3. 字体规范

### 3.1 字体家族

- 主字体：Inter, SF Pro Display, system-ui, sans-serif
- 代码字体：JetBrains Mono, Menlo, monospace

### 3.2 字号层级

| 类型 | 字号 | 行高 | 字重 | 用途 |
|---|---:|---:|---:|---|
| Display / H1 | 48px | 56px | 700 | 桌面端 Hero 主标题 |
| H1 Mobile | 36px | 42px | 700 | 移动端 Hero 主标题 |
| H2 | 28px | 36px | 600 | 一级模块标题 |
| H3 | 20px | 28px | 600 | 卡片标题 |
| Body L | 16px | 26px | 400 | 正文 |
| Body S | 14px | 22px | 400 | 辅助说明 |
| Caption | 12px | 18px | 500 | 标签、时间、状态 |
| Mono Tag | 12px | 16px | 500 | 技术标签、分类徽标 |

### 3.3 字重建议

- 700：Hero 标题
- 600：模块标题、重点标题
- 500：标签、按钮文字、辅助强调
- 400：正文与说明文本

## 4. 栅格与布局

### 4.1 桌面端布局

- 内容最大宽度：`1200px`
- 页面左右安全边距：`32px`
- 栅格系统：12 栏
- 栏间距：`24px`
- 区块垂直间距：`64px - 96px`

### 4.2 移动端布局

- 设计宽度：`390px`
- 页面左右边距：`20px`
- 模块之间垂直间距：`24px`
- 卡片内部留白：`16px`

### 4.3 区块结构建议

1. 顶部导航
2. Hero 首屏
3. Top Stories 头条区
4. Trending Discussions 热门讨论
5. Community Picks 社区精选
6. Industry & Research 行业与研究
7. New Tools 新工具
8. Curated Resources 资源导航
9. Open Source & Tools 开源工具
10. Newsletter CTA
11. Footer

## 5. 间距系统

采用 4pt 体系。

| Token | 值 |
|---|---:|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |
| space-6 | 24px |
| space-8 | 32px |
| space-10 | 40px |
| space-12 | 48px |
| space-16 | 64px |
| space-20 | 80px |
| space-24 | 96px |

### 推荐规则

- 按钮内边距：`12px 16px`
- 卡片内边距：`20px - 24px`
- 模块标题与内容间距：`16px - 20px`
- 大区块上下留白：`72px - 96px`

## 6. 圆角与边框

```css
--radius-xs: 8px;
--radius-sm: 10px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
```

### 使用规则

- 按钮：10px - 12px
- 内容卡片：16px
- Hero 大卡片：20px
- 输入框：12px

边框统一建议：

```css
border: 1px solid #27272A;
```

## 7. 阴影与层级

暗色模式下阴影应轻，重点依赖边框与亮度差异表达层级。

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.2);
--shadow-md: 0 8px 24px rgba(0,0,0,0.28);
--shadow-lg: 0 16px 40px rgba(0,0,0,0.36);
```

### 使用建议

- 默认卡片可不加明显阴影
- Hover 状态轻微提升阴影与边框亮度
- 仅在 Hero 或浮层中使用中大阴影

## 8. 组件规范

### 8.1 顶部导航 Navbar

#### 桌面端

- 高度：`72px`
- 左侧：Logo
- 中间：一级导航
- 右侧：Subscribe 按钮 / 主题切换 / 搜索入口

#### 移动端

- 高度：`64px`
- 左侧：Logo
- 右侧：菜单图标

### 8.2 Button 按钮

#### Primary

```css
background: #FFFFFF;
color: #000000;
border-radius: 12px;
padding: 12px 16px;
font-size: 14px;
font-weight: 500;
```

#### Secondary

```css
background: transparent;
color: #FFFFFF;
border: 1px solid #27272A;
```

#### Hover 规则

- Primary：背景稍降亮
- Secondary：背景变为 `#171717`

### 8.3 Hero 模块

#### 桌面端

- 左文右图布局
- 标题最多两行
- 副标题控制在两至三行
- CTA 最多两个

#### 移动端

- 改为纵向布局
- 按钮上下排列或双按钮并排等宽

### 8.4 内容卡片 Content Card

适用于新闻、讨论、资源、工具卡片。

组成：

- 分类标签
- 标题
- 摘要
- 元信息（时间、来源、阅读时长）
- 缩略图或图标

规范：

- 背景：`#111111`
- 描边：`1px solid #27272A`
- 圆角：`16px`
- 内边距：`20px`

### 8.5 列表项 List Item

适用于 Industry & Research 一类紧凑型信息流。

组成：

- 标题
- 来源
- 时间
- 可选状态点

高度建议：

- 桌面端：48px - 64px
- 移动端：自适应，高度不少于 56px

### 8.6 资源导航卡片 Resource Card

适用于分类入口。

组成：

- 分类名称
- 一句话说明
- 跳转箭头

规则：

- 保持信息极简
- 每张卡仅承载一个动作
- 可 2 列或 4 列排布

### 8.7 Newsletter 订阅模块

- 深色底 + 轻微渐变
- 左侧说明，右侧输入框 + 按钮
- 移动端纵向排列
- 输入框高度：48px
- 按钮高度：48px

## 9. 图片与图标规范

### 9.1 图标

- 风格：线性、简洁、几何化
- 推荐库：Lucide / Heroicons
- 默认尺寸：16 / 20 / 24px

### 9.2 缩略图

- 圆角：12px
- 比例：
  - 桌面新闻头图：16:10 或 4:3
  - 移动端内容缩略图：4:3
- 蒙层：必要时加黑色渐变提升标题可读性

## 10. 响应式规范

### 10.1 断点

```css
sm: 640px;
md: 768px;
lg: 1024px;
xl: 1280px;
2xl: 1440px;
```

### 10.2 响应规则

- `>= 1024px`：桌面布局
- `768px - 1023px`：平板双栏或压缩版桌面
- `< 768px`：移动端单栏

### 10.3 布局变化

- Hero 从双栏切为单栏
- 内容宫格从 4 列变 2 列，再变 1 列
- Footer 从多列变纵向堆叠
- 导航折叠为抽屉菜单

## 11. 交互规范

### 11.1 Hover

- 背景由 `#111111` 提升至 `#171717`
- 边框亮度轻微提升
- 卡片上浮 `translateY(-2px)`，避免过度动画

### 11.2 Transition

```css
transition: all 0.2s ease;
```

### 11.3 点击反馈

- 按钮按下时轻微缩放 `scale(0.98)`
- 卡片点击区域完整可触达

### 11.4 滚动体验

- 大区块之间通过分割线和留白节奏控制
- 避免大面积高亮色打断阅读流

## 12. 可访问性规范

- 正文对比度建议不低于 WCAG AA
- 按钮最小点击区域：44px × 44px
- 不仅用颜色区分状态，要配合图标或文本
- 所有输入框必须有明确 label 或 placeholder
- 键盘焦点态需可见

推荐焦点样式：

```css
outline: 2px solid rgba(255,255,255,0.6);
outline-offset: 2px;
```

## 13. 动效建议

整体动效应克制，贴近 Vercel 风格。

### 推荐动效

- 模块渐入：fade + upward 8px
- 按钮 Hover：亮度变化 + 轻微位移
- 卡片 Hover：边框提亮 + 阴影微增强
- Hero 视觉区：可加入缓慢漂浮或微光动画

### 不建议

- 大幅弹跳
- 高频闪烁
- 高饱和彩色渐变滚动
- 复杂视差效果

## 14. 设计 Token 示例

```json
{
  "color": {
    "bgPrimary": "#0A0A0A",
    "bgSecondary": "#111111",
    "textPrimary": "#FFFFFF",
    "textSecondary": "#A1A1AA",
    "border": "#27272A"
  },
  "radius": {
    "sm": "10px",
    "md": "12px",
    "lg": "16px",
    "xl": "20px"
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "12": "48px",
    "16": "64px"
  },
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.2)",
    "md": "0 8px 24px rgba(0,0,0,0.28)"
  }
}
```

## 15. 前端落地建议

### 技术栈建议

- React / Next.js
- Tailwind CSS
- Framer Motion
- Lucide Icons

### Tailwind 风格建议

- 背景：`bg-black`, `bg-zinc-950`, `bg-zinc-900`
- 文本：`text-white`, `text-zinc-400`, `text-zinc-500`
- 边框：`border-zinc-800`
- 圆角：`rounded-2xl`
- 宽度控制：`max-w-7xl mx-auto px-6`
- 模块留白：`py-16 md:py-24`

## 16. 页面内容策略建议

- 首屏聚焦一句核心价值主张
- 每个区块只强调一个主题
- 列表型信息保持短标题、短摘要
- CTA 数量控制，避免过多操作分散注意力
- 视觉重点优先放在 Hero、Top Stories、Newsletter

## 17. 桌面端与移动端差异摘要

### 桌面端

- 更强调信息密度与多栏布局
- 模块可同时展示更多内容
- 适合资讯浏览、筛选与沉浸阅读

### 移动端

- 强调单手操作与纵向滚动节奏
- 卡片信息需更浓缩
- CTA 按钮和导航入口需更直观
- 列表和卡片保持高可点按性

## 18. 总结

这套设计规范的关键词是：

**极简、克制、现代、暗色、高级、技术感、内容优先。**

目标是让产品整体视觉呈现接近 Vercel 风格，但保留 AI 信息平台应有的资讯密度、科技感和可扩展性。
