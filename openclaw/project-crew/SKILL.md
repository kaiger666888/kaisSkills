---
name: project-crew
description: Intelligent task orchestration system. "Graph is orchestration" — define skills with input/output dependencies, the orchestrator auto-analyzes the DAG and picks optimal execution strategy. Use when user says "run a crew", "orchestrate", "pipeline", "run project", "crew", or provides a multi-step workflow with skill dependencies. Supports pipeline, fan-out, map-reduce, approval gates, event loops, and nested DAG modes.
---

# Project Crew — 智能任务编排

**核心理念：图即编排。** 定义 skill 之间的数据依赖，编排器自动推断最优执行策略。

## 快速开始

1. 创建项目定义文件（JS）：
   ```js
   // /tmp/crew-myproject/crew.js
   module.exports = {
     name: "每日技术研究",
     steps: [
       { id: "research", skill: "deep-research", params: { topic: "AI 2026" }, output: "report.md" },
       { id: "chart", skill: "chart-image", input: "report.md", output: "chart.png" },
       { id: "notion", skill: "notion", input: ["report.md", "chart.png"] },
     ]
   };
   ```

2. 执行编排：
   ```
   读取项目定义 → 分析 DAG → 推断模式 → spawn sub-agents → 收集结果
   ```

## 项目定义规范

### 基本结构

```js
module.exports = {
  name: "项目名称",           // 必填
  workdir: "/tmp/crew-xxx",  // 可选，默认 /tmp/crew-<name>/
  env: { KEY: "value" },     // 可选，注入环境变量
  steps: [...]               // 必填，step 数组
};
```

### Step 定义

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识符，用于引用 output |
| `skill` | string | 要调用的 skill 名称 |
| `input` | string\|string[] | 依赖的 step output 文件（自动建立依赖边） |
| `output` | string\|string[] | 产出文件（其他 step 通过 input 引用） |
| `params` | object | 传递给 skill 的参数 |
| `mode` | string | 强制执行模式（覆盖自动推断） |
| `await` | string | `"human"` = 审批门，执行到此处暂停等用户确认 |
| `loop` | object | `{ max: 10, until: "quality >= 8" }` 事件循环 |
| `timeout` | number | 超时秒数 |
| `parallel` | number | 并行度限制 |

### 隐式 input 规则

如果 step 没有 `input` 字段，自动作为起始节点（无前置依赖）。如果 `input` 是字符串，等价于单元素数组。

## 执行模式

编排器从依赖图自动推断，用户可通过 `mode` 字段覆盖：

| 模式 | 图特征 | 描述 |
|------|--------|------|
| **pipeline** | 全串行链 | A → B → C |
| **fan-out** | 有并行独立分支 | A → (B, C, D) |
| **map-reduce** | 多分支汇合 | (A, B) → C |
| **approval** | 有 `await: "human"` | 暂停等人工确认 |
| **event-loop** | 有环依赖 | 循环直到条件满足 |
| **dag** | 复杂图 | 通用拓扑排序执行 |

### 模式推断算法

```
1. 解析所有 step，收集 id → { inputs, outputs }
2. 对每个 step，将 input 文件名解析为来源 step id
3. 构建邻接表：step.id → [依赖的 step.id]
4. 检测环：DFS 回溯 → 标记为 event-loop 模式
5. 统计入度：
   - 所有 step 入度 ≤ 1 且串行 → pipeline
   - 有 step 入度 > 1（汇合点）→ map-reduce
   - 有 step 入度 = 0（多个起始）→ fan-out
   - 有 await:"human" → approval
   - 其他 → dag（通用拓扑排序）
6. 同一图中不同子图可独立使用不同模式
```

## 编排执行流程

```
┌─────────────────────────────────────────┐
│ 1. 加载 crew.js                         │
│ 2. 创建 workdir (/tmp/crew-<name>/)     │
│ 3. 分析 DAG，推断模式                    │
│ 4. 拓扑排序，确定并行层级                │
│ 5. 按层 spawn sub-agents               │
│ 6. 等待同层完成 → 下一层                │
│ 7. 遇到 await:"human" → 暂停汇报        │
│ 8. 遇到 loop → 执行+检查 until 条件     │
│ 9. 全部完成 → 汇总结果                  │
└─────────────────────────────────────────┘
```

### Sub-Agent 调用

每个 step 作为独立 sub-agent 执行：
- 读取对应 skill 的 SKILL.md 获取指导
- `params` 中的内容作为任务描述
- `input` 文件从 workdir 中读取
- `output` 文件写入 workdir

## 完整示例

### 研究报告流水线

```js
module.exports = {
  name: "daily-research",
  steps: [
    {
      id: "search",
      skill: "deep-research",
      params: { topic: "AI agents 2026", depth: "medium" },
      output: "research.md"
    },
    {
      id: "summarize",
      skill: "notion",
      input: "research.md",
      params: { pageId: "2fc11082-af8e-81de-98bb-d1741c3cee68" }
    },
    {
      id: "chart",
      skill: "chart-image",
      input: "research.md",
      output: "trend-chart.png"
    },
    {
      id: "post",
      skill: "xiaohongshu-ops",
      input: ["research.md", "trend-chart.png"],
      await: "human"
    }
  ]
};
// 推断模式: search → (summarize, chart) [fan-out] → post [map-reduce + approval]
```

### 并行内容生产

```js
module.exports = {
  name: "content-factory",
  steps: [
    { id: "topic", skill: "deep-research", params: { topic: "Rust vs Go" }, output: "brief.md" },
    { id: "article", skill: "notion", input: "brief.md", output: "article.md" },
    { id: "xhs", skill: "xiaohongshu-ops", input: "brief.md" },
    { id: "chart1", skill: "chart-image", input: "brief.md", output: "perf.png" },
    { id: "chart2", skill: "chart-image", input: "article.md", output: "ecosystem.png" },
  ]
};
// 推断: topic → (article, xhs, chart1) [fan-out] → chart2 [dag]
```

## Cron 集成

编排项目可直接通过 cron 定时执行：

```
# 每天早上 8 点运行每日研究
cron: 0 8 * * *
task: 读取 /tmp/crew-daily-research/crew.js 并按 project-crew 流程编排执行
deliver: telegram -1003840246680
```

在 crew.js 中设置 `await: "human"` 的 step 会被跳过（cron 无人值守），除非 step 也标记了 `cronAwait: true`。

## 数据传递

所有 step 通过 `workdir` 下的文件系统传递数据：
- `input` / `output` 都是相对 workdir 的文件路径
- 编排器负责确保前置 step 的 output 文件就绪后才启动后续 step
- 文件格式由 skill 自行决定（md、json、png 等）

## 错误处理

- 单个 step 失败 → 标记该分支失败，不影响并行其他分支
- 关键路径失败 → 汇报错误，等待用户决策
- 超时 → 终止对应 sub-agent，标记超时
- 用户可在任意点通过审批门干预

## 详细文档

- `references/orchestrator.md` — 编排器算法详细实现
- `references/patterns.md` — 执行模式详解与示例
