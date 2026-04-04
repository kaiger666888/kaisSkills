# Team Members — Skill Capability Matrix

| Skill | Role | When to Dispatch | Available |
|-------|------|-----------------|-----------|
| brainstorm | Product/Requirements Analyst | Direction unclear, need structured ideation | ✅ |
| claude-code-via-openclaw | Lead Developer | Full projects (research→plan→develop→verify pipeline) | ✅ |
| coding-agent | Quick Developer | Small changes, scripts, one-off tasks, background execution | ✅ |
| thinking-partner | Technical Advisor | Deep problem exploration, complex trade-off analysis | ✅ |

## Dispatch Rules

1. **New/major project** → claude-code-via-openclaw (full pipeline)
2. **Small fix or script** → coding-agent (one-shot, background)
3. **Direction unclear** → brainstorm first, then reassess
4. **Deep technical problem** → thinking-partner for analysis
5. **Multi-phase project** → brainstorm (ideation) → claude-code-via-openclaw (execution)

## Composition Examples

- **Web app from scratch**: brainstorm → claude-code-via-openclaw
- **Bug fix**: coding-agent (solo)
- **Explore an idea**: brainstorm (solo)
- **Complex system design**: thinking-partner → claude-code-via-openclaw
- **Prototype + iterate**: claude-code-via-openclaw (solo)
