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
import { createIdleAnimation } from "./modules/idleAnimation.js";
import { playLoadAnimation } from "./modules/loadAnimation.js";
import { createAnimationState, applyAnimationState } from "./modules/animationState.js";
import { createMouseParallax } from "./modules/mouseParallax.js";

const canvas = document.getElementById("hero-canvas");
const { scene, camera, renderer, product } = initScene(canvas);

// Shared coordinator: idle and mouse-parallax both write into this instead
// of assigning to product.rotation / camera.position directly, so they
// never fight over the same properties. See CONTINUATION_BRIEF.md section 6.
const animationState = createAnimationState();
const idleAnimation = createIdleAnimation(product, camera, animationState);
const mouseParallax = createMouseParallax(canvas, animationState);

// Clock starts only once the load animation completes, so idle/parallax
// (which compose rotation/position every frame via applyAnimationState)
// never fight the GSAP intro tween for control of the same properties.
const clock = new THREE.Clock(false);
let introComplete = false;

function animate() {
  requestAnimationFrame(animate);

  if (introComplete) {
    idleAnimation.update(clock.getElapsedTime());
    mouseParallax.update();
    applyAnimationState(animationState, product, camera);
  }

  renderer.render(scene, camera);
}

animate();

playLoadAnimation({
  product,
  overlayEl: document.getElementById("hero-overlay"),
  titleEl: document.getElementById("hero-title"),
  taglineEl: document.getElementById("hero-tagline"),
  actionsEl: document.getElementById("hero-actions"),
  onComplete: () => {
    introComplete = true;
    clock.start();
  },
});