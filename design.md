# SovereignX / SentinelX Design System

## 1. Product Design Direction

SovereignX / SentinelX is a **Premium autonomous cybersecurity / DevSecOps AI platform designed for serious technical users.**

The visual identity communicates:
- Security and Privacy
- Intelligence and Autonomy
- Reliability and Precision
- Technical sophistication
- Modern engineering

**Aesthetic:** High-end developer tooling mixed with an advanced command center. It avoids generic SaaS templates, gaming UI, or overly colorful startup designs.

## 2. Core Visual Philosophy

### 2.1 Dark-First
The application is fundamentally dark. Dark surfaces dominate the interface. Contrast is achieved through surface elevation, subtle borders, typography, intentional glow, and motion—rather than excessive bright surfaces.

### 2.2 Rectangular / Technical Geometry
The UI relies on structured geometry:
- Rectangular containers with sharp or minimally rounded corners.
- Technical panel geometry, thin borders, grid structures, and dividers.
- Avoid excessive border radius, giant rounded cards, or bubble-like interfaces.

**Border Radius Scale:**
- `0px` - Full sharp (technical edges)
- `2px` - Micro elements (checkboxes)
- `4px` - Small interactive elements (inputs, standard buttons)
- `6px` - Medium cards
- `10px` (0.625rem) - Maximum radius for large elevated panels and primary modals. (Matches `--radius`).

### 2.3 Minimal Color Language
Colors are strictly controlled. The system uses a four-color dark palette based on deep space and technical blue. Random colors in individual components are prohibited.

## 3. Color System

### 3.1 Design Tokens

**Background & Surfaces:**
- `--background`: `#030406` (Deep technical black/blue - base canvas)
- `--foreground`: `#F8FAFC` (Slate 50 - Primary text)
- `--card` & `--popover`: `#0A0D14` (Elevated surface level 1)
- `--secondary` & `--muted`: `#1E293B` (Slate 800 - Elevated surface level 2 / subtle backgrounds)
- `--sidebar`: `#050A0F` (Distinct ultra-dark surface for sidebars)

**Accents & Interaction:**
- `--primary`: `#00A3FF` (Vibrant technical blue - Main action, glow, focus)
- `--primary-foreground`: `#030406`
- `--accent`: `#1E293B` (Hover states)
- `--accent-foreground`: `#00A3FF` (Active text)
- `--ring`: `#00A3FF` (Focus rings)

**Status & Semantic:**
- `--destructive`: `#EF4444` (Critical actions, errors)
- `--success`: `#10B981` (Emerald 500 - Completion, passing tests)
- `--warning`: `#F59E0B` (Amber 500 - Requires attention, pending)
- `--info`: `#00A3FF` (Informational, system logs)

### 3.2 Color Hierarchy
- **Dominant:** Deep backgrounds (`#030406`, `#0A0D14`).
- **Interaction:** Vibrant blue (`#00A3FF`) is reserved for primary actions, active states, and subtle glows (e.g., `border-glow-button`).
- **Gradients/Glows:** Permitted only for hero sections, active AI states, or high-tier elements (e.g., `liquid-glass-card`, `shader-gradient-bg`). Must be subtle and tied to interaction.

## 4. Typography System

The typography feels modern, technical, and highly legible.

### 4.1 Font Family
- **Primary Font (Sans):** `Geist Sans` (System fallback: Inter, sans-serif) - Used for all UI text, buttons, and standard copy.
- **Display Font:** `Google Sans` / `Outfit` - Used strictly for large hero headings and marketing impact.
- **Monospace (Mono):** `Geist Mono` - Used for logs, code blocks, agent telemetry, and technical metadata.

### 4.2 Typography Scale
- **Display:** `text-6xl` to `text-8xl` (font-display, tight tracking `tracking-tight`, leading `0.92`) - Hero sections only.
- **H1 (Page Heading):** `text-4xl`, font-semibold, tracking-tight.
- **H2 (Section Heading):** `text-2xl`, font-medium, text-foreground.
- **H3 (Card Heading):** `text-lg`, font-medium, text-foreground.
- **Body Large:** `text-base`, text-foreground/90, leading-relaxed.
- **Body Standard:** `text-sm`, text-muted-foreground (`#94A3B8`), leading-normal.
- **Small/Caption:** `text-xs`, text-muted-foreground/80.
- **Mono / Code:** `text-xs` or `text-sm`, font-mono, tracking-widest, uppercase for labels.

