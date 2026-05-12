---
doc_id: phase2-information-processing-overview
title: Phase 2 Information Processing Overview
category: planning
status: active
is_iterating: true
updated_at: 2026-05-12
source_path: 01-planning/phase2/phase2-information-processing-overview.md
related_docs:
  - README.md
  - 00-overview/bemonews-product-overview.md
  - 01-planning/core-plans/2026-04-14-ai-daily-news-design.md
  - 01-planning/core-plans/2026-04-14-bemonews-implementation.md
  - 01-planning/phase1/phase1-information-collection-overview.md
tags:
  - bemonews
  - planning
  - phase2
  - information-processing
  - topic-clustering
  - briefing
summary: Phase 2 指导式文档，定义 bemoNews MVP 的信息加工环节，包括职责边界、核心数据对象、处理链路、模块拆解和双简报输出口径。
---
# Phase 2 Information Processing Overview

## 1. 文档目的

这份文档用于敲定 bemoNews 在 Phase 2，也就是 MVP 第二阶段的“加工信息”环节。

如果说 Phase 1 解决的是“把东西稳定收回来”，那么 Phase 2 解决的就是“把收回来的内容整理成真正能看、能扫、能继续分发的结果”。

这也是 bemoNews 在 MVP 阶段最关键的差异化环节。

本阶段优先解决的问题是：

- 如何从原始条目中筛掉明显低价值内容
- 如何减少同一话题的重复噪音
- 如何把多条 item 整理成 topic 级内容单元
- 如何为速报和详报提供不同粒度的组织结果
- 如何在不过度自作主张的前提下做轻量价值判断

## 2. Phase 2 总原则

### 2.1 产品原则

- 加工的目标是“降低噪音”，不是“替用户思考”
- 宁可略杂，也不要失真
- 保留来源可追溯性
- 让速报和详报共享同一套加工结果

### 2.2 工程原则

- 加工层必须建立在 Phase 1 的统一输入结构之上
- 加工结果必须有稳定的中间层对象，而不是直接生成 HTML
- 所有丢弃和合并行为尽量可解释
- 所有评分与排序先做轻量版本，避免早期规则过重

### 2.3 MVP 约束

- 核心产物是 `topic`，不是单条文章
- 先做轻量加工，不做过强结论
- AI 主要用于摘要压缩和辅助判断，不做重评论
- 输出是结构化简报草稿，不是最终展示文件

## 3. 加工环节职责边界

### 3.1 本环节负责

- 接收 Phase 1 输出的 `CollectedItem`
- 执行软过滤
- 执行语义级去重
- 进行同主题聚合
- 生成 topic 级摘要
- 对 topic 做轻量评分与排序
- 组织成速报和详报两种草稿结果
- 记录本次加工过程和结果

### 3.2 本环节不负责

- 页面布局和视觉呈现
- 邮件模板与发送
- 长期知识库沉淀
- 个性化推荐
- 投资判断或行动建议
- 复杂的趋势预测和强结论评论

这条边界的核心意思是：Phase 2 是“信息编辑台”，不是“智囊团”。

## 4. 上游输入约束

Phase 2 的唯一正式输入来自 Phase 1 文档中定义的 `CollectedItem(status=ready)`。

也就是说，加工层默认不再处理：

- 缺少基础字段的内容
- 超过时间窗口的内容
- 已被硬去重拦掉的内容
- 已明确判定为无效的内容

这保证了 Phase 2 关注的是“信息整理”，而不是继续补采集层漏洞。

## 5. 核心思路：从 item 变成 topic

Phase 2 最重要的产品决策，是把“文章列表思维”切换为“话题单元思维”。

原因很简单：

- 用户并不真的关心今天看了多少篇文章
- 用户更关心今天发生了哪些值得知道的事情
- 同一事件往往会被多个 source 重复报道
- 如果不聚合成 topic，前端和推送都会显得嘈杂

因此，Phase 2 的核心产物不是单条文章，而是 `ProcessedTopic`。

一个 topic 可以包含：

- 1 条原始 item
- 也可以包含多个来自不同 source 的 item

后续速报、详报、前端展示、邮件推送，都应该优先消费 topic 层，而不是直接消费 item 层。

## 6. 核心数据对象

### 6.1 ProcessingRun

`ProcessingRun` 用来记录一次完整的信息加工执行。

