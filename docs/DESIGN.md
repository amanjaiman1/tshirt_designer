# DESIGN — Visual & Motion Language

*The brand and motion system. Goal: a site that looks like a **handcrafted studio product**, not a
template or an AI-generated page. Every build prompt references this file so the aesthetic stays
consistent across all 8 parts.*

Product context: [`../STRATEGY.md`](../STRATEGY.md) · Engineering: [`./ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 1. Brand personality

Young, confident, premium-but-playful — built for Indian college clubs, societies and fest crews
(Gen-Z). It should feel **kinetic, editorial, and tactile**: bold oversized type, real motion, and a
physical-feeling 3D centerpiece. Energetic, not corporate. Crafted, not generic.

**Tagline voice:** direct, hype, a little cheeky. Short lines. Verbs.

---

## 2. Anti-"AI-look" principles (non-negotiable)

The default look of an auto-generated site — and what we explicitly avoid:

| ❌ Avoid (the generic AI look) | ✅ Do instead |
| --- | --- |
| Default Tailwind `blue-500` / `indigo` | A deliberate, owned palette (below) |
| System / Inter-everywhere with no hierarchy | A distinctive **display** face + clean body face, dramatic scale jumps |
| Evenly-spaced centered cards, 3-column "feature grid" | Asymmetric editorial layout, broken grid, intentional negative space |
| No motion, or only fade-in-up on everything | A real motion system with signature interactions & custom easing |
| Flat pure-white `#fff` background | Off-white "paper" + subtle grain/noise texture |
| Stock emojis as feature icons | Custom/line icons, kinetic type, the 3D model as hero |
| Purple→pink gradient hero | Restrained accent used sparingly for punch |

If a section could appear on any random SaaS landing page, redesign it.

---

## 3. Color system

A confident, owned palette. Define as CSS variables + Tailwind theme tokens (never hardcode hex in
components).

```
Ink      #0E0E0F   near-black — primary text, bold blocks
Paper    #F4F1EA   warm off-white — default background (NOT pure white)
Accent   #C6F432   electric lime — CTAs, highlights, focus (use sparingly, high impact)
Violet   #5B3DF5   secondary accent — depth, gradients-with-restraint
Muted    #6B6B6B   secondary text
Line     #E2DDD2   hairline borders/dividers
```

- One **dominant** neutral field (Paper or Ink), accent for punch only.
- Support a dark "studio" mode for the designer tool (Ink background, Paper text).
- Maintain WCAG AA contrast for all text.

---

## 4. Typography

Use **Fontshare** (free, self-hostable, distinctive — avoids the generic Google-Fonts feel):

- **Display / headlines:** `Clash Display` (variable) — oversized, tight tracking, confident.
- **Body / UI:** `General Sans` or `Satoshi` — clean, modern, readable.
- Optional **mono** accent (labels, numbers): `JetBrains Mono` for tags like `EST. 2026`.

Rules:
- Dramatic scale contrast: huge display (clamp up to ~8–12vw on hero) vs calm body.
- Tight letter-spacing on big display; comfortable line-height on body.
- Use **kinetic typography** (animated text reveals, marquees of club names) as a signature.

---

## 5. Layout & grid

- 12-column fluid grid with generous gutters; **break it intentionally** (overlap, bleed to edge).
- Editorial asymmetry over centered symmetry.
- Big negative space; let the 3D model and headlines breathe.
- Sticky/pinned sections for scroll storytelling.
- Mobile-first: the broken grid gracefully stacks; type scales with `clamp()`.

---

## 6. Motion system

Motion is core to the brand, not decoration. Libraries:

| Tool | Use |
| --- | --- |
| **Framer Motion** | Component/page transitions, layout animations, gestures, micro-interactions |
| **GSAP + ScrollTrigger** | Scroll-driven storytelling, pinning, parallax, timeline sequences |
| **Lenis** | Smooth inertia scroll (the premium "weight" feel) on marketing pages |

**Signature easing** (define once, reuse): an expressive cubic-bezier, e.g.
`cubic-bezier(0.16, 1, 0.3, 1)` ("expo-out") for entrances; quicker ease for hovers. Avoid linear.

**Durations:** entrances 0.6–0.9s; micro-interactions 0.15–0.3s. Stagger groups by 40–80ms.

### Signature interactions (build these — they define the "wow")
- **Magnetic buttons** (CTA subtly follows the cursor).
- **Custom cursor** on desktop (small dot + expanding ring on interactive elements).
- **Kinetic text reveal** (mask/clip headline reveals on scroll, char/word stagger).
- **Marquee** of club/society/fest names scrolling continuously.
- **Scroll-pinned 3D moment** — the shirt rotates/changes color as you scroll the hero story.
- **Page transitions** (overlay wipe in brand color between routes).
- **Hover tilt / parallax** on cards (subtle, ~6–8°).
- **Grain/noise overlay** (SVG/feTurbulence) at low opacity over the whole page for texture.

---

## 7. 3D integration (the centerpiece)

- The garment is the hero — not a screenshot, a live react-three-fiber model.
- Studio lighting (soft key + rim), subtle contact shadow, slow idle auto-rotate that yields to user
  drag.
- On the landing page the 3D can be tied to scroll (color/rotation changes); in the designer it's
  fully interactive.
- Respect the performance budget below — beauty must not break mobile.

---

## 8. Performance guardrails (motion must not kill mobile)

Per [`ARCHITECTURE.md`](./ARCHITECTURE.md) §7:
- Heavy scroll/3D choreography lives on **marketing pages**; the **designer tool stays lean**.
- Lazy-load GSAP/Lenis and the 3D route; never block first paint on animation libs.
- Use `transform`/`opacity` only for animation (GPU-friendly); avoid layout-thrash properties.
- `react-three-fiber` `frameloop="demand"`; capped DPR (max ~2); compressed low-poly `.glb`.
- Target: smooth 60fps interaction and < 4s TTI on a mid-range 4G phone.

---

## 9. Accessibility

- **Honor `prefers-reduced-motion`**: disable Lenis, scroll choreography, custom cursor, and big
  transforms; keep content fully usable with instant/!minimal transitions.
- Keyboard-navigable; visible focus states (use Accent ring).
- WCAG AA contrast; alt text; semantic landmarks.
- Custom cursor and magnetic effects are **desktop + pointer-fine only** (never on touch).

---

## 10. Definition of "extraordinary" (acceptance bar)

A section passes only if:
1. It would **not** look out of place in an awwwards / studio portfolio.
2. It uses the owned palette + Fontshare type (no default blue/indigo, no system-font hero).
3. It has at least one intentional motion moment with custom easing.
4. It still hits the mobile performance + reduced-motion guardrails.
5. Nothing feels like a default component dropped in unstyled.
