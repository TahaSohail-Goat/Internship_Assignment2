# Contributing

This is an individual assignment repository, but it follows a real
feature-branch workflow so the Git/GitHub history itself is part of the
deliverable. These conventions apply to any future work on this repo.

## Branch naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-description>` | `feat/mouse-parallax` |
| Bug fix | `fix/<short-description>` | `fix/mobile-performance` |
| Documentation | `docs/<short-description>` | `docs/setup-guide` |
| Maintenance | `chore/<short-description>` | `chore/add-pr-template` |

Always branch from an up-to-date `main`:

```bash
git switch main
git fetch origin
git pull --rebase origin main
git switch -c feat/<short-description>
```

## Commit messages

- Imperative, specific subject: `feat: add mouse parallax with lerped tilt`
- One commit = one logical change
- Prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`
- Avoid vague messages like `update`, `changes`, `final`, `fixed stuff`

Every branch should have at least two small, logical commits rather than
one large one — see the closed PRs (#9–#15) for the pattern used
throughout this repo (e.g. a refactor commit separated from the feature
commit that depends on it).

## Pull requests

1. Open the PR against `main` with `Closes #<issue-number>` in the
   description.
2. Fill in the PR template (Summary, Linked issue, Type of change,
   Validation, Evidence, Reviewer notes).
3. Wait for the **Repository Quality Check** GitHub Action to pass.
4. Merge using **Rebase and merge** (the default for this repo) to keep
   history linear.
5. Delete the branch after merging.
6. Move the corresponding board card to **Done/Merged**.

## Project board

Every issue is tracked on the repository's project board. Columns:
**Backlog → In Progress → In Review → Done**. Move a card to **In
Progress** when you start work, **In Review** when the PR opens, and
**Done** once it's merged and verified — these two moves are manual since
GitHub doesn't auto-trigger on branch creation or PR-opened events.

## Local setup

No build step. Clone the repo and serve it with any static file server
(see `README.md` → Setup). There is no `npm install` step — Three.js and
GSAP are loaded at runtime via the import map in `index.html`.

## Design system rules

All styling must go through the design tokens defined in
`css/styles.css` (colors, typography, spacing, radii). Do not introduce a
second accent color, add shadows outside the reserved product-render
shadow, or use gradients — see the token comments in `styles.css` for the
full rule set sourced from the project's design reference.