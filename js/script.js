/**
 * Nova Audio — Hero Section
 * This file will grow across the following branches:
 *   feat/idle-animation     -> continuous rotation, float, camera orbit
 *   feat/load-animation     -> page-load intro sequence
 *   feat/mouse-parallax     -> cursor-driven tilt and camera parallax
 *   feat/scroll-animation   -> ScrollTrigger-driven scroll sequence
 *   fix/mobile-performance  -> responsive/perf fixes
 */

import { initScene } from "./modules/scene.js";

const canvas = document.getElementById("hero-canvas");
const { scene, camera, renderer } = initScene(canvas);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();