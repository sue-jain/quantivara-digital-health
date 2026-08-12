# Santhica Homepage Redesign — Copy + UI Layout Specification

**Status:** Draft for review. **Spec only — no code written, no files changed.**
**Author:** UX_Designer agent
**Date:** 2026-08-11
**Target:** `src/pages/LandingPage.tsx` and `src/components/landing/*`

---

## 0. Read this first

Two rules govern this document.

1. **Copy is in blockquotes or fenced blocks.** Everything else is commentary for the person building it. If it isn't in a quote or a fence, don't put it on the page.
2. **Anything marked `[VERIFY]` must not ship until the user confirms it.** This applies to every statistic, every module live-status, and every compliance statement. A health product that overstates a compliance posture is not a marketing problem, it is a legal exposure. I have written candidate copy so the layout can be built, but the candidate copy is a placeholder for a fact I do not have.

A consolidated checklist of every `[VERIFY]` is at the end of this document.

---

## 1. Competitive read — Eka Care

I fetched `eka.care` and `eka.care/security`. What they actually do:

**Structure:** Header → Hero → client logo strip → product suite cards → clinical decision support → capabilities grid → testimonials → statistics → integrations → certifications → blog → CTA → deep multi-column footer.

**What they do well:**
- **Proof is stacked early and hard.** Customer logos (Apollo, Medanta, Samsung, NHA) sit immediately under the hero. Then a stats band: 33K+ clinics, 90K+ doctors, 20Mn+ ABHA, 140Mn+ records. That is an unassailable position for a challenger to attack head-on.
- **Products are named and separable** — EkaScribe, EkaEMR, EkaPHR, Developer Portal. Naming the modules makes the platform feel like a platform rather than a feature list.
- **Certification row as a trust close** — NHA Approved, FHIR Compliant, ABDM Compliant, AWS Secured, Google Partner.
- **A real developer/partner surface in the nav.** It signals infrastructure, not app.

**Where they are weak, and where Santhica differentiates:**
- **Their `/security` page is a wall of undifferentiated prose.** No status-at-a-glance, no visual hierarchy, no icons, no dates, no evidence artifacts. It reads as a legal disclosure, not a trust surface. This is Santhica's clearest opening: **build the Vanta-register trust section they don't have.** Status stated plainly, evidence one click away, and — critically — an explicit statement of what is *not* held. A hospital CIO reading two vendor pages will trust the one that volunteers its gaps.
- **Their copy drifts into marketing adjectives** — "ambient," "AI-native," "scale smarter." Santhica should be flatter and more declarative. Fewer adjectives is a differentiator against this specific competitor.
- **The positioning is a product suite, not a thesis.** Eka sells you an EMR and a scribe. Santhica's thesis — *one record for one life, across custodians* — is a bigger and more defensible idea. Lead with the thesis; the modules are evidence for it, not the pitch.

**The asymmetry to design around:** Eka has scale proof. Santhica does not, and must not fake it. Santhica has (a) a sharper thesis, (b) genuinely senior infrastructure pedigree, and (c) the ability to be more honest than an incumbent with certifications to protect. The page should be built on those three assets and should *never* present an empty stats band or an unlabeled logo strip that implies customers.

> **Defect in the current site, flagged now:** `TeamSection.tsx:713-722` renders an unlabeled grayscale logo strip (Amazon, Alexa, Audible, Oracle, HubSpot, Broadcom) directly beneath the team cards. In the standard grammar of a SaaS homepage, an unlabeled logo strip means *customers*. This one means *former employers*. It must carry an explicit label. See §7.

---

## 2. Recommended section order and scroll narrative

The brief specified an order. **I am recommending two changes to it.** Both are justified below; both are reversible.

### Recommended order

| # | Section | Anchor | Surface |
|---|---|---|---|
| 0 | Navigation (sticky) | — | Light |
| 1 | **Hero** | `#top` | Light |
| 2 | **Pedigree bar** (thin, labeled) | — | Light |
| 3 | **Crisis Metrics** | `#problem` | Dark (inverse) |
| 4 | **Lifetime Journey Visual** | `#record` | Light |
| 5 | **Product Modules** | `#platform` | Subtle grey |
| 6 | **Trust & Compliance** | `#security` | Light |
| 7 | **Team** | `#team` | Subtle grey |
| 8 | **Request Demo** | `#demo` | Dark (inverse) |
| 9 | Footer | — | Dark |

### The two changes, and why

**Change 1 — Journey moves *before* Modules (brief had Modules at 3, Journey at 4).**

The Hero makes one claim: *one record for a lifetime*. The Journey visual is the proof of that claim — it is what the claim looks like. Putting nine dense module cards between the claim and its illustration means the reader hits the machinery before they understand what the machinery is for. Modules land far harder once the reader already holds the mental model "everything feeds one continuous record"; each module then reads as *another intake into the record I just saw*, instead of nine separate features. Emotional payload also decays fast — Crisis → Journey is a tight two-beat (here is the harm / here is the thing that ends it), and interrupting it with a product grid dissipates it.

**Change 2 — Trust moves *before* Team (brief had Team at 5, Trust at 7).**

The Modules section makes the most aggressive data claim on the page: *we ingest prescriptions, labs, scans, ward charts, voice, and third-party feeds, from everywhere, in days*. For an enterprise health buyer that claim generates exactly one next thought, and it is not "who are the founders." It is "where does all that data go and who can see it." Answer the objection at the moment it is created. Team then functions as the closing credibility beat immediately before the ask, which is where it does the most conversion work for a company whose strongest proof asset is its people.

**Change 3 — a new thin "Pedigree bar" at position 2.**

Eka puts customer logos under the hero. That slot is load-bearing — it is where a visitor decides whether to keep scrolling. Santhica cannot fill it with customers. It can fill it with a single labeled line of engineering pedigree, which is true and which no seed-stage competitor can match. This is a small addition with high leverage.

### The arc, stated as persuasion

1. **Claim** (Hero) — one record, for a whole life.
2. **Standing** (Pedigree) — the people making this claim have built systems at scale.
3. **Stakes** (Crisis) — here is the cost of the record not existing. Dark surface; the only dark band in the upper page. Tonal weight is the point.
4. **Vision made concrete** (Journey) — here is what one record actually looks like. Emotional centerpiece. Returns to light — literally.
5. **Mechanism** (Modules) — here is the machinery that produces it. Breadth = platform.
6. **De-risking** (Trust) — here is exactly what we can and cannot say about your data. The honesty is the persuasion.
7. **Credibility** (Team) — here is who is accountable.
8. **Ask** (Demo) — dark surface again; a deliberate visual bookend to the Crisis band, closing the loop.

---

## 3. Design system assessment and deltas

### 3.1 Palette — recommendation: evolve, do not replace

**Current tokens:** Navy `#1e3a5f`, teal-green `#2db87f`, light blue `#e8f4f8`, near-black `#0d1220`/`#0a0f1a`, Inter.

**Assessment: the navy is right. The green is not competitive at this tier, and it fails accessibility.**

Three problems with `#2db87f` as currently deployed:

1. **It fails WCAG AA as text.** `#2db87f` on white measures **2.54:1**. AA body text requires 4.5:1. It is currently used for text at 12px in five places (`AboutSection.tsx:61,112`, `TeamSection.tsx:666,691`, `DemoSection.tsx:203`). Those eyebrow labels are non-compliant today. This is not a stylistic objection — it is a defect.
2. **It is over-deployed.** The same green currently carries eyebrows, headings accents, stat numerals, bullet dots, avatar gradients, hover borders, CTA fills, focus rings, and a pulsing dot. A colour that means everything means nothing. At the Eka/Epic tier, accent colour is rationed.
3. **In a clinical context green is a semantic channel.** Green means "within normal limits." Spending it on decoration burns the channel you will need in-product.

**Recommendation:** keep green as the brand accent but **deepen it and ration it**, and let navy carry the structural weight.

```
/* NEW — brand ramp (index.css :root, HSL to match existing shadcn convention) */
--brand-navy-900: #0B1220;   /* inverse surfaces, footer            */
--brand-navy-800: #14243D;   /* dark band gradients                 */
--brand-navy-700: #1E3A5F;   /* KEEP — primary brand ink, headings  */
--brand-navy-500: #35597F;   /* secondary ink on light              */
--brand-navy-100: #E8F4F8;   /* KEEP — demoted to ONE use (§4)      */

--brand-green-800: #075C3E;  /* pressed / active states             */
--brand-green-700: #0A7A52;  /* TEXT on light. 5.36:1 on white. AA. */
--brand-green-600: #0E8A5F;  /* fills, UI boundaries, CTA. 3:1+.    */
--brand-green-400: #2DB87F;  /* KEEP — ON DARK SURFACES ONLY.       */
                             /* 7.36:1 on #0B1220. AA.              */

/* Neutrals — replaces ad-hoc gray-50/100/400/500 usage */
--surface-base:   #FFFFFF;
--surface-subtle: #F6F8FA;
--surface-inverse:#0B1220;
--ink-primary:    #0F1B2D;
--ink-secondary:  #4A5A6E;   /* 7.1:1 on white — replaces gray-500  */
--ink-tertiary:   #6B7A8D;   /* 4.6:1 on white — smallest usable    */
--border-subtle:  #E3E8EE;
--border-strong:  #C9D2DC;
--focus-ring:     #0E8A5F;
```

**Hard rule to encode:** `--brand-green-400` (`#2DB87F`) may only appear on `--surface-inverse` or `--brand-navy-700` backgrounds. On light surfaces, green text uses `--brand-green-700`, green fills use `--brand-green-600`. A lint rule or a code-review note is worth it.

**Do not introduce red or amber anywhere on this page**, including for the "in development" module badge. On a health product a red or amber chip reads as a clinical alert. Roadmap status uses a neutral slate outline (§6.4).

