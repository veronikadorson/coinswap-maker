# Coinswap Taker — Developer Handoff

> Implementation spec for four screens: **Market**, **Swap**, **Swap Progress**, **Swap Success**. Token references (`--orange`, `--surface-2`, `--r-card`, etc.) resolve to values defined in `Design-System.md`.

---

## 1. Overview

### Product context

Coinswap Taker is a desktop Bitcoin wallet that performs Coinswaps over Tor through 1–N intermediary "makers". Users are Bitcoin-native power users — they read txids, care about script types, watch confirmations, and expect dense, glanceable UIs. The visual language leans mono/CLI heritage.

### Screens in this handoff

| Screen | Route | Purpose | Primary outcome |
|---|---|---|---|
| **Market** | `Market.html` | Browse the live maker market, inspect fees, optionally pre-select makers | Click **Swap with selected makers** → Swap |
| **Swap** | `Swap.html` | Configure the swap (amount, UTXOs, makers, hop count) | Click **Start Swap** → Swap Progress |
| **Swap Progress** | `SwapProgress.html` | Animated routing visualization while the swap runs (≈18s demo) | Auto-navigate → Swap Success |
| **Swap Success** | `SwapSuccess.html` | Settlement summary with artifacts and fee breakdown | **Back to Swap** → Swap; **Export report** → JSON download |

### Primary user flows

1. **Maker-led**: Market → pick makers → Swap (makers tab pre-selected) → Progress → Success
2. **Direct**: Swap → auto-select everything → Progress → Success
3. **Hybrid**: Market (browse only, no select) → Swap → manual UTXO selection + auto makers → Progress → Success

### Flow theming

Market is **orange-primary**. Swap, Progress, and Success are **blue-primary**. This is achieved via a single token remap in `swap.css` — `--orange` is redefined to `#5B8DEF`. Apply the same pattern when extending the swap flow.

---

## 2. Layout structure

All four screens share the same outer scaffolding. Differences live inside `<main>`.

### Shared scaffold

```
<body>
  <div class="app">
    <div class="shell expanded">
      <div class="titlebar">                  ← macOS chrome + mainnet pip
        <Lights /> <TitleCenter /> <NetworkBadge />
      </div>
      <aside class="sidebar">                 ← Collapsible 68px ↔ 200px
        <Brand /> <Nav /> <SidebarFoot />
      </aside>
      <main>                                   ← Screen-specific content
        <PageHead />
        … screen body …
      </main>
    </div>
  </div>
</body>
```

### Per-screen component trees

#### Market.html

```
Main
├── PageHead (H1 "Market" + Refresh button)
├── StatsGrid                                  one-off
│   ├── BalanceCard "Fidelity Locked" (amber)
│   ├── BalanceCard "Total Liquidity"  (orange)
│   └── BalanceCard "Active Makers"    (blue)
└── Card "market-card"
    ├── CardHead
    │   └── MakerTabs (Good · Bad · Unresponsive) + TabMeta
    ├── CardBody
    │   └── Table[data-tab=…]
    │       ├── TableHead (sortable columns)
    │       └── TableRows
    │           ├── RowCheckbox       (Good tab only)
    │           ├── TorCell
    │           ├── ValueCell × N
    │           ├── FidelityBondCell  (Good tab; with mempool ext-link)
    │           └── CalcLink          → opens FeeModal
    └── CardFoot
        ├── FootMeta ("N selected")
        └── SwapSelectedButton

FeeModal (portal/overlay)
├── ModalHead (eyebrow + title + close)
├── ModalBody
│   ├── Field "Swap amount"   (NumberInput + maker range hint)
│   ├── Field "Locktime pos"  (NumberInput + locktime hint)
│   ├── FormulaBlock          (Total Fee = Base + … formula)
│   └── Breakdown
│       ├── BdRow "Base Fee"
│       ├── BdRow "Volume Fee"
│       ├── BdRow "Time Fee"
│       └── BdRow.total "Total Fee"
└── ModalFoot (note + UseMakerButton)
```

**Reusable:** `BalanceCard`, `Card`, `Pill`, `IconButton`, `Modal`, `Field`, `NumberInput`.
**One-off:** `MakerTabs`, `TorCell`, `FidelityBondCell`, `FormulaBlock`.

#### Swap.html

```
Main
├── PageHead (H1 "Initiate Swap" + subtitle)
└── SwapGrid (1fr · 360px)
    ├── Card "Initiate Swap"
    │   └── CardBody
    │       ├── Field "Amount to Swap"
    │       │   ├── SectionLabel
    │       │   ├── Hint
    │       │   ├── AmountInput (input + Sats/BTC seg)
    │       │   └── AmountMeta (conversion + UseMaxLink)
    │       ├── Field "Picker"
    │       │   ├── SectionLabel (with right-side count)
    │       │   ├── PickerTabs (Select UTXOs · Select Makers)
    │       │   ├── PickerPanel #utxoPanel
    │       │   │   ├── AmLinks (Auto / Manual)
    │       │   │   ├── AutoNote
    │       │   │   └── ManualPanel (list of UtxoItem)
    │       │   └── PickerPanel #makerPanel
    │       │       ├── AmLinks (Auto / Manual)
    │       │       ├── AutoNote
    │       │       └── ManualPanel (list of MakerItem)
    │       ├── Field "Number of Hops"
    │       │   ├── SectionLabel (with maker count)
    │       │   ├── WarnBanner ("Warning: …")
    │       │   ├── HopsGrid (5 HopButtons)
    │       │   └── HopHelp (contextual)
    │       ├── StartButton (block · disabled until valid)
    │       └── CtaHint
    └── RightColumn
        ├── BalanceCard "Swappable Balance" (blue accent)
        └── SummaryCard
            ├── SHead (h3 "Swap Summary" + EtaPill)
            ├── SBody (SRow × N)
            ├── FeeBlock (FeeRow × 3, last is `.total`)
            └── ReceiveStrip (highlighted "You receive")
```

