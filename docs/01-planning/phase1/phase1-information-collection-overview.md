---
doc_id: phase1-information-collection-overview
title: Phase 1 Information Collection Overview
category: planning
status: active
is_iterating: true
updated_at: 2026-05-12
source_path: 01-planning/phase1/phase1-information-collection-overview.md
related_docs:
  - README.md
  - 00-overview/bemonews-product-overview.md
  - 01-planning/core-plans/2026-04-14-ai-daily-news-design.md
  - 01-planning/core-plans/2026-04-14-bemonews-implementation.md
tags:
  - bemonews
  - planning
  - phase1
  - information-collection
  - source-strategy
  - ingestion
summary: Phase 1 指导式文档，收敛 bemoNews MVP 的信息收集范围、信息源分组、首批 source 清单建议、采集器模块拆解和环节边界。
---
# Phase 1 Information Collection Overview

## 1. 文档目的

这份文档用于敲定 bemoNews 在 Phase 1，也就是 MVP 第一阶段的“收集信息”环节。

目标不是一次性设计出完整的信息网络，而是先建立一套稳定、可维护、可扩展的采集底座，为后续“加工信息 -> 前端展示 -> 主动推送”提供干净、统一、可追溯的输入。

本阶段优先解决的问题是：

- 采哪些信息源
- 按什么方式分组管理
- 采集器模块怎么拆
- 采集层的职责边界是什么
- 什么内容能进入后续加工池

## 2. Phase 1 总原则

### 2.1 产品原则

- 先求稳定，再求丰富
- 先求可追溯，再求智能化
- 先做白名单采集，不做开放式全网发现
- 先做 RSS + API，不做平台型复杂抓取

### 2.2 工程原则

- 所有信息源必须可配置、可启停、可追踪状态
- 所有采集结果必须标准化到统一结构
- 所有丢弃行为必须尽量可解释
- 所有复杂判断尽量后移到“加工信息”环节

### 2.3 MVP 约束

- 信息源范围仅限 RSS 和 API
- 首批 source 数量控制在约 20 个
- 采集层只做基础校验和硬去重
- 默认时间窗口统一为 48 小时

## 3. 收集环节职责边界

### 3.1 本环节负责

- 管理信息源配置
- 定时或手动触发采集
- 读取 RSS 或调用 API
- 解析原始内容
- 标准化为统一结构
- 执行基础校验
- 执行硬去重
- 输出可进入后续加工池的原始条目
- 记录采集日志和失败信息

### 3.2 本环节不负责

- 判断内容是否“足够重要”
- 判断是否值得推荐给用户
- AI 总结、评论、改写
- 复杂话题聚合
- 语义级去重
- 最终展示排序

这条边界很重要。Phase 1 的采集层是“可靠搬运和初步整理”，不是“主编”。

## 4. 信息源分组方案

为了既方便产品视角理解，也方便后续工程拆分，Phase 1 的 source 采用“内容分组”和“采集方式”两层视角。

### 4.1 内容分组

建议首批分为 6 组：

1. `official-blog`
   - 官方产品、模型、平台发布
   - 代表来源：OpenAI Blog、Anthropic News、Google DeepMind Blog

2. `research`
   - 研究论文、研究机构动态
   - 代表来源：arXiv、Hugging Face 重要发布源

3. `engineering`
   - 工程实践、基础设施、开发工具演进
   - 代表来源：GitHub Engineering、Anthropic Engineering、OpenAI Engineering

4. `community`
   - 开发者社区热议与项目热度
   - 代表来源：Hacker News、GitHub Trending

5. `media`
   - 相对高质量的科技/AI 媒体报道
   - 代表来源：MIT Technology Review、The Verge、TechCrunch

6. `newsletter`
   - 更偏观察、趋势、精选整合的 Newsletter
   - 代表来源：Import AI、The Batch、TLDR AI

### 4.2 采集方式分组

采集实现层只分两类：

- `rss`
- `api`

这样做的好处是：

- 产品上可以按内容理解 source
- 工程上可以按抓取方式复用采集器
- 后续即使新增平台源，也能在不打乱内容分组的前提下扩展新的采集器类型

## 5. 首批约 20 个信息源建议清单

下面这份清单不是永久名单，而是建议的 Phase 1 起步白名单。重点是结构均衡、质量可控、维护成本低。

### 5.1 official-blog

- OpenAI Blog
- Anthropic News
- Google DeepMind Blog
- Hugging Face Blog

建议数量：4

### 5.2 research

- arXiv cs.AI
- arXiv cs.LG
- arXiv cs.CL

建议数量：3

说明：
- arXiv 可以先按 2 到 3 个主题 feed 接入
- 不建议 Phase 1 一开始就把学术源铺得太宽，否则噪音会明显上升

### 5.3 engineering

- GitHub Engineering Blog
- Anthropic Engineering
- OpenAI Engineering
- Cursor Blog 或同类高质量开发工具博客

建议数量：4

### 5.4 community

- Hacker News API
- GitHub Trending API

建议数量：2

说明：
- 这组虽然数量少，但价值很高
- 能补足“官方博客更新不频繁”的问题

### 5.5 media

- MIT Technology Review AI
- TechCrunch AI
- The Verge AI
- VentureBeat AI

建议数量：4

### 5.6 newsletter

- Import AI
- The Batch
- TLDR AI

建议数量：3

合计建议：20

这份分布的好处是：

- 有官方一手信源
- 有研究前沿
- 有工程实践
- 有社区热度
- 有媒体综述
- 有精选型 Newsletter 作为补充

整体不会过度依赖单一信息生态。

## 6. Source 管理建议

Phase 1 虽然范围收敛，但 source 不应只是硬编码常量。建议从一开始就按可管理对象设计。

