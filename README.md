# Nova Audio — Hero Landing Page

An Apple-inspired, single full-screen (100vh) product hero page for a
fictional headphone product, **Nova One**. Built as Codoc IT Ltd. Intern
Assignment 2 — a static, responsive page implemented with a proper
Git/GitHub feature-branch workflow.

**Live demo:** [add your Vercel URL here after deployment]
**Repository:** https://github.com/TahaSohail-Goat/Internship_Assignment2

## Purpose

Demonstrate a production-style front-end build (semantic HTML, a real
design-token CSS system, vanilla ES modules, a procedural Three.js scene,
and GSAP-driven animation) alongside a disciplined GitHub workflow: one
issue per feature, one branch per issue, one PR per branch, tracked on a
public project board.

## Tech stack

- HTML5 + CSS3 — no Tailwind/Bootstrap, custom design-token system
- Vanilla JavaScript, ES Modules (no bundler/build step)
- [Three.js](https://threejs.org/) — procedural product mesh, no external 3D model file
- [GSAP](https://gsap.com/) (+ ScrollTrigger) — animation timing
- Deployed on [Vercel](https://vercel.com/)

## Setup

No build step required — this is a static site loaded directly via an ES
module import map (Three.js and GSAP are pulled from a CDN at runtime).

```bash
git clone https://github.com/TahaSohail-Goat/Internship_Assignment2.git
cd Internship_Assignment2
```

Then serve the directory with any static file server, for example:

```bash
npx serve .
# or
python -m http.server 8000
```

Open the printed local URL in a browser. Opening `index.html` directly via
`file://` will not work — ES modules require an actual HTTP origin.

## Usage

The page is a single scrollable hero:

1. **Load** — a ~2.5s intro plays on first paint (overlay fade, product
   scale-in, headline/tagline/button reveal).
2. **Idle** — once the intro completes, the product rotates slowly, floats
   gently, and the camera orbits.
3. **Mouse parallax** *(desktop/pointer devices only)* — the product tilts
   and the camera drifts slightly toward the cursor.
4. **Scroll** — on tablet/desktop (≥641px) the hero pins and the product
   scales/rotates/drifts as you scroll, with the text fading out. On phone
   widths (≤640px) this is replaced by a lightweight fade, for performance.

## Project structure

```
Internship_Assignment2/
├── index.html
├── css/
│   └── styles.css              # design tokens + all page styling
├── js/
│   ├── script.js                # orchestrates scene, animation state, load sequence
│   └── modules/
│       ├── product.js           # procedural headphone mesh
│       ├── scene.js             # camera, renderer, lighting, HDR environment
│       ├── animationstate.js    # shared animation-state coordinator
│       ├── idleanimation.js     # continuous idle motion
│       ├── loadanimation.js     # page-load intro sequence
│       ├── mouseparallax.js     # cursor-driven tilt/parallax
│       └── scrollanimation.js   # ScrollTrigger scroll sequence
├── .github/
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature.md
│   │   └── bug.md
│   └── workflows/
│       └── repository-check.yml # CI: verifies required repo files exist
├── CONTRIBUTING.md
├── CHANGELOG.md
└── .gitignore
```

## Architecture note: the animation-state coordinator

Idle motion, mouse parallax, and scroll animation all influence the same
product rotation/position and camera position. Rather than each module
assigning to `product.rotation` / `camera.position` directly (which would
cause them to overwrite each other every frame), each writes into a shared
`animationState` object — `base` (idle), `parallaxOffset` (mouse), and
`scrollOffset` (scroll) — and a single `applyAnimationState()` call
composes all three into the actual Three.js objects once per frame. See
`js/modules/animationstate.js` for details.

## Testing / validation

No automated test suite — validation is manual, checked at the project's
defined breakpoints (1440 / 1068 / 833 / 734 / 640 / 419px) across:
- Responsive layout at each breakpoint
- Load, idle, parallax, and scroll animations independently and combined
- Reduced-quality rendering path on touch/coarse-pointer devices (Issue #8)
- `.github/workflows/repository-check.yml` runs on every push/PR to `main`
  and verifies the required repository files are present

## Status

All planned feature/fix issues (#2–#8) are complete and merged. See the
project board and `CHANGELOG.md` for details.

## Design system

Styling follows a single design-token source of truth (`apple.md`-derived):
Action Blue (`#0066cc`) as the only accent color, no gradients, no shadows
outside the one reserved product-render shadow, SF Pro Display/Text (with
Inter as the cross-platform fallback) at a fixed type scale. See
`css/styles.css` for the full token list.