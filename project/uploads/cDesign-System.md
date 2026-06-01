# Coinswap Taker — Design System

> Implementation-ready spec extracted from the live design (Dashboard, Market, Swap, Swap Progress, Swap Success). Exact values are taken from the CSS where present; inferred values are marked `[inferred]`.

The product runs in a dark macOS-styled desktop shell. Two flow palettes exist:
- **Wallet flow** (Dashboard, Market, etc.) — orange-primary
- **Swap flow** (Swap, Swap Progress, Swap Success) — blue-primary

Everything else (typography, spacing, components, motion) is shared.

---

## 1. Color Palette

### Brand / Primary

| Token | Hex | Usage |
|---|---|---|
| `--orange` | `#E85002` | Wallet-flow primary: buttons, active nav, hero accent, sort active |
| `--orange-hover` | `#FF6A2A` | Hover state for primary actions |
| `--orange-2` | `#FF541B` | Gradient stop in hero bar |
| `--orange-soft` | `#ff7a3d` | Available alt (declared, sparingly used) |
| `--orange-deep` | `#b53800` | Available alt (declared, sparingly used) |
| `--blue` | `#5b8def` | Swap-flow primary; also Swaps balance card, SegWit pill |
| `--blue-hover` `[inferred]` | `#7da3f5` | Hover state for blue primary |

Tinted variants follow the recipe `rgba(orange, 0.10–0.14)` for backgrounds, `rgba(orange, 0.25–0.30)` for borders. Same rule for blue: `rgba(91,141,239,0.10)` bg, `rgba(91,141,239,0.28)` border.

### Neutral Scale

| Token | Hex / value | Role |
|---|---|---|
| `--bg` | `#08080a` | App background, outside the shell |
| `--surface-1` | `#101014` | Shell / sidebar inner surface |
| `--surface-2` | `#16161a` | Cards (balance cards, list cards, summary) |
| `--surface-3` | `#1c1c22` | Inset rows (utxo-row, tx-row, metric, filter-tabs container) |
| `--surface-4` `[inferred]` | `#1f1f25` | Row hover state |
| `--border` | `rgba(255,255,255,0.08)` | Default 1px border |
| `--border-strong` | `rgba(255,255,255,0.14)` | Hover border, ghost button border |
| `--text` | `#f5f5f7` | Primary text |
| `--text-2` | `#a7a7ad` | Secondary text, addresses |
| `--text-3` | `#6c6c72` | Tertiary text, mono eyebrow labels, dim values |

### Semantic Colors

| Token | Hex | Meaning |
|---|---|---|
| `--green` | `#2fbf71` | Success · incoming · confirmed · swap pill · "You receive" |
| `--red` | `#ff4d5a` | Outgoing only (not destructive UI) |
| `--amber` | `#ffb547` | Unconfirmed · contract · HTLC locked · warning |
| `--blue` | `#5b8def` | Swap context · SegWit · in-progress state |
| `--purple` | `#a979ff` | Taproot script |

Tinted backgrounds for semantic chips/pills use the same `rgba(token, 0.10)` bg + `rgba(token, 0.28)` border pattern.

### Glow Pattern

Pulse dots and status pips use a small drop-shadow halo:
`box-shadow: 0 0 8px var(--green)` (or other token). Used on:
- Node OK pip
- Titlebar Mainnet dot
- Status pill dots
- Success ripple

### Gradients

Only **two** gradients exist in the system:

1. Hero balance card background:
   `linear-gradient(135deg, rgba(232,80,2,0.18), rgba(255,84,27,0.06))` `[inferred composition]`
2. Hero progress bar fill:
   `linear-gradient(90deg, var(--orange) 0%, var(--orange-hover) 100%)`
3. (Swap flow) Top-bar progress:
   `linear-gradient(90deg, var(--blue) 0%, var(--blue-hover) 100%)`

Decorative or multi-stop gradients are banned elsewhere.

---

## 2. Typography

### Families

```css
--f-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
          'Helvetica Neue', Helvetica, Arial, sans-serif;
--f-mono: ui-monospace, 'SF Mono', Menlo, Monaco, Consolas,
          'Liberation Mono', monospace;
```

`font-feature-settings: "ss01", "cv11"` is applied at `body` level.

### Type Scale

