interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Infinite horizontal marquee (DESIGN.md §6) — a band of club / society / fest
 * names. The track is duplicated so the CSS `marquee` keyframe (-50%) loops
 * seamlessly. Pauses automatically under reduced motion via the global CSS rule.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const row = [...items, ...items];
  return (
    <div className={`relative flex overflow-hidden ${className ?? ""}`} aria-hidden>
      <div className="flex shrink-0 animate-marquee whitespace-nowrap will-change-transform">
        {row.map((item, i) => (
          <span key={i} className="mx-6 flex items-center gap-6 text-sm font-medium tracking-tight">
            <span className="text-ink/55">{item}</span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
