import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DesignCanvas } from "@/features/designCanvas/DesignCanvas";
import { DesignerProvider } from "@/features/designCanvas/DesignerContext";
import { CustomizerPanel } from "@/features/customizer/CustomizerPanel";
import { LayersIcon } from "@/features/customizer/icons";

/**
 * The designer tool route (ROADMAP Part 2). A lean, studio-dark workspace — no
 * marketing chrome / Lenis / custom cursor (ARCHITECTURE §8, DESIGN.md §8) — with
 * the 2D source-of-truth canvas centre stage and the customizer panel alongside.
 */
export function Designer() {
  return (
    <DesignerProvider>
      <div
        data-surface="studio"
        className="flex min-h-[100dvh] flex-col bg-ink text-paper lg:h-[100dvh] lg:overflow-hidden"
      >
        {/* Slim toolbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="group flex items-center gap-2"
              aria-label="Back to tshirt.designer home"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-expo group-hover:-rotate-[18deg]">
                <span className="font-display text-base leading-none">t.</span>
              </span>
              <span className="hidden font-display text-lg tracking-tightest sm:inline">
                tshirt<span className="text-accent">.</span>designer
              </span>
            </Link>
            <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60 ring-1 ring-white/10">
              <LayersIcon className="text-accent" /> Studio
            </span>
          </div>

          <Link
            to="/"
            className="rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/55 transition-colors hover:text-paper"
          >
            ← Exit
          </Link>
        </header>

        {/* Workspace: canvas stage + customizer */}
        <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[46vh] min-h-[300px] w-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06),transparent_60%)] lg:h-auto lg:flex-1"
          >
            <DesignCanvas />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Customizer controls"
            className="w-full shrink-0 border-t border-white/10 bg-white/[0.015] lg:w-[400px] lg:overflow-y-auto lg:border-l lg:border-t-0"
          >
            <CustomizerPanel />
          </motion.aside>
        </div>
      </div>
    </DesignerProvider>
  );
}
