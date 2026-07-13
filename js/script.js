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

const canvas = document.getElementById("hero-canvas");
const { scene, camera, renderer, product } = initScene(canvas);

const idleAnimation = createIdleAnimation(product, camera);

// Clock starts only once the load animation completes, so idle motion
// (which sets rotation/position every frame) never fights the GSAP
// intro tween for control of the same properties.
const clock = new THREE.Clock(false);
let introComplete = false;

function animate() {
  requestAnimationFrame(animate);

  if (introComplete) {
    idleAnimation.update(clock.getElapsedTime());
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