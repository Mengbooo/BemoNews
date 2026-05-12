---
doc_id: phase4-proactive-delivery-overview
title: Phase 4 Proactive Delivery Overview
category: planning
status: active
is_iterating: true
updated_at: 2026-05-12
source_path: 01-planning/phase4/phase4-proactive-delivery-overview.md
related_docs:
  - README.md
  - 00-overview/bemonews-product-overview.md
  - 01-planning/core-plans/2026-04-14-ai-daily-news-design.md
  - 01-planning/core-plans/2026-04-14-bemonews-implementation.md
  - 01-planning/phase2/phase2-information-processing-overview.md
  - 01-planning/phase3/phase3-frontend-presentation-overview.md
tags:
  - bemonews
  - planning
  - phase4
  - delivery
  - push
  - email
summary: Phase 4 指导式文档，定义 bemoNews MVP 的主动推送环节，包括推送目标、触发方式、邮件与命令生成策略、投递对象和状态追踪边界。
---
# Phase 4 Proactive Delivery Overview

## 1. 文档目的

这份文档用于敲定 bemoNews 在 Phase 4，也就是 MVP 第四阶段的“主动推送”环节。

前 3 个阶段解决的是“信息能不能收回来、整理好、展示出来”，Phase 4 解决的是另一个关键问题：

**用户能不能在不主动打开产品的情况下，也稳定收到当天最值得看的结果。**

本阶段优先解决的问题是：

- 何时推送
- 推送什么
- 通过什么方式推送
- 手动生成和定时推送如何共存
- 如何追踪一次投递是否成功

## 2. Phase 4 总原则

### 2.1 产品原则

- 主动推送的目标是建立稳定的信息输入节奏
- 推送内容应足够轻，不打扰用户
- 推送应该把人带回报告，而不是试图在一封消息里承载全部体验
- 手动生成能力必须保留

### 2.2 工程原则

- 推送层只消费上游已成型的报告数据
- 发送逻辑和内容生成逻辑分离
- 每次推送都要可追踪
- 失败重试和人工补发要可操作

### 2.3 MVP 约束

- MVP 以邮件推送为主
- 同时支持命令手动生成最新报告
- 暂不做多渠道即时通讯推送
- 暂不做复杂用户分群与个性化发送

## 3. 推送环节职责边界

### 3.1 本环节负责

- 定时触发当天报告生成或发送
- 读取 quick / full 报告结果
- 生成邮件摘要或邮件入口
- 发送邮件
- 支持手动触发最新报告生成
- 记录投递状态

### 3.2 本环节不负责

- 信息采集
- 信息加工
- 页面内容编排
- 用户深度行为分析
- 多渠道自动运营策略

Phase 4 的定位是“把结果送达”，不是“再做一轮内容编辑”。

## 4. 上游输入约束

Phase 4 的正式输入来自 Phase 3 可访问的报告结果，核心上依赖：

- `BriefDraft`
- `ProcessedTopic`
- 对应的前端阅读落地页

也就是说，推送层不应该自己重新拼装内容判断逻辑，而应直接消费已成型的报告结构。

## 5. MVP 推送目标

MVP 的主动推送建议围绕两个目标：

### 5.1 定时送达

每天固定时间，把当天报告主动送到用户邮箱。

### 5.2 即时可取

用户在任何时候，都可以通过命令手动生成一份最新报告。

这两个目标合在一起，才能真正形成“稳定节奏 + 临时获取”的完整使用体验。

## 6. 推送对象建议

在 MVP 阶段，推送对象非常简单：

- 单个个人用户
- 单一邮箱地址

这意味着当前不需要引入复杂订阅系统，但设计上仍建议保留“未来可扩展到多接收人”的余地。

## 7. 推送内容建议

MVP 阶段不建议把 full 报告完整塞进邮件里。

更稳的做法是：

- 邮件优先承载 quick 风格摘要
- 邮件中提供进入 full 报告的链接

这样有几个好处：

- 邮件更轻
- 送达阅读成本更低
- 产品主体验仍回到前端阅读容器
- 避免邮件模板承担过多复杂内容展示

### 7.1 邮件建议包含

- 日期
- 今日 lead topic
- 3 到 5 条重点 topic 摘要
- full 报告入口链接
- 可选的 quick 报告入口链接

### 7.2 邮件不建议承担

- 完整 full 报告正文
- 复杂交互布局
- 过长的 section 展开

## 8. 触发方式建议

