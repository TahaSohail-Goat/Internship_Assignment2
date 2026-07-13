import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createProduct } from "./product.js";

/**
 * Initializes the Three.js scene: camera, renderer, HDR-style environment,
 * cinematic lighting, shadows, and the product mesh.
 *
 * Returns references needed by later branches (idle animation, parallax,
 * scroll animation) without re-creating the scene.
 */
export function initScene(canvas) {
  // Detected once at init and used to scale renderer cost down on touch
  // devices — antialiasing and shadow-map rendering are two of the more
  // expensive per-frame costs on mobile GPUs, and antialias can only be
  // set at construction time, so this has to happen before the renderer
  // is created. See Issue #8 (fix/mobile-performance).
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.4, 6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isTouchDevice, // MSAA is expensive on mobile GPUs; skip it there
    alpha: true, // transparent background so the CSS hero background shows through
  });
  const maxPixelRatio = isTouchDevice ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = !isTouchDevice; // skip shadow-map pass entirely on touch
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Procedural "HDR" environment for realistic reflections without an external .hdr file
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;
  pmremGenerator.dispose();

  // Cinematic three-point-style lighting
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(3, 5, 4);
  keyLight.castShadow = !isTouchDevice;
  keyLight.shadow.mapSize.set(
    isTouchDevice ? 512 : 1024,
    isTouchDevice ? 512 : 1024
  );
  keyLight.shadow.radius = 6;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xbfd9ff, 1.1);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  // Product
  const product = createProduct();
  product.traverse((child) => {
    if (child.isMesh) child.castShadow = !isTouchDevice;
  });
  scene.add(product);

  // Soft shadow catcher beneath the product (invisible except for its shadow)
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.18 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -1.4;
  shadowPlane.receiveShadow = !isTouchDevice;
  scene.add(shadowPlane);

  // Debounced resize — recalculating the projection matrix and resizing
  // the renderer on every single resize event is wasted work, especially
  // during a drag-resize or a mobile orientation change that fires several
  // events in quick succession.
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  }
  window.addEventListener("resize", handleResize);

  return { scene, camera, renderer, product };
}