**Reusable:** Same as Market plus `Seg`, `AmLinks`, `HopButton`, `WarnBanner`, `EtaPill`, `FeeBlock`.
**One-off:** `PickerTabs`, `UtxoItem`, `MakerItem`.

#### SwapProgress.html

A single React tree mounted via Babel-in-browser:

```
<Stage width=1920 height=1080 duration=18 loop=false>
  <Scene>
    <Background />               (radial blue glow + faint grid)
    <Chrome />                   (Coinswap brand + Mainnet pip)
    <TopBar />                   (eyebrow + phase title + ProgressBar)
    <Connector × 4 />            (between adjacent nodes)
    <TorCircuits />              (curved SVG arcs You→Makers, 3–6s)
    <CoinPackets />              (funding + routing packets)
    <Node × 5 />                 (You · M1 · M2 · M3 · Receiving)
    <ActivityLog />              (rolling 6-line mono log)
    <BottomStrip />              (Amount · Hops · Fee · Receive · ETA)
    <SuccessBurst />             (15s+: ripples + "Swap complete" badge)
  </Scene>
</Stage>
```

All children are reusable inside the engine but tied to this scene's data shapes.

#### SwapSuccess.html

```
Main (with .success-glow ::before)
├── PageHead
│   └── SuccessHead
│       ├── SuccessCheck (ripple ring)
│       ├── H1 "Swap Completed" (last word .accent-success green)
│       └── SuccessMeta (Settled pip + session id + block height)
└── SuccessGrid (1fr · 380px)
    ├── SummaryCard
    │   ├── CardBody
    │   │   ├── SecTitle "Swap Summary"
    │   │   ├── AmtHero (label + 54px mono val + sub + DurationPill)
    │   │   ├── ContractBlock
    │   │   │   ├── SecTitle "Transaction Artifacts"
    │   │   │   ├── Contract.in   (green accent + Copy + Mempool)
    │   │   │   └── Contract.out  (amber accent + Copy + Mempool)
    │   │   └── PartnersBlock
    │   │       ├── SecTitle "Swap Partners · N makers"
    │   │       └── PartnerRow × N
    │   └── CardFoot (ExportButton ghost, full-width)
    └── RightColumn
        ├── Card "Fee Details"
        │   └── FeeList (FeeRow × 2 + FeeRow.total + FeePctStrip)
        └── BackButton (primary blue, block)
```

**Reusable:** `Card`, `BalanceCard` (Swappable), `Pill`, `IconButton`, `FeeRow`.
**One-off:** `SuccessCheck`, `AmtHero`, `Contract`, `PartnerRow`, `FeePctStrip`.

---

## 3. Per-component specs

> All radii, colors, spacing, motion durations and easings come from the design tokens in `Design-System.md`. Hard pixel values are flagged as `[exact]`; everything else should bind to a token.

### 3.1 Shell + Titlebar + Sidebar

These are identical across all four HTML screens. Build once and import.

```ts
interface ShellProps {
  children: React.ReactNode;
  activeNavId: 'wallet' | 'market' | 'send' | 'receive' | 'swap' | 'recovery' | 'log' | 'settings';
  network?: { name: 'Mainnet' | 'Testnet' | 'Regtest'; version: string };  // default: Mainnet, v0.4.2
  flow?: 'wallet' | 'swap';   // applies the orange→blue token remap
}
```

| Property | Value |
|---|---|
| Outer container | `width: min(1320px, 100%)`, `border-radius: --r-shell`, `box-shadow: --shell-shadow` |
| Grid | `grid-template-columns: 68px 1fr` collapsed, `200px 1fr` expanded |
| Transition | `grid-template-columns 0.3s ease` |
| Titlebar | `42px` `[exact]` tall, absolute, 1px border-bottom |
| Sidebar | full height, 1px border-right, padding-top equal to titlebar |
| Brand mark | `30×30px`, `--r-card 9px`, bg `--orange` (or `--blue` if flow=swap) |
| Body bg | `--bg`, body padding `28px 24px 32px` |

**Sidebar nav item states:**
| State | Style |
|---|---|
| Default | text `--text-2`, no bg |
| Hover | bg `rgba(255,255,255,0.04)`, text `--text` |
| Active | bg `--orange` (or `--blue`), text `#fff` |
| Tooltip (sidebar collapsed) | shown via `::after` from `data-tip`; bg `--surface-3`, mono 10px uppercase, appears 12px to the right |

**Keyboard:** Tab order follows source order (titlebar → sidebar → main). Sidebar toggle is buttons; activate with Enter/Space.

### 3.2 Page Head

```ts
interface PageHeadProps {
  title: string;
  subtitle?: string;
  // optional right slot
  actions?: React.ReactNode;
}
```

Layout: flex row, baseline align, gap `24px`. H1: 34/700/`--tracking-tight`. Subtitle: 13/`--text-2`. Actions: flex row gap `10px`.

### 3.3 Button

```ts
interface ButtonProps {
  variant?: 'primary' | 'ghost';        // default primary
  size?: 'md' | 'sm' | 'block';          // default md
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClick?: (e: MouseEvent) => void;
  children: React.ReactNode;
}
```

| Size | Height | Padding | Font |
|---|---|---|---|
| `md` | `40px` | `0 20px` | sans `--fs-small/600` |
| `sm` | `30px` | `0 14px` | sans `--fs-btn-sm/600` |
| `block` | `46px` (Swap) / `48px` (Back to Swap) | full-width | sans `13.5/600` |

