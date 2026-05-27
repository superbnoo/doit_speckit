# Question:
> using spec-kit sdd, is it possible for multiple devs working on multiple specs each at the same time, then merge to main? If so, how is the specs/0xx-feature-name folder is name?

Yes. In fact, Spec-Kit / SDD workflows work *very well* with parallel development if you treat each spec as an isolated vertical slice.

A common setup looks like this:

```text
main
 ├── specs/
 │    ├── 001-auth/
 │    ├── 002-billing/
 │    ├── 003-search/
 │    └── 004-notifications/
 │
 ├── feature branches
 │    ├── feat/001-auth
 │    ├── feat/002-billing
 │    └── feat/003-search
```

Each developer owns:

* one spec folder
* one feature branch
* one implementation stream

Then later:

* merge independently into `main`
* or merge behind feature flags
* or merge to integration branch first

---

# Recommended workflow

## 1. Reserve spec numbers centrally

Usually:

* whoever creates the spec gets the next number
* numbers are never reused

Example:

```text
001-auth
002-payments
003-admin-dashboard
```

Even if:

* `002` gets delayed
* `003` ships first

…you still keep numbering stable.

This avoids Git conflicts and renaming chaos.

---

# How multiple devs work simultaneously

Developer A:

```text
specs/001-auth/
```

Developer B:

```text
specs/002-payments/
```

Developer C:

```text
specs/003-search/
```

Each contains:

```text
spec.md
plan.md
tasks.md
research.md
contracts/
```

Because folders are isolated:

* almost zero merge conflicts
* planning artifacts stay clean
* implementation context remains scoped

---

# Important rule: spec number ≠ release order

The spec ID is just:

* a stable identifier
* a namespace

Not:

* sprint order
* release order
* merge order

This is important.

---

# Good naming convention

Best practice:

```text
specs/001-authentication
specs/002-billing-stripe
specs/003-search-api
```

Pattern:

```text
NNN-short-kebab-name
```

Where:

* `NNN` = immutable ID
* name = short capability

Avoid:

* overly long names
* vague names
* renaming after creation

---

# Very common team setup

## Branch naming

```text
feat/001-authentication
feat/002-billing
```

## PR naming

```text
[001] Authentication
[002] Billing integration
```

## Commit naming

```text
[001] add auth middleware
[001] add login page
```

This creates traceability across:

* specs
* tasks
* code
* PRs
* releases

---

# Large team approach

Larger teams often add a registry:

```text
specs/index.md
```

Example:

```md
| ID  | Name           | Owner | Status |
|-----|----------------|-------|--------|
| 001 | auth           | Alice | active |
| 002 | billing        | Bob   | review |
| 003 | search         | Carol | done   |
```

This prevents duplicate numbers.

---

# What NOT to do

Avoid naming specs like:

```text
specs/login-page-final-final-v2
```

or:

```text
specs/current-work
```

You lose:

* stable references
* automation compatibility
* agent tooling consistency

---

# Why numbering matters for AI agents

Agents can reliably reference:

```text
/specs/003-search-api/tasks.md
```

without ambiguity.

This becomes important for:

* planning agents
* task agents
* implementation agents
* review agents

Stable IDs make automation much easier.

---

# My recommendation

For solo or small teams:

```text
001-auth
002-billing
003-search
```

For larger teams:

```text
001-authentication
002-billing-stripe
003-search-api
004-mobile-sync
```

and maintain:

```text
specs/index.md
```

as the allocation registry.

# Question:
> but if person one not merge 001-authentication yet, how the specify can create 002-billing-stripe? it will create 001-billing-stripe right?

Correct — this is one of the practical problems with naive auto-numbering.

If `/specify` simply:

* scans the local `specs/`
* picks max + 1

…then two developers on different branches can both create:

```text
001-something
```

which later conflicts.

So in real multi-dev workflows, teams usually use one of these approaches:

---

# Option 1 (Best): Reserve IDs before implementation

