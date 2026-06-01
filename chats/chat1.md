# Style Guide Review

_Started 2026-05-18 21:32 UTC_

---

## User

these are the style you need to follow. go through it

## Assistant

_[tool: read_file]_

_[tool: read_file]_

I've read through both documents. Here's a tight summary of what I'll be working with:

**Coinswap Taker** — dark macOS-styled desktop Bitcoin wallet for power users. The visual language is mono/CLI-heavy.

**Key system rules I'll follow:**

- **Flow theming**: Wallet flow = orange (`#E85002`), Swap flow = blue (`#5B8DEF`) — applied via `[data-flow="swap"]` token remap
- **Surfaces**: dark stack — `#08080a` bg → `#101014` shell → `#16161a` cards → `#1c1c22` insets. Cards are **flat** (no shadows except on the shell)
- **Type**: SF Pro sans for UI, SF Mono for *data-shaped* content (addresses, txids, amounts, eyebrows, timestamps, pills). 34/700 H1, 54/700 hero mono, 13/500 body
- **Semantic colors** are strict: green = success/incoming, red = outgoing only, amber = unconfirmed/warning, blue = swap/SegWit/info, purple = Taproot
- **Tint recipe**: `rgba(token, 0.10)` bg + `rgba(token, 0.28)` border for pills/chips/panels
- **Identity**: 2px left accent-line on `.bcard` and `.contract` rows
- **Banned**: drop shadows on cards/rows/buttons/pills, decorative gradients (only hero card + progress bars), icons inside balance cards/filter tabs/pills, emoji, italics outside the welcome-H1 last-word treatment, red outside outgoing tx, purple outside Taproot
- **Iconography**: line SVGs only, currentColor, 1.6 stroke for chrome / 2 for actions / 3 for hero check
- **Motion**: 0.15s hover crossfades, 0.3s sidebar, 0.4s refresh rotate, `easeOutBack` entrances, primary buttons lift 1px on hover

**Four target screens**: Market (orange) → Swap → Swap Progress → Swap Success (all blue). Cross-screen handoff via `localStorage['coinswap:selectedMakers']`.

Ready when you are. What would you like me to design — a specific screen, a variation of one, a new screen in the same system, or something else?

## User

okay so this is the current design. don't tske any inspiration from this this is for you understanding data and layout. 

i've a wireframe which i'll share next. don't design anything. just have a look

## Assistant

_[tool: view_image]_

Got it. I've reviewed the current Coinswap Maker Dashboard. Here's what I'm taking away as **data and layout context only** (not visual inspiration):

**Screen purpose:** Maker-side dashboard (the other side of the Taker flow in the design system). Operator manages multiple Coinswap maker instances they're running.

**Information architecture I'm noting:**

1. **Top metrics row** (4 cards):
   - Total Spendable (BTC value across all makers)
   - System Health (X/Y makers online)
   - Running count (with stopped count as sub)
   - Net Earnings (BTC + fiat + swap count)

2. **"Your Makers" section**:
   - Filter tabs (All / Running)
   - "+ Add New Maker" CTA
   - Maker cards grid showing per-maker:
     - Name + Running pill (status dot)
     - Tor Address (mono, truncated)
     - Data Directory (filesystem path, mono)
     - Balance grid: Spendable / Regular / Swap / Fidelity (all BTC, mono)
     - Manage (primary) + Stop (ghost) actions

3. **Recent Activity** panel (empty state: "No completed swaps yet")