| State | Treatment |
|---|---|
| default (primary) | bg `--orange` / `--blue`, text white |
| hover | bg `--orange-hover` / `--blue-hover`, `translateY(-1px)` |
| active | no spec — keep hover bg, drop transform `[inferred]` |
| focus-visible | **MUST ADD**: 2px outline `--orange/--blue`, 2px offset, radius matches |
| disabled | bg `--surface-3`, text `--text-3`, no transform, `cursor: not-allowed` |
| loading | spinner replaces leading icon; button stays focused but `pointer-events: none` `[inferred]` |

Refresh-button special: hovering rotates its leading icon `60deg` over `--t-rotate`.

### 3.4 Card

```ts
interface CardProps {
  head?: { title?: string; eyebrow?: string; count?: number; actions?: React.ReactNode };
  foot?: { left?: React.ReactNode; right?: React.ReactNode };
  children: React.ReactNode;
}
```

Surface `--surface-2`, 1px `--border`, `--r-card`, no shadow.
`.card-head`: padding `16px 18px`, 1px bottom border.
`.card-body`: padding varies by screen (see component trees).
`.card-foot`: padding `12px 18px`, 1px top border, mono 10.5px uppercase meta.

### 3.5 Balance Card (`.bcard`)

```ts
interface BalanceCardProps {
  variant: 'orange' | 'blue' | 'green' | 'amber' | 'white' | 'purple' | 'hero';
  label: string;        // mono caps
  value: string;        // mono numeric
  unit?: string;        // appears as <small> after value
  sub?: string;
  share?: { pct: number; ofLabel?: string };   // hero only — 3px bar
}
```

Anatomy:
- 2px left `.accent-line` colored by variant
- `.label` mono 10.5px caps `--text-3`
- `.val` mono 28px / 600 / `-0.025em` (hero 54px / 700 / `-0.035em`)
- `.sub` sentence-case 12.5 `--text-2`
- **No icons. No vertical labels.** Banned.
- Hero variant only: gradient bg, share row with bar.

### 3.6 Maker Tabs (Market)

```ts
type MakerTabId = 'good' | 'bad' | 'unres';
interface MakerTabsProps {
  active: MakerTabId;
  counts: Record<MakerTabId, number>;
  onChange: (id: MakerTabId) => void;
}
```

Pill tabs. Default tab: text `--text-2`, transparent. Hover: text `--text`. Active: tinted bg using the tab's semantic color (good→green, bad→red, unres→amber) with matching border and fg.

### 3.7 Table

```ts
interface TableColumn {
  k: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right';
}
interface TableProps {
  columns: TableColumn[];
  rows: any[];
  renderRow: (row: any, i: number) => React.ReactNode;
  sticky?: boolean;       // default true
  sort?: { key: string; dir: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;   // toggles asc → desc → asc
}
```

- Grid layout (CSS Grid `grid-template-columns` per `data-tab`). Each row is a div, not `<tr>` — semantics provided via ARIA (see §7).
- Header is `position: sticky; top: 0` with `--surface-2` bg.
- Sortable header has `.sort-ic` (two stacked triangles). Active sort gets `--orange`/`--blue` and full-opacity triangle in the sort direction.
- Row default: `--surface-3` bg, 1px `--border`, `--r-row`.
- Row hover: `--surface-4` bg, `--border-strong`.
- Row selected (Good tab): `rgba(token,0.05)` bg, `rgba(token,0.45)` border. Selection state survives sort (track by maker `tor`, not index).

### 3.8 TorCell

```ts
interface TorCellProps { addr: string; }   // .onion address
```

Truncated to `addr.slice(0,10) + '…' + addr.slice(-12)` if longer than 28 chars. Mono 11.5px `--text-2`, title attribute = full addr.

### 3.9 FidelityBondCell (Market, Good tab)

```ts
interface FidelityBondCellProps { value: number; href: string; }
```

Mono value (muted) + 18×18 icon-button with external-arrow SVG → mempool link. Hover icon-button: color `--orange`/`--blue`, bg `rgba(token, 0.08)`.

### 3.10 RowCheckbox

```ts
interface RowCheckboxProps { checked: boolean; onChange: () => void; }
```

`16×16px`, `1.5px` border-strong, `5px` radius, bg `--surface-2`. Checked: bg `--orange`/`--blue`, white check SVG visible. Clicking anywhere on the row toggles (except calc-link / fb-link).

### 3.11 FeeModal (Market)

```ts
interface FeeModalProps {
  open: boolean;
  maker: Maker | null;
  onClose: () => void;
  onUseMaker: (maker: Maker) => void;
}
```

- Backdrop: `rgba(0,0,0,0.62)` + `backdrop-filter: blur(2px)`
- Open transition: opacity `0.2s` + transform `translateY(8px) scale(0.98)` → `0, 1`
- Width: 480px, max-width 100%
- `.formula-block`: orange tinted bg, 10px radius, mono 11.5px formula with `.fx-tot`, `.fx-eq`, `.fx-op` color tokens
- `.breakdown`: surface-3 inset, dashed dividers, last row is `.total` (orange/blue, 18px / 600)

**Keyboard:** Esc closes, Tab traps inside modal `[MUST ADD]`, click backdrop closes.

### 3.12 NumberInput (modal & swap)

```ts
interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  unit?: string;          // 'BTC', 'index', 'sats'
  min?: number;
  max?: number;
  step?: number;
  hint?: { left: string; right: string };
}
```

- `.input-wrap`: 8px radius, `--surface-3`, 1px `--border`; focus-within → `--border-strong`
- Spinners disabled via `-webkit-appearance: none`
- Hint row: mono 10.5px caption beneath input