| Token | Size | Weight | Letter-spacing | Family | Use |
|---|---|---|---|---|---|
| `--h1` | 34px | 700 | -0.035em | sans | Page H1 (`Wallet`, `Market`, `Swap Completed`) |
| `--hero` | 54px | 700 | -0.035em | mono | Hero balance value, success amount |
| `--h2` | 28px | 600 | -0.025em | sans | Section h2 |
| `--val-lg` | 28px | 600 | -0.025em | mono | Secondary balance value, fee total |
| `--h3` | 18px | 600 | -0.02em | sans | Modal title `[inferred]` |
| `--h4` | 15px | 600 | -0.01em | sans | Card title (h3), section h3 |
| `--body` | 13px | 500 | -0.005em | sans | Body, nav link, default |
| `--body-mono` | 13px | 500 | -0.005em | mono | UTXO amount, fee row values |
| `--small` | 12.5px | 500–600 | -0.005em | sans/mono | Button, subtitles, secondary values |
| `--btn-sm` | 11.5px | 600 | — | sans | Small button, filter tab |
| `--mono-meta` | 11–11.5px | 500 | -0.005em | mono | TXIDs, addresses |
| `--eyebrow` | 10.5px | 500 | 0.10em | mono | Uppercase section labels |
| `--counter` | 10.5px | 500 | 0.08em | mono | Counts beside titles (uppercase) |
| `--timestamp` | 9.5px | 500 | — | mono | Time stamps (uppercase) |
| `--pill` | 9.5px | 500 | 0.04–0.06em | mono | Pills, conf badges (uppercase) |
| `--label-cap` | 9.5–10px | 500 | 0.1em | mono | Metric labels, table headers (uppercase) |

Line-height is `1.1` for display/hero values, `1.5` for body, `1.45` for warnings/log lines. `[inferred for ones not explicit]`

### Heading Hierarchy

| Level | Recipe |
|---|---|
| **H1** | 34px / 700 / -0.035em, sans, sentence case |
| **H2** | 28px / 600 / -0.025em, sans `[reserved for design-system pages]` |
| **H3** | 15px / 600 / -0.01em, sans, card title |
| **H4** | 10.5px / 500 / 0.14em mono uppercase, sub-section title within a card |
| **H5/H6** | not used `[inferred]` |

### Special Treatments

- **Italic accent.** Only on **welcome H1s** (`Let's get you connected.`, `Create your wallet.`) — wrap the last word in `<span class="accent">` → orange italic 600. The Swap Success header uses a non-italic colored accent (`<span class="accent-success">Completed</span>` → green) as the only deviation; do not extend italic elsewhere.
- **Mono is reserved for data-shaped things** — addresses, txids, BTC/sats amounts + units, eyebrows, counts, pills, timestamps, block heights, log lines, formulas.
- **Sans is for UI** — page titles, card titles, button labels, filter tab labels, body copy, hop-button counts.

---

## 3. Spacing & Layout

### Base Unit

No formal 4-/8-pixel scale, but the values in use are:
**4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 32 · 40 · 54 · 62 px.**

Treat this as the de-facto scale. Don't introduce off-scale values.

### Shell

| Property | Value |
|---|---|
| Outer width | `min(1320px, 100%)` |
| Border-radius | `24px` |
| Min-height | `calc(100vh - 60px)` |
| Border | `1px solid var(--border)` |
| Sidebar collapsed | `68px` |
| Sidebar expanded | `200px` |
| Sidebar transition | `grid-template-columns 0.3s ease` |
| Main padding | `62px 28px 28px` (62 top accounts for the 42px titlebar) |
| Main vertical gap | `18px` |
| Body padding | `28px 24px 32px` |

### Titlebar

`42px` tall, absolute-positioned, 1px border-bottom, mono uppercase center label.

### Grids

| Layout | Template |
|---|---|
| Balances (Dashboard) | `1.45fr 1fr 1fr 1fr`, gap `12px` |
| Lower (Dashboard) | `1.55fr 1fr`, gap `14px` |
| Market stats | `1fr 1fr 1fr`, gap `12px` |
| Swap page | `1fr 360px`, gap `14px` |
| Swap Success | `1fr 380px`, gap `14px` |

### Breakpoints `[inferred from media queries]`

| Name | Width | Effect |
|---|---|---|
| Desktop | `> 1100px` | Default |
| Tablet | `≤ 1100px` | 2-col grids collapse to 1, balances collapse to 2-col |
| Mobile | `≤ 760px` | Stats stack, main padding tightens to `62px 18px 22px` |
| Mobile-small | `≤ 720px` | Hops grid reduces to 2 cols |

### Card Padding

