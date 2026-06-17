# ROADMAP — The 8-Part Build Plan

*The execution sequence. Each part is delivered as a self-contained prompt and pushed to `main`.
Business rationale: [`../STRATEGY.md`](../STRATEGY.md) · Technical decisions:
[`./ARCHITECTURE.md`](./ARCHITECTURE.md).*

**Guiding rule:** build the **money path** first (design → preview → order → fulfill); tune every
part for **bulk group orders** (college clubs / society & fest committees); stay **India-first but
region-flexible.**

---

## Milestone map

```
M1  Free shareable 3D designer live   →  Parts 1–3   (start community marketing here)
M2  End-to-end paid order possible    →  Parts 4–6
M3  Deployed on domain, first order    →  Parts 7–8
```

---

## Part 1 — Project Foundation
**Goal:** a fast, clean app shell with a 3D garment rendering on screen.
- Vite + React + TypeScript + Tailwind scaffold; routing; base layout.
- react-three-fiber scene: optimized low-poly garment `.glb`, lighting, camera, orbit controls.
- Performance baseline: `frameloop="demand"`, capped DPR, lazy-loaded 3D route.
- Zustand store skeleton; project structure per ARCHITECTURE §5.
- **Deliverable:** repo runs with `npm run dev` and shows a spinnable shirt. Quickstart in README.

## Part 2 — The Customizer
**Goal:** the core editing experience on the 2D source-of-truth canvas.
- Fabric.js canvas as source of truth (ARCHITECTURE §2).
- Controls: garment color, add/edit **text** (club/society name, member name, role, number),
  font/size/color, upload **logo/image**, move/scale/delete layers.
- Group-oriented presets ("Club name + tagline", "Member name + role + batch year").
- **Deliverable:** users can fully compose a design in 2D.

## Part 3 — 2D → 3D Pipeline + Print-Ready Export
**Goal:** the differentiator and the print fix.
- Live-map the Fabric canvas onto the 3D mesh as a `CanvasTexture` (front & back print areas).
- High-DPI export (e.g. 300 DPI PNG) + print-area coordinate mapping for the POD partner.
- **Deliverable:** real-time 3D preview from the design + a production-grade export file.

## Part 4 — Catalog & Data Model
**Goal:** make it a sellable product, not just a toy.
- Supabase schema (ARCHITECTURE §6): `products`, `designs`, `orders`, `order_items`.
- Product catalog (tee/hoodie/oversized): sizes, colors, base costs, print areas.
- Persist designs; generate `share_token` for shareable preview links.
- **Deliverable:** products are data-driven; designs save and load.

## Part 5 — Cart + Bulk Ordering + Payments
**Goal:** the first point where money appears.
- Cart with **group/bulk size collection** (many sizes + member name/role per order — the killer
  feature for clubs).
- `PaymentProvider` interface + **Razorpay (INR)** implementation; Stripe-ready for later.
- Server-side order creation; amounts computed server-side.
- **Deliverable:** a customer can pay for a (bulk) order in INR.

## Part 6 — Fulfillment Integration (POD)
**Goal:** close the loop with zero inventory.
- `FulfillmentProvider` interface + **India POD partner** implementation.
- Payment webhook (serverless) → verify → auto-create POD order with the print-ready file + address.
- Order status lifecycle: `created → paid → submitted → fulfilled`.
- **Deliverable:** a paid order is automatically sent for printing & shipping.

## Part 7 — Auth, Saved Designs, Order History & Share Links
**Goal:** retention + the viral loop.
- Supabase auth (email / OAuth); user dashboard.
- Saved designs, reorder, order history.
- **Shareable 3D preview links** (`share_token`) so a secretary can get the group to approve before
  ordering — the core growth mechanic.
- **Deliverable:** accounts, history, and shareable previews work.

## Part 8 — Landing Pages, SEO, Performance Polish & Deploy
**Goal:** get found, get fast, go live.
- Niche landing pages: one for **college clubs/fests**, one for **society/event groups** (same engine,
  different copy + example templates).
- SEO basics, meta/OG tags (share links render rich previews), sitemap.
- Mobile performance pass against ARCHITECTURE §7 budget.
- Deploy to Vercel/Cloudflare on the custom domain; environment + secrets config.
- **Deliverable:** live, fast, discoverable store ready for first real club order + a self-sample.

---

## Definition of done (per part)
- Builds clean, runs on mobile, no console errors.
- Code follows ARCHITECTURE module boundaries and interface seams.
- Pushed to `main` with a clear commit message.
- README/quickstart updated when developer-facing behavior changes.

## After Part 8 (post-MVP backlog — only once revenue exists)
AdSense on free-tool pages · US expansion (Stripe + Printify impls) · more garments · AI design
assist · design templates gallery · analytics on the KPI funnel.
