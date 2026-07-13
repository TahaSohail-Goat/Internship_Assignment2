/**
 * mouseParallax.js
 *
 * Tracks pointer position and produces a lerped, damped tilt/offset that is
 * written into the shared animation state's `parallaxOffset` bucket each
 * frame. Never assigns to product.rotation or camera.position directly —
 * animationState.js composes base + parallaxOffset once per frame.
 *
 * Usage:
 *   const parallax = createMouseParallax(canvas, state);
 *   // in the render loop, after idleAnimation.update(elapsedTime):
 *   parallax.update();
 *   // then applyAnimationState(state, product, camera);
 *
 *   // cleanup when needed:
 *   parallax.dispose();
 */

const MAX_TILT_Y = 0.18;      // radians, product yaw toward cursor
const MAX_TILT_X = 0.08;      // radians, product pitch toward cursor
const MAX_CAMERA_X = 0.25;    // camera lateral drift
const MAX_CAMERA_Y = 0.12;    // camera vertical drift
const LERP_FACTOR = 0.06;     // smoothing — lower = smoother/slower

export function createMouseParallax(targetEl, state) {
  // Normalized pointer position, -1..1 on both axes, (0,0) = center/rest
  let targetX = 0;
  let targetY = 0;

  // Current (lerped) values actually applied to state each frame
  let currentX = 0;
  let currentY = 0;

  function handlePointerMove(event) {
    const rect = targetEl.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;   // 0..1
    const py = (event.clientY - rect.top) / rect.height;   // 0..1
    targetX = px * 2 - 1;  // -1..1
    targetY = py * 2 - 1;  // -1..1
  }

  function handlePointerLeave() {
    // Ease back to rest instead of snapping
    targetX = 0;
    targetY = 0;
  }

  targetEl.addEventListener('pointermove', handlePointerMove);
  targetEl.addEventListener('pointerleave', handlePointerLeave);

  return {
    update() {
      // Smooth toward target — this is what prevents sudden movement
      currentX += (targetX - currentX) * LERP_FACTOR;
      currentY += (targetY - currentY) * LERP_FACTOR;

      state.parallaxOffset.rotationY = currentX * MAX_TILT_Y;
      state.parallaxOffset.rotationX = currentY * MAX_TILT_X;
      state.parallaxOffset.cameraX = currentX * MAX_CAMERA_X;
      state.parallaxOffset.cameraY = -currentY * MAX_CAMERA_Y;
    },

    dispose() {
      targetEl.removeEventListener('pointermove', handlePointerMove);
      targetEl.removeEventListener('pointerleave', handlePointerLeave);
    },
  };
}