| Element | Padding |
|---|---|
| `.card-head` | `16px 18px` |
| `.card-body` | `14px 18px` (Dashboard) · `18px` w/ `20px` gap (Swap) |
| `.card-foot` | `12px 18px` |
| `.bcard` (balance) | `20px 20px 18px` (`22px 24px` for hero) |
| Inset row (utxo / tx) | `10px 12px` |
| Pill | `3px 8px` |
| Filter tab pill container | `3px` |
| Filter tab button | `6px 13px` |
| Button (default) | `0 20px`, 40px tall |
| Button (sm) | `0 14px`, 30px tall |

---

## 4. Borders & Radii

### Radius Scale

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `8px` | Inputs |
| `--r-md` | `12px` | Color swatches, file picker tabs, fee blocks |
| `--r-lg` | `20px` | Available (declared) |
| `--r-xl` | `32px` | Available (declared) |
| `--r-pill` | `999px` | Buttons, filter tabs, eyebrow chips |

### Ad-hoc Radii

| Value | Use |
|---|---|
| `24px` | Shell |
| `18px` | Balance card, modal |
| `14px` | Card, total-value strip, summary card, success-check |
| `10px` | Metric, utxo-row, tx-row, nav item, table row, warn banner |
| `9px` | TX direction arrow, brand-mark |
| `7px` | Icon button |
| `6px` | Pills, badges, tooltips |
| `5px` | Conf badge |
| `2px` | Accent-line tail |

### Border Widths

- **1px solid** for every default border (cards, rows, inputs, pills, sidebars).
- **1.5px** for checkbox glyphs `[inferred]`.
- **2px** for accent lines on the left edge of `.bcard` and `.contract`.

---

## 5. Elevation

The system uses **exactly one** drop shadow — on the shell. Cards are **flat**; they're delineated by `1px solid var(--border)` only.

| Token | Recipe | Use |
|---|---|---|
| `--shell-shadow` | `0 1px 0 rgba(255,255,255,0.05) inset, 0 40px 120px -20px rgba(0,0,0,0.7)` | Shell |
| `--glow-sm` `[inferred]` | `0 0 8px <token>` | Status pips, pulse dots |
| `--glow-md` `[inferred]` | `0 0 12px–16px <token>` | Hero progress bar, packet dots |
| `--glow-active` `[inferred]` | `0 0 40px rgba(token, 0.20)` | Success check, active node ring |

Banned: drop-shadows on cards, rows, buttons, pills, modals.

---

## 6. Components

### 6.1 Button

```
.btn  → primary       → 40px tall · 20px padding · 12.5/600 sans · pill
.btn.ghost            → transparent · 1px border-strong · text-2
.btn.sm               → 30px tall · 14px padding · 11.5/600
.btn.block            → width:100% · 46px tall · 13.5/600
```

| State | Treatment |
|---|---|
| Default (primary) | bg `--orange` (wallet flow) or `--blue` (swap flow), white text |
| Hover | bg `--orange-hover` / `--blue-hover` + `translateY(-1px)` |
| Ghost default | transparent, `--border-strong`, text-2 |
| Ghost hover | `rgba(255,255,255,0.05)` bg, text→text, no transform |
| Disabled | bg `--surface-3`, text `--text-3`, `cursor: not-allowed`, pointer-events: none |
| Focus-visible | undefined `[inferred — must add for a11y]` |

Refresh button rotates its icon `60deg` over `0.4s` on hover.

### 6.2 Sidebar Nav

```
.nav a  → 9px 12px padding · 10px radius · 13/500 sans
```

| State | Treatment |
|---|---|
| Default | text `--text-2` |
| Hover | bg `rgba(255,255,255,0.04)`, text `--text` |
| Active | bg `--orange` (or `--blue` on Swap flow), text white |
| Tooltip (collapsed) | shows `data-tip` via `::after` — `--surface-3` bg, mono 10px uppercase |

### 6.3 Card (`.card`)

Vertical stack of `.card-head` + `.card-body` + `.card-foot`.

- `.card-head h3` — 15/600 sans
- `.card-head .count` — mono `0.08em` uppercase 10.5px, after title
- `.card-foot .view-all` — orange (or blue) mono uppercase 11px with thin underline that brightens on hover

### 6.4 Balance Card (`.bcard`)

- 2px left edge `.accent-line` (color = modifier)
- Mono uppercase `.label`
- Mono `.val` (28px / 600, hero is 54px / 700)
- Sentence `.sub`
- **No icons. No vertical side labels.**
- Modifiers: `.orange`, `.blue`, `.green`, `.amber`, `.white`, `.purple` — color the `.val` and `.accent-line` only.
- `.hero` modifier — `1.45fr` width, padding `22px 24px`, orange gradient bg, tinted border, and a `.share` row with `.pct` + 3px `.bar`.

