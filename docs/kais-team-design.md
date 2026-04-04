# kais-team: AI Agent Team Orchestrator

> 设计文档 v1.0 | 2026-04-04 | 通过 brainstorm skill 生成，含 Pre-Mortem 风险分析

---

## 1. Overview

kais-team 是一个 OpenClaw skill，充当**AI 项目经理**。用户只需给出方向性指导，编排器负责组建团队、分配任务、跟踪进度、交付成果。

**核心理念**：在 AI 之上再包一层 AI，必须确保"用 kais-team 比直接做更快"，否则没有存在价值。

### 目标

- 用户只做**决策层**，skill 负责执行层
- 关键决策点（技术选型、架构方向）才需要用户参与
- 每个项目自动组建合适的 skill 团队
- 中断后可恢复，不丢失进度
- 根据使用习惯越用越契合

### 触发词

`"帮我做一个项目"` / `"拉个团队"` / `"start team"` / `"开干"` / `"build this"`

---

## 2. Team Members

### 2.1 可调度 Skill 矩阵

| Skill | 角色 | 何时调用 | 当前可用 |
|-------|------|---------|---------|
| brainstorm | 产品/需求分析师 | 方向不明确时 | ✅ |
| claude-code-via-openclaw | 主开发工程师 | 正规项目（完整流程） | ✅ |
| coding-agent | 快速开发者 | 小改动/脚本/一次性任务 | ✅ |
| thinking-partner | 技术顾问 | 复杂问题深度探讨 | ✅ |

### 2.2 Skill 调度规则

**判断逻辑**：
- 大项目/新项目 → claude-code-via-openclaw（完整流程：研究→计划→开发→验证）
- 小改动/脚本 → coding-agent（一次性任务，后台执行）
- 方向不清 → brainstorm 先跑
- 技术难题 → thinking-partner 深度探讨

**重要**：simple task 不拆分，直接执行。只有明确需要多 skill 协作时才启动编排。

### 2.3 Skill 策略可配置

skill 映射做成可配置的 `team.yaml`，用户可自定义添加/替换 skill，不硬编码。

---

## 3. Process Flow

```
收到需求 → 分析复杂度
              ├─ <5分钟搞定 → 不组队，直接 coding-agent 或 main agent
              └─ 需要团队 → 展示团队方案，用户确认后开工
```

### 3.1 项目阶段

```
分析评估 → [组建团队] → [分解任务] → [分配执行] → [跟踪验收] → 交付
              ↓                                              ↓
         需要你确认 ←─────── 关键检查点 ──────────────────────→ 交付报告
```

### 3.2 关键检查点（只有这些才打扰用户）

| # | 检查点 | 触发条件 |
|---|--------|---------|
| 1 | 团队组建 | 展示推荐团队，用户确认 |
| 2 | 方案确认 | brainstorm/技术方案产出后，用户选择 |
| 3 | 执行阻塞 | 技术死胡同、需求不明确时才升级 |
| 4 | 交付验收 | 完成后汇报，用户验收 |

**防骚扰**：低风险决策走偏好学习自动复用，不问。高风险决策（删数据、对外发布）必须问。

### 3.3 首次使用 vs 日常使用

**首次**：分析复杂度 → 展示团队方案 → 你确认 → 开工
**日常**：分析复杂度 → 查看偏好库 → 主动建议（"根据你之前的项目习惯，我建议..."）→ 你说"开干" → 开工

---

## 4. Project State Persistence（防中断 ⚡）

### 4.1 状态文件

每个项目维护 `projects/<project-name>/state.json`：

```json
{
  "project": "xxx",
  "phase": "developing",
  "team": ["brainstorm", "claude-code"],
  "tasks": [
    {
      "id": "t1",
      "status": "done",
      "skill": "brainstorm",
      "output": "...",
      "artifactHash": "sha256:abc123",
      "timestamp": "2026-04-04T09:00:00Z"
    },
    {
      "id": "t2",
      "status": "running",
      "skill": "claude-code",
      "contextSnapshot": "用户要求做XXX，选择了方案A，使用React+TS...",
      "timestamp": "2026-04-04T09:10:00Z"
    }
  ],
  "checkpoints": ["team_confirmed", "plan_approved"],
  "lastActive": "2026-04-04T09:10:00Z"
}
```

### 4.2 中断恢复流程