Before running `/specify`, developers reserve a number.

Example:

```text
001-authentication
002-billing-stripe
003-search-api
```

even if:

* only `001` exists on `main`
* `002` is still just planned
* `003` is not started

This is the cleanest approach.

Usually done via:

* `specs/index.md`
* Jira ticket
* Linear issue
* GitHub issue
* lightweight registry file

Then `/specify` accepts explicit IDs:

```bash
/specify 002 billing-stripe
```

instead of auto-incrementing.

This is how most mature SDD systems evolve.

---

# Option 2: Timestamp IDs (also common)

Instead of sequential:

```text
001-auth
002-billing
```

use:

```text
20260527-auth
20260527-billing
```

or:

```text
202605271430-auth
```

This avoids collisions entirely.

Pros:

* no coordination
* parallel-safe

Cons:

* less human-friendly

---

# Option 3: Random/UUID IDs

Example:

```text
specs/a91f-auth
specs/b72k-billing
```

Great for automation.

Less nice for humans.

---

# Why sequential numbering becomes hard in parallel teams

Sequential IDs assume:

```text
create spec
→ merge spec
→ next spec
```

But real teams do:

```text
Dev A creates auth branch
Dev B creates billing branch
Dev C creates search branch
```

all simultaneously.

So local auto-increment is inherently race-condition prone.

---

# What Spec-Kit usually assumes

Most Spec-Kit examples assume:

* single developer
  or
* serialized spec creation

So the simple:

```python
next_id = max(existing) + 1
```

works there.

But once you scale to teams:

* you need reservation
* or non-sequential IDs

---

# My recommended solution

For teams:

## Add a registry

```text
specs/index.md
```

Example:

```md
001 authentication reserved alice
002 billing-stripe reserved bob
003 search-api reserved carol
```

Then `/specify`:

1. locks registry
2. allocates next ID
3. creates folder

This fully solves the issue.

---

# Even better: detached spec creation

Instead of deriving IDs from filesystem:

```bash
/specify --id 002 billing-stripe
```

or:

```bash
/specify billing-stripe
# internally asks allocation service
```

This is how enterprise systems usually do it.

---

# Short answer

Yes, your concern is absolutely valid.

Without coordination:

* two devs can both generate `001-*`
* causing merge conflicts

So parallel SDD requires either:

* reserved sequential IDs
* timestamps
* UUIDs
* centralized allocation

Sequential auto-increment from local filesystem only works reliably for single-threaded workflows.


# Question:
> traditionally code is the source of truth - in sdd, spec is the source of truth. Now let's say there is a change request in a spec. How to update the spec and update the code, and also other propagated changes to other spec?

This is one of the hardest and most important parts of real SDD.

You’ve identified the central shift correctly:

Traditional development:

```text id="dmbfjw"
Code = source of truth
Docs follow code
```

SDD:

```text id="q7z7h7"
Spec = source of truth
Code implements spec
```

So the real question becomes:

> How do changes propagate safely through the spec graph?

This is where mature SDD starts looking closer to:

* architecture governance
* schema evolution
* API versioning
* ADR systems
* database migrations

rather than just “documentation”.

---

# Core principle

In SDD:

```text id="o9vbri"
CHANGE SPEC FIRST
THEN DERIVE CODE CHANGES
```

Never:

```text id="n6yr9d"
change code first
then patch spec later
```

Otherwise the spec stops being authoritative.

---

# Recommended mental model

Treat specs like database schemas.

When schema changes:

* downstream consumers break
* migrations are needed
* compatibility matters

Same with specs.

---

# Example

Suppose:

```text id="m62d0j"
001-authentication
```

defines:

```yaml id="yz6h2v"
User:
  id
  email
  password_hash
```

Later change request:

```text id="qg0cbb"
Add multi-tenant support
```

Now auth spec changes:

```yaml id="g1w6c2"
User:
  tenant_id
```

This impacts:

* billing
* permissions
* audit logs
* notifications
* analytics