## 5. Spacing System

A strict 4px/8px baseline grid is enforced.
- `4px` (gap-1): Micro spacing (icons to text).
- `8px` (gap-2): Tight component spacing (form labels to inputs).
- `16px` (gap-4): Standard UI spacing (padding inside buttons, small cards).
- `24px` (gap-6): Medium layout spacing (between form groups).
- `32px` (gap-8): Section inner spacing (padding inside large panels).
- `64px` (gap-16): Distinct layout blocks.
- `96px` (gap-24) to `128px`: Major section spacing on marketing pages.

## 6. Layout System

- **Maximum Content Width:** `1440px` (Marketing) / `100%` (Dashboard with sidebar).
- **Page Gutters:** 
  - Mobile: `16px` (px-4)
  - Tablet: `24px` (px-6)
  - Desktop: `48px` (px-12)
- **Breakpoints:** Mobile (sm: 640px), Tablet (md: 768px), Laptop (lg: 1024px), Desktop (xl: 1280px), Large Desktop (2xl: 1400px).

## 7. Grid System

- **Desktop:** 12-column grid (`grid-cols-12`).
- **Dashboard:** CSS Grid for main areas (Sidebar fixed width, Main Content flexible).
- **Bento Layouts:** Used for feature cards (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3` or varying spans like `col-span-2`).
- **Gap Size:** `gap-4` or `gap-6` standard.

## 8. Container System

- **Page Container:** Fills available viewport.
- **Section Container:** Max-width wrappers (`max-w-[1440px]`).
- **Panel (Dashboard Modules, Logs):**
  - Background: `bg-card` (`#0A0D14`)
  - Border: `border-border` (`#1E293B`), 1px solid.
  - Radius: `rounded-lg` (10px max).
  - Shadow: None by default. Subtle inner glow on hover.

## 9. Navigation System

**Global Navbar:**
- **Height:** 64px (`h-16`).
- **Background:** Transparent to blurred (`backdrop-blur-md bg-background/50`) when sticky.
- **Typography:** `text-sm`, font-medium.
- **Active State:** Text changes to `--foreground`, subtle `--primary` underline or dot indicator.
- **Animation:** Smooth transform on scroll, elements slide in.

## 10. Button System

- **Height:** Standard `40px` (`h-10`), Small `32px` (`h-8`), Large `48px` (`h-12`).
- **Radius:** `rounded-md` (6px).
- **Styles:**
  - **Primary:** `bg-primary text-primary-foreground`.
  - **Secondary / Command Button:** `bg-secondary text-secondary-foreground border border-border`. (Used for Run Scan, Deploy Agent).
  - **Ghost:** Transparent background, `hover:bg-accent hover:text-accent-foreground`.
  - **Destructive:** `bg-destructive text-white`.
  - **Icon Button:** Square aspect ratio (`w-10 h-10`), icon centered.
- **Motion:** Scale down slightly on press (`active:scale-95`), background crossfade on hover.

## 11. Card System

Standardized across the app to prevent inconsistency.
- **Structure:** `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.
- **Background:** `bg-card`.
- **Border:** `border border-border`.
- **Radius:** `rounded-lg`.
- **Hover:** For interactive cards (e.g., Repositories), border color shifts to `border-primary/50`, and a subtle `box-shadow` or background gradient mask activates (e.g., `liquid-glass-card`).

## 12. Dashboard Design System

The dashboard acts as a **Security Command Center**.
- **Sidebar:** Left-aligned, `w-64`, collapsible to icon-only. Darker background (`#050A0F`).
- **Top Bar:** Breadcrumbs, workspace selector, and global actions.
- **Priority:** 
  1. System state (Scanning, Idle).
  2. Important actions (Run Test).
  3. Security Findings / Logs.
- **Layout:** High information density. Tense, technical, and precise.

## 13. Security Status Language

States are represented by Color + Icon + Typography (never color alone).
- **Idle:** Gray / Muted (`--muted-foreground`). Icon: Pause/Dot.
- **Scanning / Running:** Blue (`--primary`). Icon: Spinner / Pulse animation.
- **Completed / Secure:** Green (`--success`). Icon: Check circle.
- **Requires Attention / Warning:** Amber (`--warning`). Icon: Triangle alert.
- **Failed / Blocked:** Red (`--destructive`). Icon: X / Shield breach.

## 14. Red Team / Blue Team Visual System

Both operate in the same platform but require visual distinction.
- **Red Team (Offensive):** Sharp angular UI elements, subtle red/magenta accents in visualizations. Represents exploits, payloads, adversarial action.
- **Blue Team (Defensive):** Shield motifs, cyan/blue accents, solid borders. Represents hardening, detection, and mitigation.
- **Note:** Keep it professional. No gaming graphics. It remains enterprise software.

## 15. AI Agent Design System

Agents are autonomous entities with states.
- **Components:** Agent Name (Mono), Role, Current Task, Progress Bar.
- **States:** 
  - *Thinking/Working:* Subtle pulse or `blob-breathe` animation. Typing indicators.
  - *Idle:* Static, reduced opacity.
  - *Completed:* Distinct timestamp.

## 16. Terminal / Log System

Professional developer infrastructure logs.
- **Typography:** `Geist Mono`, `text-xs`.
- **Format:** `[TIMESTAMP] [LEVEL] [AGENT] MESSAGE`.
- **Colors per level:** 
  - `INFO`: Muted text.
  - `DEBUG`: Gray.
  - `WARNING`: Amber.
  - `ERROR`: Red.
  - `SUCCESS`: Green.
- **Behavior:** Auto-scrolling, collapsible groups, syntax highlighting for payloads.

## 17. Table System

- **Header:** Uppercase, `text-xs`, tracking-wider, `text-muted-foreground`. Border bottom.
- **Row:** `border-b border-border`, `hover:bg-muted/50` transition.
- **Mobile:** Transforms into stacked cards on small screens.

## 18. Form System

- **Inputs:** `bg-background`, `border-border`, `rounded-md`, `h-10`.
- **Focus:** `focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background`.
- **Labels:** `text-sm font-medium`, placed above inputs.

## 19. Modal / Dialog System

- **Overlay:** `bg-background/80 backdrop-blur-sm`.
- **Panel:** `bg-card border border-border rounded-lg shadow-2xl`.
- **Motion:** Subtle fade-in and scale-up (`duration-200 ease-out`).

## 20. Toast / Notification System

- **Position:** Bottom-right.
- **Style:** Dark background, colored left border indicating severity.
- **Motion:** Slide up and fade in.

## 21. Empty & Loading States

- **Empty States:** Informative. Centered muted icon, short title, helper text, and a primary action button.
- **Loading States:** Skeletons (pulsing `#1E293B`) for content blocks. Deterministic progress bars for scans. Avoid full-page spinning loaders.

## 22. Animation & Motion System

Animations must make the app feel alive and premium, but not distracting.
- **Technologies:** GSAP, ScrollTrigger, Lenis (smooth scroll), Framer Motion, CSS transitions.
- **Duration:** 
  - Fast (Micro-interactions): `150ms`.
  - Normal (Modals/Tabs): `300ms`.
  - Complex (Page reveals): `600ms - 800ms`.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` or GSAP `power3.out`.

## 23. Page & Scroll Transitions

- **Page Transitions:** Subtle opacity/transform reveals. Content is usable instantly.
- **Scroll Animations (Landing):** Use `ScrollTrigger` for pinned sections, masked typography reveals (`masked-heading`), and horizontal scrolling.
- **Performance:** Animate `transform` and `opacity` only. Avoid animating `width`, `height`, or `box-shadow`. Respect `prefers-reduced-motion`.

## 24. GSAP Rules

- Use `gsap.context()` in React to manage scope.
- Always kill timelines in `useEffect` cleanup.
- Avoid unnecessary re-renders inside `onUpdate`.
- Use `ScrollTrigger` responsibly (do not initialize repeatedly).

## 25. Accessibility (A11y)

- **Keyboard Navigation:** All interactive elements must have visible focus rings (`focus-visible`).
- **Contrast:** Ensure text meets WCAG AA standards against `bg-background`.
- **State:** Never rely solely on color to communicate state. Include icons or text labels.

## 26. Iconography

- **Library:** `lucide-react`.
- **Size Scale:** `16px` (sm), `20px` (md), `24px` (lg).
- **Stroke Width:** `1.5px` (consistent technical feel).
- **Usage:** Use icons to support text, not replace it, unless the action is universally understood (e.g., Close `X`).
