# AI Intelligence 设计规范（Vercel 风格 · 可复刻版）

> 目标：这份规范不仅用于统一视觉风格，还要支持设计师与前端工程师 **尽可能高一致性地复刻当前桌面端与移动端页面**。  
> 适用范围：AI 资讯首页、AI Briefing、内容聚合站、技术媒体首页、Newsletter Landing Page。

---

# 0. 复刻目标

本规范所描述页面的核心特征：

- **整体风格**：Vercel 风格的暗色、克制、极简、精密感
- **页面结构**：长页面、模块化信息编排、内容驱动
- **布局特征**：
  - 桌面端：大容器 + 多区块纵向排列 + 卡片栅格 + 列表信息混排
  - 移动端：单栏滚动 + 高可读标题 + 卡片纵向堆叠
- **视觉重点**：
  - Hero 大标题
  - Top Stories 头条区
  - 卡片式内容流
  - Newsletter 订阅 CTA
- **可实现目标**：
  - 可依据本规范直接输出 Figma 组件
  - 可依据本规范直接用 Next.js + Tailwind 复刻页面
  - 可用于生成高保真网页设计稿与前端静态页

---

# 1. 页面信息架构（必须按此顺序实现）

## 1.1 桌面端页面结构

页面从上到下应包含以下区块：

1. Navbar 顶部导航
2. Hero 首屏
3. Top Stories 头条新闻区
4. Trending Discussions 热门讨论区
5. Community Picks 社区精选区
6. Industry & Research 行业与研究区
7. New Tools 新工具区
8. Curated Resources 资源导航区
9. Open Source & Tools 开源工具区
10. Newsletter CTA 订阅区
11. Footer 页脚

## 1.2 移动端页面结构

移动端顺序保持一致，但每个模块改为单栏：

1. Mobile Navbar
2. Hero
3. Top Stories
4. Trending Discussions
5. Community Picks
6. Industry & Research
7. New Tools
8. Curated Resources
9. Open Source & Tools
10. Newsletter CTA
11. Footer

## 1.3 页面阅读节奏

必须形成如下节奏：

- **首屏强吸引**
- **头条内容建立权威感**
- **卡片流增强内容丰富度**
- **工具与资源分类增强可用性**
- **底部订阅 CTA 完成转化**

---

# 2. 设计理念与视觉原则

## 2.1 核心关键词

- 极简
- 内容优先
- 技术感
- 未来感
- 暗色高级感
- 克制的交互反馈
- 高可复用性

## 2.2 必须遵守的视觉原则

1. **不要过度装饰**  
   不使用大面积高饱和渐变、彩虹光效、强拟物纹理。

2. **让排版成为视觉主角**  
   页面吸引力主要来自标题、层级、留白、布局节奏，而不是插画堆砌。

3. **用边框与亮度差表达层次**
   暗色页面中，层级主要依赖：
   - 背景明度差
   - 细边框
   - 微阴影
   - 局部发光

4. **动效一定克制**
   Hover 应该轻而准，不要夸张漂浮或过度位移。

---

# 3. 色彩系统（Color System）

## 3.1 基础 Token

```css
:root {
  --bg-primary: #0A0A0A;
  --bg-secondary: #111111;
  --bg-tertiary: #171717;
  --bg-elevated: #1C1C1E;

  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;

  --border-default: #27272A;
  --border-subtle: rgba(255,255,255,0.08);

  --white: #FFFFFF;
  --black: #000000;

  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
}
```

## 3.2 实际页面用色映射

| 用途 | 颜色 |
|---|---|
| 页面背景 | `#0A0A0A` |
| 内容卡片背景 | `#111111` |
| Hover 背景 | `#171717` |
| 主标题 | `#FFFFFF` |
| 正文说明 | `#A1A1AA` |
| 元信息 | `#71717A` |
| 边框 | `#27272A` |
| 主按钮背景 | `#FFFFFF` |
| 主按钮文字 | `#000000` |

## 3.3 渐变与微光

```css
--gradient-surface: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0));
--gradient-hero: radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 40%);
--gradient-cta: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
```

使用规则：

- Hero 可使用右上角微光
- CTA 可使用轻渐变
- 卡片背景不要使用明显渐变，避免破坏 Vercel 风格

---

# 4. 字体系统（Typography）

## 4.1 字体家族

- 中文优先：`Inter, SF Pro Display, PingFang SC, Microsoft YaHei, system-ui, sans-serif`
- 英文优先：`Inter, SF Pro Display, system-ui, sans-serif`
- 代码字体：`JetBrains Mono, Menlo, monospace`

