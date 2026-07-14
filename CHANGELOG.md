# Changelog

All notable changes to this project are documented here. Format loosely
follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Repository foundation: README, CONTRIBUTING, CHANGELOG, issue templates,
  PR template, `.gitignore` (#2)
- Semantic HTML hero structure and initial design-token CSS system (#2)
- Three.js scene setup: camera, renderer, procedural product mesh,
  three-point lighting, procedural HDR environment (#3)
- Idle animation: continuous product rotation, vertical float, camera
  orbit (#4)
- Page-load intro animation sequence via GSAP (overlay fade, product
  scale-in, staggered text/button reveal) (#5)
- Mouse parallax: cursor-driven product tilt and camera drift with lerp
  smoothing (#6)
- Shared animation-state coordinator so idle, parallax, and scroll
  animation compose instead of overwriting each other (#6)
- Scroll-triggered hero animation via GSAP ScrollTrigger: pinned scrub on
  desktop/tablet, lightweight fade on mobile (#7)
- GitHub Actions workflow (`repository-check.yml`) verifying required
  repository files on every push/PR to `main`

### Fixed
- Mobile performance: touch-aware renderer quality (disabled antialiasing
  and shadow map, reduced pixel ratio cap on coarse-pointer devices),
  debounced window resize handling, mouse parallax disabled on touch
  devices, render loop paused via the Page Visibility API when the tab is
  hidden (#8)

## [0.1.0] — TBD

Initial release for Codoc IT Ltd. Assignment 2 submission.