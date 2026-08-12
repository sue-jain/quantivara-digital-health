# Santhica homepage redesign — status

**Last updated:** 2026-08-11
**State:** Spec approved (with changes). Visual direction rejected once, now redirected. Nothing built. Live site untouched.

---

## Where things stand

| Artifact | Path | Status |
|---|---|---|
| Full copy + layout spec | `docs/homepage-redesign-spec.md` | **Content approved**, visual register superseded |
| First visual mockup | `docs/homepage-mockup.html` | **Rejected** — wrong register, see below |
| Design agent | `.claude/agents/UX_Designer.md` | Rewritten around the Eka teardown |
| Frontend agent | `.claude/agents/frontend_engineer.md` | Rewritten; deploy discipline intact |
| Production site | `src/` | **Untouched.** No code written. |

---

## Decisions locked

1. **Section order** — Journey moved ahead of Modules; Trust ahead of Team. Approved.
2. **Pedigree bar dropped** — the proposed "Built by engineers from" strip at position 2 is cut.
3. **Demo form keeps `mailto:`** — no backend. But the success toast must stop claiming receipt; copy says what actually happens and shows the fallback address.
4. **Visual register: match Eka Care.** Reuse the spec's copy, structure, and section concepts; replace the visual treatment entirely.

## Direction: reuse vs. rebuild

**Reuse from `homepage-redesign-spec.md`:**
- Section order and scroll narrative
- All copy — H1, H2s, subheads, module descriptions, trust rows, team bios, CTAs
- The birth-to-death Journey concept (custodian changes, record doesn't)
- Module IA — three bands (Outpatient 4 / Inpatient 2 / Platform 3), not tabs
- Status convention (Live / In pilot / In development), defaulting to `development`
- The honest Trust section, including "What we don't claim"

**Rebuild — the rejected register:**
Light ground, hairline rules, weight-300 numerals, muted green accent, no motion, abstract SVG schematics instead of product imagery. Reads as under-resourced next to eka.care.

**Replace with the Eka-competitive register:**
Dark grounds, one saturated accent, real product screenshots, choreographed scroll motion, alternating left/right feature rhythm.

---

## The benchmark (read from eka.care's live CSS, not guessed)

```
--blue:       #3B5BFA   /* vivid electric indigo — the accent */
--royal-blue: #111B31   /* near-black navy — dominant ground */
--grey:       #9EA8B8   /* cool grey */
```
Font: **Inter** (same as Santhica already uses).

**Their stack:** Webflow + jQuery + GSAP/ScrollTrigger + Swiper + Typed.js + Finsweet. Assets: 86 SVG, 58 WebP.

**Build the same effects here without their dependencies:**

| Effect | Build with |
|---|---|
| Scroll entrance | `IntersectionObserver` + CSS class (fix `useReveal.ts`) |
| Carousel | `embla-carousel-react` — **already installed**, `src/components/ui/carousel.tsx` |
| Infinite logo marquee | CSS keyframes on a duplicated track |
| Rotating hero word | ~30 lines of `useEffect` |
| Tabs | `src/components/ui/tabs.tsx` (Radix) |

Do not add GSAP, Framer Motion, or Swiper without asking — 30–120KB each on a mid-range-Android target.

**Caution:** match the *register and craft level*, not the literal design. A visual clone of the competitor you're compared against positions Santhica as the imitator, and their trade dress isn't ours to reuse. Same confidence, different identity.

**Where Eka is beatable:** `/security` is undated prose with no negatives; testimonial avatars are repeated stock; "AI-Native Ambient Healthcare Platform" is category language, not a claim.

**Where Santhica can't follow:** no customer logos, no certifications, no scale metrics. Do not fabricate them and do not build a structure that depends on them — an empty testimonial carousel is worse than no carousel.

---

## Blocking before anything ships

- [ ] **Citations** for both crisis figures (~1 lakh deaths/yr; ~2 min consult) — publication, year, URL
- [ ] **Three existing uncited stats** on the live site (`AboutSection.tsx`) — source or remove
- [ ] **Live status of all nine modules** — everything defaults to `In development` until promoted
- [ ] **X-ray regulatory wording** — any CDSCO/FDA/CE clearance? If not, "decision support, not diagnosis" ships verbatim
- [ ] **Data residency** — where is patient data physically stored? Highest-risk item
- [ ] **Confirm no SOC 2 / ISO 27001**, and that "Santhica is not ABDM certified today" ships unsoftened
- [ ] **Product screenshots** — the Eka-register design is screenshot-led; needs real UI captures with consented or clearly-labelled synthetic data
- [ ] **Vector logo** — current PNG is 1.36MB rendering at 48px

Full list: `docs/homepage-redesign-spec.md` §16 (37 items).

---

## Known live-site defects (verified in code)

1. `DemoSection.tsx` — unconditional success toast after `mailto:`; reports success for leads never sent
2. `src/index.css:112` — `.reveal { opacity: 0 }`, visible only via JS, no reduced-motion guard; bundle error blanks the page
3. `#2db87f` — 2.54:1 on white, a live WCAG failure, hardcoded as scattered hex literals
4. `public/` — ~3.9MB of PNGs, incl. 1.37MB and 1.36MB files
5. Anchored sections scroll under the sticky navbar — no `scroll-margin-top`

---

## Next step

Restart the session so `UX_Designer` and `frontend_engineer` register, then run a second design pass: same spec content, Eka-competitive visual register, reviewed locally in the browser before anything is built or pushed.