## 4.2 字号层级（桌面端）

| 层级 | 大小 | 行高 | 字重 | 用途 |
|---|---:|---:|---:|---|
| Display XL | 56px | 64px | 700 | Hero 大标题 |
| H1 | 40px | 48px | 700 | 大模块标题 |
| H2 | 28px | 36px | 600 | 区块标题 |
| H3 | 20px | 28px | 600 | 卡片标题 |
| Body L | 16px | 26px | 400 | 正文 |
| Body S | 14px | 22px | 400 | 辅助说明 |
| Caption | 12px | 18px | 500 | 标签 / 时间 / 来源 |

## 4.3 字号层级（移动端）

| 层级 | 大小 | 行高 | 字重 | 用途 |
|---|---:|---:|---:|---|
| Display Mobile | 36px | 42px | 700 | Hero 标题 |
| H2 Mobile | 24px | 32px | 600 | 模块标题 |
| H3 Mobile | 18px | 26px | 600 | 卡片标题 |
| Body Mobile | 15px | 24px | 400 | 正文 |
| Caption Mobile | 12px | 18px | 500 | 标签 / 元信息 |

## 4.4 文字实现规则

- Hero 标题一律粗体，最大 2 行
- 普通卡片标题最大 2~3 行
- 摘要最多 3 行，超出省略
- 时间、来源、阅读时长用较浅灰色
- 行高偏宽松，符合资讯阅读场景

---

# 5. 栅格、容器与断点（复刻重点）

## 5.1 页面容器

### 桌面端

```css
max-width: 1200px;
padding-left: 32px;
padding-right: 32px;
margin: 0 auto;
```

### 平板端

```css
max-width: 960px;
padding-left: 24px;
padding-right: 24px;
margin: 0 auto;
```

### 移动端

```css
width: 100%;
padding-left: 20px;
padding-right: 20px;
```

## 5.2 断点

```css
sm: 640px;
md: 768px;
lg: 1024px;
xl: 1280px;
2xl: 1440px;
```

## 5.3 区块垂直间距

| 区块 | 桌面端 | 移动端 |
|---|---:|---:|
| Navbar 到 Hero | 32px | 20px |
| Hero 到下一区块 | 56px | 32px |
| 模块之间 | 72px | 40px |
| Footer 前 | 72px | 48px |

## 5.4 复刻核心布局规则

### 桌面端 Hero

- 2 栏布局
- 左侧约占 56%
- 右侧约占 44%
- 左侧用于文案与按钮
- 右侧用于视觉图形或抽象装饰

### 桌面端 Top Stories

- 采用 **左大右小** 的经典资讯布局
- 左侧：1 个头条大卡片
- 右侧：4~5 个紧凑型新闻项垂直排列

### Trending Discussions

- 3 列卡片栅格
- 每卡高度尽量一致

### Community Picks

- 4 列媒体卡片
- 图在上，文字在下

### Curated Resources

- 4 列资源导航卡片
- 每卡结构统一

### Open Source & Tools

- 2 列，每列 3 个简约工具项

---

# 6. 4pt 间距系统

| Token | 值 |
|---|---:|
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 8 | 32px |
| 10 | 40px |
| 12 | 48px |
| 16 | 64px |
| 20 | 80px |
| 24 | 96px |

## 6.1 组件内间距标准

| 元素 | 间距 |
|---|---:|
| 按钮内边距 | 12px 16px |
| 小标签内边距 | 4px 8px |
| 卡片内边距 | 20px |
| 大卡片内边距 | 24px |
| 输入框内边距 | 0 16px |
| 卡片元素上下间距 | 12px |

---

# 7. 圆角、边框、阴影

## 7.1 圆角 Token

```css
--radius-xs: 8px;
--radius-sm: 10px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
```

## 7.2 使用规范

| 元素 | 圆角 |
|---|---|
| 小标签 | 999px 或 8px |
| 按钮 | 10px ~ 12px |
| 输入框 | 12px |
| 普通卡片 | 16px |
| Hero 大卡片/CTA | 20px |
| 图片缩略图 | 12px |

## 7.3 边框规则

```css
border: 1px solid #27272A;
```

不要用高对比边框，不要使用彩色描边作为默认态。