### 3.13 Seg (Sats/BTC toggle)

```ts
interface SegProps<T extends string> { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; }
```

Inline-flex pill, `3px` padding, `--surface-2` inner, `1px --border`. Buttons: 6px 13px, mono 10.5px caps. Active: bg `--orange`/`--blue`, white text.

### 3.14 Picker Tabs (Swap)

```ts
interface PickerTabsProps { active: 'utxo' | 'maker'; counts: { utxo: number; maker: number }; onChange: (id: 'utxo' | 'maker') => void; }
```

Two large pill tabs in a `--surface-3` container with `4px` padding. Buttons `flex:1`, 8px 14px, 12.5/500 sans. Mono counter chip after label.

### 3.15 AmLinks (Auto / Manual)

```ts
interface AmLinksProps { value: 'auto' | 'manual'; onChange: (v) => void; }
```

Text links separated by faint slash (`opacity: 0.6` `--text-3`). Active link: text `--text`, `1.5px` underline `--orange`/`--blue`. Inactive: `--text-3`.

### 3.16 UtxoItem / MakerItem

```ts
interface Utxo {
  id: string;                    // 'txid…short'
  amt: number;                   // sats
  script: 'taproot' | 'segwit';
}
interface UtxoItemProps { utxo: Utxo; checked: boolean; onToggle: () => void; }
```

Grid layout: `auto 1fr auto auto` → checkbox · id · script-pill · amount. 10px radius, `--surface-2` bg. Checked variant: tinted bg/border.

```ts
interface Maker {
  tor: string;
  feeRate: number;
  fidelityBond: number;
  baseFee?: number;
  timeRate?: number;
}
interface MakerItemProps { maker: Maker; checked: boolean; onToggle: () => void; }
```

Grid `auto 1fr auto auto auto` → checkbox · truncated tor · "Fee 0.030" · "0.180 BOND".

### 3.17 HopButton

```ts
interface HopButtonProps { hops: 2 | 3 | 4 | 5 | 'custom'; active: boolean; onClick: () => void; }
```

5-col grid, `14px 8px 12px` padding, 10px radius. Number is mono 18/600. Sub label "Hops" / "Custom" is mono 9.5px 0.08em caps. Active: solid `--orange`/`--blue`, white.

### 3.18 WarnBanner / HopHelp

WarnBanner: amber `rgba(255,181,71,0.07)` bg, `0.28` border, 10px radius, padding 11×14, mono 11.5px, leading 14px AlertTriangle SVG. `<strong>` prefix is `font-weight:700` uppercase 10.5px.

HopHelp (default): mono 10.5px `--text-3`. HopHelp (warn, when hops=2): mono 10.5px amber, with leading AlertTriangle.

### 3.19 EtaPill

```ts
interface EtaPillProps { value: string; label?: string; }   // label default "Estimated Time"
```

Self-aligned pill, `rgba(blue,0.10)` bg, `0.28` border, blue mono 11.5/500. `.lbl` 9.5px 0.12em caps `rgba(125,163,245,0.85)`. `.v` mono `--blue`.

### 3.20 SummaryCard rows

```ts
interface SRowProps { label: string; value: React.ReactNode; muted?: boolean; }
```

Grid `1fr auto`, padding `9px 0`, dashed 1px divider between rows. Label 12.5/`--text-2`. Value mono 12.5px, right aligned. `.muted` → `--text-3`.

`SRow.makers` variant (multi-line value):
```ts
interface MakerListProps { tors: string[]; }   // shown as orange/blue mono items
```

### 3.21 FeeBlock / FeeRow

```ts
interface FeeBlockProps { rows: FeeRowProps[]; }
interface FeeRowProps {
  label: string;
  value: string;             // already formatted (e.g., "1,800")
  unit?: string;
  sub?: string;              // small line beneath value
  total?: boolean;
}
```

Inset surface-3 panel, padding `12px 14px`, dashed dividers. Last row (`.total`): 1px solid `--border-strong` top, larger value (`fee-row.total .v` = 18px/600 for Swap, 22px/600 for Success), value colored `--orange`/`--blue`.

### 3.22 ReceiveStrip

Highlighted bottom row of SummaryCard. `rgba(green,0.04)` bg, 1px top border `--border`. Label mono 10.5px caps `--text-2`. Value mono 22/600 `--green`. Unit `rgba(green,0.7)` 11px caps.

### 3.23 SuccessCheck (Swap Success)

```ts
interface SuccessCheckProps { state?: 'success' | 'pending' | 'error'; }
```

48×48px box, 14px radius, `rgba(green,0.12)` bg, `0.30` border, 24×24 stroke-3 check SVG, color `--green`, drop-shadow `0 0 24px rgba(green, 0.20)`. Wrapped in `::after` ripple: 1px `rgba(green, 0.18)` border, animates `scale(0.9→1.35)` + `opacity(0.8→0)` over `2.4s ease-out` infinite.

### 3.24 Contract row (Success)

```ts
interface ContractProps {
  direction: 'in' | 'out';
  txid: string;
  onCopy?: (txid: string) => void;
  mempoolHref?: string;
}
```

12px radius, surface-3, 1px border, padding `14px 16px`. 2px left accent-line: green for `in`, amber for `out`. Header row: 13/600 label + directional arrow icon (color matches accent) + IconButton group (Copy + Mempool). Txid: mono 12px `--text-2`, `word-break: break-all`.

**Copy interaction:** Calls `navigator.clipboard.writeText(txid)` with a `document.execCommand('copy')` fallback. Icon flips to check, button gets `.copied` class (green tint) for `1400ms` `[exact]`, then reverts.

### 3.25 PartnerRow