### 6.5 Filter Tabs (`.filter-tabs`)

Pill container, `3px` padding, `--surface-3` bg.
Buttons: `6px 13px`, 11.5/500. Active state = solid `--orange` bg + white text.
Optional `<span class="n">` count — mono 10px, dimmed.

### 6.6 Tabs (Maker categories)

Larger pill tabs (9px 14px, 12.5/500). Active variant tinted by semantic color:
- Good Makers → green pill (active)
- Bad Makers → red pill (active)
- Unresponsive → amber pill (active)

### 6.7 Picker Tabs (Swap page)

Two big segmented pills inside a `--surface-3` container with `4px` padding. Active pill = solid `--blue`, white text. Children include a mono count chip.

### 6.8 Auto / Manual Link Toggle

```
Auto select / Manual select
```

Text links separated by a faint slash, 13/500 sans. Active link is `--text` with a `1.5px` `--orange/blue` underline on `border-bottom`. Inactive is `--text-3`.

### 6.9 Pill / Badge

```
.pill  → 3px 8px · 6px radius · 1px tinted border · mono 9.5px uppercase 0.04–0.06em
```

| Variant | Bg / border / fg |
|---|---|
| `.pill.taproot` | `rgba(purple,0.10)` / `rgba(purple,0.28)` / `--purple` |
| `.pill.segwit` | `rgba(blue,0.10)` / `rgba(blue,0.28)` / `--blue` |
| `.pill.regular` | `rgba(255,255,255,0.04)` / `--border` / `--text-2` |
| `.pill.contract` | amber-tinted |
| `.pill.swap` | green-tinted |
| `.pill.red` | red-tinted (Bad Maker reason) |
| `.conf.partial` | amber-tinted |
| `.conf.full` | green-tinted |

### 6.10 Eyebrow Chip (`.eyebrow`)

Pill with a glowing 6px orange `.pip` + mono uppercase 10.5px label. Used as step/section labels on welcome screens.

### 6.11 Input

- `.amt-wrap` — 12px radius, `--surface-3` bg, `--border`; on focus-within → `--border-strong`. Input is borderless, mono 22px / -0.02em.
- `.input-wrap` (modal) — 8px radius, `--surface-3` bg, padding `11px 12px`, mono 13.5px.
- `.field-hint` — mono 10.5px caption row, `.val` is `--text-2`.

### 6.12 Checkbox / Selectable Row

```
.utxo-item  → 10px radius · grid · padding 10px 12px
```

- Checkbox: 16px box, 1.5px `--border-strong`, 5px radius.
- Checked: bg `--orange` (or `--blue`), border same, white check svg appears.
- Row when checked: `rgba(token, 0.05)` bg + `rgba(token, 0.45)` border.

### 6.13 Status Pill (live state)

Used in animation and Market: small mono uppercase pill with a glowing 6px tonal dot.
Tones: `dim`, `green`, `blue`, `amber`, `red` — using the standard `rgba(token, 0.10)` bg / `rgba(token, 0.28)` border / `token` fg recipe.

### 6.14 Modal

- `--surface-2` bg, `--border-strong` 1px, `18px` radius, no drop shadow
- Backdrop: `rgba(0,0,0,0.62)` + `backdrop-filter: blur(2px)`
- Open transition: `opacity 0.2s` + `transform: translateY(8px) scale(0.98)` → identity
- Head/body/foot pattern with 1px dividers

### 6.15 Contract Row (Swap Success)

- 12px radius, `--surface-3` bg, 1px border, padding `14px 16px`
- 2px left accent-line: green for incoming, amber for outgoing
- Header: 13/600 sans label with directional arrow icon, right side has `icon-btn` copy + mempool
- TXID line: mono 12px, `--text-2`, `word-break: break-all`
- Copy success → button gets tinted green for 1.4s

### 6.16 Icon Button (`.icon-btn`)

26px square, 7px radius, transparent default, hover = `rgba(255,255,255,0.04)` bg + `--border` + `--text`. Active/success → tinted by semantic color.

### 6.17 Hop Button

5-column grid, padding `14px 8px 12px`, 10px radius. Number is mono 18/600, sub label is mono 9.5px 0.08em uppercase. Active = solid `--orange/blue` bg + white.

