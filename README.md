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
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | The 8-part build plan mapped to milestones |

---

## Status

🚧 **Foundation / planning stage.** Planning docs are committed. Feature implementation follows
the 8-part roadmap in [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## Quickstart

> Will be filled in during **Part 1 (Project Foundation)** once the app scaffold lands.

```bash
# coming in Part 1
npm install
npm run dev
```

---

## Tech stack (target)

React + Vite · react-three-fiber + drei (3D) · Fabric.js / canvas (2D design source-of-truth) ·
Zustand (state) · Tailwind CSS · Supabase (auth/DB/storage) · Razorpay/Stripe (payments) ·
Printify / India POD partner (fulfillment). See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