**Network indicator:** "signet" badge top-right (vs the Taker's "Mainnet").

**Key delta from Taker flow:** This is operator/ops-focused — multi-instance management, health monitoring, earnings tracking — vs Taker which is transactional (initiate one swap). Same design system, but the primary nouns are *makers* (long-lived processes) instead of *swaps* (one-off transactions).

Ready for the wireframe. Share it when you're ready and I'll just review — no design output until you say so.

## User

here is the wireframe. ask what you don't understand

## Assistant

_[tool: view_image]_

Wireframe reviewed. Here's my read of the structure and the questions I have before designing:

**What I see in the wireframe:**

- **Top bar**: "Maker app" title (left), "Segwit" network indicator (right) — no macOS chrome / sidebar shown
- **Top-right metrics**: only 2 cards now (Spendable, Net Earnings) — simpler than the existing screenshot's 4 cards
- **"Makers" section**: H2 + segmented filter tabs (All / Running) on the left, "+ Add new maker" on the right
- **Maker cards**: 3-up grid with status dot + name, full tor address, 2×2 balance grid (Spendable / Regular / Swap / Fidelity), single Manage button — note: **no Stop button**, no Data Directory row, no per-card "Running" pill from the previous design
- **Recent activities**: section header, content not yet defined

**Questions before I design:**

1. **Shell chrome** — The wireframe is a flat page (no macOS titlebar, no sidebar). Do you want me to:
   - (a) keep it flat/no-chrome as drawn, OR
   - (b) wrap it in the same shell + sidebar pattern as the Taker app (so Maker and Taker feel like one product family)?

2. **Network indicator** — "Segwit" is shown top-right. Segwit is a script type, not a network. Should this read "Signet" (testnet variant, as in your reference screenshot) or stay as "Segwit"? I'll assume **Signet** unless you say otherwise.

3. **Manage button** — In the wireframe it looks neutral/ghost-styled. Should Manage be the **primary action** (orange-filled, per design system) or a quieter ghost button? And is **Stop** gone for real, or do you want it back as a secondary action next to Manage?

4. **Maker card content** — Drop the Data Directory row entirely as shown? Or keep it tucked under the tor address?

5. **Per-card status pill** — Should each card still show a "Running / Stopped" pill (top-right of card), or is the leading status dot enough?

6. **Recent activities** — what goes here? Completed swaps list (timestamp · counterparty · amount · txid)? Empty state for now? How many rows visible by default?

7. **Flow color** — Maker app is operator-side; design system only specifies orange (wallet) vs blue (swap). Should the Maker app stay **orange** (it's wallet-adjacent), or get its own treatment?

8. **Tweaks** — any specific aspects you want exposed (e.g. card density, status-pill visibility, accent color, # of metric cards), or should I pick a few?

9. **Variations** — do you want **one polished design**, or multiple variations of the dashboard layout / maker-card style to compare?

10. **Hi-fi target** — should this be presented as a working interactive prototype (clickable tabs, hover states, Manage flow stub) or a static hi-fi layout for now?

## User

1. no sidebar for this one
2. it's signet
3. mange is primary action and stop is gone
4. drop it
5. the dot is enough, make it noticible 
6. decide for me 
7. orange
8. ?
9. one
10. interactive

## Assistant

_[tool: update_todos]_

Clear plan. Let me lay out my approach, then build.

**Design system commitment:**
- Orange-primary wallet flow (`#E85002`)
- Dark stack: `#08080a` page → `#16161a` cards → `#1c1c22` insets
- Flat cards, 1px borders, no shadows
- SF Pro sans for UI, SF Mono for data (tor addresses, BTC amounts, eyebrow labels)
- 2px left accent-line on metric cards (per `.bcard` pattern)
- Status dot with `box-shadow: 0 0 8px var(--green)` glow per spec

**Tweaks I'll expose:**
1. Maker count (3 / 4 / 5) — see how layout reflows
2. Card density (Comfortable / Compact)
3. Recent Activity state (Populated / Empty)
4. Theme accent (Orange / Blue — design-system remap)

**Interactivity:**
- Filter tabs (All / Running) live-filter the grid
- "+ Add new maker" opens a modal with form
- Manage opens a side drawer with maker details + Stop/Restart/Edit controls
- Status dot pulses; hover reveals tooltip with uptime
- Copy tor address on click

Let me set up.

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: write_file]_

Good — tweaks panel is in. Now I'll scaffold the main HTML and component files.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built. Live at **Maker Dashboard.html**.

**What's in it:**
- Top band: brand mark + H1 + subtitle, Signet network pill (amber, glowing pip)
- Two metric cards: Spendable (orange) + Net earnings (green) — both use the 2px accent-line `.bcard` pattern
- Makers section: H2 + filter tabs (All / Running / Stopped, with counts) + "Add new maker" CTA
- Maker cards: pulsing status dot (green=running, amber=warming, dim=stopped), full tor address with copy button, 2×2 balance grid (Spendable orange / Regular / Swap / Fidelity purple), uptime + Manage CTA
- Recent activity: 6 swap events with timestamp, direction arrow, maker, counterparty tor, sats earned, swap pill

**Interactions:**
- Filter tabs live-filter the grid
- Click tor address copy icon → check icon + green tint for 1.4s
- "Add new maker" opens a modal — name / port / fidelity → creates a card that warms up then transitions to running
- "Manage" opens a right-side drawer with full stats, Stop/Restart (or Start, if stopped), and a Danger zone for delete
- Esc + backdrop close both modal and drawer

**Tweaks** (toggle from toolbar):
- Maker count (1–5)
- Card density (comfortable / compact)
- Activity state (populated / empty)
- Accent (orange / blue — design-system flow remap)

Tell me what to adjust.

## User

few changes:
1. the 2 boxes spendable and net earnings shouldn't be this big. make it small in the side as per wireframes. 
2. the maker boxes are not aligned with the rest. make it aligned

## Assistant

_[tool: str_replace_edit]_

Got it — moving the metric cards up-right into the top band and making them compact. Let me also check the maker-card alignment.Now update the App to put the metric cards inside the top-band on the right (below the network pill) instead of in a separate strip below.

_[tool: str_replace_edit]_

_[tool: done]_

Updated:
1. **Metric cards** moved into the top-right corner (under the Signet pill), compact 18px value + small sub — matches the wireframe's small side-cards
2. **Maker grid** now spans the page width consistently with the section head and activity card (all anchored to the same 32px page padding)

## User

correct the alignment of the makers to the rest of the designs and show signet on left corner

## Assistant

## Assistant

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: save_screenshot]_

## Assistant

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Done:
- **Signet pill** moved to the top-left as a small eyebrow above the brand mark + title
- **Maker grid** now stays as 3 columns down to ~980px and aligns flush with the page padding, metric strip, and section head
- Trimmed the responsive collapse so the desktop layout holds at typical widths instead of stacking too early

## User

no reduce the width of all marker cards such that it aligns with recent activities cards and make the coinswap marker in all caps

## Assistant

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: show_html]_