### 3.2 Type scale

Current hero runs to `text-8xl` at `font-extrabold`. That is a consumer-launch register. Enterprise health infrastructure reads *smaller, tighter, and denser*. Epic and Vanta both set display type at roughly half the size a seed-stage landing page does.

```
display-1   clamp(2.5rem, 5.2vw, 4rem)     / 1.05 / -0.02em / 700
display-2   clamp(2rem, 3.6vw, 2.75rem)    / 1.12 / -0.015em / 700   (H2)
h3          1.25rem                        / 1.35 / -0.01em / 600
h4          1rem                           / 1.4  / 0        / 600
lede        clamp(1.0625rem, 1.4vw, 1.25rem) / 1.6 / 0 / 400
body        1rem   / 1.65 / 400
body-sm     0.875rem / 1.6 / 400
label       0.75rem / 1.2 / 600 / 0.08em uppercase   (eyebrows)
metric      clamp(3rem, 7vw, 5.5rem) / 1 / -0.03em / 300 / tabular-nums
```

- Max weight anywhere on the page is **700**. Retire `font-extrabold` and `font-black`.
- Every numeral (metrics, stats) gets `font-variant-numeric: tabular-nums`.
- Prose measure capped at `max-w-[68ch]`. Never centre a paragraph longer than two lines.
- Font loading: cut Inter from seven weights (300–900) to **four** (400, 500, 600, 700). See §12.

### 3.3 Spacing, radius, elevation

- **Spacing:** 4px base. Section rhythm `py-20 md:py-28 lg:py-32`. Currently every section is a uniform `py-24`, which flattens the page — vary it: the Pedigree bar is `py-8`, the Crisis band is `py-28 md:py-36` (weight), Modules is `py-20`.
- **Radius:** current `rounded-2xl` (16px) on every card reads consumer. Move to **`--radius: 0.5rem`** (8px) for cards and **6px** for buttons/inputs/badges. The shadcn `--radius` var already exists at `0.5rem` — the landing components are overriding it with arbitrary values. Stop doing that.
- **Elevation:** remove `hover:-translate-y-1`, `hover:shadow-xl`, `shadow-[#2db87f]/20`, `glow-pulse`, and `float` from the landing surface. Enterprise UI does not bounce or glow. Replace card hover with a **border-colour change only** (`--border-subtle` → `--brand-navy-700`) plus a 120ms transition. This is the single highest-leverage change for tonal register.

### 3.4 Motion

- Functional only, ≤200ms for state transitions; the one exception is the Journey draw-in at 1200ms, which is content, not chrome.
- **Every** animation gated behind `prefers-reduced-motion`. See §11 — the current `.reveal` system has no guard at all.

### 3.5 Component inventory

**Reuse from `src/components/ui/` (all already installed):**
`navigation-menu` (desktop mega-menu — Radix gives keyboard nav and ARIA for free), `sheet` (mobile nav drawer), `accordion` (trust detail disclosure, mobile nav groups), `badge` (module status), `card`, `button`, `form` + `input` + `textarea` + `select` + `label` (demo form — note `react-hook-form` and `zod` are installed but the landing form uses neither), `separator`, `tooltip`, `sonner`, `alert`, `skeleton`.

**New components to build (9):**

| Component | Purpose | Composes |
|---|---|---|
| `SectionHeader` | eyebrow + H2 + lede, one implementation | — |
| `StatusBadge` | Live / Pilot / In development | `badge` |
| `ModuleCard` | module tile with status | `card`, `StatusBadge` |
| `MetricPanel` | crisis numeral + label + citation slot | — |
| `Citation` | inline source line, consistent format | — |
| `JourneyTimeline` | inline SVG + semantic `<ol>` | — |
| `TrustControl` | control name + status + disclosure | `accordion` |
| `PlatformMegaMenu` | nav panel content | `navigation-menu` |
| `PedigreeBar` | labeled logo strip | — |

**Data files to create (so content is edited in one place, not in JSX):**
`src/content/modules.ts`, `src/content/journey.ts`, `src/content/trust.ts`, `src/content/team.ts`. Module status in particular must be a single-field edit — it will change often and must never require touching a component.

---

## 4. Navigation

### 4.1 Desktop (≥1024px)

**Structural change: kill the transparent-over-hero navbar.** The current bar is transparent until 60px of scroll and applies `brightness-200` to the logo to survive the dark hero (`Navbar.tsx:562-564`). That hack produces a washed-out logo, unpredictable contrast, and a jarring state flip. With a light hero (§5) the bar is opaque from the first paint.

```
Height:      64px (down from 80px)
Background:  --surface-base, always opaque
Border:      none at scrollY 0; 1px --border-subtle from scrollY > 8
Shadow:      none. Ever. The border is the separation.
Container:   max-w-[1200px], px-6
Position:    sticky top-0, z-50
```

Layout: logo left (32px tall, not 48 — see §12 on the asset), nav centre-left, actions right.

```
[ Santhica ]   Platform ▾   The Problem   Security   Team          [ Request a demo ]
```

- **Platform ▾** — the only dropdown. Opens a full-width mega-menu.
- **The Problem** → `#problem`, **Security** → `#security`, **Team** → `#team` — plain anchors.
- **Request a demo** — primary button, `--brand-green-600` fill, white text, 6px radius, 40px tall.
- Scroll-spy: the anchor matching the section in view gets a 2px `--brand-navy-700` underline offset 20px. Implement with the existing `IntersectionObserver` pattern from `useReveal.ts`, not a scroll handler.

**Mega-menu spec (Platform):**

Full-bleed panel, inner `max-w-[1120px]`, `p-8`, `--surface-base`, 1px bottom border, 8px radius on the bottom corners only. Three columns matching the module groups exactly:

```
OUTPATIENT              INPATIENT                PLATFORM & NETWORK
Prescription reading    Treatment chart          Mobile-first capture
Lab report digitization X-ray decision support   Universal integration
Voice Consult Scribe                             Agentic follow-up
Manual entry
```

Each row: module name (14px/600, `--ink-primary`), one-line descriptor (13px, `--ink-tertiary`), and a status dot on the right. Column heading is `label` style. Bottom bar of the panel spans full width, `--surface-subtle`, with:

> **See all nine modules →**

**Behaviour:** opens on hover after a 150ms intent delay and on focus/Enter/Space. `Escape` closes and returns focus to the trigger. Arrow keys move between items. Radix `navigation-menu` handles all of this; do not hand-roll.

### 4.2 Tablet (768–1023px)

Same bar, but the four nav links collapse into the hamburger. Only the logo and the **Request a demo** button remain inline. Rationale: at this width the mega-menu panel is too cramped to be readable and the links start truncating.

### 4.3 Mobile (<768px)

Hamburger (44×44 tap target) → `sheet.tsx` drawer from the right, full height, 100% width up to 400px.

```
┌───────────────────────────┐
│ [Santhica]            [×] │
├───────────────────────────┤
│ Platform              [▾] │  ← accordion, closed by default
│   Outpatient          [▾] │
│   Inpatient           [▾] │
│   Platform & Network  [▾] │
│ The Problem               │
│ The Record                │
│ Security                  │
│ Team                      │
├───────────────────────────┤
│  [  Request a demo     ]  │  ← sticky to sheet bottom
│  support@santhica.com     │
└───────────────────────────┘
```

- Every row ≥48px tall.
- Accordion groups closed on open — a wall of 13 links is worse than two taps.
- The CTA is pinned to the bottom of the sheet, not buried at the end of the list.
- Note **The Record** (`#record`) appears in mobile nav but not desktop — mobile users scroll less and benefit from the extra jump target; desktop nav stays at four items for restraint.
- Sheet traps focus, closes on `Escape` and on route/anchor navigation, and restores focus to the hamburger.

### 4.4 Anchor offset — current bug

Anchored sections currently scroll under the fixed navbar because no offset is applied. Add to every section target:

```css
scroll-margin-top: 80px; /* 64px nav + 16px breathing room */
```

---

## 5. Section 1 — Hero

### 5.1 Intent

A hospital CIO, a clinic owner, or an investor lands here. They have three seconds. They must leave with exactly one idea: **Santhica makes a single medical record that lasts a person's whole life.** Not "AI for healthcare." Not "the data backbone." The specific claim.

### 5.2 Recommendation: light hero, split layout

