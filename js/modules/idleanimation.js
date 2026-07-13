/**
 * Continuous idle motion for the hero product: a very subtle rotation,
 * a gentle vertical float, and a slow camera orbit. All motion is driven
 * by smooth sine/cosine functions of elapsed time — this IS the premium
 * easing here (no sudden starts/stops, no linear motion, no flashy moves).
 */

const ROTATION_SPEED = 0.08; // radians/sec — a full turn takes ~78 seconds
const FLOAT_AMPLITUDE = 0.06; // world units
const FLOAT_SPEED = 0.6; // controls the float's cycle speed
const ORBIT_RADIUS = 6;
const ORBIT_HEIGHT = 0.4;
const ORBIT_SPEED = 0.05; // a full camera orbit takes ~2 minutes

export function createIdleAnimation(product, camera) {
  const baseProductY = product.position.y;

  function update(elapsedTime) {
    // Subtle continuous rotation
    product.rotation.y = elapsedTime * ROTATION_SPEED;

    // Gentle float up/down — sine gives naturally eased motion at the
    // top/bottom of each cycle, unlike a linear back-and-forth
    product.position.y =
      baseProductY + Math.sin(elapsedTime * FLOAT_SPEED) * FLOAT_AMPLITUDE;

    // Slow camera orbit around the product
    const angle = elapsedTime * ORBIT_SPEED;
    camera.position.x = Math.sin(angle) * ORBIT_RADIUS;
    camera.position.z = Math.cos(angle) * ORBIT_RADIUS;
    camera.position.y = ORBIT_HEIGHT;
    camera.lookAt(0, 0, 0);
  }

  return { update };
}