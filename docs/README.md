---
doc_id: docs-readme
title: Docs README
category: reference
status: active
is_iterating: true
updated_at: 2026-05-12
source_path: README.md
related_docs:
  - 00-overview/bemonews-product-overview.md
  - 01-planning/core-plans/ai-daily-news-design.md
  - 01-planning/core-plans/bemonews-implementation.md
  - 01-planning/core-plans/bemonews-technical-architecture.md
  - 02-technical-design/ai-intelligence-design-system-vercel.md
  - 02-technical-design/ai-intelligence-design-system-vercel-rebuild.md
tags:
  - docs
  - reference
  - structure
  - metadata
  - maintenance
summary: bemoNews docs 目录说明，定义了分层结构、编号规则和文档维护约定。
---
# bemoNews Docs

`docs/` 按“总览 -> 规划 -> 技术设计 -> 资源 -> 工作记录”的顺序组织，并通过编号保证目录长期稳定。

## 目录结构

- `00-overview/`：产品定位、愿景、范围、核心概念
- `01-planning/`：需求设计、实施计划、路线图、阶段性方案
  - `core-plans/`：具体的设计计划、实现计划
  - `phase1` ~ `phase4/`：按阶段拆开的专题概览
- `02-technical-design/`：设计系统、架构规范、实现约束、技术说明
- `03-assets/`：设计图、截图、静态参考素材
- `04-worklog/`：阶段进展、里程碑、整理记录、阶段总结

## 命名规则

- 顶层文件夹统一使用 `NN-name` 格式，`NN` 表示阅读顺序和稳定分组。
- Markdown 文件优先使用语义化英文文件名；需要保留中文标题时，放在文档内的 `title` 和一级标题中。
- 图片和其他静态资源放在 `03-assets/` 下，按用途继续分子目录。

## Frontmatter 约定

所有受管 Markdown 文档应包含这些字段：

- `doc_id`
- `title`
- `category`
- `status`
- `is_iterating`
- `updated_at`
- `source_path`
- `related_docs`
- `tags`
- `summary`

## 维护建议

- 新增文档时，先判断它属于哪一层，再放到对应编号目录。
- 如果只是阶段性草稿，优先放在 `01-planning/`，成熟后再迁移到更稳定的位置。
- 如果是阶段总结、已完成事项沉淀或工作纪要，放在 `04-worklog/`。
- 文件移动或重命名后，同步更新 `source_path`、`doc_id` 和 `related_docs`。
