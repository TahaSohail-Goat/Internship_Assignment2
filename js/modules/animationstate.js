/**
 * Shared animation state for the hero scene.
 *
 * Idle motion writes a base pose here, mouse parallax adds offsets, scroll
 * adds a third layer of offsets, and the render loop applies the composed
 * result once per frame via applyAnimationState().
 */
export function createAnimationState() {
  return {
    base: {
      rotationY: 0,
      positionY: 0,
      cameraX: 0,
      cameraY: 0.4,
      cameraZ: 6,
    },
    parallaxOffset: {
      rotationX: 0,
      rotationY: 0,
      cameraX: 0,
      cameraY: 0,
    },
    // Written by scrollanimation.js via a GSAP ScrollTrigger scrub tween.
    // Kept separate from parallaxOffset so scroll and cursor motion never
    // assign the same property.
    scrollOffset: {
      rotationY: 0,
      positionY: 0,
      cameraZ: 0,
      productScale: 1,
    },
  };
}

export function applyAnimationState(state, product, camera) {
  product.rotation.x = state.parallaxOffset.rotationX;
  product.rotation.y =
    state.base.rotationY + state.parallaxOffset.rotationY + state.scrollOffset.rotationY;
  product.position.y = state.base.positionY + state.scrollOffset.positionY;
  product.scale.setScalar(state.scrollOffset.productScale);

  camera.position.set(
    state.base.cameraX + state.parallaxOffset.cameraX,
    state.base.cameraY + state.parallaxOffset.cameraY,
    state.base.cameraZ + state.scrollOffset.cameraZ
  );
  camera.lookAt(0, 0, 0);
}