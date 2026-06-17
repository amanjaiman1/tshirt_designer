# STRATEGY — Business Plan

*Prepared from the perspective of a Business Analyst Head. This is the "why" behind every
technical decision in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and every milestone in
[`docs/ROADMAP.md`](./docs/ROADMAP.md).*

---

## 1. One-line positioning

> **"Design your group's matching merch in 3D — pick colors, add your club/society name,
> member names & roles, share the preview with your squad, and order printed in bulk."**

A spot **no large competitor occupies**, aimed at a **passionate, identity-driven audience**,
reachable for **₹0** through communities the founder is already inside.

---

## 2. The core constraint that shapes everything

The founder is a student with **zero budget except a domain (~₹800–1000/yr)** and the goal is to
**earn real money, not build a showcase.**

Two hard consequences:

1. **No inventory, no upfront spend.** → The business model must be one where **money only moves
   after the customer pays.** This is exactly print-on-demand (POD).
2. **No ad budget.** → Traffic cannot be bought. The *only* viable traffic is a community the
   founder can reach for free. **This makes niche + audience the single biggest driver of success.**

---

## 3. Business model — Print-on-Demand (POD) dropshipping

We never touch a shirt. A POD partner prints and ships. The flow:

```
1. Customer designs merch in 3D on our site, clicks "Order"
2. Customer pays US (via Razorpay/Stripe)
3. Our backend sends the print-ready file + shipping address to the POD partner
4. POD partner charges US wholesale, prints, and ships directly to the customer
5. Customer receives the product (never sees the POD partner)
6. We keep the margin
```

**We pay the POD partner only AFTER the customer has paid us → ₹0 risk, ₹0 inventory.**
(Analogy: like a food-delivery app — we don't own the kitchen, we connect customer to producer
and take a margin.)

### Why not Google AdSense (the founder's first idea)?

| | AdSense (free tool) | POD store |
| --- | --- | --- |
| To earn ~₹8,000/mo (~$100) | ~30,000–100,000 pageviews/mo | ~8–10 shirt sales/mo |
| Realistic with ₹0 ads? | Very hard | Achievable in a niche |
| Earns per visitor | ~₹0.08–0.4 | ₹80–1000+ per buyer |
| Fit for a full-screen 3D tool | Poor (tools = 1 pageview, no ad space, slow) | Native (the tool *is* the funnel) |

AdSense can be **added later** once traffic exists — it's not mutually exclusive — but it cannot be
the primary engine for a zero-traffic launch.

---

## 4. The niche — group/community custom merch

### 4.1 The decisive insight: two POD models

| Model | How it works | What wins | Our fit |
| --- | --- | --- | --- |
| **A — Sell-your-art** | *You* design graphics; customer buys a pre-made design | Art talent + design volume + SEO | ❌ We're engineers, not artists; brutal competition |
| **B — Let-them-customize** | *Customer* personalizes their own (name/role/colors) | A great customization **experience** | ✅ **Our 3D customizer is the weapon** |

The famous "profitable niches" (pet lovers, fitness, mental-health, food humor) are mostly
**Model A** — our 3D tool adds little there. Our entire advantage only pays off in **Model B**,
where personalization *is* the product.

### 4.2 The chosen niche

**Group/community custom merch** — every instance is the same underlying thing: *a group ordering
personalized matching merch in bulk.*

```
College society      → club name + member names + "Core Team 2026"
Fest committee       → event name + roles + batch year
Society/event group  → group name + members + event/year
```

**One product, multiple audiences, same engine.** We don't fragment the build — only the landing
pages and example templates change per audience.

### 4.3 Why this niche fits a zero-budget student

- **Founder is inside the audience** (college + local society) → solves the #1 killer: free reach.
- **Bulk orders** (20–50 units) → high average order value; thin per-unit POD margins still add up.
- **Recurring** → every fest, new batch, and event committee = fresh demand.
- **Built-in proof loop** → one club wears the merch on campus → other clubs notice → free marketing.
- **Personalization is the point** → showcases the 3D customizer instead of competing on art.

---

## 5. Geography — India-first, global-ready

**"Biggest market" ≠ "market you can reach."** The US is the largest POD market (~36–40% global
share) but the founder has **zero free reach there**. India is smaller but is where the **warm,
reachable audience** lives (campus + society).

| | US | India |
| --- | --- | --- |
| Market size | Huge | Smaller but booming |
| Founder's free reach | Zero | College + society |
| Verdict | Phase 2 | **Launch here** |

