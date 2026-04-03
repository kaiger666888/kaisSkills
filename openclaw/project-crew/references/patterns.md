# 执行模式详解与示例

## 1. Pipeline（串行流水线）

**图特征：** 所有 step 形成单条链，每个 step 最多一个输入和一个输出消费者。

```
A ──→ B ──→ C ──→ D
```

```js
module.exports = {
  name: "pipeline-example",
  steps: [
    { id: "fetch", skill: "deep-research", params: { topic: "..." }, output: "raw.md" },
    { id: "rewrite", skill: "notion", input: "raw.md", output: "clean.md" },
    { id: "publish", skill: "xiaohongshu-ops", input: "clean.md" }
  ]
};
```

**执行：** 按顺序逐个执行，前一个完成后启动下一个。

## 2. Fan-out（并行分发）

**图特征：** 一个 step 的 output 被多个独立 step 消费，且这些消费者之间无互相依赖。

```
       ┌──→ B
A ────┼──→ C
       └──→ D
```

```js
module.exports = {
  name: "fanout-example",
  steps: [
    { id: "research", skill: "deep-research", params: { topic: "Rust" }, output: "brief.md" },
    { id: "notion", skill: "notion", input: "brief.md" },
    { id: "xhs", skill: "xiaohongshu-ops", input: "brief.md" },
    { id: "chart", skill: "chart-image", input: "brief.md", output: "chart.png" }
  ]
};
```

**执行：** A 完成后，B/C/D 同时 spawn 并行执行。

## 3. Map-Reduce（多源收集汇总）

**图特征：** 多个独立 step 的 output 汇聚到一个 step（入度 > 1）。

```
A ──┐
    ├──→ D
B ──┤
C ──┘
```

```js
module.exports = {
  name: "mapreduce-example",
  steps: [
    { id: "news", skill: "deep-research", params: { topic: "AI news" }, output: "news.md" },
    { id: "papers", skill: "arxiv-watcher", output: "papers.md" },
    { id: "trends", skill: "deep-research", params: { topic: "AI trends" }, output: "trends.md" },
    { id: "digest", skill: "notion", input: ["news.md", "papers.md", "trends.md"] }
  ]
};
```

**执行：** A/B/C 并行，全部完成后启动 D。

## 4. Approval Gate（人工审批）

**图特征：** 任何 step 标记了 `await: "human"`。

```js
module.exports = {
  name: "approval-example",
  steps: [
    { id: "draft", skill: "deep-research", params: { topic: "..." }, output: "draft.md" },
    { id: "review", input: "draft.md", await: "human" },  // 暂停，等待确认
    { id: "publish", skill: "xiaohongshu-ops", input: "draft.md" }
  ]
};
```

**执行：** 到达审批 step 时暂停，向用户展示当前进度和待审批内容，等待用户确认/拒绝/修改后继续。

## 5. Event Loop（动态循环）

**图特征：** step 标记了 `loop`，或存在环依赖。

```js
module.exports = {
  name: "loop-example",
  steps: [
    { id: "draft", skill: "deep-research", params: { topic: "..." }, output: "v1.md" },
    {
      id: "review",
      input: "v1.md",
      output: "v1.md",   // 覆写 = 环
      loop: { max: 5, until: "内容质量达标，无明显错误" }
    }
  ]
};
```

**执行：** 循环执行 review step，每次检查 until 条件，达到 max 次数或条件满足后退出。

## 6. DAG（通用有向无环图）

**图特征：** 上述模式的任意嵌套组合。

```
      ┌──→ B ──┐
A ────┤        ├──→ E ──→ F
      └──→ C ──┘         │
            D ───────────┘
```

```js
module.exports = {
  name: "dag-example",
  steps: [
    { id: "a", skill: "deep-research", output: "a.md" },
    { id: "b", skill: "notion", input: "a.md", output: "b.md" },
    { id: "c", skill: "chart-image", input: "a.md", output: "c.png" },
    { id: "d", skill: "deep-research", output: "d.md" },
    { id: "e", skill: "notion", input: ["b.md", "c.png"], output: "e.md" },
    { id: "f", skill: "xiaohongshu-ops", input: ["e.md", "d.md"] }
  ]
};
```

**执行：** 拓扑排序为 [[A, D], [B, C], [E], [F]]，同层并行，层间串行。

## 模式强制覆盖

任何 step 都可通过 `mode` 字段强制指定执行策略，覆盖自动推断：

```js
{ id: "x", skill: "...", mode: "fan-out" }
```

这对编排器提示：该 step 的所有下游应以 fan-out 方式执行。