```ts
type ProcessingTrigger = 'scheduled' | 'manual'
type ProcessingStatus = 'running' | 'success' | 'partial' | 'failed'

interface ProcessingRun {
  id: string
  triggerType: ProcessingTrigger
  status: ProcessingStatus
  startedAt: string
  endedAt?: string
  inputItemCount: number
  filteredItemCount: number
  topicCount: number
  selectedTopicCount: number
  discardedTopicCount: number
  errorMessage?: string
  durationMs?: number
}
```

### 6.2 ProcessedTopic

`ProcessedTopic` 是 Phase 2 的核心产物。

```ts
type ImportanceLevel = 'high' | 'medium' | 'low'
type TopicStatus = 'selected' | 'discarded'

interface ProcessedTopic {
  id: string
  processingRunId: string
  title: string
  canonicalUrl: string
  summary: string
  sourceIds: string[]
  itemIds: string[]
  primaryCategory: string
  tags: string[]
  publishedAt: string
  importance: ImportanceLevel
  noveltyScore: number
  credibilityScore: number
  richnessScore: number
  duplicateGroupSize: number
  isCrossSourceConfirmed: boolean
  status: TopicStatus
  discardReason?: string
}
```

字段含义建议：

- `title`：加工后的人类可读标题，不必机械沿用原始文章标题
- `canonicalUrl`：优先使用主参考来源链接
- `sourceIds`：参与该 topic 的 source 列表
- `itemIds`：该 topic 下包含的原始条目
- `importance`：轻量重要性分级
- `duplicateGroupSize`：同主题合并前的条目数
- `isCrossSourceConfirmed`：是否由多个 source 交叉印证

### 6.3 BriefDraft

`BriefDraft` 是给下一环“前端展示”和“主动推送”的直接上游输入。

```ts
type BriefType = 'quick' | 'full'

interface BriefDraftSection {
  key: string
  title: string
  topicIds: string[]
}

interface BriefDraft {
  id: string
  processingRunId: string
  type: BriefType
  date: string
  leadTopicId?: string
  topicIds: string[]
  sections: BriefDraftSection[]
  stats: {
    inputItems: number
    selectedTopics: number
    droppedItems: number
    crossSourceTopics: number
  }
}
```

这里最关键的设计是：

- `ProcessedTopic` 负责表达“加工后的事实单元”
- `BriefDraft` 负责表达“面向阅读的组织方式”

这能让 Phase 2 和 Phase 3 解耦得更健康。

## 7. Phase 2 的处理链路

MVP 建议按 6 步处理。

### 7.1 Soft Filter

先做软过滤，去掉明显低价值内容。

建议优先过滤：

- 纯广告或促销导向内容
- 纯活动通知、无后续信息增量的预告
- 标题非常强但正文信息极弱的条目
- 与当前主题范围明显偏离的内容
- 重复转载且没有新增信息的二次分发内容

注意：

- 软过滤不应过于激进
- MVP 优先目标是“降低噪音”，不是“极限压缩”

### 7.2 Semantic Dedupe

这一步处理的是“不是同一链接，但其实在说同一件事”的情况。

典型例子：

- 多家媒体转述同一官方发布
- 多个博客同时解读同一模型更新
- 同一工具上线被不同渠道重复报道

这一步不应只靠 URL，而应结合：

- 标题相似度
- 关键信息词
- 发布时间接近程度
- 是否引用同一原始来源

### 7.3 Topic Clustering

在语义去重基础上，把相关 item 聚成 topic。

聚合目标不是做复杂知识图谱，而是形成“今天这件事”的最小表达单元。

一个 topic 应尽量满足：

- 内部条目围绕同一事件或更新
- 有一个主标题
- 有一个主链接
- 可以用一小段摘要说明清楚

### 7.4 Importance Scoring

MVP 只做轻量评分，不建议一上来就上过重的 `BREAKING / MAJOR / NOTABLE` 体系。

建议先从以下维度计算：

- `cross-source`
  - 是否被多个 source 同时提及
- `source credibility`
  - 是否来自官方源、研究源或高可信工程源
- `novelty`
  - 是否是新发布、新模型、新论文、新能力上线
- `richness`
  - 是否提供了足够的信息密度，而不只是口号式标题
- `theme relevance`
  - 是否和当前产品核心关注主题贴近

输出先压成：

- `high`
- `medium`
- `low`

这样既足够实用，也更容易调参。

