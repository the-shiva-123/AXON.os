# Google Material 3D Web Engine

A production-ready, ultra-responsive 3D web application inspired by Google’s product design language (Google Material 3 / Google Sans cues): clean, spacious, minimal, rounded, and pixel-polished. Built with **React 19**, **TypeScript**, **Vite**, **React Three Fiber (Three.js)**, **Tailwind CSS**, and **Framer Motion**.

![Google Material 3D Banner](https://raw.githubusercontent.com/google/material-design-lite/master/catalog/images/mdl-logo.png)

---

## 🌟 Key Highlights

- **Google Material 3 Aesthetic**: Spacious layouts, 8–16px rounded elevation cards, soft ambient shadows, crisp Google Sans typography, and Google brand color accents (`#1A73E8`, `#EA4335`, `#FBBC04`, `#34A853`).
- **3D React Three Fiber Engine**: Interactive physical glass transmission model (`MeshPhysicalMaterial`) with procedural mesh options, floating ambient particles, cursor parallax, and overlay controls.
- **Robust WebGL Fallback**: Runtime WebGL feature detection (`useWebGLSupport`) with automatic progressive fallback to a high-resolution 2D visual prism for non-WebGL hardware or low-power contexts.
- **Accessibility (WCAG 2.1 AA)**: Keyboard navigable controls, visible focus rings (`focus-visible:ring-2`), aria-live region tags, and OS `prefers-reduced-motion` detection.
- **Performance Budget (< 250KB Gzipped Core)**: Lazy-loaded `@react-three/fiber` bundle, code splitting with Vite manual chunks, and progressive loading skeletons.

---

## 🚀 Quick Start & Commands

### Prerequisites
- Node.js 18+ or Bun

### 1. Install Dependencies
```bash
npm install
# or
bun install
```

### 2. Development Server
Start the Vite development server on `http://localhost:3000`:
```bash
npm run dev
```

### 3. Type Checking & Linting
Validate strict TypeScript types without building output:
```bash
npm run lint
```

### 4. Unit & Smoke Tests
Run unit tests powered by Vitest and React Testing Library:
```bash
npm run test
```

### 5. Production Build
Compile optimized production assets to `/dist`:
```bash
npm run build
```

### 6. Preview Production Build
Locally preview the production bundle:
```bash
npm run preview
```

---

## 🎨 Design Tokens & Google UI Mapping

| Design System Token | Specification / Value | Usage in Application |
| :--- | :--- | :--- |
| **Primary Accent** | `#1A73E8` (Dark: `#8AB4F8`) | Primary buttons, active tabs, focus rings |
| **Secondary Accents**| `#EA4335`, `#FBBC04`, `#34A853` | Category badges, metrics, 3D color palette |
| **Surface Light** | `#FFFFFF` / `#F8F9FA` | Page background, cards, header |
| **Surface Dark** | `#121212` / `#1E1E1E` | Dark mode background & glass panels |
| **Corner Radius** | `8px` (`sm`), `12px` (`md`), `16px` (`lg`), `24px` (`xl`) | Product cards, controls, modal dialogs |
| **Typography** | `Google Sans`, `Roboto`, `sans-serif` | Headers, body text, UI overlays |
| **Elevation Shadows**| `0 1px 3px rgba(0,0,0,0.12)`, `shadow-xl` | Card hover lift, 3D control overlay |

---

## 🏗️ Project Architecture

```
AXON.os/
├── .github/workflows/ci.yml       # GitHub Actions CI pipeline
├── public/
│   ├── favicon.svg                # Google 4-color SVG favicon
│   └── hero-fallback.webp         # Fallback visual assets
├── src/
│   ├── assets/                    # Graphic assets and icons
│   ├── components/
│   │   ├── Header.tsx             # Responsive header with theme toggle & mobile drawer
│   │   ├── Hero3D.tsx             # Lazy 3D scene wrapper with WebGL detection & error boundary
│   │   ├── CanvasWrapper.tsx      # R3F Canvas container for chunk splitting
│   │   ├── Scene.tsx              # R3F lights, physical glass shaders, particles & controls
│   │   ├── Controls.tsx           # Floating overlay for 3D color, rotation & wireframe customization
│   │   ├── FallbackHero.tsx       # Accessible 2D visual fallback
│   │   ├── ProductCards.tsx       # Google product grid with filter chips & modal details
│   │   ├── FeatureGrid.tsx        # Highlight cards for engineering pillars
│   │   ├── InteractiveShowcase.tsx# Real-time studio sandbox & telemetry monitor
│   │   ├── StatsSection.tsx       # Performance metrics & frame budget benchmarks
│   │   ├── ThemeProvider.tsx      # Light/Dark mode state provider & hook
│   │   └── Footer.tsx             # Clean Google-style footer
│   ├── hooks/
│   │   ├── useIsomorphicLayoutEffect.ts # Isomorphic layout effect hook
│   │   ├── usePrefersReducedMotion.ts   # Accessibility reduced motion hook
│   │   └── useWebGLSupport.ts           # WebGL detection & context loss listener
│   ├── styles/
│   │   ├── tailwind.config.js    # Google design tokens & theme extenders
│   │   └── index.css             # Tailwind v4 setup & custom keyframes
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for theme, products, and 3D controls
│   ├── tests/
│   │   ├── setup.ts              # Vitest environment setup
│   │   ├── Hero3D.test.tsx       # Fallback and Hero unit tests
│   │   └── ThemeProvider.test.tsx# Theme context tests
│   ├── App.tsx                    # Main app assembly
│   └── main.tsx                   # React root mount point
├── package.json                   # Project manifests & scripts
├── vite.config.ts                 # Vite setup with Three.js manual chunking & Vitest config
└── README.md                      # Comprehensive documentation
```

---

## ⚡ Performance & WebGL Optimization Checklist

- [x] **Code Splitting**: Dynamic lazy loading of `@react-three/fiber` and Three.js in `CanvasWrapper.tsx`.
- [x] **Manual Rollup Chunks**: Configured `vite.config.ts` to separate `three`, `r3f`, and `framer-motion` chunks to prevent single large bundle bottlenecks.
- [x] **GPU Frame Budgeting**: Maintained frame rendering under 16.6ms for steady 60 FPS interactions on modern devices.
- [x] **Memory Management**: Geometry and materials disposed automatically on unmount; ambient sparkle particle count budgeted according to hardware mode.
- [x] **Progressive Image & Visual Fallbacks**: WebGL context creation failure gracefully reverts to `FallbackHero.tsx` without breaking DOM execution.

---

## ♿ Accessibility Compliance (WCAG 2.1 AA)

- **Keyboard Navigation**: All interactive elements (filter chips, modal triggers, theme switches, 3D sliders) feature visible focus rings (`focus-visible:ring-2 focus-visible:ring-blue-500`).
- **Screen Readers**: Interactive elements are decorated with explicit `aria-label`, `aria-expanded`, `role="dialog"`, and `aria-modal="true"`.
- **Motion Accessibility**: Reduced motion preference automatically halts 3D mesh rotation and disables heavy scroll physics.
- **Color Contrast**: Text and background color combinations maintain contrast ratios strictly `>= 4.5:1` in both Light and Dark modes.

---

## 🌐 Deploy to Production

### Deploying to Vercel
1. Push project repository to GitHub.
2. Import project into Vercel Dashboard.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**.

### Deploying to Netlify
1. Create a `netlify.toml` file or set build settings in Netlify UI:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
2. Deploy via Netlify CLI or Git connection:
   ```bash
   npx netlify-cli deploy --build --prod
   ```

---

## 📝 Design & Architecture Notes

### Why React Three Fiber + Drei?
Declarative 3D scene management allows standard React state hooks to control Three.js scene graphs seamlessly. Toggling wireframes or color palettes updates `meshPhysicalMaterial` props without manual WebGL canvas redraw boilerplate.

### Why Runtime WebGL Detection?
In headless environments, corporate virtual desktops, or devices with disabled GPU acceleration, WebGL canvas creation can throw errors or return null. The custom `useWebGLSupport` hook probes WebGL 2.0 and WebGL 1.0 support before mounting the canvas, providing seamless accessibility.
