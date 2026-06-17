import { Suspense, lazy, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RevealText } from "@/components/RevealText";
import { Magnetic } from "@/components/Magnetic";
import { Marquee } from "@/components/Marquee";
import { useDesignStore } from "@/store/useDesignStore";

// Lazy-load the entire 3D stack so three.js never blocks first paint (§7).
const Scene = lazy(() => import("@/features/designer3d/Scene"));

const SWATCHES = [
  { name: "Paper", value: "#F4F1EA" },
  { name: "Ink", value: "#16161A" },
  { name: "Lime", value: "#C6F432" },
  { name: "Violet", value: "#5B3DF5" },
  { name: "Clay", value: "#C5705D" },
];

const CLUBS = [
  "Coding Club",
  "Dramatics Society",
  "Music Club",
  "Photography Society",
  "Robotics Club",
  "Dance Crew",
  "Debate Society",
  "Fest Committee",
  "Sports Council",
  "Design Guild",
];

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-line border-t-ink" />
    </div>
  );
}

export function Landing() {
  const { garmentColor, setGarmentColor } = useDesignStore();

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28">
        {/* soft accent wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-24 h-[36rem] w-[36rem] rounded-full bg-violet/10 blur-3xl"
        />
        <div className="container-edge relative grid items-center gap-8 pb-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left — kinetic headline */}
          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-paper/60 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              For clubs · societies · fests
            </motion.span>

            <h1 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.9] tracking-tightest">
              <RevealText text="Design your" className="block" />
              <RevealText text="crew's merch" className="block text-violet" delay={0.12} />
              <RevealText text="in 3D." className="block" delay={0.24} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-md text-base text-muted sm:text-lg"
            >
              Pick colours, add your club name, member names &amp; roles, watch it spin in real time
              — then order printed for the whole team. Free to design, zero inventory.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.4}>
                <Link
                  to="/design"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors duration-300 hover:bg-violet"
                >
                  Start designing
                  <span aria-hidden>→</span>
                </Link>
              </Magnetic>

              {/* live colour swatches — proof the 3D is interactive */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  Try a colour
                </span>
                <div className="flex gap-2">
                  {SWATCHES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      aria-label={`Set garment colour to ${s.name}`}
                      onClick={() => setGarmentColor(s.value)}
                      data-cursor="hover"
                      className={`h-7 w-7 rounded-full border transition-transform duration-300 ease-expo hover:scale-110 ${
                        garmentColor === s.value
                          ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper"
                          : "border-line"
                      }`}
                      style={{ backgroundColor: s.value }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — 3D shirt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[44vh] min-h-[340px] w-full lg:h-[76vh]"
          >
            <Suspense fallback={<CanvasFallback />}>
              <Scene color={garmentColor} className="h-full w-full" />
            </Suspense>
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-muted">
              drag to rotate
            </span>
          </motion.div>
        </div>

        {/* marquee band */}
        <div className="border-y border-line bg-paper/70 py-4 backdrop-blur">
          <Marquee items={CLUBS} />
        </div>
      </section>

      {/* ── Anchor sections (fleshed out in Part 8) ─────────────────────── */}
      <SectionStub id="how" kicker="01 — How it works" title="Design. Share. Order in bulk.">
        Build your design in the 3D editor, drop the preview link in your club group, collect sizes,
        and place one bulk order. We print and ship — you never touch inventory.
      </SectionStub>
      <SectionStub id="clubs" kicker="02 — For clubs &amp; fests" title="Look like a team.">
        Club tees, core-team hoodies, fest crew kits — names, roles and batch year on every piece.
      </SectionStub>
      <SectionStub id="societies" kicker="03 — For societies &amp; events" title="Built for the whole crew.">
        Matching merch for societies, committees and event groups — designed once, ordered together.
      </SectionStub>
    </>
  );
}

function SectionStub({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="container-edge scroll-mt-24 border-b border-line py-24">
      <div className="grid gap-8 md:grid-cols-[0.4fr_0.6fr]">
        <span
          className="font-mono text-xs uppercase tracking-widest text-muted"
          dangerouslySetInnerHTML={{ __html: kicker }}
        />
        <div>
          <h2 className="max-w-xl text-4xl tracking-tightest sm:text-5xl">{title}</h2>
          <p className="mt-5 max-w-lg text-muted">{children}</p>
        </div>
      </div>
    </section>
  );
}