```ts
interface PartnerRowProps { index: number; tor: string; href: string; }   // "Maker 0N"
```

Grid `60px 1fr auto`, mono 11.5px, dashed bottom divider (except last). `.lbl` 10/0.1em caps `--text-3`. `.tor` ellipsis. `.ext` "View" link with arrow SVG, hover tinted blue.

### 3.26 IconButton

```ts
interface IconButtonProps {
  label: string;       // for aria-label / title
  href?: string;
  onClick?: () => void;
  size?: 26 | 22;      // default 26
  state?: 'default' | 'copied' | 'success' | 'error';
}
```

Square, 7px radius. Default: transparent. Hover: `rgba(255,255,255,0.04)` bg, `--border`, color `--text`. `.copied` state: green tinted.

### 3.27 SwapProgress components

Use the timeline engine from `animations.jsx`. Build scene components as small functions that consume `useTime()` or wrap in `<Sprite start end>`.

```ts
interface NodeProps {
  id: 'you' | 'm1' | 'm2' | 'm3' | 'dest';
  label: string;
  sub: string;                   // tor / addr fragment
  type: 'wallet' | 'maker';
  x: number;                     // center x
  index: number;                 // appearance stagger
}

interface ConnectorProps { fromIdx: number; toIdx: number; startAt: number; endAt: number; }

interface CoinPacketProps {
  from: { x: number; y: number };
  to:   { x: number; y: number };
  start: number; end: number;
  label?: string;
}

interface ActivityLogProps { lines: { at: number; tag: LogTag; text: string }[]; }
```

NodeStatus is a pure function of `(nodeId, t)` returning `{ label, tone, lock, check }`. Tones: `dim | green | blue | amber | red`. The function lives in `swap-progress.jsx`; copy its mapping when re-implementing.

---

## 4. Responsive behavior

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | `< 640px` | `[inferred — not in current CSS]` Stack everything, sidebar overlays as drawer, modal becomes bottom-sheet |
| Mobile-small | `≤ 720px` | Hops grid → 2 columns. UTXO toggle → 1 column. (Swap) |
| Mobile | `≤ 760px` | Stats grid → 1 column. Main padding `62px 18px 22px`. |
| Tablet | `≤ 1100px` | `swap-grid` and `success-grid` stack to 1 column. Stats grid 2-col with 3rd item spanning 2. |
| Desktop | `> 1100px` | Full multi-column layout. |

**Reflow rules per screen:**

- **Market table**: don't reflow — let it scroll horizontally inside the card via `overflow-x: auto`. Column widths defined by `data-tab` grid template.
- **Swap form**: at <1100px, summary card moves below the form card; the Swappable Balance card stacks above it.
- **Success page**: at <1100px, Fee Details + Back to Swap stack below Summary.
- **Swap Progress** (1920×1080 stage): Stage scales to fit viewport via the engine's auto-scale. Black letterboxing applied.

**What hides/resizes:**
- Sidebar: collapses to `68px` icon rail at any width if user toggles; tooltip on hover shows label.
- Titlebar: stays 42px tall.

---

## 5. Interactions & motion

| Trigger | Result | Duration | Easing |
|---|---|---|---|
| Sidebar toggle (button click) | grid-template-columns animates 68 ↔ 200 | `0.3s` | `ease` |
| Nav link hover | bg fades in | `0.15s` | linear |
| Nav link active | solid bg flip | `0.15s` | linear |
| Button hover | bg crossfade + `translateY(-1px)` | `0.15s` | linear |
| Refresh button hover | icon rotates `60deg` | `0.4s` | linear |
| Row hover | bg + border crossfade | `0.15s` | linear |
| Tab click | active state crossfade | `0.15s` | linear |
| Picker tab click | swaps visible panel (sets `hidden` attr) | instant | — |
| AmLinks click | active style swap | `0.15s` | linear |
| Pill / checkbox click | bg + border + check opacity | `0.15s` | linear |
| Sort header click | sort dir toggles asc→desc→asc | instant | — |
| Calculate link click | modal opens (opacity + transform) | `0.2s` | `ease` |
| Modal close (× / Esc / backdrop) | reverse open animation | `0.2s` | `ease` |
| Amount input | conversion + max link update; CTA enables/disables | live | — |
| Hops button click | active swap; help line updates; if hops=2 → warn class on `.hop-help` | `0.15s` | — |
| Start Swap click | navigate to `SwapProgress.html` (only if not disabled) | — | — |
| Copy button (Success) | copy txid → check icon → revert | `1400ms` hold | — |
| Back to Swap | clears `localStorage['coinswap:selectedMakers']`, navigates to `Swap.html` | — | — |
| Swap Progress complete | `setTimeout(18500ms)` → navigate to `SwapSuccess.html` | — | — |

### Keyboard

| Key | Context | Action |
|---|---|---|
| Tab / Shift+Tab | global | Standard focus traversal |
| Enter / Space | button | Activate |
| Esc | modal open | Close modal |
| Esc | scrubber focused (Swap Progress) | Stop playback |
| Space | Swap Progress | Play/pause |
| ← / → | Swap Progress | Seek ±0.1s (Shift+arrow = ±1s) |
| 0 / Home | Swap Progress | Reset to start |

**Missing today (must add):**
- Focus rings on every interactive element (`.btn`, `.tab`, `.nav a`, `.hop-btn`, `.utxo-item`, `.row-check`, `.calc-link`, `.icon-btn`).
- Focus trap inside `FeeModal`.
- Arrow-key navigation between picker tabs / maker tabs / hop buttons (left/right cycles).

---

## 6. Content & data

### 6.1 Maker (market dataset)

