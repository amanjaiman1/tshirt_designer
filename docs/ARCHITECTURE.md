# ARCHITECTURE — Engineering Plan

*Prepared from the perspective of a Senior Software Engineer. This document defines the stack and
the load-bearing technical decisions. The "why" behind the product lives in
[`../STRATEGY.md`](../STRATEGY.md); the build sequence lives in [`./ROADMAP.md`](./ROADMAP.md).*

---

## 1. Guiding principles

1. **Build the money path first.** Design → preview → order → fulfill. Everything else is cut.
   The original project drowned in blogs/teams/ambassador/plugin features that earned nothing.
2. **Fast on a mid-range phone.** Most buyers (club members) are on mobile. A slow 3D page = no
   sales. Performance is a feature, not a polish step.
3. **Region-flexible from day one.** Multi-currency + pluggable payment/fulfillment providers, so
   India-first does not become a US-later rewrite.
4. **Lean, free-tier-only infra.** No paid service until revenue justifies it.
5. **Keep it boring & typed where it counts.** Predictable libraries, clear module boundaries.

---

## 2. The single most important decision

### 🔑 The 2D design canvas is the source of truth — NOT the 3D view

The original project tried to let users "download the 3D screenshot." That is useless for printing
(low resolution, perspective-distorted). We invert it:

```
        ┌──────────────────────────────────┐
        │  2D DESIGN CANVAS (source of truth)│
        │  authored at print spec            │   <-- this is what gets PRINTED
        │  e.g. 4500 x 5400 px @ 300 DPI     │
        │  layers: colors, text, logos,      │
        │          member name, role, number │
        └───────────────┬──────────────────┘
                        │ exported live as a texture
                        ▼
        ┌──────────────────────────────────┐
        │  3D GARMENT (react-three-fiber)    │
        │  canvas mapped onto mesh as a      │   <-- PREVIEW ONLY: spins, looks premium
        │  CanvasTexture; updates in realtime│
        └───────────────┬──────────────────┘
                        │ on checkout
                        ▼
        ┌──────────────────────────────────┐
        │  EXPORT: high-DPI PNG of the 2D    │
        │  canvas + print-area coordinates   │   --> sent to POD partner for production
        └──────────────────────────────────┘
```

**Outcome:** one data source yields *both* a beautiful real-time 3D preview *and* genuine
print-ready output. Competitors charge for this; we bake it in from the start.

---

## 3. Tech stack

### Frontend
| Concern | Choice | Rationale |
| --- | --- | --- |
| Framework | **React 18 + Vite** | Fast dev/build; familiar from the reference project |
| Language | **TypeScript** | Type safety on the data model that flows to payments/fulfillment |
| 3D | **three.js via @react-three/fiber + @react-three/drei** | Declarative 3D, ecosystem, free |
| 2D design engine | **Fabric.js** (canvas) | Layer/text/image control + high-DPI export = the source of truth |
| State | **Zustand** | Lightweight; replaces the reference project's heavier Redux + valtio mix |
| Styling | **Tailwind CSS** | Fast, consistent, small |
| Routing | **React Router** | Standard |

### Backend / services (all free tier)
| Concern | Choice | Rationale |
| --- | --- | --- |
| Auth + DB + Storage | **Supabase** (Postgres) | One service replaces Firebase + Cloudinary; relational data suits orders |
| Serverless functions | **Vercel / Supabase Edge Functions** | Payment webhooks + POD order creation; no always-on server |
| Payments | **Razorpay (India)**, Stripe-ready (US) behind an interface | India-first; global-ready |
| Fulfillment (POD) | **India POD partner** (e.g. Qikink/Printrove), Printify-ready (US) behind an interface | India-first; global-ready |
| Hosting | **Vercel / Cloudflare Pages** | Free, fast, custom domain, CI from git |

> Final India POD + payment vendor selection is confirmed in Roadmap Parts 5–6 against live pricing
> and API capability. The code depends on **interfaces**, not a specific vendor.

---

## 4. Region & vendor abstraction (global-ready)

Two seams keep India-first from becoming a US-later rewrite:

