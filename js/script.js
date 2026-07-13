/**
 * Nova Audio — Hero Section
 * This file will grow across the following branches:
 *   feat/idle-animation     -> continuous rotation, float, camera orbit
 *   feat/load-animation     -> page-load intro sequence
 *   feat/mouse-parallax     -> cursor-driven tilt and camera parallax
 *   feat/scroll-animation   -> ScrollTrigger-driven scroll sequence
 *   fix/mobile-performance  -> responsive/perf fixes
 */

import * as THREE from "three";
import { initScene } from "./modules/scene.js";
import { createIdleAnimation } from "./modules/idleanimation.js";
import { playLoadAnimation } from "./modules/loadanimation.js";
import { createAnimationState, applyAnimationState } from "./modules/animationstate.js";
import { createMouseParallax } from "./modules/mouseparallax.js";
import { createScrollAnimation } from "./modules/scrollanimation.js";

const canvas = document.getElementById("hero-canvas");
const heroEl = document.getElementById("hero");
const contentEl = document.querySelector(".hero__content");
const { scene, camera, renderer, product } = initScene(canvas);

// Shared coordinator: idle, mouse-parallax, and scroll all write into this
// instead of assigning to product.rotation / camera.position directly, so
// none of them fight over the same properties. See CONTINUATION_BRIEF.md
// section 6.
const animationState = createAnimationState();
const idleAnimation = createIdleAnimation(product, camera, animationState);
const mouseParallax = createMouseParallax(canvas, animationState);

// Clock starts only once the load animation completes, so idle/parallax
// (which compose rotation/position every frame via applyAnimationState)
// never fight the GSAP intro tween for control of the same properties.
const clock = new THREE.Clock(false);
let introComplete = false;

// Tracks the current rAF handle so the loop can be fully stopped (not just
// skipped) while the tab is hidden — see the visibilitychange listener
// below. Issue #8 (fix/mobile-performance).
let rafId = null;

function animate() {
  rafId = requestAnimationFrame(animate);

  if (introComplete) {
    idleAnimation.update(clock.getElapsedTime());
    mouseParallax.update();
    applyAnimationState(animationState, product, camera);
  }

  renderer.render(scene, camera);
}

animate();

// Fully cancel the render loop when the tab/app is backgrounded, rather
// than letting requestAnimationFrame keep firing (some mobile browsers
// throttle but don't stop it). Real battery savings on a page that's
// running a continuous Three.js render loop.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  } else if (rafId === null) {
    animate();
  }
});

playLoadAnimation({
  product,
  overlayEl: document.getElementById("hero-overlay"),
  titleEl: document.getElementById("hero-title"),
  taglineEl: document.getElementById("hero-tagline"),
  actionsEl: document.getElementById("hero-actions"),
  onComplete: () => {
    introComplete = true;
    clock.start();

    // Only created after the intro finishes — see the note in
    // scrollanimation.js on why this can't happen any earlier.
    createScrollAnimation({ heroEl, contentEl, state: animationState });
  },
});