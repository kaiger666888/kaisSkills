---
name: kais-brainstorm
description: Systematic brainstorming for any idea — software projects, business ventures, product features, or creative concepts. Use when the user says "brainstorm", "有个想法", "帮我想想", "explore this idea", "帮我分析一下", "评估一下这个方案", "这个靠谱吗", "帮我梳理一下", "给我几个方向", "别问我直接说", "give me your thoughts", "what do you think about", "evaluate this", "feasible?", or presents an idea that needs structured thinking before action. NOT for simple factual questions or one-liner fixes.
---

# Brainstorm: Ideas → Structured Designs

Turn raw ideas into actionable, validated designs through structured collaborative dialogue.

<HARD-GATE>
Do NOT jump to implementation, write code, or take irreversible action until the design is presented and the user approves it. This applies to every idea regardless of perceived simplicity.
</HARD-GATE>

**When the user asks to skip the design** (e.g., "just build it", "直接写代码吧"):
> "I hear you — let's get to building fast. But first, a 30-second design sketch so we're aligned on what we're making. [Present 2-3 sentence design]. Look good?"

For truly trivial changes (rename a variable, change a config value), the design can be a single sentence. The point is alignment, not paperwork.

## Anti-Pattern: "Too Simple To Design"

A one-page utility, a config tweak, a weekend project — all go through this process. "Simple" ideas are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly trivial ideas), but it MUST be presented and approved.

## Process Flow

```
1. Explore Context → 2. Clarify (1 question at a time) → 3. Scope Check
       ↓                                                          ↓
   Too big? → Decompose into sub-projects                    Right-sized
                                                          ↓
                                              4. Propose 2-3 Approaches
                                                          ↓
                                              5. Present Design (sections)
                                                          ↓
                                              6. User Approves?
                                                No → Revise
                                                Yes ↓
                                              7. Deliver Output
```

## Cold Start Mode

When the user doesn't have a specific idea yet ("我想做点什么但不知道做什么", "有什么方向可以探索", "give me ideas"), enter cold start mode before the main flow:

0. **Leverage user context** — read USER.md and recent memory to understand the user's interests, skills, and ongoing projects. Use this to customize ideas (don't start from zero).
1. **Probe interests** — ask about recent obsessions, frustrations, skills they want to build, problems they see
   - **Fallback**: if the user says "都行/没什么特别的/anything", offer domain options: AI/ML, Web/前端, 效率工具, 创意/内容, 硬件/IoT, 商业/创业
2. **Scan trends** — optionally do a quick web search on trends in their domain of interest; weave findings into generated ideas (not just generic suggestions)
3. **Generate 5-7 raw ideas** across different categories (build, learn, explore, fix). Add a one-line "why this suits you" to each idea to help the user decide quickly.
4. **Let the user pick** — they pick 1-2 to brainstorm, then enter the main flow at Step 2

Cold start is a single turn: present ideas → user picks → done. Don't over-iterate here.

## Multi-Person Mode

When in a group chat or the user mentions involving others ("大家讨论一下", "帮我们团队梳理"):

1. **Act as facilitator** — don't dominate, solicit input from each participant
2. **Set the frame** — define the core question, set expectations ("We'll go around once, then I'll summarize")
3. **Go round-robin** — ask each participant in turn; keep it focused (one point per person per round)
4. **Synthesize** — after each round, summarize agreements, disagreements, and open questions
5. **Drive to convergence** — when discussion loops, propose a structured decision method:
   - **Scoring matrix** — fill in this template:
     | Option | Cost (1-5) | Effort (1-5) | Risk (1-5) | Impact (1-5) | Total |
     |--------|-----------|-------------|-----------|-------------|-------|
     | ... | ... | ... | ... | ... | ... |
   - **Voting**: each participant picks their top choice
   - **Your recommendation**: if the group is stuck, present your reasoned recommendation
6. **Document** — output a summary with: participants, key positions, decision made, open questions

## Resume from Previous Session

Before starting, check if this idea has been brainstormed before:
- Search `memory/*.md` and MEMORY.md for the topic keyword or related terms
- **If found:** briefly recap previous conclusions (what was decided, what was left unresolved), identify which Step (1-7) the session stopped at, then ask "Pick up where we left off, or start fresh?"
- **If not found:** proceed to Step 1 (Explore Context) as normal

## Step-by-Step

### 1. Explore Context
- Check existing project files, docs, recent memory if relevant
- Understand what already exists before proposing anything new
- If working in an existing codebase: follow existing patterns

