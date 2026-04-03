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
| `retry` | object\|number | 重试配置：`{ max: 3, delay: 5000 }` 或数字（默认 delay 3s） |
| `fallback` | string | 失败时替代 skill 名称 |
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
1. 解析所有 step，收集 id → { inputs, outputs, hasLoop }
2. 对每个 step，将 input 文件名解析为来源 step id
3. 构建邻接表：step.id → [依赖的 step.id]
4. 检测环：DFS 回溯 → 标记为 event-loop 模式
   - 注意：自环（同一文件 input+output）需通过 loop 字段辅助检测
5. 检查 await:"human" → 标记为 approval
6. 统计拓扑特征：
   - 有 step 的 outDegree > 1（单源扇出）→ fan-out
   - 有多个起始节点（入度=0）→ fan-out
   - 有 step 入度 > 1（汇合点）→ map-reduce
   - 所有 step 入度 ≤ 1 且全串行 → pipeline
   - 有 loop 字段 → event-loop
   - 其他 → dag（通用拓扑排序）
7. 用户通过 step.mode 可覆盖自动推断
8. 同一图中不同子图可独立使用不同模式
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
│ 9. 失败 → retry 重试 / fallback 降级    │
│ 10. 全部完成 → 汇总结果                  │
└─────────────────────────────────────────┘
```

### 重试与降级

- **retry**: step 失败后自动重试，支持 `max`（次数）和 `delay`（间隔 ms）
- **fallback**: 重试耗尽后，切换到替代 skill 执行
- 执行日志记录每次尝试的状态、耗时和 token 消耗

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

## 高级模式执行指南（AI 必须遵循）

### Approval Gate（人工审批）

当 command 包含 `await` 字段时：

```
1. 执行到该 step 时，先完成所有前置 step
2. 收集 await.reviewFiles 列出的文件内容
3. 向用户发送审批请求，包含：
   - 当前进度（已完成的 steps）
   - 待审批内容（文件摘要或关键片段）
   - await.prompt 中定义的审批问题
   - 选项：✅ 继续 / ❌ 终止 / ✏️ 修改意见
4. 等待用户回复
5. 用户确认 → 继续执行后续 step
6. 用户拒绝 → 终止编排，报告原因
7. 用户修改 → 根据修改意见调整后重新审批
```

**Cron 模式下**：`await.cronSkip: true` 的 step 自动跳过，`cronAwait: true` 的 step 正常暂停（cron 会发送通知）。

### Event Loop（事件循环）

当 command 包含 `loop` 字段时：

```
1. 执行该 step
2. 检查产出（loop.selfLoop 时检查 output 文件内容）
3. 评估 loop.until 条件（AI 判断内容质量是否达标）
4. 如果达标 → 退出循环，继续后续 step
5. 如果未达标且迭代次数 < loop.max → 重新执行该 step
6. 达到 loop.max → 退出循环，记录最终状态
7. 每次迭代输出日志：[CREW] {step} | loop_iteration | {current}/{max}
```

**条件评估**：AI 读取产出文件，基于 `loop.until` 描述判断。如果有 `loop.condition`（JS 表达式），也可程序化检查。

### Nested DAG（嵌套编排）

当 step 定义了 `crew` 字段而非 `skill` 时：

```js
{
  id: "sub-project",
  crew: "./sub-crew.js",     // 相对路径，指向另一个 crew.js
  input: "shared-data.md",   // 传递给子 DAG 第一个 step 的输入
  output: "final-result.md"  // 子 DAG 最后一个 step 的输出映射回父 DAG
}
```

orchestrator 会自动展开嵌套 DAG，子 step 的 id 加上 `parentId.` 前缀。`--execute` 输出中标记了 `parentStep` 和 `nestedWorkdir`。

### Retry / Fallback 执行

当 command 包含 `retry` 时：

```
1. step 失败 → 检查 retry.max
2. 未达上限 → 等待 retry.delay ms → 重新 spawn sub-agent
3. 达到上限 → 如果有 fallback，切换到 fallback skill 重新执行
4. 无 fallback → 标记失败，继续/终止取决于是否有下游依赖
```

日志：`[CREW] {step} | retrying | {attempt}/{max}` / `[CREW] {step} | fallback | {fallback_skill}`

## Cron 集成

编排项目可直接通过 cron 定时执行：

```
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
- `references/skill-registry.md` — 常用 skill 参数格式与执行方式

## 编排器 CLI

```bash
# 输出执行计划（JSON）
node scripts/orchestrator.js /path/to/crew.js

# 输出结构化执行指令（推荐 — AI 直接按指令执行）
node scripts/orchestrator.js --execute /path/to/crew.js
```

### --execute 模式

`--execute` 输出可直接执行的指令列表，AI 无需手动分析 DAG 或猜参数：

```json
{
  "project": "tech-research-test",
  "workdir": "/tmp/crew-tech-research-test",
  "inferredMode": "pipeline",
  "totalSteps": 2,
  "commands": [
    {
      "step": "search",
      "layer": 0,
      "instruction": "使用 deep-research skill topic='AI 2026', depth='medium'，输出到 research.md",
      "skillRef": "deep-research",
      "params": { "topic": "AI 2026", "depth": "medium" },
      "input": null,
      "output": ["research.md"],
      "validation": "检查 research.md 存在且非空"
    },
    {
      "step": "notion",
      "layer": 1,
      "instruction": "使用 notion skill pageId='xxx'，读取 research.md",
      "skillRef": "notion",
      "params": { "pageId": "xxx" },
      "input": ["research.md"],
      "output": null,
      "validation": null,
      "retry": { "max": 3, "delay": 5000 },
      "fallback": "deep-research"
    }
  ],
  "logTemplate": {
    "format": "[CREW] {{step}} | {{status}} | {{duration}}ms",
    "example": "[CREW] search | success | 42000ms"
  }
}
```

**AI 执行流程：**
1. 运行 `--execute` 获取 commands 列表
2. 按 layer 顺序执行（同层可并行）
3. 每步执行前读取对应 skill 的 SKILL.md
4. 执行后按 `validation` 字段验证结果
5. 按 `logTemplate.format` 输出日志行
6. 失败时按 `retry`/`fallback` 配置处理

### 参数校验

`--execute` 模式自动检查每个 step 的必填参数是否齐全，缺失时在 `warnings` 数组中输出警告。参数定义来自 `references/skill-registry.md`。

### 执行日志

执行时按模板输出日志，便于解析和追踪：
```
[CREW] search | running | 0ms
[CREW] search | success | 42000ms
[CREW] notion | running | 0ms
[CREW] notion | failed | 15000ms
[CREW] notion | retrying | 15000ms
[CREW] notion | success | 28000ms
```
