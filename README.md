# Tshirt Designer

**Design your group's custom merch in 3D — pick colors, add your club/society name, member
names & roles, see it spin in real time, and order printed for the whole team.**

A fast, free, web-based 3D apparel customizer built for **college clubs, society committees,
and fest / event groups**. Free to design and share; optional one-click bulk order via
print-on-demand (zero inventory, zero upfront cost).

---

## Why this exists

The original reference project (`Product_3D`) was a 3D t-shirt viewer with no path to revenue —
it only let you download a screenshot. This is a ground-up rebuild with a clear business model
and a sharp niche.

- **Niche:** group/community custom merch (college clubs, societies, fest committees, event groups).
- **Differentiator:** an interactive 3D customizer (name + number + role + colors) that beats the
  flat 2D mockups every generic store uses — for *identity/team* wear, that "wow, that's *our* kit"
  moment is what closes the sale.
- **Model:** print-on-demand dropshipping. The customer pays first; a POD partner prints & ships.
  We never hold inventory and risk nothing upfront.
- **Launch market:** India-first (where our free, warm audience is), architected to add the US later.

> Full reasoning lives in [`STRATEGY.md`](./STRATEGY.md).

---

## Documentation

| Doc | What's inside |
| --- | --- |
| [`STRATEGY.md`](./STRATEGY.md) | Business analysis: niche, model, unit economics, go-to-market, risks |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Tech stack & key engineering decisions (the 2D-canvas → 3D → print pipeline) |
| [`docs/DESIGN.md`](./docs/DESIGN.md) | Visual & motion language — the "extraordinary, not AI-generated" design system |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | The 8-part build plan mapped to milestones |

---

## Status

🚧 **Part 1 (Project Foundation) complete.** A fast app shell with the full DESIGN.md aesthetic and
an interactive 3D shirt hero is live. Next: Part 2 (the customizer). Build order:
[`docs/ROADMAP.md`](./docs/ROADMAP.md).

## Quickstart

Requires Node 18+ (developed on Node 22).

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

### What's in Part 1
- **Vite + React 18 + TypeScript + Tailwind**, React Router, Zustand.
- **Design system** from [`docs/DESIGN.md`](./docs/DESIGN.md): owned palette (CSS vars + Tailwind
  tokens), Fontshare type (Clash Display + General Sans), grain overlay, signature easing.
- **Motion stack**: Framer Motion (eager) + GSAP + Lenis smooth scroll (lazy-loaded); custom cursor
  and magnetic buttons (desktop + fine-pointer only); full `prefers-reduced-motion` support.
- **3D hero**: react-three-fiber scene with the garment model (auto-centred, recolourable),
  studio lighting, contact shadow, orbit controls, `frameloop="demand"` + capped DPR, and
  viewport-gated idle rotation.
- **App shell**: header/nav, footer, global layout, and a kinetic landing hero with live colour
  swatches and a club-name marquee.

> The 3D model in `public/models/shirt.glb` is a placeholder (reused from the reference project) and
> will be swapped for an optimised, licensed garment later.

---

## Tech stack (target)

React + Vite · react-three-fiber + drei (3D) · Fabric.js / canvas (2D design source-of-truth) ·
Zustand (state) · Tailwind CSS · Supabase (auth/DB/storage) · Razorpay/Stripe (payments) ·
Printify / India POD partner (fulfillment). See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