### 6.18 Warning Banner (`.warn-banner`)

Amber-tinted box, 10px radius, padding `11px 14px`, mono 11.5px. "Warning:" prefix is `font-weight:700` uppercase 10.5px.

### 6.19 ETA Pill (`.eta`)

Self-aligned pill, `rgba(blue,0.10)` bg, `rgba(blue,0.28)` border, blue mono 11.5/500. Label is 9.5px uppercase, value is mono.

### 6.20 Activity Log Row

Mono 13px row inside a 12px-radius surface-1@60% panel with `backdrop-filter: blur(8px)`. Columns: 56px timestamp + 90px tag (uppercase, tonal) + message.

---

## 7. Iconography

### Style

- **Line / stroke** SVGs. No filled icons by default.
- `stroke-width: 1.6` for navigation and chrome.
- `stroke-width: 2` for actions (refresh, copy, mempool, modal close, packet arrows, success check on row).
- `stroke-width: 3` for the success check inside the green ripple badge.
- `stroke-linecap: round`, `stroke-linejoin: round`.
- `color: currentColor` always.

### Size Scale

| Size | Use |
|---|---|
| `9–11px` | Inline link arrows (Mempool · View) |
| `12–13px` | Icon buttons, ETA pill, modal close |
| `14px` | Button icons, refresh, success-row check |
| `16px` | Sidebar nav |
| `22–24px` | Node icons in animation, success-check hero |

### Where Icons Are Allowed

- Sidebar nav (one per item)
- TX direction arrows (up/down inside `.tx-arrow`)
- Refresh, mempool-link external arrow, view-all chevron, copy
- Modal close
- Picker-tab auto/manual indicators
- Hop selector (none)
- Status check / lock / warning icons on Swap Progress nodes
- Animation node icons (wallet / onion)

### Banned

- Inside balance cards (no icons in `.label`)
- Inside filter tabs (except action affordances like sort arrows)
- Inside pills/badges
- As decorative filler anywhere

---

## 8. Motion

### Durations

| Use | Value |
|---|---|
| Hover/state transitions | `0.15s` |
| Toggle / opacity fade | `0.2s` |
| Sidebar expand/collapse | `0.3s ease` |
| Refresh icon rotate | `0.4s` |
| Modal open | `0.2s` (opacity) + `0.2s` (transform) |
| Success ripple | `2.4s ease-out infinite` |
| Pulse dot | `2.4s ease-in-out infinite` |

### Easing

The CSS layer uses `ease` and `ease-in-out` defaults. The animation engine ships richer curves:

```
linear, easeInQuad / easeOutQuad / easeInOutQuad,
easeInCubic / easeOutCubic / easeInOutCubic,
easeInQuart / easeOutQuart / easeInOutQuart,
easeInExpo / easeOutExpo / easeInOutExpo,
easeInSine / easeOutSine / easeInOutSine,
easeInBack / easeOutBack / easeInOutBack,
easeOutElastic
```

Defaults in use:
- **Entrances** → `easeOutBack` (slight overshoot)
- **Card / packet travel** → `easeInOutCubic`
- **Exits** → `easeInCubic`

### Interaction Behaviors

- Buttons lift 1px on hover (primary only).
- Filter tabs/pills: bg + text color crossfade, no lift.
- Rows: bg + border crossfade.
- Refresh icon: rotates 60° on hover.
- Hover-bg pattern: `rgba(255,255,255,0.04)` (low) → `0.05` (slightly higher).

---

## 9. Tokens

### 9.1 CSS Custom Properties

