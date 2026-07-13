import gsap from "gsap";

/**
 * Page-load intro sequence (~2.5s total):
 *   1. The overlay fades away, revealing the scene underneath
 *   2. The product scales from 95% -> 100% and settles its rotation
 *      (both run in parallel with the overlay fade, at t=0)
 *   3. Headline slides up + fades in
 *   4. Tagline follows shortly after
 *   5. Buttons fade in last
 *
 * Built with GSAP for precise, premium easing curves (power2/power3 —
 * no linear motion, no bounce, nothing flashy per apple.md's restraint).
 */
export function playLoadAnimation({
  product,
  overlayEl,
  titleEl,
  taglineEl,
  actionsEl,
  onComplete,
}) {
  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete,
  });

  timeline
    .set(product.scale, { x: 0.95, y: 0.95, z: 0.95 })
    .set(product.rotation, { y: -0.4 })
    .to(overlayEl, { opacity: 0, duration: 1.0, ease: "power2.out" }, 0)
    .to(product.scale, { x: 1, y: 1, z: 1, duration: 1.4 }, 0)
    .to(product.rotation, { y: 0, duration: 1.4 }, 0)
    .to(titleEl, { opacity: 1, y: 0, duration: 0.8 }, 0.6)
    .to(taglineEl, { opacity: 1, y: 0, duration: 0.7 }, 1.0)
    .to(actionsEl, { opacity: 1, y: 0, duration: 0.6 }, 1.5)
    .set(overlayEl, { display: "none" });

  return timeline;
}