### 7.5 Summary Generation

为每个 topic 生成一段简短、中性、可读的摘要。

摘要原则：

- 不夸张
- 不营销
- 不抢结论
- 尽量说明“发生了什么”和“为什么值得看”

MVP 阶段建议以“信息压缩摘要”为主，不强求每条都带观点评论。

### 7.6 Brief Shaping

把同一批 `ProcessedTopic` 组织成两份不同阅读目的的草稿。

#### `quick`

定位：

- 适合快速扫读
- 保留少量高价值 topic
- 强调“今天有什么值得立刻知道”

建议特征：

- 条目更少
- 优先 `high` 和较强 `medium`
- sections 更紧凑

#### `full`

定位：

- 适合完整浏览
- 保留更多 topic
- 强调“今天发生了什么全貌”

建议特征：

- 条目更完整
- 允许更多 `medium` 和部分 `low`
- sections 更细分

## 8. MVP 不建议现在做的能力

为了避免加工层过早复杂化，以下能力不建议进入当前核心链路：

- 强主观的 AI 评论系统
- 激进的重要性分级体系
- 个性化推荐与用户画像
- 复杂趋势预测
- 基于历史长期记忆的深层判断
- 自动生成明确行动建议

这些都可能有价值，但不应抢占 MVP 的主路径。

## 9. 模块拆解方式

Phase 2 建议按“编排 -> 过滤 -> 聚合 -> 评分 -> 摘要 -> 成稿 -> 落库”拆。

### 9.1 模块总览

1. `processing-orchestrator`
   - 发起一次加工流程
   - 创建 `ProcessingRun`
   - 编排后续步骤

2. `noise-filter`
   - 执行软过滤
   - 输出保留项和丢弃原因

3. `topic-cluster`
   - 执行语义级去重
   - 聚合成 topic 草稿

4. `topic-ranker`
   - 计算重要性和轻量评分
   - 产出排序结果

5. `topic-summarizer`
   - 为 topic 生成中性摘要

6. `brief-builder`
   - 基于同一批 topic 生成 `quick` 和 `full`

7. `processing-store`
   - 保存 `ProcessingRun`
   - 保存 `ProcessedTopic`
   - 保存 `BriefDraft`

### 9.2 为什么不直接从 item 生成 HTML

不建议跳过中间层，原因有三点：

- 前端展示和邮件推送都会需要结构化内容，而不只是 HTML 字符串
- 如果没有 topic 层，后续调试去重和聚合会非常困难
- 直接生成 HTML 会把“内容判断”和“展示表现”耦合在一起

因此，Phase 2 的结束点应该是“结构化简报草稿已准备好”，而不是“页面已经渲染好”。

## 10. Quick 与 Full 的口径建议

MVP 阶段，建议两种简报共享同一批 `ProcessedTopic`，只是取舍和编排不同。

### 10.1 Quick

建议规则：

- 只取有限数量的高优先级 topic
- 默认保留最值得先看的部分
- 更强调主线和密度

适合：

- 摸鱼时间
- 通勤碎片时间
- 想先知道今天有没有大事

### 10.2 Full

建议规则：

- 保留更多 topic
- 更完整覆盖不同类别
- 支持后续更细的 section 分组

适合：

- 集中阅读
- 做每日巡检
- 想补齐信息全貌

## 11. Phase 2 的成功标准

如果“加工信息”环节做到下面这些，就说明 Phase 2 基本成立：

- 能稳定接收 Phase 1 输出的 ready items
- 能显著减少重复和明显噪音
- 能把 item 组织成更接近人类阅读习惯的 topic
- 能保留原始来源可追溯性
- 能产出 quick 和 full 两种结构化草稿
- 能在不过度主观的前提下完成轻量排序
- 能为下一环前端展示提供稳定输入

## 12. 当前结论

截至当前，Phase 2 的“加工信息”环节建议正式定为：

- 输入：`CollectedItem(status=ready)`
- 核心产物：`ProcessedTopic`
- 最终输出：`BriefDraft(quick/full)`
- MVP 流程：软过滤 -> 语义去重 -> topic 聚合 -> 轻量评分 -> 摘要生成 -> 双简报组织
- AI 使用方式：以摘要压缩和辅助判断为主，不做重评论
- 职责边界：做信息整理，不做展示和推送

这份文档可以作为后续讨论“前端展示”环节的上游输入约束。
