import { useEffect, useRef } from 'react';

// Interactive elements that should keep their normal behaviour (no drag from them).
const NO_DRAG_SELECTOR = 'input, textarea, select, button, a, audio, video, canvas';

/*
 * Makes an element feel like rubber: click-drag stretches it toward the pointer,
 * and releasing springs it back to its original shape with a decaying wobble.
 *
 * Returns a ref to attach to the element you want to be stretchy.
 */
export default function useRubberBand({
  pull = 0.35,        // how far the element follows the pointer (drag resistance)
  stretchFactor = 0.0007, // how much it deforms per pixel dragged
  maxStretch = 0.28,  // cap on the squash-and-stretch
  stiffness = 0.18,   // spring pull-back strength
  damping = 0.72,     // < 1 so it oscillates (the wobble)
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let tx = 0;
    let ty = 0;
    let stretch = 0;
    let angle = 0;
    let vtx = 0;
    let vty = 0;
    let vStretch = 0;
    let rafId = null;

    const apply = () => {
      el.style.transform =
        `translate(${tx}px, ${ty}px) ` +
        `rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.45}) rotate(${-angle}deg)`;
    };

    const spring = () => {
      vtx = (vtx - stiffness * tx) * damping;
      vty = (vty - stiffness * ty) * damping;
      vStretch = (vStretch - stiffness * stretch) * damping;
      tx += vtx;
      ty += vty;
      stretch += vStretch;
      apply();

      const settled =
        Math.abs(tx) < 0.15 && Math.abs(ty) < 0.15 && Math.abs(stretch) < 0.002 &&
        Math.abs(vtx) < 0.15 && Math.abs(vty) < 0.15 && Math.abs(vStretch) < 0.002;

      if (settled) {
        tx = ty = stretch = 0;
        el.style.transform = '';
        // Drop the GPU layer once idle; keeping will-change on a backdrop-filter
        // element full-time causes repaint seams (the "black lines") in the navbar.
        el.style.willChange = 'auto';
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(spring);
    };

    const onPointerDown = (e) => {
      if (e.target.closest(NO_DRAG_SELECTOR)) return; // keep controls interactive
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.willChange = 'transform';
      el.classList.add('rubber-grabbing');
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      tx = dx * pull;
      ty = dy * pull;
      const dist = Math.hypot(dx, dy);
      stretch = Math.min(dist * stretchFactor, maxStretch);
      angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      apply();
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('rubber-grabbing');
      vtx = vty = vStretch = 0;
      rafId = requestAnimationFrame(spring);
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [pull, stretchFactor, maxStretch, stiffness, damping]);

  return ref;
}