The current hero is a full-bleed dark photographic network image with centred type at `text-8xl`. Two problems: it reads as consumer-AI-launch rather than health infrastructure (Eka's hero is light; Epic's and Vanta's are light), and it costs 655KB before anything else loads (§12).

**Go light and split.** Copy left, product artifact right. Light surfaces read institutional; dark surfaces are then reserved for the two places where darkness carries meaning — the Crisis band and the closing Demo band.

### 5.3 Copy

**Eyebrow**
```
HEALTH RECORD INFRASTRUCTURE FOR INDIA
```

**H1**
> # One patient. One record. From birth to end of life.

**Subheadline**
> Santhica turns every prescription, lab report, scan, and admission — handwritten or digital — into a single continuous medical record that follows the patient across every clinic, hospital, and city.

**Value chips** (three, inline, below the subhead)
```
30 seconds to digitize a record
Works on any phone
No change to how doctors already work
```

**CTAs**
- Primary: `Request a demo` → `#demo`
- Secondary: `See how the record works` → `#record`

> Note: the current secondary CTA reads "Learn More" (`HeroSection.tsx:396`), which names no destination. Replace it. Every secondary CTA should say where it goes.

### 5.4 Layout

**Desktop (≥1024px)** — 12-column grid, `max-w-[1200px]`, `gap-16`, `pt-24 pb-20`.

```
┌─────────────────────────────────┬───────────────────────┐
│ cols 1–7                        │ cols 8–12             │
│                                 │                       │
│ EYEBROW (label, green-700)      │  ┌─────────────────┐  │
│                                 │  │                 │  │
│ H1 — display-1, ink-primary,    │  │  Product        │  │
│ max 3 lines, max-w-[16ch] per   │  │  artifact       │  │
│ line at the top end             │  │  (see 5.5)      │  │
│                                 │  │                 │  │
│ Subhead — lede, ink-secondary,  │  │                 │  │
│ max-w-[52ch]                    │  └─────────────────┘  │
│                                 │                       │
│ [Request a demo] [See how ...]  │                       │
│                                 │                       │
│ ◦ chip  ◦ chip  ◦ chip          │                       │
└─────────────────────────────────┴───────────────────────┘
```

- Background: `--surface-base`, with a very restrained `--brand-navy-100` (`#E8F4F8`) radial wash behind the right column only. **This is the one sanctioned use of the light-blue token** — it stops it becoming a third competing surface colour across the page.
- H1 line breaks are typographic, not `<br>`: set `text-balance` and `max-w-[15ch]` so it wraps to three lines naturally at desktop and reflows cleanly.
- Chips: 1px `--border-subtle`, 6px radius, `body-sm`, `--ink-secondary`, 4px `--brand-green-600` dot. No fill.

**Tablet (768–1023px)** — stack vertically, artifact below copy, artifact capped at 480px wide and centred. `pt-20 pb-16`.

**Mobile (<768px)** — single column, `px-5 pt-16 pb-12`. H1 at the clamp floor (2.5rem). CTAs full-width stacked, primary first, 48px tall, 12px gap. Chips wrap to a two-line list, left-aligned. **The artifact renders below the CTAs and is lazy-loaded** — on a mid-range Android the buttons must be reachable within the first viewport.

### 5.5 The right-column artifact

We have no shippable product screenshot and I will not specify one containing invented clinical data. Two options:

**Option A (recommended default): schematic capture diagram.** Inline SVG, ~4KB. A phone outline at 1:2 ratio containing three stacked states connected by two short arrows:

```
  [ 📄 photo of a prescription ]      ← rendered as a generic paper glyph,
            ↓  ~8s                       NO legible drug names
  [ structured fields ]                ← labelled rows: DRUG / DOSE /
            ↓  ~22s                       FREQUENCY / DURATION, values
  [ ✓ filed to patient record ]           shown as neutral grey bars
```

Total elapsed marker `30s` in the corner. Monochrome navy on white with a single green check. Zero fabricated patient data, zero fabricated drug names, and it makes the "30 seconds" claim visual rather than asserted.

**Option B: a real product screenshot.** Better, if the user can supply one. Constraints if used: it must show either genuinely consented demo data or obviously synthetic data, and it must carry a visible `Sample data` chip in the corner. Under no circumstances a realistic-looking record for a person who does not exist presented without that label. Note the repo has synthetic fixtures in `public/sample-documents/` that could seed a legitimate labelled screenshot.

### 5.6 States

Hero has no interactive state beyond CTA hover/focus/active. Specify:
- Focus: 2px `--focus-ring`, 2px offset, on all three interactive elements.
- The artifact SVG is `aria-hidden="true"` with the 30-second claim stated in the adjacent chip text, so screen-reader users lose nothing.

---

## 6. Section 2 — Pedigree bar

Thin band directly under the hero. `py-8`, `--surface-base`, 1px top and bottom `--border-subtle`.

**Copy**
```
BUILT BY ENGINEERS FROM
```
followed by: `Amazon · Alexa · Audible · Oracle · HubSpot · Broadcom`

Rendered as text wordmarks (not logo images — we do not have licensed logo assets and text is 0KB), `body-sm`, `--ink-tertiary`, `500`, letterspaced `0.04em`, separated by 32px. Centred on desktop; horizontally scrollable single row on mobile with the label stacked above.

**This label is mandatory.** Without it the strip claims customers. See §1.

`[VERIFY]` — confirm all six companies are accurate to the founding team's history and that none of them are current customers or partners (which would change what the label should say).

---

## 7. Section 3 — Crisis Metrics

### 7.1 Intent

Establish stakes, hard, in one screen. Two numbers, no more. The temptation to pad a stats band with a third and fourth figure must be resisted — the current site's three-stat band (`AboutSection.tsx:71-84`) carries figures (3.9M care points, 70% travel 100km+, <0.1% digitized) that are **also uncited** and should be either sourced or removed in this rebuild.

### 7.2 Copy

**Eyebrow**
```
THE PROBLEM
```

**H2**
> ## The record doesn't travel. The patient pays for it.

**Lede**
> Two numbers describe Indian outpatient care. Both trace to the same gap: at the moment of decision, the doctor cannot see what came before.

**Metric A**
```
~1,00,000
```
> deaths a year in India attributed to medical error.

`[VERIFY — SOURCE REQUIRED]` Source line, rendered directly beneath the label:
> Source: *[Publication], [Year]* ↗

**Metric B**
```
~2 min
```
> the average outpatient consultation. Two minutes to reconstruct a history that may span decades.

`[VERIFY — SOURCE REQUIRED]` Source line:
> Source: *[Publication], [Year]* ↗

**Bridge line** (single sentence, centred beneath both panels, `lede` size)
> A doctor with two minutes cannot rebuild a history that lives in a plastic bag of paper. Santhica hands them the history in the first ten seconds.

### 7.3 Layout and visual treatment

Full-bleed dark band. `--surface-inverse` (`#0B1220`) with a subtle linear gradient to `--brand-navy-800` at the bottom edge. `py-28 md:py-36`. This is the heaviest section on the page and should feel like it.

**Desktop:** two panels side by side, 6 columns each, separated by a 1px vertical `rgba(255,255,255,0.10)` rule that runs the full panel height. Inside each panel, left-aligned:

```
┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│  ~1,00,000               │  ~2 min                  │
│  ──────────────          │  ──────────────          │  ← 48px hairline,
│                          │                          │    rgba(255,255,255,.2)
│  deaths a year in India  │  the average outpatient  │
│  attributed to medical   │  consultation. Two       │
│  error.                  │  minutes to reconstruct  │
│                          │  a history that may      │
│  Source: [Pub], [Yr] ↗   │  span decades.           │
│                          │                          │
│                          │  Source: [Pub], [Yr] ↗   │
└──────────────────────────┴──────────────────────────┘
```

**Numeral treatment for maximum impact:**
- `metric` scale: `clamp(3rem, 7vw, 5.5rem)`, weight **300**, `tabular-nums`, `tracking-[-0.03em]`, colour `#FFFFFF`.
- **Weight 300, not 700.** Thin oversized numerals on a dark field read as gravity; heavy numerals read as a sales deck. This is the difference between the Epic register and the startup register.
- **Monochrome. Do not colour these numbers.** Green would read "positive." Red would read "system alert" and would be the only red on a health page, which is a semantic error. Scale and space carry the impact.
- Indian digit grouping (`1,00,000` not `100,000`) — a small, correct, local signal.
- The 48px hairline rule under each numeral is the only ornament.

**Mobile:** panels stack. The vertical rule becomes a horizontal 1px divider with `my-12`. Numerals hold at the clamp floor (3rem) — do not shrink further; the whole point is scale. `px-5 py-20`.

### 7.4 Citation UI — non-negotiable specification

- **Position: inside the panel, directly beneath the claim it supports.** Not a page-bottom footnote, not a tooltip, not a hover reveal. A hospital CIO evaluating a vendor should be able to see the source without an interaction.
- **Format:** `Source: {Publication}, {Year}` where the publication name links to the primary source, opens in a new tab, `rel="noopener noreferrer"`, with an external-link glyph.
- **Style:** `body-sm` at 13px, `rgba(255,255,255,0.55)`, link underlined with `underline-offset-4`, hover to `rgba(255,255,255,0.9)`. Deliberately quiet — present, not shouted.
- **Contrast check:** `rgba(255,255,255,0.55)` over `#0B1220` computes to roughly 8:1. Passes.

### 7.5 Animation

- Panels fade in on scroll (opacity + 12px rise, 400ms). That's all.
- **Explicitly: no count-up animation on the deaths figure.** Animating a death toll upward for visual interest is tasteless and a reviewer will notice. A count-up on the "2 min" figure is technically defensible but I recommend against it for consistency.
- `prefers-reduced-motion: reduce` → both panels render at full opacity with no transform.

### 7.6 The blocker

> **This section cannot ship as specified until both sources are supplied.** If the user cannot source them by launch, the fallback is a qualitative version with no numerals:
>
> ## The record doesn't travel. The patient pays for it.
>
> > In most Indian outpatient encounters the treating doctor has no access to the patient's prior prescriptions, results, or admissions. Decisions get made on a two-minute history and whatever paper the patient remembered to bring.
>
> Weaker, but honest. **Shipping an uncited mortality statistic on a health product website is the worst option available and is not on the table.**

---

## 8. Section 4 — Lifetime Journey Visual

### 8.1 Intent

This is the emotional centrepiece and the proof of the H1. One job: make "a record that lasts a lifetime" legible in about five seconds, without decoration getting in the way.

**The differentiating idea, and the thing most timeline visuals miss:** the interesting variable is not that time passes — it is that *the custodian changes and the record does not*. Village clinic, district hospital, tertiary centre, home care. That is the insight the visual must carry, and it is what separates this from a generic milestone timeline.

### 8.2 Copy

**Eyebrow**
```
THE RECORD
```

**H2**
> ## One record, from the first immunization to the last discharge.

**Lede**
> Providers change. Cities change. Paper is lost. The record shouldn't be.

**Stage labels and event chips** (five stages)

| Stage | Events shown as chips |
|---|---|
| `Birth` | Birth record · Immunizations |
| `Childhood` | Paediatric visits · Growth · Allergies |
| `Adult care` | Prescriptions · Lab panels · Imaging |
| `Chronic & surgical care` | Admissions · Operative notes · Discharge summaries · Follow-up |
| `Elder care` | Polypharmacy review · Interaction checks · Care-team access |

These are **record categories, not a patient**. No names, no dates, no dosages, no diagnoses. Nothing on this graphic should be mistakable for a real person's data.

**Custodian rail caption** (below the graphic)
> Village clinic → District hospital → Tertiary centre → Home care

> **Custodians change. The record does not.**

### 8.3 Visual concept — build spec

Inline SVG. No image files, no animation library, no Lottie. Estimated ~6KB uncompressed, ~2KB gzipped.

```
viewBox="0 0 1200 340"  preserveAspectRatio="xMidYMid meet"

y=60    stage labels (five, 12px/600 uppercase, --ink-tertiary)
y=120   ── SPINE BASE: x=60→1140, 3px, --border-subtle, round cap
y=120   ── SPINE FILL: same path, 3px, --brand-green-600, drawn L→R
y=120   ── NODES: 5 circles r=9, fill --brand-navy-700, 3px white ring
y=170   event chips, stacked per stage, 12px, --ink-secondary,
        1px --border-subtle, 4px radius
y=290   ── CUSTODIAN RAIL: four segments, 28px tall, 4px radius,
        alternating --surface-subtle / --brand-navy-100 fills,
        1px --border-subtle, label centred 11px/600
        Segment boundaries deliberately DO NOT align with the node
        positions — that misalignment is the point: custody handoffs
        happen mid-stage, and the spine runs straight through them.
```

The spine passing unbroken over four discontinuous custodian segments *is* the argument. Everything else is annotation.

### 8.4 Animation

- On `IntersectionObserver` entry at 0.3 threshold, **once**, then disconnect:
  1. Spine fill draws left→right via `stroke-dasharray` / `stroke-dashoffset`, 1200ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
  2. Nodes scale 0→1 with a per-node stagger of 140ms, timed so each node pops as the spine reaches it.
  3. Event chips fade in 200ms after their node, staggered 60ms.
  4. Custodian rail fades in at 800ms, all four segments together.
- Total: ~1.8s. Long for UI, correct for content — this animation *is* the message (the record accumulating). That is the one place a long animation earns its keep.
- **Reduced motion:** the entire sequence is skipped. Spine renders fully drawn, nodes at scale 1, chips and rail at opacity 1, all transitions set to `none`. Implement by checking `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before attaching the observer — **not** by relying on CSS alone, because the initial state is `opacity: 0` and a CSS-only guard leaves it there.

### 8.5 Mobile degradation

**Do not scale the SVG down and do not make it horizontally scrollable.** A 1200px timeline at 375px is illegible, and a horizontal-scroll region inside a vertical-scroll page is a well-known failure — users miss it entirely.

Below `768px`, render a **vertical DOM list** from the same data array:

```
│
●  BIRTH
│    Birth record · Immunizations
│
●  CHILDHOOD
│    Paediatric visits · Growth · Allergies
│
●  ADULT CARE
│    Prescriptions · Lab panels · Imaging
│
●  CHRONIC & SURGICAL CARE
│    Admissions · Operative notes ·
│    Discharge summaries · Follow-up
│
●  ELDER CARE
│    Polypharmacy review · Interaction checks ·
│    Care-team access
│
```

- 2px rail at `left: 15px`, `--border-subtle`, with a `--brand-green-600` fill that animates top→bottom on the same reduced-motion rules.
- Nodes: 12px circles, `--brand-navy-700`.
- Custodian rail becomes four stacked labelled bars below the list, with the same caption.
- This costs roughly 40 extra lines of JSX over a scaled SVG. Worth it.

### 8.6 Accessibility

**Render the semantic `<ol>` at all widths.** Below `md` it is visible; at `md` and above it is `sr-only`, and the SVG carries `aria-hidden="true"`.

This is cleaner than `role="img"` + `<title>`/`<desc>` on the SVG, because it gives screen-reader users the same structured, navigable content sighted users get rather than a single prose summary. It also means the content is in the DOM for crawlers.

```
<ol> with <li> per stage:
  <li>
    <h3>Birth</h3>
    <ul><li>Birth record</li><li>Immunizations</li></ul>
  </li>
  ...
```

Section wrapper: `<section aria-labelledby="record-heading">`.

---

## 9. Section 5 — Product Modules

### 9.1 IA recommendation: **three labeled bands, all visible, with a sticky jump rail. Not tabs.**

I considered four options.

| Option | Verdict |
|---|---|
| **Tabs** (Radix `tabs`) | **Rejected.** Hides two-thirds of the platform on first paint. The entire purpose of this section is that breadth reads as a platform — a tab UI actively works against the goal. Also costs a tap for a mobile user on patchy data, and pushes two-thirds of the copy behind an interaction where it does less SEO work. |
| **Flat 9-card grid** | **Rejected.** Nine undifferentiated tiles read as a feature list, which is exactly the impression to avoid. No structure means no platform story. |
| **Progressive disclosure / "show more"** | **Rejected.** Same hiding problem, plus it implies the extra modules are less important. |
| **Three labeled bands, all rendered, sticky jump rail** | **Recommended.** |

**Why the recommendation wins:** grouping into three named layers is what makes nine items read as *architecture* instead of *inventory*. Everything stays in the DOM on first paint. The sticky rail supplies the scannability and orientation that tabs would have given, without the cost of hiding content — it scroll-jumps rather than toggles. Degrades to a scroll-chip rail on mobile with zero behaviour change.

**Grouping (4 / 2 / 3):**

- **Outpatient** — prescription reading, lab digitization, Voice Consult Scribe, manual entry
- **Inpatient** — treatment chart, X-ray decision support
- **Platform & Network** — mobile-first capture, universal integration, agentic follow-up

Care setting is the right axis rather than, say, capture-vs-analysis, because it maps directly onto how a buyer is organised. A hospital COO scans for "inpatient." A clinic owner scans for "outpatient." A CIO scans for "platform." Everyone finds their row in one pass.

### 9.2 Copy

**Eyebrow**
```
THE PLATFORM
```

**H2**
> ## Nine modules. One record underneath.

**Lede**
> Santhica isn't a single app. It's a capture-and-integration layer that works wherever the record is actually created — the consult room, the ward, the lab, the pharmacy.

**Status legend** (right-aligned on the section header row)
```
● Live      ○ In development      Status as of [DATE]
```

---

**Band 1 header**
> ### Outpatient
> Where most of Indian care happens, and where almost none of it is recorded.

**Handwritten prescription reading** `[VERIFY STATUS]`
> Photograph a handwritten prescription. Santhica reads it, structures it into drug, dose, frequency, and duration, and files it to the patient's record in about 30 seconds. Printed or handwritten, neat or not.

**Lab report digitization** `[VERIFY STATUS]`
> Upload a lab PDF or photograph a printed report. Values are extracted into discrete, trendable results — so a creatinine from 2021 sits on the same axis as one from today. Not a stored image.

**Voice Consult Scribe** `[VERIFY STATUS]`
> Ambient capture of the consultation. The conversation becomes a structured note and a prescription draft, which the doctor reviews and signs before anything is filed.

**Manual outpatient entry** `[VERIFY STATUS]`
> For the cases where capture fails, or where a doctor would rather type. Full structured entry on the same mobile surface — no desktop, no separate system.

---

**Band 2 header**
> ### Inpatient
> Ward-side capture and decision support.

**Inpatient treatment chart** `[VERIFY STATUS]`
> The ward chart, digitized. Orders, administrations, vitals, and progress notes on one continuous timeline per admission — and that admission joins the patient's lifetime record on discharge.

**X-ray decision support** `[VERIFY STATUS]`
> A model that reads chest X-rays and flags findings for the treating clinician. **Decision support, not diagnosis** — every output is reviewed by a physician, and Santhica does not return a diagnosis on its own. `[VERIFY — regulatory wording, see §11]`

---

**Band 3 header**
> ### Platform & Network
> How data gets in, and how it stays connected.

**Mobile-first capture** `[VERIFY STATUS]`
> Every module runs on the phone a clinician already carries. No workstation, no installation, no IT project, no change to how they already work.

**Universal data integration** `[VERIFY STATUS]`
> New hospitals, labs, pharmacies, doctors, and data sources onboarded in days, not quarters. Each new source makes every record downstream of it more complete.

**Agentic follow-up** `[VERIFY STATUS]`
> An agent that watches the record for the moments that need a human: post-surgical checkpoints, oncology follow-up windows, and abnormal results that were never acted on.

### 9.3 Layout

Surface: `--surface-subtle` (`#F6F8FA`). `py-20 md:py-28`.

**Sticky jump rail** — sits directly under the sticky navbar at `top-16`, `z-40`, full-bleed, `--surface-subtle` with `backdrop-blur-sm` and a 1px bottom border once it sticks. Three segmented pills:

```
[ Outpatient (4) ] [ Inpatient (2) ] [ Platform & Network (3) ]
```

Counts included — they are the compact signal of breadth. Clicking scroll-jumps to the band with `scroll-margin-top: 128px` (nav + rail). Active pill (scroll-spy) gets `--brand-navy-700` fill, white text. Inactive: transparent, 1px `--border-strong`, `--ink-secondary`.

**Band layout:**
- Band header: `h3` left, one-line descriptor beneath in `--ink-tertiary`, then a full-width 1px `--border-subtle` rule, then the grid. `mb-8`, bands separated by `mt-16`.
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `gap-4`. Band 1 (4 cards) fills 3 + 1; band 2 (2 cards) uses `lg:grid-cols-2` with wider cards so it doesn't look truncated; band 3 (3 cards) fills the row exactly.

**Card anatomy:**

```
┌────────────────────────────────────┐
│ [icon 20px]              ● Live    │  ← status top-right
│                                    │
│ Handwritten prescription reading   │  ← h4, ink-primary
│                                    │
│ Photograph a handwritten           │  ← body-sm, ink-secondary
│ prescription. Santhica reads it,   │     3–4 lines, no clamp
│ structures it into drug, dose,     │     (clamping loses meaning)
│ frequency, and duration...         │
└────────────────────────────────────┘
```

- Padding `p-6`, radius 8px, `--surface-base` fill, 1px `--border-subtle`.
- Icons: `lucide-react`, 20px, 1.5 stroke, `--brand-navy-700`. Monoline only. Suggested: `ScanLine`, `FileText`, `Mic`, `Keyboard`, `ClipboardList`, `Scan`, `Smartphone`, `Network`, `BellRing`.
- **Hover: border colour only** (`--border-subtle` → `--brand-navy-700`), 120ms. No lift, no shadow, no scale.
- Equal-height cards per row via grid; no fixed height — copy length varies and truncation costs comprehension.

**Mobile:** rail becomes a horizontally scrollable chip row with `overflow-x-auto`, `scroll-snap-x`, and 16px edge padding so the third chip peeks (signalling scrollability). Cards go single-column, `p-5`.

### 9.4 The status convention — specification

This is the most consequential detail in the section. Presenting a roadmap item as shipped to a hospital buyer is a credibility loss you don't recover from in a procurement cycle.

**Three states, defined in `src/content/modules.ts` as a union type:**

| Status | Chip | Colour | Meaning |
|---|---|---|---|
| `live` | ● Live | `--brand-green-700` text, `--brand-green-600` filled 6px dot | In production use today by at least one real customer or pilot site |
| `pilot` | ◐ In pilot | `--brand-navy-700` text, half-filled dot | Working, deployed, but limited-availability |
| `development` | ○ In development | `--ink-tertiary` text, hollow 6px ring, `--border-strong` stroke | Not available. Roadmap. |

Rules:
1. **Never colour alone.** Every chip carries its text label. The dot is redundant reinforcement, not the signal. (WCAG 1.4.1.)
2. **`sr-only` prefix:** each chip renders `<span class="sr-only">Availability status: </span>` before the label.
3. **No amber, no red.** Roadmap is neutral slate, not a warning.
4. **Default is `development`.** The type should make `live` an explicit opt-in per module, so a new module can never accidentally inherit a "Live" badge.
5. **Section-level date stamp:** `Status as of {DATE}` in the legend. Undated status claims go stale silently.
6. **Status is one field in one file.** No component knows about it.

> **`[VERIFY]` — the user must confirm the status of all nine modules individually before build.** I have not guessed. Every module above is marked `[VERIFY STATUS]` and the build should ship with all nine defaulted to `development` until each one is explicitly promoted.

---

## 10. Section 6 — Trust & Compliance

### 10.1 Intent and the hard constraint

This is the section that most separates Santhica from a seed-stage landing page — and the one with the most downside risk. Eka can put up five certification badges. Santhica cannot, and must not imply otherwise.

**The strategic move: make the honesty the product.** A trust section that plainly says "here is what we do, here is what we don't hold, here is what's on the roadmap and when" is *more* persuasive to a hospital CIO than a badge wall, because the CIO knows the badge wall is table stakes and will ask the gap question anyway. Volunteering it converts an objection into a credibility signal. This is Vanta's actual insight, and Eka's `/security` page — a wall of unstructured prose with no dates and no negatives — does not do it.

**The constraint stated plainly:** every claim below is `[VERIFY]`. I do not know Santhica's actual infrastructure posture. I have specified the *slots* and written candidate copy so the section can be built, but **no claim in this section may ship without the user confirming it is true today** — not "will be true," not "basically true." Claiming a certification you don't hold (ABDM, NHA, SOC 2, ISO 27001, HIPAA) is a misrepresentation with regulatory and contractual consequences, and on a health product it is the single fastest way to lose an enterprise deal or attract a regulator. When in doubt, cut the row.

### 10.2 Copy

**Eyebrow**
```
SECURITY & DATA GOVERNANCE
```

**H2**
> ## What we can say about your data today.

**Lede**
> A medical record is the most sensitive data a person generates, and it outlives every system that touches it. Below is Santhica's current posture — stated plainly, including what we haven't done yet.

---

**Control rows.** Each row: control name, a one-line present-tense status, and a "Details" disclosure containing the specifics.

**1. Encryption in transit** `[VERIFY]`
> All traffic between apps, clinics, and Santhica services runs over TLS 1.2 or higher. No health data is transmitted unencrypted.
>
> *Details:* `[VERIFY — TLS version floor, HSTS enabled?, certificate authority, whether internal service-to-service traffic is also encrypted]`

**2. Encryption at rest** `[VERIFY]`
> Records, documents, and images are encrypted at rest in storage.
>
> *Details:* `[VERIFY — cipher (AES-256?), key management (KMS? which?), key rotation policy, whether database AND object storage are both covered, whether backups are encrypted]`

**3. Consent-driven access** `[VERIFY]`
> A clinician sees a patient's record only after that patient has granted access. Consent is recorded, scoped to a care relationship, and can be withdrawn by the patient.
>
> *Details:* `[VERIFY — what exactly is scoped: full record or subsets? Time-bounded? What happens to already-viewed data on revocation? Is revocation self-service?]`
>
> *Note: the repo contains real consent machinery (`AbhaStatusBadge`, recent commits on consent-gated doctor views and patient invites), so this row is likely the strongest genuine claim on the page. It is also the one worth the most detail — it is a differentiator, not a checkbox.*

**4. Role-based access control** `[VERIFY]`
> Access is scoped by role and by care-team membership. Staff cannot browse records they have no relationship to.
>
> *Details:* `[VERIFY — which roles exist, whether break-glass access exists and whether it's logged, whether Santhica employees can access production records and under what controls]`

**5. Audit logging** `[VERIFY]`
> Every access to a patient record is logged with actor, time, and record.
>
> *Details:* `[VERIFY — is this actually implemented? Retention period? Is the log available to the patient? Immutable/append-only?]`
>
> **If audit logging is not implemented today, delete this row.** Do not soften it to "we log activity."

**6. Data residency** `[VERIFY — HIGHEST RISK ROW]`
> `[CANDIDATE, ONLY IF TRUE:]` Patient data is stored and processed in India, in the [provider] [region] region.
>
> **If data is stored outside India, this row must say so, or be removed.** Do not write "data residency options available" or any construction that implies Indian residency without it being the case. Indian hospital procurement asks this question first, and answering it wrongly is both a lost deal and a potential DPDP Act exposure.

---

**Roadmap block** — visually distinct: `--surface-subtle` panel, 1px `--border-subtle`, 8px radius, `p-6`, with its own heading.

> ### On our roadmap
>
> **ABDM integration.** Santhica is building toward ABDM interoperability so records can move under the national framework.
>
> > **Santhica is not ABDM certified today.** We will publish the certification date when we have one.

**That bolded sentence is mandatory and must not be softened, shortened, or moved into a footnote.** It is the single most important line in this section. Any phrasing that reads as "ABDM-ready," "ABDM-aligned," or "ABDM-compatible" without the disclaimer adjacent is a compliance implication and must not ship.

---

**"What we don't claim" block** — plain text, no panel, `--ink-secondary`, directly beneath the roadmap block.

> ### What we don't claim
>
> - Santhica is not ABDM certified. `[FIXED — do not remove]`
> - We do not hold SOC 2 Type II or ISO 27001 today. `[VERIFY — confirm this is accurate; if either is held or in progress, state the accurate version]`
> - Santhica's AI models provide clinical decision support. They are not regulated diagnostic devices, they carry no regulatory clearance, and they do not replace clinician judgment. `[VERIFY — confirm no clearance is held; if one is, name it precisely]`

This block is the differentiator. It is also a real legal safe harbour: explicit disclaimers of what is not held are far better protection than silence.

---

**Closing line**
> Questions about our security posture, or need a vendor questionnaire completed? Write to [support@santhica.com](mailto:support@santhica.com).

### 10.3 Layout

`--surface-base`, `py-20 md:py-28`, `max-w-[880px]` — narrower than other sections. Trust content reads as a document, not a marketing grid, and a narrower measure signals that.

**Control rows** use `accordion.tsx` (Radix — keyboard and ARIA handled), `type="multiple"`, all collapsed by default:

```
┌────────────────────────────────────────────────────────┐
│ ✓  Encryption in transit                          [▾]  │
│    All traffic between apps, clinics, and Santhica     │
│    services runs over TLS 1.2 or higher.               │
└────────────────────────────────────────────────────────┘
```

- Leading `Check` icon, 16px, `--brand-green-700`. Only on rows that are confirmed true. A row with unresolved `[VERIFY]` gets no icon and should not be built.
- Control name `h4`; status line `body-sm` `--ink-secondary`, always visible (not inside the disclosure) — **status at a glance, evidence one click away.** That is the Vanta pattern and it is the whole point of the section.
- Rows separated by 1px `--border-subtle`, no card chrome. A stack of bordered cards here reads as marketing; a document-style list reads as disclosure.
- Chevron rotates 180° in 150ms; disclosure expands with the existing `accordion-down` keyframe (already in `tailwind.config.ts:853`).

**Mobile:** identical, single column, `px-5`. Accordion is the right pattern at every width here — no layout change needed.

### 10.4 States

- **Default:** all rows collapsed, all status lines visible.
- **Expanded:** detail text, `body-sm`, `--ink-secondary`, `max-w-[62ch]`, `pt-3 pb-5`.
- **Deep link:** support `#security-encryption-at-rest` style anchors that auto-expand the matching row on load. Enterprise buyers link colleagues to specific rows; make that work.
- No async, no empty, no error states — this is static content by design. **Do not** fetch trust status from an API; it should be reviewable in a git diff.

---

## 11. Section 7 — Team

### 11.1 Copy

**Eyebrow**
```
WHO'S BUILDING IT
```

**H2**
> ## Built by engineers who have run systems at this scale.

**Lede**
> Santhica's founding team comes from Amazon, Oracle, and HubSpot, where they built and operated AI and distributed systems in production. `[VERIFY — confirm phrasing; avoid any computed "combined years" claim]`

---

**Suranjana Roy — Founder & CEO**
> Former Head of Engineering at Amazon. Led Agentic AI, LLM, inferencing, and MLOps for Alexa and AGI. 15+ years building AI systems at Amazon, Oracle, and now Santhica.

`LinkedIn` → https://www.linkedin.com/in/sbroy/

**Soubhagini Mahapatra — CTO & Founding Engineer**
> Ex-HubSpot Senior Engineer. 14+ years building distributed systems at scale. Building Santhica's core infrastructure: mobile-first capture, cloud sync, and consent-driven data flows.

`LinkedIn` → https://www.linkedin.com/in/soubhagini-mahapatra-978035156/

**Romir Jain — COO & Founding Engineer**
> Recent CS graduate and serial entrepreneur. Brings startup velocity and AI product experience to the founding team.

> **Copy change flagged:** the current bio for Soubhagini says "offline-first mobile" (`TeamSection.tsx:649`). Per the standing constraint this must read **"mobile-first."** Corrected above.

**Pedigree strip label** (if repeated here rather than only in §6)
```
PREVIOUSLY AT
```
`Amazon · Alexa · Audible · Oracle · HubSpot · Broadcom`

### 11.2 Layout — what changes from the current treatment

The current section (`TeamSection.tsx`) is three centred cards with gradient circular monograms, hover lift, and colored shadow. Centred text with a decorative gradient avatar is the visual grammar of a consumer team page. Four changes:

1. **Left-align everything inside the card.** Centred bios are harder to scan and read as a startup "meet the team." Left-aligned reads as a masthead.
2. **Monogram becomes a flat square, not a gradient circle.** 56px, 8px radius, `--brand-navy-700` fill, white initials at 18px/600. No gradient. Circular gradient avatars are a stylistic tell.
3. **Hover: border colour only.** Drop `hover:-translate-y-1` and `hover:shadow-xl`, consistent with §9.3.
4. **Role becomes the strongest secondary element**, `--brand-green-700` at `body-sm`/600 — it is what a buyer scans for.

```
┌──────────────────────────────────┐
│ ┌────┐                           │
│ │ SR │                           │
│ └────┘                           │
│ Suranjana Roy                    │  ← h3
│ Founder & CEO                    │  ← body-sm/600, green-700
│                                  │
│ Former Head of Engineering at    │  ← body-sm, ink-secondary
│ Amazon. Led Agentic AI, LLM,     │
│ inferencing, and MLOps for       │
│ Alexa and AGI...                 │
│                                  │
│ [in] LinkedIn ↗                  │  ← 14px, ink-tertiary
└──────────────────────────────────┘
```

Surface `--surface-subtle`. `py-20 md:py-28`. Grid `md:grid-cols-3 gap-6`, cards `p-6`, 1px `--border-subtle`, radius 8px, `--surface-base` fill.

**No photographs** — standing decision, carried forward. Monograms only.

**Mobile:** single column, cards `p-5`, `gap-4`. Pedigree strip becomes a two-line centred wrap.

### 11.3 States

- LinkedIn links: `target="_blank" rel="noopener noreferrer"`, external-link glyph, and an `sr-only` "(opens in a new tab)".
- Romir Jain has no LinkedIn URL — the link simply does not render. Do not render a disabled or placeholder link.

---

## 12. Section 8 — Request Demo

### 12.1 Copy

**Eyebrow**
```
GET STARTED
```

**H2**
> ## See a prescription become a record.

**Lede**
> A 30-minute walkthrough with the founding team. Bring one of your own documents.

**Benefits** (three, checkmarked)
> - **Live capture on your documents.** Bring a real prescription or lab report — we'll digitize it on the call.
> - **Runs on a phone.** Nothing to install, no workstation, no IT involvement to see it work.
> - **A written deployment plan for your setting** within 48 hours of the call. `[VERIFY — this is a commitment; confirm the team will honour it, or change the number]`

**Form heading**
> ### Request a demo

**Fields**

| Label | Type | Required | Placeholder / options |
|---|---|---|---|
| `Full name` | text | Yes | *(no placeholder — see below)* |
| `Work email` | email | Yes | — |
| `Organization` | text | No | — |
| `Role` | select | Yes | Physician · Hospital administrator · Clinic owner · IT / CIO · Lab or diagnostics · Investor · Other |
| `Message` | textarea | No | — |

> **Two changes from the current form.** (1) `Role` becomes a `select` rather than free text — free-text roles produce unsortable data and cost the visitor typing on a mobile keyboard; the `Other` option reveals a text input on selection. (2) **All placeholders are removed.** The current form uses placeholders as example values (`"Dr. Priya Sharma"`, `"Apollo Hospitals"`, `"Chief Medical Officer"` — `DemoSection.tsx:243,271,286`). Placeholder-as-example disappears on focus, is low-contrast, and is read inconsistently by screen readers. The labels are already above the fields and are sufficient.

**Required-field marking**
> Fields marked *required* must be completed.

Mark required fields with the word `Required` in `--ink-tertiary` next to the label, **not** a red asterisk. The current implementation uses `<span className="text-red-400">*</span>` — a red glyph carrying meaning by colour alone, which fails WCAG 1.4.1, and red is the alert channel.

**Submit button**
```
Request a demo
```

**Consent microcopy** (below the button, `body-sm`, `--ink-tertiary`)
> By submitting, you agree that Santhica may contact you about this request. We don't sell or share your details. See our [Privacy Policy](/privacy-policy). `[VERIFY WITH COUNSEL — DPDP Act 2023 consent wording]`

### 12.2 Layout

Surface: `--surface-inverse` (`#0B1220`). Deliberate bookend to the Crisis band — the page opens light, goes dark for the problem, returns to light for the solution, and closes dark for the ask. Two dark bands, symmetric, both load-bearing.

On the dark surface: eyebrow and accents use `--brand-green-400` (`#2DB87F` — 7.36:1, the sanctioned dark-surface green). Form card sits on `--surface-base` (white) inside the dark band, 8px radius, `p-8` — the white card is the visual "landing zone" and pulls the eye to the conversion point.

**Desktop:** 12-col, `gap-16`. Copy + benefits cols 1–5; form card cols 7–12.
**Tablet:** stacked, form below copy, form `max-w-[560px]` centred.
**Mobile:** stacked, `px-5`, form card `p-6`, all fields full width, 48px input height, `inputMode` and `autoComplete` set (`name`, `email`, `organization`) so mobile keyboards and autofill behave.

### 12.3 States — and a real bug in the current implementation

> **Defect:** `DemoSection.tsx:175-195` opens a `mailto:` link and then unconditionally fires `toast.success("Thanks! We'll be in touch within 24 hours.")`. The mail client may be blocked by the popup blocker, absent on the device, or the user may close the draft without sending. **The form reports success for submissions that were never sent.** On the primary conversion path of the site this is losing real leads silently, and it is telling users something untrue.
>
> **Fix: POST to a real endpoint.** Options in order of preference: (a) a small serverless function that emails via Resend/SES and returns a real status; (b) Formspree or similar; (c) if neither is possible before launch, change the copy to match reality — `"Opening your email app…"` with a visible fallback address — and never claim receipt.

Full state list, implemented with `react-hook-form` + `zod` + `form.tsx` (all installed, none currently used on the landing page):

| State | Behaviour |
|---|---|
| **Idle** | All fields empty, submit enabled. |
| **Validating** | Validation fires **on blur**, not on keystroke. Errors render beneath the field in `--ink-primary` with a 16px `AlertCircle`, `aria-invalid="true"`, `aria-describedby` pointing at the error node. Error text states the remedy: `"Enter a work email address so we can reply."` — not `"Invalid email."` |
| **Submitting** | Button label → `Sending…`, spinner, `disabled`, `aria-busy="true"`. All fields become `readOnly` (not `disabled` — disabled fields drop out of the tab order and lose their values to some autofill implementations). |
| **Success** | The form is **replaced in place** by a confirmation panel — not just a toast. A toast is dismissible and ephemeral; a panel is the durable record of what happened. Panel: green check, `### Request received`, `> We'll be in touch within 24 hours. A copy has gone to the address you gave us.`, plus a `Send another request` text button. The `sonner` toast fires as well (existing copy: `"Thanks! We'll be in touch within 24 hours."`). Confirmation panel carries `role="status"` `aria-live="polite"`. |
| **Error** | `alert.tsx` above the form, `role="alert"`: `> We couldn't send that. Try again, or email us directly at support@santhica.com.` **Field values are preserved** — never clear a form on a failed submit. Submit re-enables. |
| **Rate-limited / duplicate** | `> Looks like you've already sent this. We've got it — we'll be in touch within 24 hours.` Prevents double-submit anxiety and duplicate leads. |
| **Offline** | On `navigator.onLine === false` at submit: `> You appear to be offline. Your details are saved — try again when you're back online.` Retain form state in component state. Relevant given the target user base. |
| **Empty** | N/A. |

---

## 13. Footer

Surface `--surface-inverse`, `pt-16 pb-8`. Four columns on desktop, two on tablet, one accordion-free stack on mobile.

**Column 1 — brand**
Logo (white variant), then:
> Health record infrastructure for India.

Then `support@santhica.com` and the LinkedIn icon link.

**Column 2 — Platform**
`Outpatient` · `Inpatient` · `Platform & Network` · `All nine modules` (all anchor to `#platform` bands)

**Column 3 — Company**
`The Problem` · `The Record` · `Team` · `Contact`

**Column 4 — Trust & Legal**
`Security & data governance` (→ `#security`) · `Privacy Policy` · `Terms of Service` · `Account deletion` (route exists at `public/account-deletion/`)

**Bottom bar** — 1px `rgba(255,255,255,0.15)` top border, `pt-6`, `body-sm`, `rgba(255,255,255,0.6)`:
> © 2026 Santhica, Inc. All rights reserved.

**Do not put the ABDM disclaimer in the footer.** It belongs in §10 where the claim is made. A disclaimer relegated to the footer reads as burial.

**Mobile:** columns stack, headings `label` style, links 44px tall rows, `gap-8` between groups.

---

## 14. Accessibility — WCAG 2.2 AA

### 14.1 Defects in the current site that this rebuild must fix

1. **`#2db87f` text on white = 2.54:1.** Fails 1.4.3 (4.5:1). Five occurrences. Fixed by the palette change in §3.1.
2. **`.reveal` has no `prefers-reduced-motion` guard** (`src/index.css:1035-1070`). Every scroll animation runs for users who have explicitly asked for none. Fails 2.3.3 and is an accessibility-settings violation.
3. **`.reveal` is a content-loss risk.** Elements start at `opacity: 0` and only become visible when JS attaches an `IntersectionObserver` and it fires. If JS fails, is blocked, errors earlier in the bundle, or the observer never fires (which happens on some in-page navigations and in some crawler contexts), **the content is permanently invisible.** This is worse than an animation bug — it's silent content loss. Fix: default to visible, and have JS add an `is-animatable` class on mount that flips elements to the hidden pre-animation state. No JS → everything visible.
4. **`html { scroll-behavior: smooth }`** (`src/index.css:1030`) with no reduced-motion guard.
5. **Red asterisk as the sole required-field indicator** (`DemoSection.tsx:236` etc.). Fails 1.4.1.
6. **No `scroll-margin-top`** on anchor targets — anchored headings land under the fixed navbar. Fails 2.4.3 in effect.
7. **`<img alt="">` on the hero background** is correct, but the hero contains no `<h1>` describing the visual content — with a light split hero and a real H1, resolved.

Required CSS:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal, .reveal-left, .reveal-right {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 14.2 The animated sections specifically

**Journey timeline (§8):**
- SVG `aria-hidden="true"`; the `<ol>` is the accessible source of truth at all widths.
- Reduced motion checked in **JS** before attaching the observer, not just in CSS — the initial state is `opacity: 0` and a CSS-only guard would strand it.
- Animation runs **once**; observer disconnects. Nothing loops, nothing auto-plays indefinitely (2.2.2).
- No parallax, no scroll-linked scrubbing. Scroll-driven animation is a documented vestibular trigger and is not needed here.
- Node colours: `--brand-navy-700` on `--surface-base` = 10.9:1. Spine `--brand-green-600` against `--border-subtle` = >3:1 for graphical objects (1.4.11).

**Crisis metrics (§7):**
- Fade only. No count-up (also the right editorial call — §7.5).
- `1,00,000` should be wrapped so screen readers announce it sensibly: `<span aria-label="approximately one hundred thousand">~1,00,000</span>`. Digit-group commas are read inconsistently across screen readers.
- Citation links have discernible text — the publication name, not "here" or "source" alone (2.4.4).

**Mega-menu (§4):** Radix `navigation-menu` provides `aria-expanded`, roving focus, `Escape` to close, and focus return. Do not hand-roll. Verify the hover-intent delay does not make the menu keyboard-inaccessible — focus must open it immediately with no delay.

**Sticky module rail (§9.3):** must not obscure focused content. Combined with the navbar it occupies 128px; `scroll-margin-top: 128px` on band headings. WCAG 2.2's **2.4.11 Focus Not Obscured** is specifically about this — test tabbing through module cards with both bars stuck.

### 14.3 Baseline across all sections

- Landmarks: one `<header>`, one `<nav aria-label="Main">`, one `<main>`, `<section aria-labelledby="...">` per section, one `<footer>`.
- Heading order: one `h1` (hero), `h2` per section, `h3` for bands/cards, `h4` for module names. No level skips.
- Focus visible everywhere: 2px `--focus-ring`, 2px offset. Never `outline: none` without a replacement.
- Touch targets ≥44×44 (2.5.8): nav rows, chips, accordion triggers, footer links, LinkedIn icons.
- Skip link as the first focusable element: `Skip to main content`.
- Text resize to 200% without loss (1.4.4) — all clamps and `max-w` in `ch`/`rem`, never `px`-locked heights on text containers.
- `lang="en"` set; if any Hindi/regional copy is added later it gets its own `lang` attribute.
- Dark bands (§7, §12, footer): every text colour re-checked against `#0B1220`, not assumed from the light palette.

---

## 15. Performance

**Target device:** mid-range Android (Moto G-class, ~4× CPU throttle), Slow 4G / patchy mobile data.
**Budgets:** LCP < 2.5s · CLS < 0.1 · INP < 200ms · **first-view transfer ≤ 400KB** · JS ≤ 150KB gzipped.

### 15.1 The dominant problem: 3.4MB of images

```
public/santhica-network.png        1,373,464 bytes
public/slide1_Picture 3.png        1,356,799 bytes   ← this is the LOGO
public/santhica-hero-network.png     655,199 bytes
public/santhica-sms-opt-in-flow.png  541,298 bytes
```

The hero currently loads a 655KB PNG as a full-bleed background, and the navbar loads a **1.36MB PNG to render a 48px-tall logo**. On Slow 4G that logo alone is roughly 15–20 seconds. This is by far the largest performance defect on the site and it is on the critical rendering path.

**Fixes, in order of impact:**

1. **Logo → SVG.** If no vector exists, export a PNG at 2× the display size (32px tall → 64px asset, ~4KB) plus a white variant for the footer. Expected saving: **~1.35MB.**
2. **Drop `santhica-hero-network.png` entirely.** The light split hero (§5) replaces it with an inline SVG schematic (~4KB). Expected saving: **~650KB.**
3. **`santhica-network.png` (the ecosystem diagram)** — the Journey visual (§8) supersedes it conceptually. If it is kept anywhere, convert to AVIF/WebP at ≤120KB with a `<picture>` fallback, explicit `width`/`height`, `loading="lazy"`, `decoding="async"`. Expected saving: **~1.25MB.**
4. Every remaining `<img>` gets explicit `width`/`height` to prevent CLS.

Net: roughly **3.3MB removed** from the page.

### 15.2 Weight of the new visual concepts

| Concept | Approach | Cost |
|---|---|---|
| Hero artifact | inline SVG | ~4KB raw, ~1.5KB gz |
| Journey timeline | inline SVG + DOM list | ~6KB raw, ~2KB gz |
| Crisis metrics | pure type + CSS | ~0 |
| Module icons | `lucide-react`, tree-shaken, 9 icons | ~3KB gz |
| Mega-menu | Radix `navigation-menu` | ~8KB gz |
| Journey animation | CSS + one IntersectionObserver | ~0.5KB |

**Total new visual weight: under 20KB gzipped.** This is the payoff for choosing inline SVG over raster and over an animation library. **Explicitly rejected: Framer Motion (~35KB gz), Lottie (~60KB gz + JSON payload), any 3D/canvas library, and `recharts` for the timeline** (it is already a dependency for the product app but pulls ~90KB and is entirely wrong for a static annotated diagram).

### 15.3 Fonts

Currently: Google Fonts, Inter, **seven weights** (300/400/500/600/700/800/900), render-blocking `<link>` after two `preconnect`s (`index.html:41-43`).

- Cut to **four weights** (400/500/600/700) — the type scale in §3.2 uses no others.
- **Self-host** woff2, latin subset, in `public/fonts/`. Removes two third-party DNS+TLS handshakes from the critical path (worth 200–400ms on a high-latency mobile connection) and removes a third-party dependency from a health site.
- `font-display: swap`, `<link rel="preload">` on the two above-the-fold weights (400, 700) only.
- Expected: ~7 requests → 4, and a meaningfully earlier first render.

### 15.4 Bundle

This repo contains a full product application alongside the landing page. **Verify the landing route does not pull the app bundle.** `React.lazy` + `Suspense` on all non-landing routes in `App.tsx`, and `build.rollupOptions.output.manualChunks` in `vite.config.ts` to split vendor from landing. The landing chunk should be React + Radix (navigation-menu, accordion, sheet, select) + `lucide-react` icons + `react-hook-form`/`zod`, and nothing else. `@tanstack/react-query`, `recharts`, `embla-carousel`, `react-day-picker`, `react-dropzone`, `vaul`, `cmdk`, `input-otp` must all be absent from the landing chunk.

### 15.5 Rendering

- IntersectionObserver everywhere; **zero scroll event listeners.** The current navbar attaches an unthrottled `scroll` listener (`Navbar.tsx:530-533`) which fires on every frame during scroll — replace with a sentinel element observed by IntersectionObserver.
- Observers disconnect after firing.
- `content-visibility: auto` with `contain-intrinsic-size` on below-the-fold sections (Modules, Trust, Team, Demo). Meaningfully cheaper first paint on throttled CPU.
- The Journey animation must run on `transform`/`opacity`/`stroke-dashoffset` only — no layout-triggering properties.

---

## 16. OPEN QUESTIONS FOR THE USER

Numbered checklist. **Nothing marked BLOCKING may ship without an answer.**

### Statistics and claims

1. **BLOCKING — Source for "~1 lakh deaths/year in India from medical errors."** Need publication, year, and a URL. Without it the section ships in the qualitative fallback form (§7.6), or not at all.
2. **BLOCKING — Source for "doctors averaging a ~2-minute consult."** Same requirement. Confirm whether it is India-specific or global, and primary-care or all settings — the copy must match the scope of the study.
3. **BLOCKING — the three existing stats** currently on the site (3.9M care points, 70% travel 100km+, <0.1% of 10B prescriptions digitized, `AboutSection.tsx:71-92`). Are these sourced? They are uncited today. Source them or remove them from the rebuild.
4. Confirm the "30 seconds to digitize a record" claim — is that median, typical, or best case? The copy says "about 30 seconds"; if it's a best case, the wording changes.
5. Confirm the **48-hour deployment plan** promise in §12 is a commitment the team will honour, or supply a different number.
6. Confirm the demo response promise "within 24 hours" (existing toast copy) is still accurate.

### Module status — BLOCKING, all nine

7. Which of these nine are **live in production with real users today**? Mark each `live` / `pilot` / `development`. The build ships everything defaulted to `development` until each is explicitly promoted.
   - [ ] Handwritten prescription reading
   - [ ] Lab report digitization
   - [ ] Voice Consult Scribe
   - [ ] Manual outpatient entry
   - [ ] Inpatient treatment chart
   - [ ] X-ray decision support
   - [ ] Mobile-first capture
   - [ ] Universal data integration
   - [ ] Agentic follow-up
8. What date should the `Status as of [DATE]` stamp carry?
9. Is a **`pilot`** state useful, or should it be a binary live/development?
10. **BLOCKING — X-ray module regulatory wording.** Does the model carry any regulatory clearance (CDSCO, FDA, CE)? If not, the "decision support, not diagnosis" framing in §9.2 must ship verbatim. If it does, name it precisely.
11. Is "universal data integration — onboarded within days" a demonstrated result or a design goal? If it hasn't been done for a real external source yet, the copy needs softening.

### Compliance and security — BLOCKING, every row

12. **Encryption in transit:** TLS version floor? HSTS? Is internal service-to-service traffic encrypted?
13. **Encryption at rest:** Which cipher? Which KMS? Are object storage and backups both covered? Key rotation policy?
14. **Consent:** What exactly does a consent grant scope — full record or subsets? Time-bounded? Is revocation self-service? What happens to already-accessed data on revocation?
15. **RBAC:** Which roles exist? Does break-glass access exist, and is it logged? Can Santhica employees access production patient records, and under what controls?
16. **Audit logging:** Is it implemented today? Retention? Immutable? Visible to the patient? **If not implemented, that row is deleted — not softened.**
17. **BLOCKING, HIGHEST RISK — Data residency.** Where is patient data physically stored and processed? Which provider, which region? If it is not in India, that must be stated or the row removed. Do not imply Indian residency.
18. **BLOCKING — Confirm Santhica holds no SOC 2 Type II and no ISO 27001.** If either is held or formally in progress, supply the accurate status.
19. **BLOCKING — Confirm the ABDM disclaimer wording** in §10.2 is acceptable: *"Santhica is not ABDM certified today."* This sentence is mandatory and must not be softened. Confirm the brief's standing constraint (no ABDM claim) still holds — nothing in the new brief reverses it, and this spec does not reverse it.
20. **DPDP Act 2023:** has counsel reviewed Santhica's obligations? The form consent microcopy in §12.1 needs legal sign-off.
21. Does Santhica have a responsible-disclosure / security contact address to publish? (Eka does; it's cheap credibility.)
22. Is there a vendor security questionnaire or one-pager that could be linked from §10? Enterprise buyers ask for one within a day.

### Content and assets

23. **Is there a vector (SVG) or small-format Santhica logo?** The current 1.36MB PNG is the single worst performance item on the site (§15.1).
24. Can you supply a **real product screenshot** for the hero (§5.5, Option B) with consented or clearly-labelled synthetic data? If not, we ship the schematic.
25. Confirm the pedigree list (Amazon, Alexa, Audible, Oracle, HubSpot, Broadcom) is accurate to the founding team, and that none are current customers or partners.
26. Confirm the corrected bio wording for Soubhagini — **"mobile-first"** not "offline-first" (`TeamSection.tsx:649` is currently wrong per the standing constraint).
27. Should the LinkedIn company page appear anywhere beyond the footer?
28. Any customer, pilot site, or design-partner logo that can be shown *with permission*? Even one changes the Pedigree bar meaningfully.

### Decisions I assumed — confirm or reverse

29. **Section reorder:** Journey moved before Modules; Trust moved before Team; a new Pedigree bar added at position 2. Justified in §2. Confirm or revert to the brief's order.
30. **Light hero instead of dark.** §5.2. This is the largest visual change and it also fixes the logo `brightness-200` hack and removes 655KB. Confirm.
31. **Palette evolution:** `#2db87f` demoted to dark-surface-only; `#0A7A52` introduced for text on light. Driven by a real 2.54:1 contrast failure. §3.1.
32. **Module IA:** three visible bands with a sticky jump rail, **not** tabs. §9.1.
33. **Radius 16px → 8px, max font weight 700, no hover-lift or glow.** These are the tonal changes that move the page from seed-stage to enterprise. §3.3.
34. **Role field becomes a select** rather than free text, and all placeholder example values are removed. §12.1.
35. **Demo form must POST to a real endpoint.** The current `mailto:` + unconditional success toast reports success for submissions that were never sent (§12.3). Which backend do you want — serverless + Resend/SES, or a form service?
36. Fonts self-hosted instead of Google Fonts, four weights instead of seven. §15.3.
37. Should `#record` (The Record) appear in the desktop nav? I kept desktop at four items for restraint and added it to mobile only. §4.3.

---

## 17. BUILD COMPLEXITY ESTIMATE

Assumes one competent React/Tailwind engineer familiar with this repo. "Days" are working days including states, responsive behaviour, and accessibility — not just happy-path desktop.

| # | Section | Complexity | Est. | Notes |
|---|---|---|---|---|
| — | **Design tokens + type scale** (§3) | Low | **0.5d** | Do this first; everything else depends on it. `index.css` + `tailwind.config.ts` only. |
| — | **Motion / reduced-motion fix** (§14.1) | Low | **0.25d** | Small, and fixes a real content-loss bug. |
| 0 | **Navigation** (§4) | **High** | **2d** | Mega-menu, mobile sheet with accordion groups, scroll-spy, focus management. The single most intricate piece. Radix does the heavy lifting; the responsive matrix is the work. |
| 1 | **Hero** (§5) | Medium | **1d** | 0.5d layout + copy; 0.5d for the inline-SVG artifact. Add 0.5d if a real screenshot needs treatment. |
| 2 | **Pedigree bar** (§6) | Trivial | **0.25d** | Text only. |
| 3 | **Crisis Metrics** (§7) | Low | **0.5d** | Pure type and layout. **Blocked on sources (#1, #2)** — build the shell, hold the numbers. |
| 4 | **Journey visual** (§8) | **High** | **2.5d** | Two renderings (SVG horizontal + DOM vertical), draw-in animation, stagger choreography, reduced-motion path, `<ol>` accessibility layer. The highest-craft item and the one most likely to overrun. Budget a half-day of visual iteration on top. |
| 5 | **Product Modules** (§9) | Medium-High | **1.5d** | Content file, `ModuleCard`, `StatusBadge`, three bands, sticky jump rail with scroll-spy, mobile chip rail with snap. |
| 6 | **Trust & Compliance** (§10) | Low *(build)* / **High** *(content)* | **0.75d build** | The UI is an accordion list — genuinely simple. **The cost is entirely in verification (#12–#22).** Do not start until answers land; building against placeholder compliance copy risks the wrong text shipping. |
| 7 | **Team** (§11) | Low | **0.5d** | Restyle of an existing section. |
| 8 | **Request Demo** (§12) | Medium | **1.5d** | 0.5d layout; 1d for `react-hook-form` + `zod`, the full state matrix, and wiring a real endpoint. **Add 0.5–1d if a serverless function must be written and deployed.** |
| 9 | **Footer** (§13) | Low | **0.5d** | |
| — | **Performance pass** (§15) | Medium | **1d** | Asset conversion, self-hosted fonts, route splitting, `content-visibility`, Lighthouse verification on throttled mobile. |
| — | **Accessibility audit** (§14) | Medium | **1d** | Keyboard walkthrough, screen-reader pass (VoiceOver + NVDA), contrast verification, 200% zoom, reduced-motion verification. |
| — | **Cross-browser / device QA** | Medium | **0.75d** | Real mid-range Android, iOS Safari, tablet breakpoint. |

**Total: ~15.5 working days (~3 weeks) for one engineer**, excluding time spent gathering the `[VERIFY]` answers.

**Critical path and sequencing:**

1. **Tokens → Nav → Hero** (3.5d). Ship-able milestone: the page reads enterprise-tier from the first screen even if nothing below has changed.
2. **Journey → Modules** (4d). The two highest-value sections. Modules can ship with everything marked `In development` and be promoted later with a one-line edit.
3. **Demo → Team → Footer** (2.5d). Conversion path and closing.
4. **Trust** (0.75d) — **gated on §16 #12–#22.** Do not start before.
5. **Crisis** (0.5d) — **gated on §16 #1–#2.** Build the shell early, hold the numerals.
6. **Perf + A11y + QA** (2.75d). Last, but do not compress — these are where the enterprise tier is actually won or lost on a mid-range Android.

**Highest-risk items:** the Journey visual (craft-heavy, most likely to overrun), the mega-menu responsive matrix, and the Trust section's content verification — which is not an engineering risk at all, but is the one most likely to delay launch.