## 7.4 阴影规则

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.20);
--shadow-md: 0 8px 24px rgba(0,0,0,0.28);
--shadow-lg: 0 16px 40px rgba(0,0,0,0.36);
```

### 重要说明

- 默认卡片以边框和背景差为主
- Hover 时再加轻阴影
- 切忌所有卡片都阴影很重

---

# 8. 页面级组件规范（复刻核心）

## 8.1 Navbar

### 桌面端结构

- 高度：72px
- 左：Logo
- 中：导航菜单（5~6 个）
- 右：Subscribe 主按钮 + 辅助图标按钮

### 样式

- 背景透明或极浅底色
- 下边界可无，也可使用极淡分隔线
- 导航文字 14px / 500

### 移动端结构

- 高度：64px
- 左：Logo
- 右：汉堡菜单按钮

---

## 8.2 Hero（首屏）

### 布局结构

桌面端为左右两栏：

- 左侧：
  - 小型 Eyebrow 标签
  - 大标题
  - 副标题
  - 双按钮 CTA
  - 更新时间信息
- 右侧：
  - 抽象视觉图形 / 发光卡片 / 品牌感装饰

### 尺寸建议

- 左右区块最小高度：420px
- 左侧内容宽度控制在 560px 内
- Hero 与下一区块间留白：56px

### 标题规范

- 行数：2 行内最佳
- 语义：一句话说明核心价值
- 推荐结构：  
  `AI insights, curated daily.`

### 副标题规范

- 说明产品内容范围：新闻、研究、工具、社区
- 最多 2~3 行

### 按钮规范

- 主按钮：白底黑字
- 次按钮：透明描边
- 两按钮间距：12px

### 右侧视觉建议

可使用以下任一种：

- 发光的抽象几何体
- 玻璃感黑色卡片
- 柔和高光 + 品牌形状
- 极简抽象 UI 组件

不要用花哨 3D 插画。

---

## 8.3 Section Header

每个模块都应使用统一头部：

- 左：标题
- 右：`View all →`

### 尺寸

- 标题：24px / 600（桌面端）
- 移动端标题：20px / 600

### 结构

```text
Top Stories                           View all →
```

---

## 8.4 Top Stories（头条区）

这是全页面最关键的内容模块之一，复刻时必须重点还原。

### 桌面端布局

- 左侧：1 个 **大头条卡片**
- 右侧：4~5 个 **紧凑新闻项**

比例建议：

- 左列：约 60%
- 右列：约 40%

### 大头条卡片结构

1. 顶部标签组（如 BREAKING / OPENAI / RELEASE）
2. 大标题
3. 摘要
4. 底部元信息（日期 / 阅读时长）
5. 右侧或底部抽象配图

### 大头条卡片尺寸建议

- 最小高度：340px
- 内边距：24px
- 圆角：20px

### 右侧新闻项结构

- 左：品牌图标或缩略方块
- 右：标题 + 时间 + 阅读时长

### 右侧新闻项高度

- 64px ~ 80px 每项
- 项间距：12px

### 移动端改法

- 大头条卡片在上
- 紧凑新闻项在下，单列纵向排列

---

## 8.5 Trending Discussions（热门讨论）

### 桌面端

- 3 列栅格
- 每张卡片内容一致：
  - 作者或来源
  - 时间
  - 标题
  - 简短描述
  - 互动数据（upvotes / comments）

### 卡片高度

建议统一 220px ~ 240px

### 移动端

- 改为单列纵向卡片流
- 每卡宽度占满容器

---

## 8.6 Community Picks（社区精选）

### 桌面端

- 4 列媒体卡片
- 适合视频、播客、文章精选

### 卡片结构

1. 顶部缩略图
2. 类型标签（VIDEO / PODCAST / ARTICLE）
3. 标题
4. 作者 / 来源
5. 日期

### 图片比例

- 16:10 或 4:3
- 图上可叠加播放按钮

### 移动端

- 可使用横向滑动，也可单列排列
- 若单列，图片置顶，信息在下

---

## 8.7 Industry & Research（行业与研究）

### 桌面端

- 2 列列表布局
- 每列 4~6 项

### 单项结构

- 标题
- 来源
- 时间

### 样式特征

- 更轻、更密、更像新闻列表
- 无需大图
- 行间距统一

### 移动端

- 变为单列列表
- 每项间距 14px ~ 16px

---

## 8.8 New Tools（新工具）

### 桌面端

- 4 列小卡片

### 卡片结构

- Logo / Icon
- 工具名
- 一句话描述
- 标签（Free / Web / Open Source 等）

### 卡片风格

- 高度统一
- 信息简洁
- 标签靠底部排列

### 移动端

- 可 2 列或单列
- 如果要更接近设计图，建议 2 列小卡片

---

## 8.9 Curated Resources（资源导航）

### 桌面端

- 4 列卡片
- 每卡只承载一个入口

### 卡片结构

- 分类名
- 一句话说明
- 资源数量或箭头

### 设计目标

它更像是导航组件，而不是资讯卡片。

---

## 8.10 Open Source & Tools（开源工具）

### 桌面端

- 2 列结构
- 每列 3 项

### 单项结构

- 图标
- 名称
- 描述

### 特点

- 信息密度较高
- 风格简约
- 比 New Tools 更轻量

---

## 8.11 Newsletter CTA（转化区）

这是页面底部最重要的转化模块。

### 桌面端结构

- 左：标题 + 说明文案
- 右：输入框 + 订阅按钮

### 尺寸建议

- 整体最小高度：120px
- 内边距：24px ~ 32px
- 圆角：20px

### 输入框

- 高度：48px
- 背景：深灰
- 边框：细描边
- 文本：14px

### 移动端

- 改为纵向堆叠
- 输入框和按钮各占一行
- 元素间距 12px

---

## 8.12 Footer

### 桌面端

- 左：Logo + 版权
- 右：若干列链接

### 移动端

- 改为纵向
- 链接分组简化

---

# 9. 内容模型（Data Schema，方便开发复刻）

## 9.1 Hero

```ts
type HeroData = {
  eyebrow: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  meta: string
}
```

## 9.2 Story Card

```ts
type StoryCard = {
  category: string[]
  title: string
  summary?: string
  date: string
  readTime: string
  image?: string
}
```

## 9.3 News Item

```ts
type NewsItem = {
  icon?: string
  title: string
  date: string
  readTime: string
}
```

## 9.4 Discussion Card

```ts
type DiscussionCard = {
  source: string
  timeAgo: string
  title: string
  summary: string
  upvotes: number
  comments: number
}
```

## 9.5 Media Pick

```ts
type MediaPick = {
  type: "video" | "podcast" | "article"
  thumbnail: string
  title: string
  author: string
  date: string
}
```

## 9.6 Tool Card

```ts
type ToolCard = {
  icon: string
  name: string
  description: string
  tags: string[]
}
```

## 9.7 Resource Card

```ts
type ResourceCard = {
  title: string
  description: string
  count?: string
}
```

---

# 10. 交互规范（必须克制）

## 10.1 Hover

### 卡片 Hover

```css
background: #171717;
border-color: rgba(255,255,255,0.14);
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(0,0,0,0.28);
transition: all 0.2s ease;
```

### 按钮 Hover

- 主按钮：白色略降亮度
- 次按钮：背景加深到 `#171717`

