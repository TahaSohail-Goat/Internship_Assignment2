import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// iOS/Android show and hide the browser chrome (address bar, tab bar) as
// you scroll, which fires a native `resize` event that has nothing to do
// with the user actually rotating or resizing the device. Without this,
// ScrollTrigger would recalculate and can shift the pinned position
// mid-scroll on mobile. See Issue #8 (fix/mobile-performance).
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Scroll-triggered hero animation.
 *
 * Uses gsap.matchMedia() to run two different versions depending on
 * viewport width, re-evaluated automatically whenever the breakpoint is
 * crossed (matchMedia handles revert + recreate on resize/orientation
 * change for free — this is the "resize handling" half of Issue #8):
 *
 *   - >= 641px: full pinned scrub. The hero pins for one viewport of
 *     scroll while the product shrinks, drifts down, gains extra rotation,
 *     and the camera pulls in, as headline/tagline/buttons fade and lift.
 *   - <= 640px: no pin, no 3D scrub. Just a lightweight content fade as
 *     the hero scrolls past. Pinning a Three.js scene through a scrub on
 *     a mobile GPU, combined with mobile browser chrome resize, is a
 *     reliable source of scroll jank — not worth it for a phone viewport
 *     where the 3D product motion is barely visible anyway.
 *
 * The desktop tween targets state.scrollOffset directly (GSAP can tween
 * any plain object's numeric properties), so it composes with idle +
 * parallax in applyAnimationState() instead of assigning to product/camera
 * itself. See CONTINUATION_BRIEF.md section 6.
 *
 * IMPORTANT: call this only from playLoadAnimation's onComplete callback
 * (script.js does this), never before — see the note this file had before
 * Issue #8 for why.
 */
export function createScrollAnimation({ heroEl, contentEl, state }) {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: "(min-width: 641px)",
      isMobile: "(max-width: 640px)",
    },
    (context) => {
      const { isMobile } = context.conditions;

      if (isMobile) {
        return gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }).to(contentEl, { opacity: 0, y: -16 }, 0);
      }

      return gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
        },
      })
        .to(state.scrollOffset, { productScale: 0.82 }, 0)
        .to(state.scrollOffset, { positionY: -0.35 }, 0)
        .to(state.scrollOffset, { cameraZ: -1.4 }, 0)
        .to(state.scrollOffset, { rotationY: 0.6 }, 0)
        .to(contentEl, { opacity: 0, y: -24 }, 0);
    }
  );

  return mm;
}