```ts
// Payments — one interface, swappable implementations
interface PaymentProvider {
  createOrder(amountMinor: number, currency: Currency): Promise<PaymentSession>;
  verifyWebhook(req: Request): Promise<PaymentEvent>;
}
// RazorpayProvider (INR) now; StripeProvider (USD) later.

// Fulfillment — one interface, swappable implementations
interface FulfillmentProvider {
  listProducts(): Promise<CatalogProduct[]>;
  createOrder(design: PrintFile, address: ShippingAddress, items: LineItem[]): Promise<FulfillmentOrder>;
}
// IndiaPodProvider now; PrintifyProvider (US) later.
```

Region/currency is configuration. Adding the US = implement two interfaces + a config entry.

---

## 5. Proposed repository structure

```
tshirt_designer/
├─ README.md
├─ STRATEGY.md
├─ docs/
│  ├─ ARCHITECTURE.md
│  └─ ROADMAP.md
├─ public/
│  └─ models/                 # optimized .glb garments (low-poly, draco/meshopt)
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ routes/                 # pages: landing, designer, cart, checkout, orders
│  ├─ features/
│  │  ├─ designer3d/          # react-three-fiber scene, garment, camera, lighting
│  │  ├─ designCanvas/        # Fabric.js source-of-truth canvas + export-to-texture
│  │  ├─ customizer/          # color/text/logo/role controls (UI panel)
│  │  ├─ catalog/             # products, sizes, colors, pricing
│  │  ├─ cart/                # cart + bulk/group size collection
│  │  └─ orders/              # order history, shareable preview links
│  ├─ lib/
│  │  ├─ payments/            # PaymentProvider interface + impls
│  │  ├─ fulfillment/         # FulfillmentProvider interface + impls
│  │  ├─ supabase/            # client, auth, queries
│  │  └─ print/               # high-DPI export + print-area mapping
│  ├─ store/                  # Zustand stores
│  ├─ types/                  # shared domain types
│  └─ styles/
└─ supabase/                  # SQL migrations, edge functions
```

---

## 6. Core data model (initial sketch)

```
users        (id, email, name, created_at)               -- Supabase auth-backed
designs      (id, user_id, product_id, canvas_json,       -- canvas_json = source of truth
              preview_url, share_token, created_at)
products     (id, name, type, base_cost_minor,            -- catalog (tee/hoodie...)
              colors[], sizes[], print_areas)
orders       (id, user_id, design_id, status,             -- status: created→paid→submitted→fulfilled
              amount_minor, currency, payment_ref)
order_items  (id, order_id, size, color, qty,             -- bulk/group: many sizes per order
              member_name, role)
```

`order_items` carrying `member_name` + `role` per row is what makes **bulk group ordering** (the
killer feature for clubs) first-class rather than bolted on.

---

## 7. Performance budget (mobile-first)

| Metric | Target |
| --- | --- |
| Garment .glb size | < 1.5 MB (draco/meshopt compressed, low-poly) |
| Initial JS (designer route, gzip) | < 250 KB excl. three.js, code-split |
| Time to interactive (mid-range 4G phone) | < 4 s |
| 3D interaction | smooth on integrated mobile GPUs (capped DPR, on-demand rendering) |

Techniques: lazy-load the 3D route, `frameloop="demand"` so we only render on interaction,
texture size caps, and route-level code splitting.

---

## 8. Security & compliance notes

- **No secrets in the client.** POD/payment API keys live only in serverless functions.
- **Payments verified server-side** via signed webhooks before any fulfillment order is created.
- **User-generated content only** for artwork (text + own uploads); ToS forbids infringing uploads.
  No built-in branded/deity artwork (see [`../STRATEGY.md`](../STRATEGY.md) §9).
- **Privacy:** minimal PII; shipping data passed to the POD partner only at order time.

---

## 9. What we deliberately are NOT building (anti-scope)

Cut from the reference project because none of it earns money at MVP: blogs, community feeds, teams,
ambassador programs, plugin marketplace, rich-text editors, speech recognition, confetti, multiple
human avatars/animations. These can be revisited only after revenue exists.