```ts
interface Maker {
  tor: string;                  // ".onion" address — unique
  baseFee: number;              // BTC
  feeRate: number;              // percent (e.g. 0.030 means 0.030%)
  timeRate: number;             // percent per block
  minSwap: number;              // BTC
  maxSwap: number;              // BTC
  fidelityBond: number;         // BTC
}

interface BadMaker {
  tor: string;
  reason: string;               // e.g. "Invalid fidelity proof"
  flagged: string;              // e.g. "12 h ago" — pre-formatted
  lastSeen: string;
}

interface UnresMaker {
  tor: string;
  lastTry: string;
  retries: number;
  timeout: string;              // e.g. "30 s"
}
```

### 6.2 UTXO (swap)

```ts
interface Utxo {
  id: string;                   // shortened "txid…suffix"
  amt: number;                  // sats
  script: 'taproot' | 'segwit';
}
```

### 6.3 Swap state (Swap page)

```ts
interface SwapState {
  unit: 'sats' | 'btc';
  activePicker: 'utxo' | 'maker';
  utxoMode: 'auto' | 'manual';
  makerMode: 'auto' | 'manual';
  hops: 2 | 3 | 4 | 5 | 6;       // 6 = custom
  amountSats: number;
  manualUtxos: Set<string>;      // utxo ids
  manualMakers: Set<string>;     // maker tor addresses
}
```

### 6.4 Cross-screen handoff

Selected makers persist via `localStorage`:

```ts
localStorage.setItem('coinswap:selectedMakers', JSON.stringify(string[]));
```

Swap.html reads this on mount. If non-empty: sets `makerMode='manual'`, `activePicker='maker'`, pre-populates `manualMakers`. SwapSuccess.html clears this key when "Back to Swap" is clicked.

### 6.5 Swap result (Success page)

```ts
interface SwapResult {
  sessionId: string;                 // "7fa2e1c8"
  block: number;                     // 824517 — settled at block
  amountSats: number;
  durationMs: number;
  contracts: {
    incoming: { txid: string; mempoolHref: string };
    outgoing: { txid: string; mempoolHref: string };
  };
  partners: { tor: string; mempoolHref: string }[];
  fees: { makerSats: number; miningSats: number; totalSats: number; pctOfAmount: number };
}
```

### 6.6 Loading / error / empty states

| Surface | Loading | Empty | Error |
|---|---|---|---|
| Market table | Skeleton rows × 6 with shimmer `[MUST ADD]` | Empty-state component (icon + headline + reasons + Refresh) | Same as empty, with red copy and "Retry" button |
| Stats grid | Skeleton blocks per card | Show "—" placeholder | n/a |
| FeeModal | Spinner inside breakdown rows | n/a | Inline mono red "Calculation failed · Retry" |
| Swap amount | Inline mono `--text-3` "Loading wallet…" `[inferred]` | "Use max swappable: 0 sats" | Red caption "Wallet locked · Unlock to swap" |
| Manual UTXO list | Skeleton rows × 4 | "No UTXOs available" + Receive link | Red caption |
| Manual Maker list | Skeleton rows × 4 | "No makers in market" + Refresh | Red caption |
| Swap Progress | n/a — fully scripted animation | n/a | If real RPC fails: replace TopBar with red status, freeze nodes, show Retry button |
| Success page | n/a — final state | n/a | Replace with `SwapFailed.html` `[future work]` |

### 6.7 Content limits

| Field | Max | Truncation rule |
|---|---|---|
| Tor address | ~62 chars | Shown as `slice(0,10) + '…' + slice(-12)`; title attribute carries full |
| Txid (Success contract row) | 64 chars | Full display with `word-break: break-all` — no truncation |
| Maker label in summary list | shown full-truncated to ~22 chars | Same rule as Tor address |
| Activity log line | 60 chars target | Hard truncate via CSS `text-overflow: ellipsis`; full line in title attr |
| Amount input | numeric only | Strips commas; rejects non-numeric |

---

## 7. Accessibility

### Semantic structure

| Visual | Element |
|---|---|
| Sidebar | `<aside>` |
| Nav inside sidebar | `<nav><ul role="list"><li><a>…` |
| Cards | `<section>` for top-level, `<article>` only if standalone (none currently) |
| Page head H1 | `<h1>` exactly once per route |
| Card title | `<h3>` |
| Sub-section inside card | `<h4>` |
| Maker list table | `role="table"` on container, `role="row"` / `role="columnheader"` / `role="cell"` on grid items (because the layout uses CSS Grid, not `<table>`). Or convert to `<table>` for free a11y. |
| Modal | `role="dialog" aria-modal="true" aria-labelledby="modalTitle"` |
| Tabs | `role="tablist"` on container, `role="tab" aria-selected aria-controls` on each, `role="tabpanel"` on panels |
| Status pill / pip | wrap label with `aria-label`; the colored dot is `aria-hidden` |
| Activity log (Swap Progress) | container `role="log" aria-live="polite" aria-atomic="false"` |
| Decorative chrome (titlebar lights, brand mark, glow div) | `aria-hidden="true"` |

### ARIA labels to add

- Sidebar toggle buttons: `aria-label="Collapse sidebar"` / `Expand sidebar` (✅ already set as `title`; mirror to `aria-label`).
- Copy buttons: `aria-label="Copy transaction id"`; on success, `aria-live` region or visually-hidden text "Copied" `[MUST ADD]`.
- Mempool external link: `aria-label="View on mempool.space (opens in new tab)"`. `target="_blank" rel="noopener noreferrer"` `[MUST ADD]`.
- Refresh button: `aria-label="Refresh maker list"`.
- Modal close: `aria-label="Close"`.

### Focus management

