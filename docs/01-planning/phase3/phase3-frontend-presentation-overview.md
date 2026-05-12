---
doc_id: phase3-frontend-presentation-overview
title: Phase 3 Frontend Presentation Overview
category: planning
status: active
is_iterating: true
updated_at: 2026-05-12
source_path: 01-planning/phase3/phase3-frontend-presentation-overview.md
related_docs:
  - README.md
  - 00-overview/bemonews-product-overview.md
  - 01-planning/core-plans/2026-04-14-ai-daily-news-design.md
  - 01-planning/core-plans/2026-04-14-bemonews-implementation.md
  - 01-planning/phase1/phase1-information-collection-overview.md
  - 01-planning/phase2/phase2-information-processing-overview.md
tags:
  - bemonews
  - planning
  - phase3
  - frontend
  - presentation
  - briefing
summary: Phase 3 指导式文档，定义 bemoNews MVP 的前端展示环节，包括承载定位、输入输出边界、页面结构、展示对象和渲染策略。
---
# Phase 3 Frontend Presentation Overview

## 1. 文档目的

这份文档用于敲定 bemoNews 在 Phase 3，也就是 MVP 第三阶段的“前端展示”环节。

如果说 Phase 2 负责把信息加工成 topic 和 briefing 草稿，那么 Phase 3 的任务就是把这些结构化结果变成可浏览、可切换、可回看、可沉淀的阅读体验。

本阶段优先解决的问题是：

- 前端到底展示什么对象
- quick 和 full 两种简报如何承载
- 首页与详情页的关系如何定义
- MVP 应该更像“报告容器”还是“复杂资讯站”
- 展示层如何和内容层保持解耦

## 2. Phase 3 总原则

### 2.1 产品原则

- 前端首先是一个“阅读容器”，不是复杂媒体门户
- 优先让用户快速进入今天的内容，而不是在导航中消耗精力
- quick 和 full 应共享同一套内容底座，但提供不同阅读路径
- 回看历史报告应足够顺滑

### 2.2 工程原则

- 展示层应消费 Phase 2 输出的结构化对象，而不是反向耦合加工逻辑
- 前端结构应以 `BriefDraft` 为核心，而不是直接依赖原始 item
- 页面渲染与内容生产应分层
- MVP 优先稳定、清晰、低维护成本

### 2.3 MVP 约束

- MVP 更偏“报告容器”而不是“资讯站入口”
- 先支持 quick 和 full 两种报告阅读
- 先支持当天阅读和历史回看
- 不做复杂互动式探索
- 不做内置 AI 对话入口

## 3. 展示环节职责边界

### 3.1 本环节负责

- 展示 `BriefDraft`
- 展示 `ProcessedTopic` 的阅读结果
- 组织 quick 与 full 的浏览入口
- 提供日期维度的历史导航
- 提供“今天最新报告”的快速入口
- 承接后续推送跳转的落地页

### 3.2 本环节不负责

- 内容采集
- 内容加工判断
- 邮件发送
- 用户画像和个性化推荐
- 聊天式追问
- 多平台社交分发

Phase 3 的定位是“把内容读出来”，不是“再加工一次内容”。

## 4. 上游输入约束

Phase 3 的正式输入来自 Phase 2 的两个核心对象：

- `ProcessedTopic`
- `BriefDraft`

其中：

- `BriefDraft` 是页面组织的主输入
- `ProcessedTopic` 是详情卡片和引用信息的内容来源

这意味着前端不应该回头直接消费 `CollectedItem`，否则会把 Phase 2 已经完成的整理工作重新打散。

## 5. MVP 定位：报告容器优先

对于 MVP，我建议明确站在“报告容器”这一侧，而不是“资讯站入口”。

原因有三点：

1. 更贴合 bemoNews 当前目标
   - 目标是解决“我今天该看什么”
   - 不是做一个持续刷新、无限滚动的资讯门户

2. 更符合上游处理链路
   - Phase 2 的输出是成型的 briefing 草稿
   - 前端最自然的工作，就是把这份 briefing 稳定承载出来

3. 更利于 MVP 快速验证
   - 容器型产品更容易稳定落地
   - 导航结构更简单
   - 后续再扩成资讯站也更自然

所以，Phase 3 的主定位建议是：

**一个以“今日报告 + 历史回看”为核心的轻量阅读容器。**

## 6. 核心页面结构

MVP 建议先固定成三层结构：

### 6.1 首页

首页职责：

- 展示“今天最新”的 quick 和 full 入口
- 展示最近几天的报告记录
- 提供按日期进入报告的能力

首页不需要承担太强的信息密度，它更像一个“报告总入口”。

### 6.2 日期页

日期页职责：

- 承载某一天的报告阅读
- 提供 quick / full 切换
- 展示这一天的摘要信息

日期页是 MVP 的核心页面。

### 6.3 报告阅读页或阅读区域

阅读区域职责：

- 真正承载某一份 quick 或 full 报告
- 展示 lead topic、sections、topic 列表、来源信息

这层可以是独立路由，也可以是日期页中的主阅读区域。MVP 里两种都可行，但建议产品语义上仍把它视为“报告阅读页”。

## 7. 路由建议

结合当前文档语境，MVP 可以采用更稳的路由设计：

