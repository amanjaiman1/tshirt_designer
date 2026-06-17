/**
 * Full-screen film grain (DESIGN.md §6) — an SVG feTurbulence baked into a data
 * URI so it costs zero network requests. Sits above everything, ignores pointer
 * events, and is intentionally subtle.
 */
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
     <filter id='n'>
       <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/>
       <feColorMatrix type='saturate' values='0'/>
     </filter>
     <rect width='100%' height='100%' filter='url(#n)'/>
   </svg>`,
);

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.05] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
        backgroundSize: "160px 160px",
      }}
    />
  );
}
