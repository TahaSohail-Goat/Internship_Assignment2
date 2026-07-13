import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered hero animation.
 *
 * Pins the hero for one viewport of additional scroll and scrubs the
 * product/camera through a subtle settle-and-shrink motion as the user
 * scrolls past: the product shrinks slightly, drifts down, gains a bit of
 * extra rotation, and the camera pulls in — while the headline/tagline/
 * buttons fade and lift out.
 *
 * The tween targets state.scrollOffset directly (GSAP can tween any plain
 * object's numeric properties), so this composes with idle + parallax in
 * applyAnimationState() instead of assigning to product/camera itself.
 * See CONTINUATION_BRIEF.md section 6.
 *
 * IMPORTANT: call this only from playLoadAnimation's onComplete callback
 * (script.js does this), never before. Creating the ScrollTrigger earlier
 * would let a user who scrolls during the ~2.5s intro start scrubbing
 * scrollOffset while the GSAP load tween is still mid-flight, and the two
 * would fight over the same product transform for that brief window.
 */
export function createScrollAnimation({ heroEl, contentEl, state }) {
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: heroEl,
      start: "top top",
      end: "+=100%",
      scrub: 1,
      pin: true,
    },
  });

  timeline
    .to(state.scrollOffset, { productScale: 0.82 }, 0)
    .to(state.scrollOffset, { positionY: -0.35 }, 0)
    .to(state.scrollOffset, { cameraZ: -1.4 }, 0)
    .to(state.scrollOffset, { rotationY: 0.6 }, 0)
    .to(contentEl, { opacity: 0, y: -24 }, 0);

  return timeline;
}