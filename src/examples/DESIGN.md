---
name: Luminous Ledger
colors:
  surface: '#0f131f'
  surface-dim: '#0f131f'
  surface-bright: '#353946'
  surface-container-lowest: '#0a0e1a'
  surface-container-low: '#171b28'
  surface-container: '#1b1f2c'
  surface-container-high: '#262a37'
  surface-container-highest: '#313442'
  on-surface: '#dfe2f3'
  on-surface-variant: '#c5c5d3'
  inverse-surface: '#dfe2f3'
  inverse-on-surface: '#2c303d'
  outline: '#8f909c'
  outline-variant: '#454651'
  surface-tint: '#b7c4ff'
  primary: '#bbc6ff'
  on-primary: '#0e2878'
  primary-container: '#95a9ff'
  on-primary-container: '#253b89'
  inverse-primary: '#4559a9'
  secondary: '#d7fff3'
  on-secondary: '#00382f'
  secondary-container: '#00f5d3'
  on-secondary-container: '#006c5c'
  tertiary: '#ffafed'
  on-tertiary: '#56124f'
  tertiary-container: '#e691d4'
  on-tertiary-container: '#6a2561'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#2b418f'
  secondary-fixed: '#25fedc'
  secondary-fixed-dim: '#00dfc0'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#005144'
  tertiary-fixed: '#ffd7f2'
  tertiary-fixed-dim: '#ffacec'
  on-tertiary-fixed: '#390035'
  on-tertiary-fixed-variant: '#712b68'
  background: '#0f131f'
  on-background: '#dfe2f3'
  surface-variant: '#313442'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  title-sm:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '700'
    lineHeight: '1.4'
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1600px
  gutter: 1.5rem
  section-gap: 2.5rem
  card-padding: 1.5rem
  header-height: 72px
---

## Brand & Style

Luminous Ledger embodies a high-stakes, futuristic prediction market aesthetic. The brand personality is authoritative yet exhilarating, targeting a tech-savvy audience interested in finance, crypto, and current events. 

The UI utilizes **Glassmorphism** combined with a **High-Contrast/Bold** approach. It features deep obsidian surfaces layered with translucent glass panels, vibrant neon accents, and mesh gradients to create a sense of digital depth and "real-time" energy. The emotional response should be one of sophisticated speculation—clean enough for professional analysis, but bold enough to feel like the cutting edge of finance.

## Colors

The palette is rooted in a deep "Obsidian" neutral (`#0a0e1a`), providing a high-contrast foundation for neon functional colors. 

- **Primary (Electric Blue):** Used for "Yes" outcomes, primary actions, and branding.
- **Secondary (Cyber Mint):** Used for trending indicators, success states, and probability highlights.
- **Tertiary (Neon Orchid):** Reserved for "No" outcomes and specific category markers to provide clear visual divergence from "Yes" actions.
- **Surface Strategy:** Backgrounds utilize a mesh gradient of the three brand colors at very low opacities (5-15%) to prevent the dark mode from feeling flat.

## Typography

The system relies exclusively on **Manrope** to maintain a modern, technical, yet highly readable feel. 

- **Weight as Hierarchy:** The design uses extreme weight variance (from 400 to 800) to create hierarchy rather than relying solely on size.
- **Micro-Copy:** Specialized `label-caps` are used for metadata (Volume, Probability, Time) to evoke a "terminal" or "trading floor" feel.
- **Tight Tracking:** Headlines use negative letter spacing to feel more impactful and cohesive within glass containers.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy with a maximum width of 1600px, centering the content on large displays. 

- **Grid System:** A 12-column grid is used. Main content typically spans 8 or 9 columns, with a 3 or 4-column sidebar for supplementary "Trending" and "Closing" data.
- **Vertical Rhythm:** Large sections are separated by 40px (`2.5rem`) gaps.
- **Information Density:** Card layouts use tight internal spacing (`1.5rem` padding) to allow for multiple data points (Volume, Charts, Avatars, Buttons) to coexist without clutter.

## Elevation & Depth

Depth is achieved through **translucency and atmospheric perspective** rather than traditional shadows.

- **Glass Panels:** All containers use `backdrop-filter: blur(16px)` with a semi-transparent background (`rgba(14, 19, 32, 0.7)`).
- **Ghost Borders:** Elements are defined by 1px solid borders at 10-20% opacity. This creates a crisp, architectural feel.
- **Luminous Glows:** Primary buttons and active states utilize colored shadows (`shadow-primary/20`) to simulate light emission.
- **Stacking:** The header and bottom navigation use higher z-index values with increased backdrop blur to appear closer to the user.

## Shapes

The shape language is **Rounded** and friendly, contrasting with the technical nature of the data.

- **Large Containers:** Featured sections and main cards use a `1.5rem` (`3xl`) or `2rem` radius.
- **Interactive Elements:** Buttons and input fields use a `0.75rem` (`xl`) radius for a "squishy," tactile feel.
- **Utility Shapes:** Pills (fully rounded) are reserved for categories, badges (e.g., "Live Now"), and the "Connect Wallet" trigger to distinguish them from actionable outcome buttons.

## Components

### Buttons
- **Outcome Buttons:** "Yes" buttons use a solid Primary fill. "No" buttons use a solid Tertiary (Orchid) fill. Both use high-contrast text colors for maximum legibility.
- **Ghost Buttons:** Used for secondary actions (e.g., "View All"), featuring a ghost border and no fill.

### Cards
- Prediction cards must include a header (Title + Icon), a visual probability indicator (Progress bar or Chart), and clear Action buttons.
- Hover states should slightly increase the background opacity of the glass panel and transition the header text color to the brand primary.

### Chips & Badges
- **Status Badges:** Use a 20% opacity background of the status color (e.g., Secondary for "Live") with a 1px border of the same color.
- **Filter Chips:** Inactive filters use a dark surface; the active filter uses the Secondary container color with a subtle outer glow.

### Input Fields
- Search bars are pill-shaped with a 5% white overlay and a ghost border. On focus, they transition to a 2px Primary or Secondary border.

### Progress Bars
- Dual-sided bars used for binary markets. The "Yes" side is Primary, and the "No" side is a low-opacity `on-surface-variant` to emphasize the winning side.