```text
/                         # 首页
/[date]                   # 某日报告总入口
/[date]/quick             # 该日速报
/[date]/full              # 该日详报
```

这样做的好处：

- 和产品语言一致
- 比旧的 `daily/intelligence` 命名更贴近 quick/full 口径
- 路由足够清晰，适合邮件落地和历史回看

如果实现层为了兼容旧稿仍保留 `/briefs/*.html`，也建议把它看作渲染产物路径，而不是产品主路由语义。

## 8. 前端展示对象

Phase 3 前端不应该只展示“文章列表”，而应围绕 `BriefDraft` 里的 topic 级结构展开。

### 8.1 首页建议展示

- 今日 quick
- 今日 full
- 最近几日报告列表
- 每日报告的生成时间、topic 数量、来源数量等摘要信息

### 8.2 quick 页面建议展示

- 当日主 topic
- 少量高优先级 topic 卡片
- 精简 section
- 每条 topic 的摘要与来源链接

### 8.3 full 页面建议展示

- 当日 lead topic
- 更完整的 section 分组
- 更多 topic 条目
- 每条 topic 下的相关来源信息

### 8.4 topic 卡片建议包含

- 标题
- 短摘要
- 发布时间
- category
- importance
- 原始来源链接
- 交叉来源数量

这样既能保持可读性，也保留足够的可信度支撑。

## 9. 渲染策略建议

Phase 3 的关键设计点，不是“要不要页面”，而是“页面消费什么格式”。

### 9.1 推荐策略

建议采用：

**结构化数据驱动页面渲染**

也就是：

- 页面消费 `BriefDraft`
- 页面读取 `ProcessedTopic`
- 组件负责把内容渲染出来

### 9.2 为什么不把 HTML 作为唯一中间产物

旧稿中的 iframe + 独立 HTML 方案有工程上的简洁性，但如果把它作为唯一真相来源，会带来几个问题：

- quick/full 的展示逻辑难以复用
- 后续邮件、网页、其他分发渠道难共享结构化内容
- 很难在前端做更细的导航和轻交互
- 内容调试会过度依赖字符串模板

因此，MVP 更推荐：

- `BriefDraft` 和 `ProcessedTopic` 作为内容真相层
- HTML 只是某一种渲染输出

### 9.3 兼容旧方案的折中方式

如果工程上仍想保留静态 HTML 输出，可以这样理解：

- `BriefDraft` 是源数据
- HTML 是从 `BriefDraft` 渲染出来的静态阅读产物
- 前端主站可选择直接渲染，也可嵌入该产物

这样不会把架构锁死。

## 10. manifest 的角色建议

Phase 3 仍然建议保留 `manifest`，但角色要更清晰。

`manifest` 的职责应是：

- 记录有哪些报告
- 提供日期、类型、标题、生成时间、统计信息
- 驱动首页和历史列表

`manifest` 不应该承担：

- 详细内容存储
- topic 级结构存储
- 页面布局逻辑

换句话说，`manifest` 是目录，不是正文。

## 11. MVP 建议的展示体验

MVP 建议优先满足以下体验：

### 11.1 今天先看什么

用户进入首页后，能立即看到：

- 今天的 quick 是否已生成
- 今天的 full 是否已生成
- 一键进入阅读

### 11.2 能快速扫读

quick 页面应该明显更短、更轻、更快进入重点。

### 11.3 能完整浏览

full 页面应支持从上到下的完整信息巡检。

### 11.4 能回看历史

过去几天或过去一段时间的报告，应该能方便打开，不需要重新生成。

## 12. 模块拆解方式

Phase 3 建议按“目录层 -> 页面层 -> 阅读层 -> 组件层 -> 输出层”拆。

### 12.1 模块总览

1. `manifest-reader`
   - 读取报告索引
   - 为首页和历史列表提供数据

2. `brief-resolver`
   - 按日期和类型读取对应 `BriefDraft`
   - 关联所需 `ProcessedTopic`

3. `home-page`
   - 首页容器
   - 展示今日入口和历史记录

4. `brief-page`
   - 日期页或报告页容器
   - 承载 quick/full 切换

5. `topic-card`
   - 渲染 topic 摘要卡片

6. `brief-section`
   - 渲染 section 分组内容

7. `brief-renderer`
   - 将结构化数据渲染为网页
   - 如需要，也可以渲染为静态 HTML 产物

## 13. Phase 3 的成功标准

如果“前端展示”环节做到下面这些，就说明 Phase 3 基本成立：

- 能稳定消费 Phase 2 输出的 `BriefDraft`
- 用户能快速进入当天 quick 和 full
- 页面能清楚区分 quick 和 full 的阅读节奏
- topic 级内容可读、可追溯、不过噪
- 历史报告可方便回看
- 前端不需要反向承担内容加工逻辑
- 页面结构能承接后续主动推送的落地访问

## 14. 当前结论

截至当前，Phase 3 的“前端展示”环节建议正式定为：

- 定位：以“今日报告 + 历史回看”为核心的轻量阅读容器
- 输入：`BriefDraft` + `ProcessedTopic`
- 主页面：首页、日期页、quick/full 阅读页
- 内容单位：`topic`
- 渲染策略：结构化数据驱动，HTML 只是输出形式之一
- 边界：负责承载阅读，不负责内容加工和推送

这份文档可以作为后续讨论“主动推送”环节的上游输入约束。