So change propagation must happen.

---

# Proper SDD flow

## Step 1 — Update originating spec

Modify:

```text id="7l0e1v"
specs/001-authentication/spec.md
```

Add:

* new requirements
* changed behavior
* migration notes
* compatibility notes

Often with:

```md id="i7jz18"
## Change Log

### v1.2
- Added tenant_id to User
- Updated session validation
```

---

# Step 2 — Detect affected specs

This is the missing piece in most toy SDD examples.

Mature SDD systems maintain:

```text id="0l31l7"
spec dependencies
```

Example:

```yaml id="1i1n9s"
depends_on:
  - 001-authentication
```

inside:

```text id="e8r3dj"
002-billing
003-notifications
004-admin
```

Now tooling can determine:

```text id="x9t8tu"
001 changed
→ downstream specs affected
```

---

# Step 3 — Create propagation tasks

Affected specs receive updates.

Example:

```text id="g7hkgd"
specs/002-billing/tasks.md
```

gets:

```md id="fp36qy"
- [ ] Support tenant-scoped invoices
- [ ] Add tenant validation
```

This is similar to dependency graph invalidation.

---

# Step 4 — Update downstream specs

Not necessarily full rewrites.

Usually:

* contracts
* assumptions
* APIs
* data models
* edge cases

must be updated.

Example:

```text id="umq3m9"
003-notifications/spec.md
```

changes from:

```text id="bq9v9c"
send user email
```

to:

```text id="v7s9yc"
send tenant-scoped user email
```

---

# Step 5 — Regenerate implementation plans

Then:

* tasks
* plans
* implementation agents

recompute from updated specs.

This is critical.

Because:

* old implementation plans may now be invalid
* tasks may conflict with new constraints

---

# Important concept: spec versions

Mature SDD systems version specs.

Example:

```text id="jlwmya"
001-authentication v1.0
001-authentication v1.1
001-authentication v2.0
```

Why?

Because:

* some features may still depend on older assumptions
* breaking changes must be explicit

Very similar to API versioning.

---

# The missing capability in most SDD tooling

Most current SDD demos only support:

```text id="q4h2af"
spec → code
```

But real-world SDD requires:

```text id="k0umct"
spec graph management
impact analysis
dependency propagation
change tracking
migration planning
```

This is where the hard engineering begins.

---

# Recommended repository structure

A good scalable structure:

```text id="w0bqqw"
specs/
 ├── 001-authentication/
 │    ├── spec.md
 │    ├── contracts/
 │    ├── changelog.md
 │    └── metadata.yaml
 │
 ├── 002-billing/
 │    ├── metadata.yaml
 │    └── spec.md
```

Example metadata:

```yaml id="2x6w5o"
id: 002
name: billing
depends_on:
  - 001-authentication

version: 1.3
```

---

# Very important distinction

In mature SDD:

## Specs are NOT documentation

They are:

```text id="cb8m2t"
executable architectural contracts
```

Code is merely one projection of the spec.

Other projections:

* tests
* APIs
* DB schemas
* infrastructure
* monitoring
* analytics
* permissions

can all derive from specs.

---

# Real-world analogy

Think about Kubernetes.

The YAML spec is source of truth.

Controllers continuously reconcile:

* actual state
* desired state

SDD eventually evolves similarly:

```text id="42mhkc"
desired architecture state
→ reconcile implementation
```

---

# Best practical approach today

For current AI-assisted SDD systems:

## Add:

* `depends_on`
* `version`
* `change_log`

to every spec.

## When changing a spec:

1. update spec first
2. run impact analysis
3. identify affected specs
4. regenerate tasks/plans
5. implement changes
6. reconcile downstream specs

That’s the scalable path.

---

# Short answer

In real SDD:

```text id="a4mh2j"
spec change
→ dependency analysis
→ downstream spec updates
→ task regeneration
→ code reconciliation
```

The difficult part is not generating code.

The difficult part is managing the evolving graph of specifications over time.
