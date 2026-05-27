---
marp: true
theme: default
paginate: true
backgroundColor: #1a1a2e
color: #eaeaea
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  h1 {
    color: #e94560;
    font-size: 2.0em;
  }
  h2 {
    color: #0f3460;
    background: linear-gradient(90deg, #e94560, #0f3460);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 1.6em;
  }
  section.lead {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    text-align: center;
  }
  section.lead h1 {
    font-size: 2.6em;
    color: #e94560;
  }
  section.lead h2 {
    font-size: 1.4em;
    background: none;
    -webkit-text-fill-color: #eaeaea;
    color: #eaeaea;
  }
  section.invert {
    background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  }
  section.invert h1 {
    color: #e94560;
  }
  strong {
    color: #e94560;
  }
  code {
    background: #16213e;
    color: #53d8fb;
    padding: 2px 6px;
    border-radius: 4px;
  }
  blockquote {
    border-left: 4px solid #e94560;
    padding-left: 16px;
    font-style: italic;
    color: #b0b0b0;
  }
  table {
    font-size: 0.85em;
  }
  th {
    background: #0f3460;
    color: #eaeaea;
  }
  td {
    background: #16213e;
  }
  ul li {
    margin-bottom: 0.4em;
  }
  .emoji {
    font-size: 1.4em;
  }
  section.divider {
    background: linear-gradient(135deg, #e94560 0%, #0f3460 100%);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  section.divider h1 {
    color: #ffffff;
    font-size: 2.4em;
  }
---

<!-- _class: lead -->

# Spec-Driven Development
## with SpecKit

An AI prompting framework for structured,
reliable coding agent workflows

---

# What is Spec-Driven Development?

`Initial high-level spec` - Start with a **clear, high-level specification** of what you want to build — describing _what_ it should be and _what_ it should do — **without** going into technical implementation details.

From that spec, everything else is **derived**:

1. **Spec** → High-level feature description (the _what_ and _why_)
2. **Plan** → Detailed technical implementation plan (the _how_)
3. **Tasks** → Ordered, actionable coding tasks
4. **Code** → The actual implementation


---

# What is SpecKit?

SpecKit is **an AI prompting framework** released by GitHub that integrates with coding agents like:

- GitHub Copilot
- Claude Code
- Codex
- Cursor
- Gemini CLI

It provides **pre-made prompts/slash-cmd and scripts** to guide AI through a structured development cycle — producing **better, more reliable results**.

---

<!-- _class: divider -->

# The Problem with Vibe Coding

---

# The Vibe Coding Problem

When you just **"let the AI go wild"**, things go sideways fast:

- **Wanders off track** — implements things you never asked for
- **Random buggy code** — inconsistent patterns and hidden bugs
- **Carelessly stitched together** — no coherent architecture
- **Constant back-and-forth** — "Can you change this? Do this? Undo that?"
- **Reverting & scrapping** — starting over from scratch repeatedly

> "I think when you just let the AI go wild, it's way too easy for it to wander off, throw in random buggy code, and everything ends up feeling just carelessly stitched together."

---

# Why Vibe Coding Fails at Scale

| Problem | What Happens |
|---|---|
| No guiding principles | AI contradicts itself across files |
| No spec boundary | Features creep and bloat uncontrollably |
| Context overload | Long chat history degrades AI output |
| No verification | Inconsistencies slip through unnoticed |
| No reusability | Can't reuse the same spec with a different stack |

The result: **you spend more time fixing AI output than you saved by using AI.**

---

<!-- _class: divider -->

# The SDD + SpecKit Solution

---

# The SpecKit Development Cycle

```text
  ┌──────────────┐
  │ /constitution│  Governing principles (one-time setup)
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │   /specify   │  High-level feature spec (what & why)
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │   /clarify   │  Fill gaps & ambiguities (optional)
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │    /plan     │  Technical implementation plan (how)
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │    /tasks    │  Ordered, actionable task list
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │   /analyze   │  Cross-artifact consistency check (optional)
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │  /implement  │  AI executes tasks → working code
  └──────────────┘
```

---

# Step 1: Constitution — Set the Rules

The **constitution file** defines non-negotiable principles for the entire project:

- Clean code standards
- UX requirements (simple, accessible)
- Tech stack, Testing policies, ...

> "We're putting walls around the application and saying — stay within these boundaries at all times."

These principles **trump all other information** and serve as persistent memory for every future spec.

---

# Step 2: Specify — Describe the Feature

The spec focuses on **what** and **why**, not how:

- **User stories** — What the user needs and why
- **Acceptance scenarios** — Concrete pass/fail conditions
- **Edge cases** — What happens in unusual situations
- **Functional requirements** — Numbered, testable "the system must..." items
- **Key entities** — Data models at a conceptual level

The spec is kept **non-technical** — readable by non-technical stakeholders.


---

# Step 3: Clarify — Polish the Spec

The `/clarify` command has the AI **ask you targeted questions** about ambiguities:

- How should data persist between sessions?
- What happens when a deadline passes?
- How should validation errors display?
- How should completed items be sorted?

Each answer gets **baked back into the spec** — filling `[NEEDS_CLARIFICATION]` markers and adding new functional requirements.

This step ensures the spec is **airtight before planning begins**.

---

# Step 4: Plan — Design the Architecture

Now you provide **technical preferences**:

- CSS framework (Tailwind, etc.)
- UI component library (shadcn, etc.)
- State management approach
- Storage solution (localStorage, database)
- Date libraries, APIs, etc.

The plan generates:
- **Research notes** — Best practices, decisions, trade-offs
- **Data models** — Typed schemas with enums and interfaces
- **Contract files** — Component props, function signatures, API shapes
- **Project structure** — Exact file paths and folder layout

---

# Step 5: Tasks — Create the Roadmap

The `/tasks` command converts the plan into **sequenced, actionable tasks**:

| Phase | Example Tasks |
|---|---|
| **Setup** | Install dependencies, configure theme |
| **Core: Types** | Create interfaces, storage service |
| **Core: UI** | Build GoalCard, GoalForm, Modal |
| **Core: Logic** | Custom hooks, CRUD operations |
| **Integration** | Wire components into pages/layout |
| **Polish** | Visual highlighting, edge cases |

Tasks include **dependency chains** — the AI knows what must finish before what.

---

# Step 6: Implement — Let the AI Code

Finally, `/implement` tells the coding agent to **execute every task**:

- Creates a to-do for each task and checks them off
- Follows the contract files, data models, and architecture
- Respects constitutional principles throughout
- Reports progress and completion status

> Best practice: **Start a fresh chat session** for implementation. A bloated context window from planning degrades output quality.

---

<!-- _class: divider -->

# Benefits of SDD with SpecKit

---

# Why SDD + SpecKit Works

**You stay in the loop** — you can see exactly what the AI is planning and doing at every stage.

- **Less chance of going off track** — every step validates against the spec
- **Constitution as guardrails** — non-negotiable principles enforced everywhere
- **Reusable specs** — same spec, different tech stack, new plan
- **Contracts as documentation** — AI has clear boundaries and interfaces
- **Cross-artifact validation** — the analyze step catches inconsistencies
- **Structured output** — plans, models, and tasks are all reviewable markdown

---

# Reusable Specs

A spec contains **no implementation details** — only user-facing requirements.

This means you can:

| Same Spec | Different Plan |
|---|---|
| Goal tracking app | localStorage → PostgreSQL |
| Goal tracking app | React → Vue |
| Goal tracking app | Tailwind → vanilla CSS |
| Goal tracking app | Desktop → Mobile (React Native) |

> "If I wanted to make a similar feature using a different stack or database instead of local storage, then I could use that spec file again."

---

# Built-in Quality Checks

SpecKit includes **self-verification** at multiple stages:

- **Content quality checklist** in every spec (no implementation details? focused on user value?)
- **Constitution compliance table** in every plan (all principles pass?)
- **Coverage summary** from `/analyze` (95%+ requirement coverage?)
- **Dependency ordering** in tasks (correct execution sequence?)
- **Conflict detection** across all artifacts (no contradictions?)

The AI checks its own work before you even review it.

---

<!-- _class: divider -->

# Do's and Don'ts of SDD

---

# Do's ✓

- **Do** keep specs high-level — focus on _what_ and _why_, not _how_
- **Do** review specs before planning — it's the foundation for everything
- **Do** use the clarify step — fill gaps before they become bugs
- **Do** start with an existing/scaffolded project — SpecKit works best adding features incrementally
- **Do** experiment with different AI models per stage — some are better at planning vs coding
- **Do** commit after each stage — create checkpoints you can revert to
- **Do** start a fresh chat for implementation — avoid context window bloat

---

# Don'ts ✗

- **Don't** try to one-shot an entire app in a single spec — the model veers off track
- **Don't** skip reviewing generated artifacts — AI output isn't always right
- **Don't** put technical details in the spec — save that for the plan
- **Don't** make specs too small — SpecKit becomes overkill for trivial changes
- **Don't** blindly trust the AI — always read the plan, tasks, and code
- **Don't** reuse a bloated chat session — long context history degrades quality
- **Don't** ignore constitution principles — they exist to prevent scope creep

---

# How Big Should a Spec Be?

Finding the **sweet spot** matters:

| Too Small | Just Right | Too Big |
|---|---|---|
| "Add a button" | "Goal tracking page with CRUD, persistence, and deadline highlighting" | "Build the entire app with auth, dashboard, settings, and notifications" |
| SpecKit is overkill | Multiple components, clear scope | Model veers off track |

> "I found that working on contained features works better than trying to one-shot an entire application with a single spec."

Aim for a **contained feature** — big enough to benefit from structure, small enough to stay coherent.

---

<!-- _class: divider -->

# Additional Insights

---

# Choosing the Right Model per Stage

Different AI models excel at different stages:

| Stage | Consideration |
|---|---|
| Specify / Clarify | Models that reason step-by-step (e.g., Sonnet) let you watch the process |
| Plan / Tasks | Models with strong structured output (e.g., GPT-5) may produce better task lists |
| Implement | Capable coding models that follow instructions precisely |

> "I would try this whole process out with different models because they do produce different results."

**Experiment** — find what works best for each stage in your workflow.

---

# Project Memory: Constitution as Guardrails

The constitution file acts as **persistent memory** across all features:

```text
Constitution
├── Clean Code → readable, maintainable, single-responsibility
├── Simple UX  → minimal clicks, clear feedback, intuitive
├── Responsive → mobile-first, touch targets ≥ 44px
├── Minimal Dependencies → justify every new package
└── Technology Stack → pinned versions from package.json
```

When you run `/constitution`, SpecKit also **updates template files** to align with your principles — ensuring consistency across all future specs.

---

# The Analyze Step: Your Safety Net

The `/analyze` command catches what humans miss:

- **Ambiguities** — "fun pastel colors" lacks specific color values
- **Inconsistencies** — same file referenced in two different tasks
- **Under-specification** — business logic tasks missing file paths
- **Coverage gaps** — requirements without matching implementation tasks
- **Constitutional violations** — tasks that break your core principles

It outputs a **severity-rated table** with actionable recommendations.

> Think of it as a final code review — but for your entire planning pipeline.

---

# SpecKit Folder Structure

```text
project/
├── .github/prompts/          # Slash commands for your coding agent
│   ├── constitution.prompt.md
│   ├── specify.prompt.md
│   ├── clarify.prompt.md
│   ├── plan.prompt.md
│   ├── tasks.prompt.md
│   ├── analyze.prompt.md
│   └── implement.prompt.md
├── .speckit/
│   ├── memory/constitution.md  # Non-negotiable principles
│   ├── scripts/                # Automation (branch, file creation)
│   └── templates/              # Templates for spec, plan, tasks
└── specs/
    ├── 001-initial-page-setup/ # Feature 1
    │   ├── spec.md
    │   ├── plan.md
    │   ├── tasks.md
    │   ├── research.md
    │   ├── data-model.md
    │   └── contracts/
    └── 002-drag-and-drop/      # Feature 2
        ├── spec.md
        ├── plan.md
        └── ...
```

---

# Git Integration

SpecKit handles **branching automatically**:

- Each feature gets its own branch: `001-initial-page-setup`, `002-drag-and-drop`
- Branch names are derived from the **first three words** of your spec input
- Feature numbers auto-increment
- All work stays off `main` until you merge

> "It's not making changes directly to the main branch."

**Tip**: Name your spec input intentionally — those first three words become your branch name.

---

# The Full Cycle in Practice

A real-world feature addition (drag-and-drop reordering):

| Step | Time | Command |
|---|---|---|
| Skip constitution | — | Already set |
| Create spec | ~2 m | `/specify drag and drop — let's make it so users can reorder goals by dragging...` |
| Clarify spec | ~3 m | `/clarify` → answer 5 questions |
| Plan feature | ~3 m | `/plan using @dnd-kit/sortable and Tailwind for styling` |
| Generate tasks | ~1 m | `/tasks` |
| Implement | ~5 m | `/implement` (new chat session) |
| Total | ~15 m | Working drag-and-drop feature |
| x | ~xxxxxx | xx |

---

<!-- _class: lead -->

# Key Takeaway

## Spec-Driven Development isn't about slowing down.
## It's about giving AI the **right constraints**
## so it can build the **right thing**.

---

<!-- _class: lead -->

# Get Started

```bash
uvx speckit-cli --here
```

GitHub: [github.com/github/spec-kit](https://github.com/github/spec-kit)

> "I've really enjoyed using SpecKit because I've never been a fan of full-on vibe coding."

**Give AI structure. Get better code.**