### 2. Clarify — One Question at a Time
- **Multiple choice preferred** — easier to answer, faster to converge
- **One question per message** — never bombard with 5 questions
- Focus on: purpose, constraints, success criteria, timeline, budget
- **Stop rule**: generally 3-5 questions is enough to cover the essentials. Stop when you can confidently propose 2-3 distinct approaches — don't wait for perfect information

### 3. Scope Check
- If the idea involves **3+ independent subsystems**, flag it immediately as too large
- Help decompose into ordered sub-projects (by dependency and priority)
- Brainstorm the first sub-project through the normal flow; defer the rest
- After completing each sub-project, check in with the user before starting the next one

### 4. Propose 2-3 Approaches
- Always explore alternatives — never present only one option
- Include trade-offs for each (pros/cons, effort, risk)
- Lead with your recommendation + reasoning
- Use a comparison table when differences are structural

### 5. Present Design — Section by Section
- Scale sections to complexity: a few sentences if simple, up to 200-300 words if nuanced
- Ask for approval after each section
- **Default section order** (adapt to domain, but keep this as baseline):
  1. Overview & goals
  2. Core architecture / approach
  3. Key components / user stories
  4. Data flow / business model
  5. Risks & edge cases
  6. MVP scope & milestones
- Domain-specific additions:
  - **Software**: error handling, testing strategy
  - **Business**: cost structure, revenue model, competitive moat
  - **Product**: UX flow, metrics, user acquisition
  - **Creative**: audience, distribution, format

### 6. Self-Review Before Delivery
Quick inline check on the final design:
1. **Placeholders** — any TBD, TODO, or vague requirements? Fix them.
2. **Consistency** — do sections contradict each other?
3. **Scope** — is this focused enough, or does it need decomposition?
4. **Ambiguity** — could any requirement be interpreted two ways? Pick one.

### 7. Ask: Deliver or Continue?

After self-review, ask the user what they want to do next:

> "Design is ready. How would you like to proceed?
> A) **Deliver** — output the design as [format]
> B) **Go deeper** — apply an analysis framework (SWOT, Pre-Mortem, etc.)
> C) **Continue to implementation** — turn this design into an actionable plan
> D) **Done for now** — save and move on"

**Deliver options** (for choice A):
- Ask user preferred format if not obvious from context:
  - **Telegram message** — concise summary, good for quick sharing
  - **Notion page** — structured doc with headings, tables, callouts
  - **Markdown file** — `docs/specs/YYYY-MM-DD-<topic>-design.md`, commit if in git repo
  - **Just the conversation** — the chat itself is the record, no extra file needed
- Match the format to the idea's weight: a weekend project doesn't need a Notion page

**Go deeper** (for choice B):
- Auto-suggest the most relevant framework based on idea type:
  - Business/new venture → Lean Canvas + SWOT
  - Feature/prioritization → User Story Mapping + Cost-Benefit Matrix
  - Big bet / high-stakes → Pre-Mortem + First Principles
  - Controversial / team disagreement → Six Thinking Hats
  - Challenging industry norms → First Principles + Inversion
  - Risk-heavy project → Pre-Mortem + Cost-Benefit Matrix
