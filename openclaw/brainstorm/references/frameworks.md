# Analysis Frameworks Reference

Detailed guides for each brainstorming framework. Read the relevant section when applying a framework to an idea.

---

## SWOT Analysis

**Structure:** 2x2 matrix of internal/external × positive/negative.

| | Positive | Negative |
|---|---------|---------|
| **Internal** | **Strengths** — what you have going for you | **Weaknesses** — what you lack or do poorly |
| **External** | **Opportunities** — trends, gaps, tailwinds | **Threats** — risks, competition, headwinds |

**How to apply:**
1. Fill each quadrant with 3-5 items (force at least 3 per quadrant)
2. Look for cross-quadrant insights:
   - How can strengths capture opportunities? (SO strategies)
   - How can strengths defend against threats? (ST strategies)
   - Can opportunities compensate for weaknesses? (WO strategies)
   - How to minimize weaknesses + threats? (WT strategies)
3. Prioritize: which 2-3 insights should actually influence the design?

**Common mistake:** Listing vague items ("good team", "market is big"). Be specific: "Team has 5 years of domain experience in X" vs "Market for X is projected to grow 40% CAGR through 2028."

---

## Six Thinking Hats (Edward de Bono)

**Purpose:** Systematically explore an idea from 6 perspectives. Especially valuable for controversial or emotionally charged decisions.

| Hat | Color | Perspective | Key Questions |
|-----|-------|-------------|---------------|
| ⚪ White | Facts | Data and information | What do we know? What don't we know? What data do we need? |
| 🔴 Red | Feelings | Intuition and emotion | What's your gut reaction? What excites/worries you? |
| ⚫ Black | Caution | Risks and problems | What could go wrong? What's the worst case? Why might this fail? |
| 🟡 Yellow | Benefits | Value and optimism | What's the best case? Who benefits? What's the upside? |
| 🟢 Green | Creativity | Alternatives and ideas | What else could we do? What's the unconventional option? |
| 🔵 Blue | Process | Meta-thinking and overview | Are we covering all angles? What's the conclusion? |

**How to apply:**
1. Go through each hat in order (White → Red → Black → Yellow → Green → Blue)
2. For each hat, spend 2-3 minutes generating points
3. Blue hat summarizes and identifies action items
4. **Tip:** Don't skip the Green hat — it's where breakthrough ideas live

---

## First Principles Thinking

**Purpose:** Break a problem down to fundamental truths and reason up from there. Best when challenging conventional wisdom or industry dogma.

**Process:**
1. **Identify assumptions** — "What is everyone assuming about this?"
2. **Break down to fundamentals** — "What do we know for certain is true?"
3. **Rebuild from the ground up** — "If we started from scratch, what would we build?"
4. **Compare with convention** — "Where does our first-principles answer differ from the standard approach?"

**Example (SpaceX):**
- Conventional: "Rockets are expensive because that's how aerospace works."
- First principle: "What are rockets made of? Aluminum, titanium, carbon fiber. What's the raw material cost? ~2% of the price. So the cost is in manufacturing and reuse, not materials."

---

## Pre-Mortem Analysis

**Purpose:** Imagine the project already failed, then work backward to find why. More powerful than risk assessment because it assumes failure is certain.

**Process:**
1. **Set the scene:** "It's 6 months from now. This project has failed spectacularly. What happened?"
2. **Generate failure modes** (5-10 minutes):
   - Each participant writes 3-5 reasons for failure independently
   - No blame, no judgment — pure imagination of failure
3. **Cluster and prioritize:**
   - Group similar failures
   - Rate by likelihood × impact
4. **Convert to mitigations:**
   - For top 3-5 failures: what specific action prevents it?
   - Add these as requirements or checks in the design

**Common failure categories to seed thinking:**
- Nobody wanted it (market risk)
- We couldn't build it (technical risk)
- We ran out of money/time (resource risk)
- Someone else did it better/faster (competitive risk)
- We couldn't agree on what to build (alignment risk)

---

## Cost-Benefit Matrix

**Structure:** 2x2 matrix of effort vs. impact.

| | Low Impact | High Impact |
|---|-----------|------------|
| **Low Effort** | Quick Wins (do first) | Home Runs (prioritize) |
| **High Effort** | Time Sinks (avoid) | Major Projects (plan carefully) |

**How to apply:**
1. List all features/approaches
2. Score each on effort (1-5) and impact (1-5)
3. Plot on matrix
4. Sequence: Quick Wins → Home Runs → Major Projects → Time Sinks (or cut)

---

## User Story Mapping

**Structure:** Horizontal = user journey steps (left to right). Vertical = priority (top = must-have, bottom = nice-to-have).

**Process:**
1. Define user personas (who is this for?)
2. Map the user journey: what does the user do from start to finish?
3. Under each step, list features/stories
4. Prioritize vertically: release 1 (top), release 2, future
5. Identify the **minimum viable path** — the simplest slice through the map that delivers value

---

## Lean Canvas

**Purpose:** One-page business model for early-stage ideas. Forces specificity on the riskiest assumptions.

| Block | Question |
|-------|----------|
| **Problem** | Top 3 problems you're solving? |
| **Existing Alternatives** | How do people solve this today? |
| **Solution** | Top 3 features of your solution? |
| **Key Metrics** | What does success look like numerically? |
| **Unique Value Proposition** | Single clear message: why you're different & worth paying attention |
| **High-Level Concept** | Hook — what's the one-sentence pitch? |
| **Unfair Advantage** | Something that can't be easily copied |
| **Channels** | How do you reach customers? |
| **Customer Segments** | Who are the early adopters? Target customers? |
| **Cost Structure** | What are the main costs? |
| **Revenue Streams** | How do you make money? |

**How to apply:** Fill each block with specific, verifiable statements. Identify the 2-3 riskiest assumptions and design experiments to test them.

---

## Inversion (Munger's Approach)

**Purpose:** Instead of asking "how do I succeed?", ask "how do I guarantee failure?" — then avoid those things.

**Process:**
1. **State the goal** clearly
2. **Invert:** "What would guarantee this fails?"
3. **List failure paths** — be exhaustive and creative
4. **Invert again:** Each failure path becomes a thing to avoid or a check to implement
5. **Design:** Build your plan around avoiding failure paths

**Example:** "How do I build a successful product?"
→ "How do I guarantee my product fails?"
→ "Build something nobody wants. Ignore feedback. Launch late. Spend too much before validating. Hire the wrong people. No metrics."
→ Design principle: Validate demand before building. Ship early. Measure everything. Hire slowly.

---

## When to Use Which Framework

| Situation | Recommended Framework(s) |
|-----------|--------------------------|
| New business idea | Lean Canvas + SWOT |
| Feature prioritization | User Story Mapping + Cost-Benefit Matrix |
| Big bet / high-stakes | Pre-Mortem + First Principles |
| Controversial decision | Six Thinking Hats |
| Challenging industry norms | First Principles + Inversion |
| Competitive strategy | SWOT + Inversion |
| Quick early-stage idea | Lean Canvas (solo) |
| Risk-heavy project | Pre-Mortem + Cost-Benefit Matrix |