## 10.2 Active

```css
transform: scale(0.98);
```

## 10.3 Focus

```css
outline: 2px solid rgba(255,255,255,0.65);
outline-offset: 2px;
```

## 10.4 页面进入动效

- 区块进入：fade in + translateY(8px)
- 时长：0.4s ~ 0.6s
- easing：ease-out

不要对所有元素都做延迟瀑布动画，避免页面显得浮夸。

---

# 11. 图片、图标与媒体规范

## 11.1 图标

- 建议使用 Lucide 或 Heroicons
- 线宽统一
- 尺寸统一为 16 / 20 / 24

## 11.2 图片

- 图片统一圆角 12px
- 暗色页面中图片不要太亮
- 必要时叠加深色蒙层

## 11.3 Logo/品牌图标

- 顶部导航 Logo 尽量使用简洁单色
- 工具 logo 可以保留品牌识别，但不应过饱和

---

# 12. 响应式细节（复刻必须遵守）

## 12.1 桌面端 ≥ 1024px

- Hero 双栏
- Top Stories 左右分栏
- Discussions 3 列
- Community 4 列
- New Tools 4 列
- Resources 4 列
- Open Source 2 列

## 12.2 平板端 768px - 1023px

- Hero 双栏可压缩或变上下
- Top Stories 变单栏或 1+3 结构
- Discussions 2 列
- Community 2 列
- New Tools 2 列
- Resources 2 列

## 12.3 移动端 < 768px

- 所有内容单列优先
- Top Stories 头条卡片置顶
- 列表项纵向排列
- Footer 纵向排列
- 导航改抽屉菜单

---

# 13. 复刻级 Tailwind 设计 Token

```ts
export const theme = {
  colors: {
    bg: {
      primary: "#0A0A0A",
      secondary: "#111111",
      tertiary: "#171717",
      elevated: "#1C1C1E"
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A1A1AA",
      muted: "#71717A"
    },
    border: {
      DEFAULT: "#27272A",
      subtle: "rgba(255,255,255,0.08)"
    }
  },
  radius: {
    sm: "10px",
    md: "12px",
    lg: "16px",
    xl: "20px"
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.20)",
    md: "0 8px 24px rgba(0,0,0,0.28)",
    lg: "0 16px 40px rgba(0,0,0,0.36)"
  }
}
```