### 6.1 Source 的最小管理动作

- 新增 source
- 查看 source 列表
- 查看 source 详情
- 编辑 source
- 启用 / 禁用 source
- 删除 source
- 试采集 source

### 6.2 Source 的关键字段

- `id`
- `name`
- `type`
- `url`
- `category`
- `enabled`
- `priority`
- `fetchIntervalMinutes`
- `timeWindowHours`
- `parserType`
- `lastFetchedAt`
- `lastStatus`
- `lastItemCount`
- `lastErrorMessage`

### 6.3 管理层的产品意图

这不是为了“做后台而做后台”，而是因为 source 一旦超过十几个，就一定会出现这些实际需求：

- 某个源临时失效，需要快速停用
- 某个源噪音太高，需要调低优先级或直接移除
- 某个源格式变了，需要知道它最近失败过
- 需要试采集单个 source 进行调试

如果 Phase 1 不把这些管理能力考虑进去，后面排查问题会非常低效。

## 7. 采集器模块拆解方式

Phase 1 建议按“调度层 -> 采集器层 -> 规范化层 -> 校验去重层 -> 输出层”拆。

### 7.1 模块总览

建议拆成以下模块：

1. `source-registry`
   - 负责读取和管理 source 配置
   - 提供启用 source 列表

2. `fetch-orchestrator`
   - 负责触发一次采集任务
   - 为每个 source 创建 `FetchRun`
   - 分发给不同的采集器

3. `connectors/rss`
   - 通用 RSS 拉取与解析
   - 适合大多数 RSS 型 source

4. `connectors/api`
   - 通用 API 请求适配
   - 适合 Hacker News、GitHub Trending 等 API 型 source

5. `parsers/*`
   - 处理 source 特定字段映射
   - 用于把不同原始返回值转成统一草稿结构

6. `normalizers`
   - 统一 URL、时间、作者、摘要等字段格式
   - 生成 `canonicalUrl`、`dedupeKey`

7. `validators`
   - 基础字段校验
   - 时间窗口过滤
   - 内容是否可进入待加工池的判断

8. `dedupe`
   - 执行硬去重
   - 规则优先按 `canonicalUrl`

9. `collection-store`
   - 写入 `CollectedItem`
   - 更新 `FetchRun`
   - 更新 `Source.lastStatus`

10. `test-fetch`
    - 面向单个 source 的试采集入口
    - 方便 CRUD 页面或命令行直接调试

### 7.2 为什么不按“每个 source 一个大类”来拆

不建议一开始就按 “OpenAIAgent / AnthropicAgent / TechCrunchAgent / HNAgent ...” 全部平铺，因为这样会带来两个问题：

- 重复逻辑很多，难维护
- source 一多就失控，无法沉淀通用能力

更好的方式是：

- 通用抓取逻辑沉到 `connectors`
- 轻量 source 差异收敛到 `parsers`
- 统一清洗、校验、去重放在公共模块

这样后续新增 source 时，大多数情况只需要：

1. 新增一条 source 配置
2. 复用现有 `rss` 或 `api` connector
3. 必要时补一个轻量 parser

## 8. 推荐的实现分层

建议实现时遵循下面这层结构：

### 8.1 调度层

职责：

- 决定采哪些 source
- 控制执行方式
- 记录 run 生命周期

输出：

- `FetchRun`

### 8.2 抓取层

职责：

- 发起 RSS/API 请求
- 拿到原始返回内容

输出：

- 原始 source payload

### 8.3 解析层

职责：

- 将原始 payload 映射为统一中间结构

输出：

- `CollectedItem draft`

### 8.4 规范化层

职责：

- 统一日期格式
- 规范化 URL
- 生成 `canonicalUrl`
- 生成 `dedupeKey`

输出：

- 标准化 `CollectedItem`

### 8.5 校验与去重层

职责：

- 校验必要字段
- 应用时间窗口
- 过滤重复项

输出：

- `ready`
- `invalid`
- `duplicate`

### 8.6 落库与状态层

职责：

- 保存 `CollectedItem`
- 更新 `FetchRun`
- 更新 `Source` 最近状态

## 9. Phase 1 推荐的新增 source 流程

后续新增 source 时，建议统一遵循这个流程：

1. 确定它属于哪个内容分组
2. 判断它是 `rss` 还是 `api`
3. 复用已有 connector
4. 判断是否需要自定义 parser
5. 试采集单个 source
6. 检查输出字段是否完整
7. 检查是否有异常噪音或高重复
8. 再决定是否正式启用

这能避免 source 名单无序膨胀。

## 10. Phase 1 的成功标准

如果“收集信息”环节做到下面这些，就说明 Phase 1 基本成立：

- 首批约 20 个 source 可稳定采集
- 大部分 source 可复用少量通用 connector
- 单个 source 的失败不会影响整体采集
- 所有采集结果都能进入统一结构
- 无效条目、重复条目、超时效条目可以被明确标记
- 可以看见每个 source 最近一次采集状态
- 输出能稳定供给后续“加工信息”环节

## 11. 当前结论

截至当前，Phase 1 的“收集信息”环节建议正式定为：

- 信息源范围：仅 `RSS + API`
- 首批 source 数量：约 20 个
- 分组方式：`official-blog`、`research`、`engineering`、`community`、`media`、`newsletter`
- 管理能力：支持基础 CRUD、启停、状态查看、试采集
- 采集器拆法：通用 connector + 轻量 parser + 公共 normalizer/validator/dedupe
- 时间窗口：默认 48 小时
- 职责边界：只做采集、标准化、基础校验、硬去重，不做智能判断

这份文档可以作为后续讨论“加工信息”环节的上游输入约束。