```css
:root {
  /* Brand */
  --orange:        #E85002;
  --orange-hover:  #FF6A2A;
  --orange-2:      #FF541B;
  --orange-soft:   #ff7a3d;
  --orange-deep:   #b53800;

  --blue:          #5b8def;
  --blue-hover:    #7da3f5;

  /* Semantic */
  --green:         #2fbf71;
  --red:           #ff4d5a;
  --amber:         #ffb547;
  --purple:        #a979ff;

  /* Neutrals */
  --bg:            #08080a;
  --surface-1:     #101014;
  --surface-2:     #16161a;
  --surface-3:     #1c1c22;
  --surface-4:     #1f1f25;
  --border:        rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);
  --text:          #f5f5f7;
  --text-2:        #a7a7ad;
  --text-3:        #6c6c72;

  /* Type */
  --f-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
            'Helvetica Neue', Helvetica, Arial, sans-serif;
  --f-mono: ui-monospace, 'SF Mono', Menlo, Monaco, Consolas,
            'Liberation Mono', monospace;

  --fs-hero:   54px;
  --fs-h1:     34px;
  --fs-h2:     28px;
  --fs-h3:     15px;
  --fs-body:   13px;
  --fs-small:  12.5px;
  --fs-btn-sm: 11.5px;
  --fs-meta:   11px;
  --fs-eyebrow:10.5px;
  --fs-pill:   9.5px;

  --tracking-tight:  -0.035em;
  --tracking-h2:     -0.025em;
  --tracking-h3:     -0.01em;
  --tracking-body:   -0.005em;
  --tracking-loose:  0.08em;
  --tracking-caps:   0.10em;

  /* Radii */
  --r-sm:    8px;
  --r-md:    12px;
  --r-lg:    20px;
  --r-xl:    32px;
  --r-pill:  999px;
  --r-row:   10px;
  --r-card:  14px;
  --r-shell: 24px;

  /* Spacing scale */
  --s-1:  4px;
  --s-2:  6px;
  --s-3:  8px;
  --s-4:  10px;
  --s-5:  12px;
  --s-6:  14px;
  --s-7:  16px;
  --s-8:  18px;
  --s-9:  20px;
  --s-10: 22px;
  --s-11: 24px;
  --s-12: 28px;
  --s-13: 32px;
  --s-14: 40px;
  --s-15: 54px;
  --s-16: 62px;

  /* Elevation */
  --shell-shadow: 0 1px 0 rgba(255,255,255,0.05) inset,
                  0 40px 120px -20px rgba(0,0,0,0.7);

  /* Motion */
  --t-fast:  120ms;
  --t-base:  150ms;
  --t-slow:  300ms;
  --t-rotate: 400ms;
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Swap-flow remap (apply to <body data-flow="swap">) */
[data-flow="swap"] {
  --orange:        var(--blue);
  --orange-hover:  var(--blue-hover);
}
```

### 9.2 W3C DTCG Token JSON

```json
{
  "color": {
    "brand": {
      "orange":       { "$type": "color", "$value": "#E85002" },
      "orangeHover":  { "$type": "color", "$value": "#FF6A2A" },
      "orange2":      { "$type": "color", "$value": "#FF541B" },
      "blue":         { "$type": "color", "$value": "#5B8DEF" },
      "blueHover":    { "$type": "color", "$value": "#7DA3F5" }
    },
    "semantic": {
      "green":  { "$type": "color", "$value": "#2FBF71" },
      "red":    { "$type": "color", "$value": "#FF4D5A" },
      "amber":  { "$type": "color", "$value": "#FFB547" },
      "purple": { "$type": "color", "$value": "#A979FF" }
    },
    "neutral": {
      "bg":            { "$type": "color", "$value": "#08080A" },
      "surface1":      { "$type": "color", "$value": "#101014" },
      "surface2":      { "$type": "color", "$value": "#16161A" },
      "surface3":      { "$type": "color", "$value": "#1C1C22" },
      "surface4":      { "$type": "color", "$value": "#1F1F25" },
      "border":        { "$type": "color", "$value": "rgba(255,255,255,0.08)" },
      "borderStrong":  { "$type": "color", "$value": "rgba(255,255,255,0.14)" },
      "text":          { "$type": "color", "$value": "#F5F5F7" },
      "text2":         { "$type": "color", "$value": "#A7A7AD" },
      "text3":         { "$type": "color", "$value": "#6C6C72" }
    }
  },
  "font": {
    "family": {
      "sans": { "$type": "fontFamily", "$value": ["-apple-system","BlinkMacSystemFont","SF Pro Display","SF Pro Text","Helvetica Neue","Helvetica","Arial","sans-serif"] },
      "mono": { "$type": "fontFamily", "$value": ["ui-monospace","SF Mono","Menlo","Monaco","Consolas","Liberation Mono","monospace"] }
    },
    "size": {
      "hero":   { "$type": "dimension", "$value": "54px" },
      "h1":     { "$type": "dimension", "$value": "34px" },
      "h2":     { "$type": "dimension", "$value": "28px" },
      "h3":     { "$type": "dimension", "$value": "15px" },
      "body":   { "$type": "dimension", "$value": "13px" },
      "small":  { "$type": "dimension", "$value": "12.5px" },
      "btnSm":  { "$type": "dimension", "$value": "11.5px" },
      "eyebrow":{ "$type": "dimension", "$value": "10.5px" },
      "pill":   { "$type": "dimension", "$value": "9.5px" }
    }
  },
  "radius": {
    "sm":    { "$type": "dimension", "$value": "8px" },
    "md":    { "$type": "dimension", "$value": "12px" },
    "row":   { "$type": "dimension", "$value": "10px" },
    "card":  { "$type": "dimension", "$value": "14px" },
    "shell": { "$type": "dimension", "$value": "24px" },
    "pill":  { "$type": "dimension", "$value": "999px" }
  },
  "spacing": {
    "1": { "$type": "dimension", "$value": "4px" },
    "2": { "$type": "dimension", "$value": "6px" },
    "3": { "$type": "dimension", "$value": "8px" },
    "4": { "$type": "dimension", "$value": "10px" },
    "5": { "$type": "dimension", "$value": "12px" },
    "6": { "$type": "dimension", "$value": "14px" },
    "7": { "$type": "dimension", "$value": "16px" },
    "8": { "$type": "dimension", "$value": "18px" },
    "9": { "$type": "dimension", "$value": "20px" },
    "11":{ "$type": "dimension", "$value": "24px" },
    "12":{ "$type": "dimension", "$value": "28px" },
    "14":{ "$type": "dimension", "$value": "40px" }
  },
  "shadow": {
    "shell": {
      "$type": "shadow",
      "$value": [
        { "color": "rgba(255,255,255,0.05)", "offsetX": "0", "offsetY": "1px", "blur": "0",      "spread": "0",     "inset": true },
        { "color": "rgba(0,0,0,0.7)",        "offsetX": "0", "offsetY": "40px","blur": "120px",  "spread": "-20px", "inset": false }
      ]
    }
  },
  "motion": {
    "duration": {
      "fast":   { "$type": "duration", "$value": "120ms" },
      "base":   { "$type": "duration", "$value": "150ms" },
      "slow":   { "$type": "duration", "$value": "300ms" },
      "rotate": { "$type": "duration", "$value": "400ms" }
    },
    "easing": {
      "out":     { "$type": "cubicBezier", "$value": [0.16, 1, 0.3, 1] },
      "outBack": { "$type": "cubicBezier", "$value": [0.34, 1.56, 0.64, 1] }
    }
  }
}
```