- On modal open: move focus to the first form input (`#swapAmount`).
- On modal close: return focus to the trigger (the `.calc-link` that opened it).
- On tab switch: leave focus on the tab; the previous panel's focused element becomes inert.
- On navigation between pages: focus moves to `<h1>` `[MUST ADD]` — apply `tabIndex="-1"` to h1 and call `.focus()` on mount.

### Contrast

See `Design-System.md` §10 contrast table. Action items:
- `--text-3` is AA-Large only — never use for body. It's currently only on ≥9.5px mono caps (OK).
- Orange/blue on tinted bg is AA Large; pills (mono caps 9.5px) are uppercase which boosts perceived readability, but **don't use orange text on `--surface-2` at body sizes**.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` `[MUST ADD]`:
- Disable pulse-dot animation on `.dot`, `.success-check::after`.
- Cap Swap Progress engine to first frame: render the diagram in its final state.
- Disable refresh icon rotation.

---

## 8. Assets

### Icons (line, currentColor)

All icons are inline SVGs in the current markup. For a component library, package them as React components or sprite map.

| Name | Used on | Stroke |
|---|---|---|
| `chevron-left` | Sidebar collapse | 2 |
| `menu` | Sidebar expand | 2 |
| `wallet` | Sidebar Wallet | 1.6 |
| `bar-chart` | Sidebar Market | 1.6 |
| `arrow-up-right` | Sidebar Send, Outgoing contract | 1.6 / 2 |
| `arrow-down-left` | Sidebar Receive, Incoming contract | 1.6 / 2 |
| `swap` | Sidebar Swap | 1.6 |
| `shield-check` | Sidebar Recovery | 1.6 |
| `log` | Sidebar Log | 1.6 |
| `settings` | Sidebar Settings | 1.6 |
| `refresh` | Refresh buttons | 2 |
| `external-link` | Mempool link, Maker View | 2 |
| `copy` | Copy txid | 2 |
| `check` | Selected row, copied state, success | 3 |
| `lock` | HTLC locked status | 2 |
| `clock` | Duration pill | 2 |
| `alert-triangle` | Warning banner, hop=2 hint | 2 |
| `x` | Modal close | 2 |
| `download` | Export report | 2 |
| `bolt` | Auto select | 2 |
| `clipboard-check` | Manual select | 2 |
| `onion` (custom) | Maker node in animation | 1.6 |
| `info` (small dot) | Empty-state mark | 1.6 |

**Format:** Inline SVG (currentColor) preferred. If exported, ship as a single `.svg` sprite or icon font.
**Sizing:** 16 (sidebar), 14 (button), 13 (icon-btn), 11–13 (inline link arrows), 22–24 (hero contexts).

### Images / illustrations

None. The design intentionally avoids decorative imagery.

### Brand

- "C" wordmark — recreated as a 30×30 rounded square with mono `C` glyph. No raster logo asset.
- Replace with proper SVG logo when available; should sit at the same 30×30 footprint with 9px radius.

---

## 9. Edge cases

| Case | Behavior |
|---|---|
| Long maker `.onion` (>62 chars) | Truncate via slice rule; full in title attr |
| Long txid (Success contract) | `word-break: break-all`; renders on 2 lines without overflow |
| Zero makers in active tab | Empty-state with title + why + reasons list + Check connection / Refresh actions |
| Zero UTXOs available | Manual UTXO list shows empty state; auto mode shows "No funds available" + Receive button |
| Amount > swappable | Inline red hint under input; Start Swap disabled with "Amount exceeds swappable balance" |
| Manual UTXOs < amount | Start Swap disabled with "Selected UTXOs are less than swap amount" |
| Manual makers count > hops | Allow; treat as "preferred pool", actual route still uses `hops` count. Show "Picked from N selected" in summary `[future polish]` |
| Hops = 2 | Show amber warning under hop selector; do not block submit |
| Tor circuit fails mid-progress | Stop animation, switch TopBar to red status, freeze nodes, show "Retry" button `[future]` |
| Maker rejects funding | Pause animation at funding phase, set offending node to red, surface error in log, offer "Resume with different maker" `[future]` |
| Clipboard API unavailable (no HTTPS) | Fall back to `document.execCommand('copy')` (already implemented) |
| Mempool ext-link in offline mode | Add `aria-disabled="true"` and don't navigate `[future]` |
| User refreshes Swap Progress mid-run | Auto-clears persisted scrub position (already implemented); animation restarts from t=0 |
| User pastes BTC into Sats-mode amount input | Treats as Sats integer; user must toggle unit (no auto-detection) |
| Sort + selection interaction | Selection state survives sort via `tor` identity (already implemented) |
| Multiple maker selection then navigation | Persisted via localStorage; cleared on Back to Swap |
| Skewed locale (non-US numbers) | `Intl.NumberFormat('en-US')` is hard-coded. Switch to user locale `[future]` |
| Modal open during table sort | Modal traps focus; sort still possible via header click but discouraged |

---

## 10. Implementation notes

### Suggested file/folder structure