Phase 4 建议同时保留两种触发方式。

### 8.1 Scheduled

定时任务每天固定时间触发。

建议流程：

1. 检查当天报告是否已生成
2. 如未生成，则先执行生成流程
3. 读取最新 quick/full 结果
4. 生成邮件内容
5. 执行发送
6. 记录投递结果

### 8.2 Manual

手动触发用于：

- 临时查看最新结果
- 当天重跑
- 调试内容链路
- 漏发后的补发

手动触发建议至少支持：

- 生成最新报告
- 仅发送今日邮件
- 重新发送指定日期报告

## 9. 核心数据对象建议

为了让推送可追踪，Phase 4 建议至少建立一个 `DeliveryRun`。

### 9.1 DeliveryRun

```ts
type DeliveryTrigger = 'scheduled' | 'manual' | 'retry'
type DeliveryChannel = 'email'
type DeliveryStatus = 'running' | 'success' | 'partial' | 'failed'

interface DeliveryRun {
  id: string
  triggerType: DeliveryTrigger
  channel: DeliveryChannel
  date: string
  status: DeliveryStatus
  startedAt: string
  endedAt?: string
  recipientCount: number
  successCount: number
  failureCount: number
  briefDraftId?: string
  landingUrl?: string
  errorMessage?: string
  durationMs?: number
}
```

### 9.2 DeliveryEnvelope

如果希望把“要发送什么”单独抽出来，也可以定义一个轻量对象：

```ts
interface DeliveryEnvelope {
  id: string
  deliveryRunId: string
  subject: string
  previewText?: string
  quickBriefId: string
  fullBriefId?: string
  leadTopicId?: string
  topicIds: string[]
  landingUrl: string
}
```

它的作用是把“内容封装”和“发送执行”分开。

## 10. 命令生成能力建议

根据 overview，MVP 需要保留“通过命令即时生成最新报告”的能力。

这项能力在产品上非常重要，因为它意味着：

- 用户不必等定时任务
- 内容链路调试更方便
- 当天发现 source 更新后，可以手动补跑

MVP 建议至少提供三类命令语义：

- 生成今日报告
- 生成并发送今日报告
- 重生成指定日期报告

是否最终暴露成 CLI、后台按钮或 API，都可以后续再定，但产品语义应先固定。

## 11. 模块拆解方式

Phase 4 建议按“触发层 -> 内容封装层 -> 发送层 -> 状态层”拆。

### 11.1 模块总览

1. `delivery-orchestrator`
   - 发起一次推送任务
   - 协调生成、封装、发送、记录

2. `brief-loader`
   - 加载当天 quick/full 的 `BriefDraft`
   - 补齐所需 `ProcessedTopic`

3. `email-composer`
   - 生成邮件标题、预览文案、摘要块

4. `email-sender`
   - 调用邮件服务发送

5. `manual-trigger`
   - 承接命令或后台触发

6. `delivery-store`
   - 记录 `DeliveryRun`
   - 记录失败信息
   - 支持重试查询

## 12. MVP 的失败处理建议

主动推送这一环不能只关心“发出去”，也要关心“没发出去怎么办”。

MVP 建议至少支持：

- 单次发送失败后记录错误
- 可查看最近一次失败原因
- 支持手动重试
- 若生成成功但发送失败，不必重新加工内容

这能明显降低运维成本。

## 13. 与前端的关系

Phase 4 应把前端页面看作“推送的落地容器”。

也就是说：

- 邮件负责提醒与引导
- 前端负责完整阅读体验

这条关系建议尽量不要反过来，否则邮件会承担过重的内容展示压力。

## 14. Phase 4 的成功标准

如果“主动推送”环节做到下面这些，就说明 Phase 4 基本成立：

- 每天固定时间可以稳定发送当日报告
- 用户可通过命令手动生成或补发
- 邮件内容足够轻，能引导回前端阅读
- 推送结果可追踪
- 失败可重试
- 推送层不需要重新承担内容加工职责

## 15. 当前结论

截至当前，Phase 4 的“主动推送”环节建议正式定为：

- 目标：建立稳定的信息送达节奏
- 主渠道：邮件
- 双触发：定时触发 + 手动触发
- 推送内容：以 quick 摘要为主，full 作为阅读入口
- 核心对象：`DeliveryRun`
- 边界：负责送达，不负责内容采集、加工和展示

这份文档与前 3 个 phase 一起，构成 bemoNews MVP 的完整链路指导基线。