---

# 14. Tailwind 页面搭建建议（可直接复刻）

## 14.1 页面外层

```html
<body class="bg-black text-white antialiased">
  <main class="mx-auto max-w-7xl px-5 md:px-6 xl:px-8">
    ...
  </main>
</body>
```

## 14.2 常用类映射

| 场景 | Tailwind |
|---|---|
| 页面背景 | `bg-black` |
| 卡片背景 | `bg-zinc-950` |
| Hover 背景 | `hover:bg-zinc-900` |
| 边框 | `border border-zinc-800` |
| 正文灰字 | `text-zinc-400` |
| 元信息 | `text-zinc-500` |
| 大圆角 | `rounded-2xl` |
| CTA 容器 | `rounded-[20px] border border-zinc-800 bg-zinc-950` |
| 大区块留白 | `py-16 md:py-20` |

## 14.3 推荐组件结构

```text
Page
 ├─ Navbar
 ├─ Hero
 ├─ Section(Top Stories)
 │   ├─ FeaturedStoryCard
 │   └─ NewsList
 ├─ Section(Trending Discussions)
 │   └─ DiscussionCard[]
 ├─ Section(Community Picks)
 │   └─ MediaCard[]
 ├─ Section(Industry & Research)
 │   └─ ResearchList[]
 ├─ Section(New Tools)
 │   └─ ToolCard[]
 ├─ Section(Curated Resources)
 │   └─ ResourceCard[]
 ├─ Section(Open Source & Tools)
 │   └─ CompactToolItem[]
 ├─ NewsletterCTA
 └─ Footer
```

---

# 15. Figma 组件命名建议（便于团队协作）

```text
Layout/Navbar/Desktop
Layout/Navbar/Mobile
Section/Header
Hero/Desktop
Hero/Mobile
Card/FeaturedStory
Card/NewsItem
Card/Discussion
Card/Media
Card/Tool
Card/Resource
List/ResearchItem
List/OpenSourceItem
CTA/Newsletter
Footer/Desktop
Footer/Mobile
Button/Primary
Button/Secondary
Tag/Category
Input/Email
```

---

# 16. 高保真复刻检查清单（做完页面后逐项检查）

## 16.1 视觉检查

- [ ] 页面背景是否是纯暗黑而非偏蓝黑
- [ ] 卡片是否使用细边框而非重阴影
- [ ] 标题是否足够大且有阅读张力
- [ ] 所有模块留白是否统一
- [ ] CTA 是否明显但不过分突兀
- [ ] Hover 是否轻微、克制、统一

## 16.2 布局检查

- [ ] Hero 是否为双栏
- [ ] Top Stories 是否为左大右小结构
- [ ] Discussion 是否为等高卡片栅格
- [ ] Community 是否为多列媒体卡片
- [ ] Research 是否为轻量列表
- [ ] Resources 是否为入口型卡片
- [ ] Footer 是否足够简洁

## 16.3 交互检查

- [ ] 按钮 hover / active 是否一致
- [ ] 输入框 focus 是否可见
- [ ] 卡片是否整块可点击
- [ ] 移动端点击热区是否 ≥ 44px

## 16.4 响应式检查

- [ ] 移动端是否单栏清晰
- [ ] Hero 在手机上是否不拥挤
- [ ] Top Stories 是否正确折叠
- [ ] Footer 是否改为纵向
- [ ] CTA 是否改为上下堆叠

---

# 17. 可直接复刻页面的最低实现标准

如果要做到“看起来就是这张图”的程度，至少必须满足：

1. 正确的区块顺序
2. 正确的 Hero 双栏布局
3. 正确的 Top Stories 左大右小结构
4. 正确的暗色配色与边框层次
5. 正确的标题字号与留白
6. 正确的卡片圆角与按钮样式
7. 正确的移动端单栏适配
8. 正确的底部 Newsletter CTA

只要这 8 点准确，页面复刻度就会非常高。

---

# 18. 总结

这不是一份泛泛而谈的设计规范，而是一份 **能指导设计与前端复刻该页面的实现文档**。

这套页面的本质不是“炫酷”，而是：

- 用极简暗色系统构建高级感
- 用强排版与留白建立品牌感
- 用卡片与列表混合组织高密度内容
- 用节制的交互与统一组件提升完成度

最终关键词：

**Vercel 风格、暗色极简、内容优先、强排版、高一致性、可直接复刻。**
