# Santhica Website — Source Code Structure

## Active Website Code

```
src/
├── App.tsx                        # Router — 4 routes: /, /privacy-policy, /terms-of-service, /*
├── index.css                      # Global styles, Tailwind config, scroll animations
├── main.tsx                       # React entry point
│
├── components/
│   ├── landing/                   # All landing page components
│   │   ├── Navbar.tsx             # Fixed nav — transparent on hero, white on scroll
│   │   ├── HeroSection.tsx        # Dark cinematic hero with network diagram background
│   │   ├── AboutSection.tsx       # Problem statement (stats) + product image + What We Do cards
│   │   ├── FeatureCard.tsx        # Reusable card component for What We Do section
│   │   ├── TeamSection.tsx        # Team cards with placeholder initials + LinkedIn links
│   │   ├── DemoSection.tsx        # Split layout — benefits left, demo request form right
│   │   ├── LandingFooter.tsx      # Footer — logo, email, LinkedIn, Privacy Policy, Terms
│   │   ├── LegalLayout.tsx        # Shared layout for Privacy Policy and Terms of Service pages
│   │   └── useReveal.ts           # Scroll-triggered fade-in animation hook
│   │
│   └── ui/                        # shadcn/UI primitives (shared, do not modify)
│
├── pages/
│   ├── LandingPage.tsx            # Main page — assembles all landing/ components
│   ├── PrivacyPolicy.tsx          # /privacy-policy — full legal content
│   ├── TermsOfService.tsx         # /terms-of-service — full legal content
│   └── NotFound.tsx               # 404 page
│
├── contexts/                      # React context providers (from prototype, may still be imported)
├── hooks/                         # Custom React hooks
├── services/                      # API service modules (from prototype)
├── lib/                           # Utility functions
└── types/                         # TypeScript type definitions
```

## Public Assets

```
public/
├── santhica-hero-network.png      # Hero background — dark network diagram
├── santhica-network.png           # Product mockup — phone screens ecosystem
├── slide1_Picture 3.png           # Santhica logo (from pitch deck slide 1)
├── favicon-32.png                 # Browser tab icon (32x32)
├── favicon-64.png                 # Browser tab icon (64x64)
└── sample-documents/              # Test data (from prototype)
```

## Old Prototype Code (isolated, safe to delete)

```
src/
├── components/_prototype/         # Old components: auth, doctor, layout, sections, results, demo
└── pages/_prototype/              # Old pages: 40+ files (dashboards, login, patient views, etc.)
```

The `_prototype/` folders contain the original demo app (doctor/patient/lab dashboards).
They are not imported by any active code. Delete when ready.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **shadcn/UI** — UI component primitives
- **React Router DOM** — client-side routing
- **Sonner** — toast notifications
- **Lucide React** — icons

## Key Commands

```bash
npm run dev        # Start dev server (port 8080)
npx vite --port 5173  # Dev server on custom port
npm run build      # Production build → dist/
```
