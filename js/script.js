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

const canvas = document.getElementById("hero-canvas");
const { scene, camera, renderer, product } = initScene(canvas);

const idleAnimation = createIdleAnimation(product, camera);
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  idleAnimation.update(elapsedTime);

  renderer.render(scene, camera);
}

animate();