```
src/
  styles/
    tokens.css                # CSS custom props from §9 of Design-System.md
    base.css                  # reset, body, scrollbar
    shell.css                 # shell + titlebar + sidebar
    components/
      button.css
      card.css
      bcard.css
      pill.css
      table.css
      modal.css
      ...
    pages/
      market.css
      swap.css
      swap-progress.css
      swap-success.css
  components/
    Shell.tsx
    Titlebar.tsx
    Sidebar.tsx
    PageHead.tsx
    Button.tsx
    Card.tsx
    BalanceCard.tsx
    Pill.tsx
    Modal.tsx
    Table.tsx
    UtxoItem.tsx
    MakerItem.tsx
    HopButton.tsx
    EtaPill.tsx
    WarnBanner.tsx
    SummaryCard.tsx
    FeeBlock.tsx
    Contract.tsx
    PartnerRow.tsx
    SuccessCheck.tsx
    icons/                    # one tsx per icon
  hooks/
    useSwapState.ts
    useMakers.ts
    useLocalStorage.ts
  pages/
    market/index.tsx
    swap/index.tsx
    swap/progress.tsx
    swap/success.tsx
  features/
    animation/
      Stage.tsx               # ported from animations.jsx
      Sprite.tsx
      easing.ts
      interpolate.ts
    swap-scene/
      Node.tsx
      Connector.tsx
      CoinPacket.tsx
      ActivityLog.tsx
      TorCircuits.tsx
      data.ts                 # NODES, PHASES, LOG_LINES
  lib/
    format.ts                 # fmtSats, fmtBTC, truncTor
    api.ts                    # mock RPC client
```

### Libraries

| Need | Recommendation |
|---|---|
| Routing | `react-router-dom` v6+ — four routes, none nested |
| State | React `useState` + `useContext` for swap-state; `zustand` only if more screens added |
| Animation engine | Keep the in-tree `animations.jsx`. Don't pull `framer-motion` for this — the engine is purpose-built and ~700 LOC |
| Clipboard | Built-in `navigator.clipboard` with fallback (already implemented) |
| Date / time | `date-fns` if real timestamps needed; current data is pre-formatted |
| BigNumber | `bignumber.js` once real sats arithmetic is in play (current code uses plain numbers; safe up to `Number.MAX_SAFE_INTEGER` for sats, but BTC math at 8dp is risky) |
| Forms | None — controlled inputs only; validation is inline |
| Icons | None — keep inline SVGs |
| Testing | Vitest + Testing Library + Playwright for E2E flows |

### Tricky things to know upfront

1. **Token remap for blue flow.** Don't write blue-specific CSS variables; remap `--orange` instead. Apply `[data-flow="swap"]` at the body or route root.

2. **Modal portal.** The current implementation renders the modal inside the body (`#modalBackdrop` at root). When porting, render via React portal to avoid z-index conflicts with the shell's `box-shadow` and the titlebar (z-index 5). Modal stacking context starts at z-index 100; bump to 1000 if any toasts/popovers are added.

3. **Animation engine assumes a stable mount.** It persists scrubber position to `localStorage[persistKey + ':t']`. On the Progress page, we explicitly clear this on mount so the animation always restarts from `t=0`. If you change the flow (e.g., add a confirm screen before progress), make sure that reset still happens, or the auto-navigate `setTimeout(18500ms)` fires before the animation has a chance to play.

4. **`setTimeout` for auto-navigate is fragile.** If you replace it with proper React Router navigation, drive it from a `useEffect` watching `time >= TOTAL - 0.5` inside a Sprite. Don't double-fire on remounts.

5. **`localStorage['coinswap:selectedMakers']` is the single cross-page handoff.** Don't add more — promote to URL params or context as soon as a second flow needs handoff.

6. **Sorting + selection.** Selection state is keyed by maker `tor`; row index changes when sorting. If you switch to indexes you'll break selection retention. Same for UTXOs (keyed by `id`).

7. **Sticky table header.** The header uses `position: sticky; top: 0` inside `.scroll`. Z-index is 2 to clear regular rows; bump higher if you add row hover popovers.

8. **Scrollbar styling is WebKit-only.** `::-webkit-scrollbar` rules don't work in Firefox. If Firefox support matters, add `scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent;`.

9. **The Swap form recompute is sync and runs on every input event.** That's fine for the current data sizes (≤8 UTXOs, ≤8 makers). If you wire to real backend data with hundreds of items, debounce or move heavy work to a worker.

10. **Babel-in-browser is for prototype only.** `SwapProgress.html` ships `@babel/standalone` for development. Compile JSX at build time for production — the file size is 1MB+ unminified and adds a parse cost.

11. **The "Calculate" link in maker rows uses `event.stopPropagation()`** to avoid toggling the row checkbox. Preserve this when restructuring; same for `.fb-link` (Fidelity Bond mempool link).

12. **macOS chrome.** The traffic-light dots and titlebar are visual chrome only — not Electron / native. If embedding in Electron, hide these and use real OS chrome instead. Detect via `window.electronAPI` or a build flag.

13. **`prefers-reduced-motion`** is not yet wired. Add a media-query block that disables pulse/ripple/refresh-rotate and clamps Swap Progress to the final frame. The animation engine should also short-circuit `useTime()` to `TOTAL` when this preference is set.

14. **Right-to-left languages** — the design assumes LTR. Mirror sidebar, swap arrows, and row layouts when adding RTL.

---

## Appendix: cross-screen state machine

```
       ┌─────────┐   click Swap-with-selected
       │ Market  │ ───────────────────────────►┐
       └────┬────┘                              │
            │ sidebar Swap                      │
            ▼                                   ▼
       ┌─────────┐                       ┌─────────────────────┐
       │  Swap   │ ◄──── localStorage ◄──┤ maker-handoff       │
       └────┬────┘                       │ ['…tor1', '…tor2']  │
            │ click Start Swap           └─────────────────────┘
            ▼ (only if validate)
   ┌────────────────┐
   │ SwapProgress   │  setTimeout(18.5s)
   └────────┬───────┘
            ▼
   ┌────────────────┐
   │ SwapSuccess    │
   └────────┬───────┘
            │ click Back to Swap
            │ clears localStorage['coinswap:selectedMakers']
            ▼
       ┌─────────┐
       │  Swap   │
       └─────────┘
```

That's the full handoff. Anything ambiguous, ask before guessing.
