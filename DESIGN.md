---
name: LyRise
description: AI-powered tech talent hiring platform connecting employers with pre-vetted engineers.
colors:
  signal-blue: '#2957FF'
  navy-deep: '#1a2742'
  surface-tint: '#F7F9FF'
  surface-tint-mid: '#EFF2FF'
  card-white: '#F9FAFC'
  near-black: '#2C2C2C'
  dark-section: '#20273b'
typography:
  display:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2rem, 4vw, 3.5rem)'
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: '-0.02em'
  headline:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '-0.01em'
  title:
    fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.25rem'
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: 'Poppins, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Poppins, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 500
    letterSpacing: '0.02em'
rounded:
  sm: '4px'
  md: '8px'
  lg: '20px'
  pill: '40px'
  navbar: '20px'
spacing:
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '40px'
  section: '120px'
components:
  button-primary:
    backgroundColor: '{colors.signal-blue}'
    textColor: '#ffffff'
    rounded: '{rounded.md}'
    padding: '13px 24px'
  button-primary-hover:
    backgroundColor: '{colors.signal-blue}'
    textColor: '#ffffff'
    rounded: '{rounded.md}'
    padding: '13px 24px'
  button-ghost:
    backgroundColor: '{colors.card-white}'
    textColor: '{colors.signal-blue}'
    rounded: '{rounded.md}'
    padding: '9px 16px'
  button-ghost-hover:
    backgroundColor: '{colors.card-white}'
    textColor: '{colors.signal-blue}'
    rounded: '{rounded.md}'
    padding: '9px 16px'
  card-default:
    backgroundColor: '{colors.card-white}'
    rounded: '{rounded.lg}'
    padding: '20px'
  card-default-hover:
    backgroundColor: '{colors.card-white}'
    rounded: '{rounded.lg}'
    padding: '20px'
---

# Design System: LyRise

## 1. Overview

**Creative North Star: "The Credentialed Operator"**

LyRise's visual system is built on a single conviction: authority is proven by restraint, not flourish. The system speaks with the confidence of a firm that has placed hundreds of engineers, not the excitement of a startup pitching its first client. Every surface is flat and structured. Every typographic choice is weighted and tight. The accent blue earns its place by appearing rarely and precisely, which is why it carries so much meaning when it does appear.

The aesthetic reference is Linear and Vercel: product-company brand sensibility applied to a marketing context. This means no gradient blobs, no decorative illustrations, no stock photography of handshakes. It means generous negative space used as a structural tool, not as filler. It means copy that earns every word. The particle canvas in the hero exists because it adds perceived depth without competing with content; this is the threshold any motion element must cross.

This system explicitly rejects three lanes: the staffing-agency aesthetic (institutional, clip-art heavy, 2012 corporate), the generic SaaS blue (Intercom-scale gradients, MUI defaults, "AI-powered" stamped everywhere), and the hacker/terminal aesthetic (dark-first, code-font heavy, engineer-facing energy that alienates the buyer). LyRise speaks to employers and candidates simultaneously with one voice.

**Key Characteristics:**

- Flat surfaces at rest, lift on interaction
- Signal Blue as a precision accent, not a fill color
- Space Grotesk display + Poppins body: authority meets clarity
- Particle motion and float animations retained; all other decoration prohibited
- 20px card radius for warmth within a rigorous structure

## 2. Colors: The Precision Palette

One committed accent against a field of blue-tinted neutrals. The blue is never ambient; it is always a signal.

### Primary

- **Signal Blue** (`#2957FF`, oklch approx. 49% 0.26 262): The sole accent. Used for primary CTAs, active states, interactive links, and focus indicators. Not used as a background fill on large surfaces. Its scarcity makes it legible.

### Neutral

- **Near-Black** (`#2C2C2C`, oklch approx. 24% 0.003 263): Primary text color. Slightly cool-shifted, not pure black. Reads as intentional rather than default.
- **Navy Deep** (`#1a2742`, oklch approx. 22% 0.05 254): Used for dark-mode sections (footers, dark hero variants, the custom landing page shell). Conveys depth and sector credibility.
- **Dark Section** (`#20273b`): Alternate dark shell for custom landing pages. Slightly lighter than Navy Deep; used for mid-depth dark surfaces.
- **Card White** (`#F9FAFC`): The default card surface. Not pure white; carries a faint cool undertone that reads as deliberate.
- **Surface Tint** (`#F7F9FF`): The page background. Blue-tinted near-white. Used for the root `#__next` background and marquee fade overlays.
- **Surface Tint Mid** (`#EFF2FF`): Hover background for ghost buttons and selected chip states. One step deeper than Surface Tint.

### Named Rules