- User can accept the suggestion or pick a different one
- Apply it, then assess the findings:
  - **Minor insights** (new angles, refinements, non-critical additions) → integrate into the design, re-offer delivery
  - **Major issues** (flawed core assumption, missing critical risk, significant scope change needed) → flag to the user and offer to **loop back** to Step 2 (Clarify) or Step 4 (Propose approaches) with the new understanding. The litmus test: "Does this affect the core value proposition?" If yes → major.
  - **Idea killer** (no viable market, technically impossible, conflicts with user's core goal) → present findings honestly, let the user decide: pivot, kill it, or rethink from scratch

**Done for now** (for choice D):
- If the conversation itself is the record → acknowledge completion, no extra files needed
- If decisions or discoveries were made → update `memory/YYYY-MM-DD.md` with key conclusions
- Always: remind the user they can resume anytime by mentioning the idea again

**Continue to implementation** (for choice C):
- For software: invoke coding-agent skill to start building
- For business/product: create a milestone-based action plan with owners and deadlines
- For creative: outline production steps and deliverables
- For AI/ML or data science: define dataset, evaluation metrics, and iterative experiment plan

## Optional Analysis Frameworks

When the idea benefits from deeper structured analysis, apply one or more frameworks. **Use judgment** — don't force frameworks on simple ideas.

For detailed framework guides, see [references/frameworks.md](references/frameworks.md).

| Framework | Best For |
|-----------|----------|
| **SWOT** | Business ideas, strategy decisions, competitive analysis |
| **Six Thinking Hats** | Controversial decisions, team discussions, blind-spot detection |
| **First Principles** | "Everyone does it this way" — break it down to fundamentals |
| **Pre-Mortem** | High-stakes plans — imagine it failed, work backward |
| **Cost-Benefit Matrix** | Comparing options with different cost/benefit profiles |
| **User Story Mapping** | Product features, prioritization, UX flow |
| **Lean Canvas** | Startups, new business models, quick validation |
| **Inversion** | Avoiding failure — list everything that could go wrong |

**How to use:** Read [references/frameworks.md](references/frameworks.md) for the selected framework, apply it to the current idea, and integrate findings into the design.

## Hybrid Architecture: Main Agent + Sub-Agent

The brainstorm flow splits into **interactive phases** (main agent) and **compute phases** (sub-agent with optional stronger model). This keeps the conversation smooth while offloading heavy work.

### When to Use Sub-Agent

| Trigger | Sub-Agent Task | Suggested Model |
|---------|---------------|-----------------|
| Step 4 needs competitive/market research | Research competitors, pricing, market size | Current model or stronger |
| Step 7B user chooses "Go deeper" | Apply analysis framework (SWOT, Pre-Mortem, etc.) | Stronger model recommended |
| Cold Start "Scan trends" | Web search for trends in user's domain | Current model |
| Any step needs deep technical analysis | Architecture evaluation, feasibility study | Stronger model recommended |

### How It Works

```
Main Agent (对话层, 当前模型)          Sub-Agent (计算层, 可指定模型)
    │                                      │
    ├─ Steps 1-3: 探索/提问/范围检查         │
    │                                      │
    ├─ Step 4: 需要调研 ──────────────→ spawn(调研任务, model=?)
    │   ←── 返回调研结果                     │
    ├─ 整合结果，呈现方案（对话）              │
    │                                      │
    ├─ Step 5-6: 设计呈现（对话）              │
    │                                      │
    ├─ Step 7B: 框架分析 ─────────────→ spawn(框架分析, model=?)
    │   ←── 返回分析结果                     │
    ├─ 整合结果，继续对话确认                  │
    │                                      │
    └─ Step 7 A/C/D: 交付/实施/结束           │
```

### Sub-Agent Spawn Pattern

When spawning a sub-agent for compute work:

1. **Pack context** — include the design so far, the specific question, and which framework to apply
2. **Set model** — use `model` parameter; default to current model, but for framework analysis recommend a stronger model (e.g., `claude-sonnet-4-20250514`)
3. **Wait for result** — sub-agent completes and returns; do NOT poll, wait for push notification
4. **Integrate** — present the sub-agent's findings to the user in the main conversation, then continue the interactive flow

### Model Selection

Read `config.json` at the skill root for model assignments. Actual values in config.json take precedence over any examples below.

| Sub-Agent Task | Config Key | Example Default |
|---------------|-----------|-----------------|
| Competitive/market research | `subAgent.model.research` | `zai/glm-5-turbo` |
| Framework analysis (SWOT, etc.) | `subAgent.model.framework` | `zai/glm-5.1` |
| Domain trend scanning | `subAgent.model.trends` | `zai/glm-5-turbo` |
| Deep technical analysis | `subAgent.model.technical` | `zai/glm-5.1` |

- Use the value from `config.json` — do not hardcode model names in logic
- `current` = use the main session's model
- Any provider-prefixed value (e.g., `zai/glm-5.1`) = spawn sub-agent with that model
- To customize: edit `config.json` in the skill directory, no restart needed

### Important: Conversation Never Leaves Main Agent

The user always interacts with the main agent. Sub-agents are invisible to the user — they see the result, not the process. Never spawn a sub-agent for anything that requires user interaction.

## Key Principles

- **Ideas first, judgment later** — generate freely before evaluating
- **YAGNI ruthlessly** — cut unnecessary scope from every design
- **One question at a time** — conversation, not interrogation
- **Explore alternatives** — the first idea is rarely the best
- **Incremental validation** — present, check, revise, repeat
- **Match depth to complexity** — a weekend project doesn't need a 10-page spec
- **Be opinionated** — recommend, don't just list options. The user wants your thinking.

## Quick Mode

When the user wants speed over depth ("给我几个方向", "别问我直接说", "give me options fast", "just brainstorm quickly"):

1. **Skip Steps 1-3** — no context exploration, no clarifying questions, no scope check
2. **Generate 3 approaches** — each 2-3 sentences, covering meaningfully different angles (e.g., minimal vs ambitious, DIY vs buy, free vs paid)
3. **Present with brief trade-offs** — one line of pros/cons per approach
4. **User picks one** → enter the main flow at Step 2 (Clarify) to deepen the chosen direction

Quick Mode is a fast funnel into the main flow. It replaces Steps 1-3, not the entire process.