```
session 重启 → 用户说"进度怎么样"
→ 编排器读取 state.json
→ 展示"上次做到哪了"摘要（基于 contextSnapshot）
→ 用户确认上下文
→ 从 lastActive 位置继续，跳过已完成任务
```

### 4.3 防护措施

- 写入前备份 `state.json.bak`，损坏时自动回退
- 超过 50KB 自动归档已完成任务到 `archive/`
- 每步产出记录 artifact hash，支持步骤级回滚

---

## 5. Learning & Evolution（MVP 后实现）

### 5.1 偏好学习

记录用户决策到 `memory/team-preferences.json`，带标签：

```json
{
  "decisions": [
    {
      "date": "2026-04-04",
      "project": "xxx",
      "type": "tech_choice",
      "choice": "claude-code",
      "tags": ["web-app", "full-project"],
      "context": "大型新项目"
    }
  ]
}
```

**建议时显示依据**："因为上次在 XX 项目中你选择了 YY，这次类似场景建议同样处理。"

**防误用**：偏好记录必须带标签和上下文，不存裸值。提供"忽略历史偏好"快捷指令。

### 5.2 自我迭代（10+ 项目后）

- 分析历史决策成功率
- 生成优化建议（"你选 A 的项目 80% 都返工了"）
- 建议更新 skill prompt（经用户确认后执行）
- **原则**：建议权在 agent，决定权在用户

---

## 6. Pre-Mortem Risk Analysis

### 致命级（MVP 必须解决）

| # | 风险 | 预防 |
|---|------|------|
| 1 | 任务拆分质量差，过度拆分反而更慢 | 设"直接执行 vs 拆分"阈值，小任务不拆 |
| 2 | 级联失败：上游产出差导致下游崩 | 每步产出必须自动验证才写入 state |
| 3 | 中断恢复失忆，不连贯 | state.json 记录 contextSnapshot，恢复时先展示摘要 |

### 严重级（MVP 后解决）

| # | 风险 | 预防 |
|---|------|------|
| 4 | 通知骚扰，频繁打断用户 | 默认只高风险决策暂停，提供"自动驾驶模式" |
| 5 | Skill 策略僵化，无法覆盖新场景 | team.yaml 可配置，支持通用 worker 模式 |
| 6 | 偏好学习产生错误建议 | 带标签记录，显示依据，支持忽略 |
| 7 | state.json 膨胀/损坏 | 自动备份 + 归档 + hash 校验 |

### 中等级（长期优化）

| # | 风险 | 预防 |
|---|------|------|
| 8 | 依赖 skill 版本不兼容 | try-catch + fallback 到 main agent |
| 9 | 学习数据不足 | MVP 阶段不做自我迭代，先做好基础编排 |
| 10 | Token 消耗过高 | 按需加载 state，缓存 skill 定义 |

---

## 7. MVP Scope

### MVP 包含

- ✅ 需求分析 + 复杂度判断
- ✅ 团队组建 + 任务分配
- ✅ 4 个关键检查点
- ✅ 进度查询
- ✅ 项目状态持久化 + 中断恢复
- ✅ 交付报告

### MVP 不包含（后续迭代）

- ❌ 偏好学习（P2）
- ❌ 自我迭代（P2）
- ❌ team.yaml 自定义配置（P1）
- ❌ 自动驾驶模式（P1）

---

## 8. File Structure

```
skills/kais-team/
├── SKILL.md                    # 编排器主逻辑
├── config.json                  # 模型配置（复用 brainstorm 的 hybrid 架构）
├── references/
│   ├── team-members.md         # 团队成员能力矩阵
│   └── state-schema.json       # 项目状态文件格式定义
└── scripts/
    └── project-init.sh          # 初始化项目目录和 state.json
```

---

## 9. Config

```json
{
  "subAgent": {
    "model": {
      "research": "zai/glm-5-turbo",
      "framework": "zai/glm-5.1",
      "analysis": "zai/glm-5.1",
      "technical": "zai/glm-5.1"
    },
    "description": {
      "research": "Requirement analysis: competitive/market research",
      "framework": "Architecture analysis: SWOT, Pre-Mortem, etc.",
      "analysis": "Deep analysis: risk assessment, feasibility study",
      "technical": "Technical evaluation: architecture review"
    }
  }
}
```
