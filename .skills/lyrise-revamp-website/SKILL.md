---
name: lyrise-revamp-website
description: Architecture, component hierarchy, design system tokens, white-mode hero specifications, fixed navigation, executive operations bento pipeline, sacred copy rules, and development workflows for the revamped LyRise website (v41+). Use whenever modifying, extending, styling, or debugging pages/index.js, src/components/RevampLanding/, or related marketing components.
---

# LyRise Revamp Website Development Skill

This skill provides full architecture specifications, design tokens, copy rules, layout constraints, and verification procedures for developing on the revamped LyRise website (v41+).

---

## 1. High-Level Architecture & Page Flow

The landing page root is located at [`pages/index.js`](file:///d:/projects/lyRise/website/pages/index.js).
It imports and renders `<RevampLanding />` from [`src/components/RevampLanding/RevampLanding.jsx`](file:///d:/projects/lyRise/website/src/components/RevampLanding/RevampLanding.jsx).

```
pages/index.js
  └─ <RevampLanding>
       ├─ <RevampHeader>             (Fixed frosted white navbar, 2-door CTAs, anchor navigation)
       ├─ <HeroSection>              (White mode, 2-line headline, Purple/Mint accent, CTAs)
       │    └─ <HeroAgentCanvas>     (Top industry switcher + 3-card executive operations bento)
       ├─ <BackedByStrip>            (Forbes, Techstars, Google, Microsoft, Meta)
       ├─ <WhoItsForSection>         (4 segment cards: Law, Accounting, Consulting, Collections + catch-all)
       ├─ <ProblemSection>           (58% work-about-work stat & contrast cards)
       ├─ <HowItWorksSection>        (3 steps + Joseph 4-phase scanner)
       ├─ <ResultsSection>           (Quantrax & NY Legal verified case studies)
       ├─ <AgentInActionDemo>        (3-tab Quantrax deliverable drawer + live video modal)
       ├─ <CompareSection>           (5-column strategic comparison table)
       ├─ <WorkflowCalculator>       (2-slider interactive math + segment presets)
       ├─ <PricingSection>           (3 transparent columns + buyer hours required)
       ├─ <GuaranteeBand>            (The 3:1 written guarantee band)
       ├─ <FaqSection>               (8 executive FAQs with verified client proof lines)
       ├─ <AboutMarcSection>         (Founder story, portrait, 3 metrics)
       └─ <BookingCloseSection>      (Two-door close, 3 call steps, footer)
```

---

## 2. Directory Structure

All revamp components, styling, and data live under [`src/components/RevampLanding/`](file:///d:/projects/lyRise/website/src/components/RevampLanding/):

| File                     | Purpose                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `RevampLanding.jsx`      | Main container assembling all sections in vertical flow                                                  |
| `index.jsx`              | Re-exports `RevampLanding` as default                                                                    |
| `revamp.module.css`      | Complete CSS token system, executive white mode, fixed header, bento cards, and responsive rules         |
| `RevampHeader.jsx`       | Fixed navigation bar with frosted white blur (`backdrop-filter: blur(20px)`), logo, and two-door CTAs    |
| `HeroSection.jsx`        | White-mode hero surface, two-line headline, LyRise micro-accent line, dual CTAs, and canvas wrapper      |
| `HeroAgentCanvas.jsx`    | Top industry switcher + 3-column executive operational pipeline (Intake, Agent Execution, Audited Yield) |
| `WorkflowCalculator.jsx` | Interactive ROI calculator (team size × hours/wk × hourly cost) with segment presets                     |
| `AgentInActionDemo.jsx`  | Deliverable viewer with 3 tab views (Map, Agent Spec, ROI Ledger) + video player                         |
| `data/verifiedFacts.js`  | **Single source of truth** for all numbers, client metrics, pricing, FAQs, and segment data              |

---

## 3. Strict Design Tokens & White Mode Rules

LyRise is fundamentally an **executive, high-trust B2B service** for managing partners and C-suite operators at law, accounting, consulting, and collections firms.

### Lighting & Surfaces

- **Hero & Page Surface:** Must be **clean White Mode** (`#ffffff` / `#f7f8f7`).
- **Accent Tints:** Ultra-subtle ambient glow at the top (`rgba(102, 102, 255, 0.08)` radial gradient).
- **Obsidian Dark Surfaces:** Strictly restricted to mid-page high-contrast feature bands (e.g. `<GuaranteeBand />` or demo drawer). Never turn the Hero or entire page pitch-black.
- **Accents:**
  - Action Purple: `#6666ff`
  - Violet Hover: `#4200ff`
  - Growth Mint: `#00b8b0` / `#008e87`
  - Text Dark (Ink): `#000022`
  - Text Muted: `#4a4e69` / `#555566`
- **Gradient Rules:** Strictly forbid foreign rainbow or neon gradients (`#ec4899`, orange/yellow). Underlines or micro-accents must use the LyRise signature: `linear-gradient(90deg, #6666ff 0%, #00b8b0 100%)`.

---

## 4. Key UI & UX Layout Constraints

### 1. Fixed Header on Scroll

- The navigation bar ([`RevampHeader.jsx`](file:///d:/projects/lyRise/website/src/components/RevampLanding/RevampHeader.jsx)) is pinned on scroll:
  - `position: fixed; top: 0; left: 0; right: 0; width: 100%; z-index: 1000;`
  - `background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(20px);`
  - `box-shadow: 0 4px 24px rgba(0, 0, 34, 0.03);`
- **Container Overflow Rule:** The root `.revampWrapper` must use `overflow-x: clip;` (NEVER `overflow-x: hidden;` which causes browsers to break sticky/fixed stacking and scroll contexts).
- **Hero Top Padding Compensation:** `.heroSectionWhite` must maintain `padding-top: 124px;` so content doesn't collide with the fixed navbar.
- **In-Page Anchor Offset:** All anchor targets (`section[id]`, `div[id]`) have `scroll-margin-top: 84px;` so smooth scrolling lands cleanly below the fixed navbar.

### 2. Strictly Two-Line Hero Headline

- The hero title must format across **exactly two lines**:
  - Line 1: `Find the $1M hiding in your team’s week.`
  - Line 2: `Then let AI agents go and get it.`
- Enforced via:
  - Wrapping each line in `<span className={styles.heroTitleLine}>...</span>` (`display: block`).
  - `.heroTitleLight` sizing: `max-width: 1200px;`, `font-size: clamp(32px, 4.1vw, 56px);`, `line-height: 1.16;`, `letter-spacing: -0.035em;`.

### 3. Executive Operations Bento (No Raw Code for C-Suite)

- Instead of raw developer code (`mountAgent()`, TypeScript syntax, macOS traffic light dots), the showcase presents an **Audited Operational Pipeline**:
  - **Top Switcher:** Segment pills (`Collections`, `Law firms`, `Accounting`, `Consultancies`) allow instant live switching.
  - **Card 1 (01 // Intake Stream):** Repetitive queue interception, API source, baseline frequency and latency.
  - **Card 2 (02 // Agent Execution):** Step-by-step checklist with checkmarks (ledger parsing, zero-drift compliance check, auto-resolution or human handoff) + `1.4s Latency` badge.
  - **Card 3 (03 // Verified Yield):** Audited financial uplift (`$394,000 / yr`), signed Month 3 audit, and 3:1 written guarantee tag.

---

## 5. Strict Copy & Brand Rules (Sacred Constraints)

When editing or adding text on this site, strictly adhere to Marc's verified copy constraints:

1. **Forbidden Words & Substitutions:**
   - ❌ "FTEs saved" / "Eliminate jobs" $\rightarrow$ ✅ **"Hours returned to billable & client work"**
   - ❌ "Cost Savings" $\rightarrow$ ✅ **"Profit Uplift"** or **"Total Financial Gain"**
   - ❌ "AI replaces your team" $\rightarrow$ ✅ **"AI takes over the tedious work"** / **"Supercharge your specialists"**
2. **Zero Invented Numbers:**
   - Only cite verified clients: **Quantrax** (debt collection, \$394,000 profit uplift, 10,000+ accounts scored) and **NY Legal Firm** (special education law, 40 hrs/mo returned).
   - Any client fact must be accompanied by the purple `Verified` pill (`#6366ff` / `#a5b4fc`).
3. **Data Centralization:**
   - Never hardcode pricing or client metrics inside JSX components. All values flow from [`src/components/RevampLanding/data/verifiedFacts.js`](file:///d:/projects/lyRise/website/src/components/RevampLanding/data/verifiedFacts.js).

---

## 6. Development & Verification Commands

This project runs on **Windows**. Never use Linux commands (`cat`, `rm -rf`, `sed`, `grep`). Always use standard PowerShell tools and npm scripts:

```powershell
# 1. Format code with Prettier
npx prettier --write "src/components/RevampLanding/**/*.{js,jsx,css}" pages/index.js

# 2. Check ESLint rules
npx eslint "src/components/RevampLanding/**/*.{js,jsx}" pages/index.js

# 3. Verify Next.js production build
npm run build
```

---

## 5. Coding & Linting Standards

The workspace enforces strict Next.js, Prettier, and ESLint configurations:

- **Formatting Rules:**
  - Single quotes (`'`)
  - No semicolons (`semi: false`)
  - Indent: 2 spaces
  - Line endings: `LF` (`endOfLine: 'lf'`)
- **Next.js Images:**
  - When using standard `<img>` tags for SVG icons or local assets, prefix the component with:
    ```js
    /* eslint-disable @next/next/no-img-element */
    ```
- **Security Plugin Lints:**
  - Avoid raw bracket access with arbitrary strings that trip `security/detect-object-injection`. Use static mapping objects or safe lookups.
- **Building / Verifying Changes:**
  Always verify code with PowerShell before finishing:
  ```powershell
  npx prettier --write pages/index.js "src/components/RevampLanding/**/*.{js,jsx}"
  npx eslint pages/index.js "src/components/RevampLanding/**/*.{js,jsx}"
  npm run build
  ```

---

## 6. How to Extend or Modify Revamp Components

### Updating Data & Pricing

Do **not** hardcode pricing or numbers inside JSX. Edit [`src/components/RevampLanding/data/verifiedFacts.js`](file:///d:/projects/lyRise/website/src/components/RevampLanding/data/verifiedFacts.js):

- Modify `pricingTiers` for tier costs and buyer hours.
- Modify `industryBenchmarks` for calculator presets.
- Modify `faqItems` for executive objection answers.

### Adding New Interactive Tools or Modals

1. Create your component in `src/components/RevampLanding/YourComponent.jsx`.
2. Apply scoped CSS rules in `src/components/RevampLanding/revamp.module.css`.
3. Import and render in `RevampLanding.jsx`.
4. Ensure full keyboard accessibility and mobile responsiveness (`@media (max-width: 900px)`).