_[tool: str_replace_edit]_

_[tool: done]_

Got it. Making maker cards more compact and aligning both rows to a tighter inner width.Done:
- **COINSWAP MAKER** now uppercase with slight positive tracking to keep it readable at 34px
- Maker grid, section head, and Recent Activity card all constrained to the same **1040px** max-width and left-aligned, so the three rows sit on a clean column

## User

now align it with net earning card

## Assistant

_[tool: str_replace_edit]_

_[tool: done]_

Done — maker grid and activity card now extend to the full page width, right edges aligned with the Net earnings card.

## User

okay now make new page 'add marker' 

okay so this is the current design. don't take any inspiration from this this is for you understanding data and layout. 

i've a wireframe which i'll share next. don't design anything. just have a look.

## Assistant

Reviewed the four screenshots. Here's what I'm taking away as **data and structural context only** (not visual inspiration):

**Page header**
- Back chevron + "Add New Maker" H1
- Subtitle: "Configure a new maker instance"

**Form sections** (each in its own card):

1. **Basic Information**
   - Maker ID * (text — e.g. `maker-1`) — *Unique, used in all API calls, cannot be changed later*
   - Data Directory (text — e.g. `~/.coinswap/maker1`) — defaults to `~/.coinswap/<id>`
   - Maker Password (optional, masked with eye toggle) — protects the maker's wallet

2. **Bitcoin Connection**
   - Bitcoin RPC Endpoint * (host:port — `127.0.0.1:38332`)
   - RPC Username * + RPC Password * (side-by-side, password masked with eye)
   - ZMQ Endpoint * (`tcp://127.0.0.1:28332`)

3. **Tor Configuration**
   - Note: "Ports must match your Tor instance. Auth password is required if your Tor control port uses `HashedControlPassword`."
   - SOCKS Port (`9050`) + Control Port (`9051`) side-by-side
   - Tor Auth Password (optional, masked)

4. **Maker Network Ports**
   - Note: "Ports this maker listens on. Must be unique across all makers."
   - Network Port (`6106`) + RPC Port (`6107`) side-by-side
   - Required Confirmations (`1`)

5. **Pre-checks** (list of testable items)
   - Empty radio/circle on left, "Click to test" link on right, title + description in middle, then a mono code block showing the test command/snippet
   - 5 items: Bitcoin Core synced, RPC enabled, REST enabled, ZMQ configured, Tor running

**Footer**
- Cancel (ghost) + Add Maker (primary, full-width split)
- Info callout: "Before adding a maker: …" bullet list (Bitcoin Core synced, unique ID, RPC creds required, ZMQ matches Bitcoin Core)

**Got it.** Ready for the wireframe — share it whenever and I'll just review, no design yet.

## User

this is full one page

## Assistant

Got it — all four screenshots are one continuous scrolling page (header → Basic Info → Bitcoin Connection → Tor Config → Maker Network Ports → Pre-checks → footer with Cancel/Add Maker + info callout).