### 9.3 Tailwind Config Snippet

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          orange:      '#E85002',
          orangeHover: '#FF6A2A',
          orange2:     '#FF541B',
          blue:        '#5B8DEF',
          blueHover:   '#7DA3F5',
        },
        success: '#2FBF71',
        danger:  '#FF4D5A',
        warning: '#FFB547',
        info:    '#5B8DEF',
        accent:  '#A979FF',
        surface: {
          0: '#08080A',
          1: '#101014',
          2: '#16161A',
          3: '#1C1C22',
          4: '#1F1F25',
        },
        ink: {
          DEFAULT: '#F5F5F7',
          muted:   '#A7A7AD',
          dim:     '#6C6C72',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong:  'rgba(255,255,255,0.14)',
        },
      },
      fontFamily: {
        sans: ['-apple-system','BlinkMacSystemFont','"SF Pro Display"','"SF Pro Text"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
        mono: ['ui-monospace','"SF Mono"','Menlo','Monaco','Consolas','"Liberation Mono"','monospace'],
      },
      fontSize: {
        hero:    ['54px', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '700' }],
        h1:      ['34px', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '700' }],
        h2:      ['28px', { lineHeight: '1.1',  letterSpacing: '-0.025em', fontWeight: '600' }],
        h3:      ['15px', { lineHeight: '1.3',  letterSpacing: '-0.01em',  fontWeight: '600' }],
        body:    ['13px', { lineHeight: '1.5',  letterSpacing: '-0.005em' }],
        small:   ['12.5px',{ lineHeight: '1.5'}],
        btnSm:   ['11.5px',{ lineHeight: '1', letterSpacing: '0' }],
        eyebrow: ['10.5px',{ lineHeight: '1.2', letterSpacing: '0.1em' }],
        pill:    ['9.5px', { lineHeight: '1.2', letterSpacing: '0.06em' }],
      },
      letterSpacing: {
        tightest: '-0.035em',
        h2:       '-0.025em',
        h3:       '-0.01em',
        body:     '-0.005em',
        caps:     '0.10em',
        loose:    '0.08em',
      },
      spacing: {
        '4.5': '18px', '5.5': '22px', '6.5': '28px',
        '11':  '44px', '13':  '54px', '15.5':'62px',
      },
      borderRadius: {
        row:   '10px',
        card:  '14px',
        shell: '24px',
        pill:  '999px',
      },
      boxShadow: {
        shell: '0 1px 0 rgba(255,255,255,0.05) inset, 0 40px 120px -20px rgba(0,0,0,0.7)',
      },
      transitionDuration: {
        fast:   '120ms',
        base:   '150ms',
        slow:   '300ms',
        rotate: '400ms',
      },
      transitionTimingFunction: {
        out:     'cubic-bezier(0.16, 1, 0.3, 1)',
        outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
};
```

---

## 10. Guidelines

### Do

- Use **mono** for any **data-shaped** content (addresses, txids, BTC/sats + unit, eyebrows, counts, pills, timestamps).
- Use **sans** for UI chrome (page titles, button labels, filter tabs, body copy).
- Keep every screen on the same dark `#08080a` outside the shell.
- Carry exactly **one elevation** (the shell). Cards are flat.
- Reach for the **semantic colors** for their assigned role: green = success / incoming, red = outgoing only, amber = unconfirmed / warning, blue = swap / SegWit / info, purple = Taproot.
- Use the `2px accent-line` on the left edge of `.bcard` / `.contract` for card identification.
- Wrap the final word of a **welcome H1** in `<span class="accent">` for the italic-orange treatment.
- Add a glowing pip for status indicators (`box-shadow: 0 0 8px <token>`).
- Use the same `0.10` bg / `0.28` border tint recipe for pills, conf badges, and tinted panels.