**The One Signal Rule.** Signal Blue covers no more than 10% of any given screen. It is reserved for primary actions and interactive states. When every element is blue, nothing is. Use tinted neutrals for all structural surfaces.

**The No-White Rule.** Neither `#ffffff` nor `#000000` appears in the system. Every neutral is tinted toward the brand hue. The distinction is small (chroma 0.003-0.008) but deliberate.

## 3. Typography: Authority + Clarity

**Display Font:** Space Grotesk (Light 300 through Bold 700, self-hosted)
**Body Font:** Poppins (Regular 400, Medium 500, SemiBold 600, self-hosted)
**Supporting Font:** Outfit (Regular 400 through Bold 700, used in select marketing components)
**Decorative Font:** Toxigenesis (Bold 700, used sparingly for hero display moments)

**Character:** Space Grotesk is geometric and tight-tracked at display sizes: it reads as engineered confidence. Poppins is humanist and open at body sizes: it reads as accessible and warm. The contrast between them creates the LyRise voice, where authority opens into clarity.

### Hierarchy

- **Display** (700, `clamp(2rem, 4vw, 3.5rem)`, lh 1.1, ls -0.02em): Hero headlines. First contact with the brand. Space Grotesk Bold, tracked in, set tight. Never more than two lines.
- **Headline** (600, `clamp(1.5rem, 2.5vw, 2rem)`, lh 1.2, ls -0.01em): Section openers. Space Grotesk SemiBold. One per section; not used for card titles.
- **Title** (500, `1.25rem`, lh 1.3): Card titles, subsection labels. Space Grotesk Medium.
- **Body** (400, `1rem`, lh 1.6): All paragraph content. Poppins Regular. Max line length 65-75ch. Below 768px reduce to `0.9375rem`.
- **Label** (500, `0.875rem`, ls 0.02em): Button text, captions, navigation items, form labels. Poppins Medium. Never uppercase by default; small-caps treatment reserved for Toxigenesis headings only.

### Named Rules

**The Two-Font Rule.** Space Grotesk and Poppins cover every surface. Outfit is permitted in existing marketing components where it already appears. Toxigenesis is decorative-only; one hero use per page maximum. No fourth font family.

**The Scale Law.** Minimum 1.25 ratio between adjacent hierarchy steps. A flat type scale is the first sign the system has been assembled rather than designed.

## 4. Elevation

This system is flat by default. Surfaces rest without shadow; depth is communicated through background color contrast (surface-tint → card-white), borders on hover, and careful layering. Shadows appear only as a response to interaction.

The navbar is the one permanent exception: it carries an ambient shadow (`0px 0px 8px 0px rgba(0,0,0,0.08)`) to separate it from page content on scroll. This shadow is diffuse and nearly invisible; it marks the nav as a distinct z-layer without asserting itself.

### Shadow Vocabulary

- **Ambient Nav** (`0px 0px 8px 0px rgba(0, 0, 0, 0.08)`): Navbar only. Separates the nav from the page at rest.
- **Lift Hover** (`13px 21px 34px 2px rgba(66, 0, 255, 0.10)`): Cards and primary buttons on hover. The purple tint is deliberate: it echoes Signal Blue without competing with it. Perceived as authority, not decoration.
- **Focus Glow** (`0 0 0 2px rgba(82, 139, 255, 0.6)`): Applied to form fields `:focus-within`. Blue outline, no offset, used in lieu of default browser focus rings.

### Named Rules

**The Flat-By-Default Rule.** Every surface starts at zero elevation. Shadows are earned by state, not assigned by hierarchy. A card with a shadow at rest is a card that has forgotten its purpose.

## 5. Components

### Buttons

The button system carries the system's authority. Solid primary for primary actions; ghost for secondary navigation and pairing with the primary.

- **Shape:** Gently curved edges (8px radius). Not pill-shaped; not square. The radius signals approachability within a rigorous system.
- **Primary:** Signal Blue fill (`#2957FF`), white text (`#ffffff`), 13px vertical / 24px horizontal padding. Label text in Poppins Medium at 0.875rem.
- **Primary Hover:** Unchanged fill (opacity of the background does not shift). Lifts with `transform: translateX(-1px)` and blue-purple shadow (`13px 21px 34px 2px rgba(66, 0, 255, 0.10)`). Transition: `all 0.3s ease`.
- **Ghost:** Card-white fill (`#F9FAFC`), Signal Blue text and 1px Signal Blue border, 9px vertical / 16px horizontal padding. Same radius.
- **Ghost Hover:** Lifts with `transform: translateX(-1px)` and a lighter shadow (`3px 4px 12px 1px rgba(66, 0, 255, 0.10)`). Fill remains unchanged.

### Cards

The workhorse container. Warmly rounded at 20px; flat and quiet at rest; lifts and acquires a blue border on hover.