Waiting on the wireframe.

## User

here is the wireframe. ask what you don't understand

## Assistant

Wireframe reviewed. Here's my read + questions:

**Layout I see:**
- "Add new maker" H1 (no back chevron in wireframe — should I add one?)
- **Basic Info** — full-width card
- **Bitcoin connection** + **Tor configuration** — 2-column row (50/50)
- **Maker network ports** — full-width card
- **Pre-check** — full-width card with 5 circular pills/items on the left and a **"Test all"** button anchored bottom-right
- Footer: **Cancel** (ghost) on left, **Add maker** (primary) on right — both wide

**Questions:**

1. **Back to dashboard** — wireframe shows no chevron. Should I add a small "← Back" link at the top, or skip it entirely?

2. **Network pill** — Do you want the Signet pill at the top-left like the dashboard, or hide it on this page?

3. **Pre-check layout** — In the wireframe the 5 items are just circles stacked vertically with "Test all" bottom-right. In the existing design (4th screenshot) each item had a title, description, and a code block. Should I:
   - (a) keep it minimal — just a row per check with a label + status dot + small "Test" link (matches the wireframe's stripped-down feel), OR
   - (b) include the description + code block per row (matches the data context you shared)?

4. **"Test all"** button placement — bottom-right inside the Pre-check card. Confirmed. After clicking, should each circle animate to a checkmark/cross one-by-one (live status feedback), or all at once?

5. **Field validation** — required fields marked with `*`? Inline red error on blur? Or just enable/disable "Add maker" button based on validity?

6. **Info callout** at the bottom — the existing design had a blue "Before adding a maker:" callout under the footer. Wireframe doesn't show it. Drop it?

7. **Maker Password / RPC Password / Tor Auth Password** — keep the eye-toggle to show/hide for these masked fields?

8. **Cancel** — should this go back to dashboard, or open a confirmation if fields are dirty?

9. **Add maker** — on submit: show a loading state on the button → run pre-checks if not run → success → navigate back to Dashboard with the new maker showing as "warming"? Or just immediate success?

10. **Tweaks** — same scope as before (a couple of useful toggles like pre-check state: idle / running / passed / failed)? Or skip tweaks on this page?

## User

1. yes add the back chevron
2.  i want but on right corner
3. (a) match the wireframe
4. each circle animate to checkmark
5. inline red error with an errror message
6. show all the info
7. yes
8. open a confirmation
9. loading state and show warming 
10.  okay

## Assistant

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

Got it. I'll build this following the existing Coinswap design system (orange/blue tokens, mono for data, flat cards) — not introducing a new aesthetic. Building now.

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: done]_

Now wire the Dashboard to:
1. Navigate to Add Maker.html on the "Add new maker" click
2. Pick up the new maker from localStorage and show it as warming → running

_[tool: save_screenshot]_

_[tool: view_image]_

Looks clean. **Add Maker.html** is live with everything wired up:

**Page structure (matches your wireframe):**
- Back chevron + "ADD NEW MAKER" + subtitle (left)
- Signet pill (top-right)
- **Basic info** (full-width)
- **Bitcoin connection** + **Tor configuration** (2-col)
- **Maker network ports** (full-width)
- **Pre-checks** with 5 items + "Test all" button bottom-right
- **Cancel / Add maker** footer (50/50)
- Info callout listing the prereqs

**Interactions wired:**
1. Back chevron and Cancel both → confirmation modal if any field is dirty, else go straight to Dashboard
2. Validation runs live; red border + inline error message under each invalid field (only after blur or submit attempt)
3. Password fields have eye-toggle to show/hide
4. **Pre-checks**: click any "Click to test" → spinner → checkmark pops in (or red X on fail). "Test all" runs them staggered with a 220ms cascade. Footer summary shows pass/fail counts with glowing pips.
5. **Add maker** → loading spinner → persists new maker to `localStorage["coinswap:newMaker"]` → redirects to Dashboard, where it appears as "warming" and promotes to "running" after a beat
6. Dashboard's "Add new maker" button now navigates to this page

**Tweaks:**
- Pre-check state (idle / running / all-passed / mixed)
- Show info callout (on/off)
- Accent (orange / blue)

## User

make the headings like 'basic info' , 'bitcoin connection' and everything a little different from the input card titles. maybe a 1 size up

## Assistant

_[tool: str_replace_edit]_

_[tool: done]_

Bumped section headings to 18px / 600 with -0.02em tracking — clearly distinct from the 12px field labels now.

