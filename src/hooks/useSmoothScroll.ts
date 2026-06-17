import { useEffect } from "react";
import { usePrefersReducedMotion } from "./useMediaQuery";

/**
 * Lenis inertia smooth-scroll (DESIGN.md §6) — lazy-loaded so the library never
 * blocks first paint, and fully disabled under prefers-reduced-motion (§9).
 */
export function useSmoothScroll(): void {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId = 0;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [reduced]);
}