- **Corner Style:** Generous rounding (20px). Conveys approachability inside a structured grid.
- **Background:** Card White (`#F9FAFC`), not pure white.
- **Shadow Strategy:** None at rest (Flat-By-Default Rule). On hover: `13px 21px 34px 2px rgba(66, 0, 255, 0.10)` lift.
- **Border:** None at rest. On hover: 3px solid `#094bf6` (a slightly deeper blue than Signal Blue for contrast legibility).
- **Internal Padding:** 20px uniform. Content should not crowd the edge; use 24px for richer content cards.
- **Hover Motion:** `transform: translateY(-3px)`, `transition: all 0.3s ease-out`.

### Inputs / Fields

- **Style:** Stroke border on transparent background. Border-radius matches `rounded.md` (8px).
- **Focus:** Blue outline via `:focus-within` on the container: `outline: 2px solid rgba(82, 139, 255, 0.6)`, `border-radius: 6px`. No inset glow; the outline is the signal.
- **Error:** Not yet documented; use red-tinted border + inline error message below the field when implementing.
- **Padding:** 1.2rem vertical (`padding-top: 1.2rem; padding-bottom: 1.2rem`) for tactile hit area, matching the phone input treatment.

### Navigation

- **Style:** Frosted glass pill. Semi-transparent gradient background (`rgba(248,248,248,0.25)` → `rgba(167,167,167,0.1275)` → `rgba(248,248,248,0.25)`), 20px border-radius, ambient shadow.
- **Typography:** Poppins Medium (label weight), default color is Near-Black.
- **Active State:** `text-decoration: underline`. Not color-shifted; legibility is the signal.
- **Mobile:** Collapses to drawer or full-screen overlay; frosted pill treatment maintained for the trigger button.

### Signature Component: Particle Canvas Hero

The hero section uses an animated particle network on `<canvas>` as a background layer, with a radial gradient overlay (`rgba(255,255,255,0.3)` at center, fading to near-zero at edges) to blend with page content. The canvas is `z-index: 1`, content is above it. The `subtleGradientShift` animation (20s, ease, infinite) is the only ambient background animation permitted.

This component is the one place LyRise's technical identity is expressed visually. It communicates depth without declaring itself. Do not replace it with a static image or a CSS gradient; the motion is load-bearing.

## 6. Do's and Don'ts

### Do:

- **Do** use Signal Blue exclusively for primary CTAs, active states, and focus indicators. One accent, precisely placed.
- **Do** lead display headings with Space Grotesk Bold at negative letter-spacing (-0.02em). The tight tracking is what gives the display tier its authority.
- **Do** use `transform: translateY(-3px)` with `ease-out` on interactive cards. The lift is the feedback.
- **Do** tint every neutral toward the brand hue. `#F9FAFC` for cards, `#F7F9FF` for page backgrounds. Never raw `#ffffff` or `#000000`.
- **Do** allow generous section spacing (120px). Whitespace is a structural element, not empty space.
- **Do** cap body line length at 65-75ch to preserve readability.
- **Do** respect `prefers-reduced-motion`: freeze particle animations, float animations, and card hover transforms when the user has requested reduced motion.

### Don't:

- **Don't** use `border-left` or `border-right` greater than 1px as a colored stripe on cards, list items, or callouts. This is the staffing-agency tell. Use full borders, background tints, or leading numerals instead.
- **Don't** use `background-clip: text` with a gradient fill. Gradient text is never meaningful. Use a single solid color; convey emphasis through weight or size.
- **Don't** ship glassmorphism or backdrop-filter blur as decoration. The frosted-glass navbar is purposeful and contained; it does not scale to cards, modals, or section backgrounds.
- **Don't** build an identical card grid (same size, same icon + heading + paragraph repeated). If every card is the same, none of them matter. Vary sizing, visual weight, or leading element.
- **Don't** default to a modal. Inline expansion, progressive disclosure, or a dedicated page are almost always preferable. A modal is a last resort, not a first thought.
- **Don't** use Hacker / terminal aesthetic (dark-first, monospaced fonts, green or neon accents). Terminal colors exist in the token set for the custom employer landing pages only. They must not bleed into the main brand surface.
- **Don't** replicate Generic SaaS patterns: gradient blob hero backgrounds, stock photography of tech teams, "AI-Powered" callouts in bright accent boxes, or unstyled MUI defaults. Every component should bear visible design decisions.
- **Don't** treat Staffing-agency visual language as a safe default: dense feature tables, clip-art icons, or corporate-formal typography choices that signal "vendor" rather than "expert partner."
- **Don't** add motion beyond what already exists (particle canvas, fade-in, float, card lift). New animated elements require explicit justification. If the question is "would this be OK without the animation?", the answer is probably yes, so skip it.