**Decision:** Launch India-first. Build the code **region-flexible** (multi-currency, pluggable
fulfillment + payment providers) so expanding to the US later is a *config change, not a rewrite.*

```
Phase 1 (now):   Launch India-first → real sales from the warm audience
Phase 2 (later): Code already supports US → add US POD provider + Stripe → expand
```

---

## 6. Unit economics (illustrative)

> Numbers are directional and will be finalized against the chosen India POD partner's live pricing.

```
Retail price (premium tee)         ₹699
POD cost (print + blank + ship)   -₹380
Payment gateway fee (~2-3%)       - ₹18
-----------------------------------------
Gross profit / shirt              ~₹301   (~43% margin)

Typical club order: 25 shirts
Order revenue                     ₹17,475
Order profit                     ~₹7,525
```

- Hoodies/oversized raise both AOV and absolute profit.
- Break-even on the domain (~₹900) = **3–4 shirts.**
- This is **not** passive income — revenue is gated by traffic, and traffic = founder's time in
  communities. The tech removes every *other* barrier.

---

## 7. Go-to-market on ₹0

| Channel | Tactic | Cost |
| --- | --- | --- |
| Campus / clubs | Talk to club secretaries & fest committees directly | ₹0 |
| WhatsApp / Insta | Share 3D preview links in club & society groups | ₹0 |
| Viral loop | Secretary shares preview → members vote/approve → bulk order | ₹0 |
| Reels / Shorts | Screen-record the 3D designer spinning a custom kit | ₹0 |
| Referral | Club captain who organizes the order gets theirs free | margin |

**The product is the marketing:** a free, fun, shareable 3D designer that ends in an optional
bulk-order button.

---

## 8. Competitive differentiation

We do **not** fight the POD factories (Printify/Printful — they're our *supplier*) or the
mega-stores (Canva/Redbubble — they sell everything to everyone). We aim to be the **best store for
one community.**

Three layers, in order of real-world impact:

1. **Strategy (~60%)** — niche + a reachable audience. No audience = ₹0.
2. **Experience / Design (~30%)** — the 3D "wow" that converts a visitor into a buyer.
3. **Architecture / Code (~10%)** — fast, reliable, real print-ready output. Our home turf.

The uncomfortable truth for us as developers: **code is the smallest part of winning.** The product
just has to be fast, look amazing, and serve one community better than anyone else.

---

## 9. Risks & mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| No traffic / no sales | 🔴 High | Niche + founder's community presence; ship the free shareable tool first to build a funnel before checkout exists |
| Print quality / returns | 🟡 Med | Order one self-sample early; pick a top-rated POD provider |
| Copyright / sensitive imagery | 🟡 Med | Allow only user text + own uploads/logos; no built-in branded or deity artwork; ToS forbids infringing uploads |
| Free-tier limits | 🟢 Low | Free tiers handle thousands of visitors; upgrade only once revenue exists |
| 3D performance on mobile | 🟡 Med | Optimized low-poly GLB, lazy-load, code-split — a real flaw in the original project we will fix |
| Solo-founder bandwidth | 🟡 Med | Tight MVP scope: build the money path first, nice-to-haves later |
| Store longevity | 🟡 Med | ~76% of POD stores die within 3 years — survivors have a niche + audience, which is our core thesis |

---

## 10. Success milestones & KPIs

- **M1 (Roadmap Parts 1–3):** A free, shareable 3D designer is live → start posting in communities,
  build a funnel even before checkout works.
- **M2 (Parts 4–6):** First real transaction possible end-to-end.
- **M3 (Parts 7–8):** Deployed on the domain; first real club order; order one self-sample to verify
  print quality.

**KPI funnel to watch** (not vanity metrics):

```
design sessions → share-link opens → "order" clicks → completed checkouts → repeat clubs
```

---

## 11. Summary

| Dimension | Decision |
| --- | --- |
| Product | Group/community custom merch designed in 3D |
| Model | Print-on-demand dropshipping (₹0 inventory, ₹0 upfront) |
| Niche | College clubs/fests + society/event groups (Model B: personalization) |
| Audience | Communities the founder is already inside |
| Launch market | India-first, architected to add US later |
| Monetization | Product margin on bulk orders (AdSense optional, later) |
| Win condition | Best 3D experience for one reachable community, served fast |