### Don't

- Don't add **drop shadows** to cards, rows, buttons, or pills.
- Don't introduce **decorative gradients**. Only hero card bg, hero progress bar, and the Swap top-bar progress allow gradients.
- Don't put **icons in balance cards**, filter tabs, or pills.
- Don't add **filler stats / data slop**. Every number must be actionable or referenced.
- Don't italicize anything outside a welcome H1's last word.
- Don't repurpose **red** outside outgoing tx contexts; use red text on `--surface-3` for destructive UI when needed.
- Don't repurpose **purple** outside Taproot scripts.
- Don't introduce vertical side labels on cards (removed deliberately).
- Don't use **emoji** unless explicitly part of brand.

### Accessibility Notes

Computed WCAG contrast against `--surface-2` (#16161A):

| Pair | Ratio | Verdict |
|---|---|---|
| `--text` (`#F5F5F7`) | **15.6 : 1** | AAA |
| `--text-2` (`#A7A7AD`) | **7.4 : 1** | AAA |
| `--text-3` (`#6C6C72`) | **3.4 : 1** | AA Large only — keep at 9.5–11px caps, do not use for body |
| `--green` on tinted bg | **4.8 : 1** | AA |
| `--orange` on tinted bg | **3.6 : 1** | AA Large — okay at ≥18px / pills (uppercase) |
| `--blue` on tinted bg | **4.4 : 1** | AA |
| `--amber` on tinted bg | **8.2 : 1** | AAA |

Action items:
- Add a `:focus-visible` ring on `.btn`, `.tab`, `.nav a`, `.hop-btn`, `.utxo-item`, `.icon-btn` — recommend a 2px `--orange` (or `--blue` on swap flow) outline with 2px offset.
- Ensure `--text-3` is only used for uppercase mono micro-copy ≥9.5px — never for body text.
- Define a **disabled** state for filter tabs and inputs.
- Provide `aria-live="polite"` for the activity log on Swap Progress.
- Hit targets: buttons 30–46px tall (✓), nav links 36px (✓), icon-btn 26px (sub-44px desktop target — acceptable for mouse only; bump to 32px on touch breakpoints).

---

## Appendix: File Map

| File | Role |
|---|---|
| `Design System.html` | Visual reference page (palette, type ramp, components) |
| `Coinswap Taker.html` | Welcome / first-run |
| `Wallet Creation.html` | Step 02 form |
| `Dashboard.html` | Wallet dashboard |
| `Market.html` | Maker market (orange-primary) |
| `Swap.html` | Initiate swap (blue-primary) |
| `SwapProgress.html` | 18s animated routing through 3 makers (blue) |
| `SwapSuccess.html` | Swap completion summary (blue) |
| `dashboard-shared.css` | Shared dashboard helpers |
| `market.css` / `market.js` | Market behaviors |
| `swap.css` / `swap.js` | Swap form behaviors |
| `swap-success.css` / `swap-success.js` | Success page behaviors |
| `animations.jsx` | Timeline animation engine |
| `swap-progress.jsx` | Animated swap scenes |
