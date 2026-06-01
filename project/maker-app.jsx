// maker-app.jsx — root app + Tweaks integration

const { useState: useStateA, useMemo, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "makerCount": 3,
  "density": "comfortable",
  "activity": "populated",
  "accent": "orange"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // ── Apply theme remap based on accent tweak ─────────────────────────────────
  useEffectA(() => {
    document.body.dataset.flow = t.accent === "blue" ? "swap" : "wallet";
  }, [t.accent]);

  // ── Maker state ─────────────────────────────────────────────────────────────
  const initialMakers = useMemo(() => MAKERS_BASE.slice(0, t.makerCount), [t.makerCount]);
  const [makers, setMakers] = useStateA(initialMakers);

  // Pick up a new maker created on Add Maker page (via localStorage handoff)
  useEffectA(() => {
    try {
      const raw = localStorage.getItem("coinswap:newMaker");
      if (!raw) return;
      const m = JSON.parse(raw);
      localStorage.removeItem("coinswap:newMaker");
      setMakers((prev) => {
        if (prev.some((p) => p.id === m.id || p.name === m.name)) return prev;
        return [...prev, m];
      });
      // promote warming → running after a beat
      setTimeout(() => {
        setMakers((prev) => prev.map((x) => x.id === m.id
          ? { ...x, status: "running", uptime: "00:01:08" }
          : x));
      }, 1800);
    } catch (_) {}
  }, []);

  useEffectA(() => {
    // Keep maker list in sync with the makerCount tweak
    setMakers((prev) => {
      const wanted = MAKERS_BASE.slice(0, t.makerCount);
      // preserve runtime status changes for makers that already exist
      return wanted.map((m) => {
        const existing = prev.find((p) => p.id === m.id);
        return existing ? { ...m, status: existing.status } : m;
      });
    });
  }, [t.makerCount]);

  const [tab, setTab] = useStateA("all");
  const [drawerMaker, setDrawerMaker] = useStateA(null);
  const [drawerOpen, setDrawerOpen] = useStateA(false);
  const [addOpen, setAddOpen] = useStateA(false);

  const counts = useMemo(() => ({
    all: makers.length,
    running: makers.filter((m) => m.status === "running" || m.status === "warming").length,
    stopped: makers.filter((m) => m.status === "stopped").length,
  }), [makers]);

  const visible = useMemo(() => {
    if (tab === "running") return makers.filter((m) => m.status === "running" || m.status === "warming");
    if (tab === "stopped") return makers.filter((m) => m.status === "stopped");
    return makers;
  }, [makers, tab]);

  // ── Top metric values ──────────────────────────────────────────────────────
  const spendable = makers.reduce((s, m) => s + m.balances.spend, 0);
  const earnedSats = makers.reduce((s, m) => s + m.earnedSats, 0);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const openManage = (m) => {
    setDrawerMaker(m);
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    // keep maker in state briefly so the drawer can animate out
    setTimeout(() => setDrawerMaker(null), 320);
  };

  const updateMaker = (id, patch) => {
    setMakers((prev) => prev.map((m) => m.id === id ? { ...m, ...patch } : m));
    setDrawerMaker((m) => m && m.id === id ? { ...m, ...patch } : m);
  };

  const onStop    = (m) => updateMaker(m.id, { status: "stopped", uptime: "—" });
  const onStart   = (m) => updateMaker(m.id, { status: "warming", uptime: "00:00:08" });
  const onRestart = (m) => {
    updateMaker(m.id, { status: "warming", uptime: "00:00:03" });
    setTimeout(() => updateMaker(m.id, { status: "running", uptime: "00:00:42" }), 1200);
  };
  const onDelete  = (m) => {
    setMakers((prev) => prev.filter((x) => x.id !== m.id));
    closeDrawer();
  };

  const onCreateMaker = ({ name, port, fidelity }) => {
    const id = `maker-new-${Date.now()}`;
    const newMaker = {
      id, name, port,
      status: "warming",
      tor: `${Math.random().toString(36).slice(2,10)}${Math.random().toString(36).slice(2,8)}xxxx.onion:${port}`,
      uptime: "00:00:04",
      swapsTotal: 0, swapsToday: 0, earnedSats: 0,
      balances: { spend: 0, regular: 0, swap: 0, fidelity: Number(fidelity) || 0.00010000 },
    };
    setMakers((prev) => [...prev, newMaker]);
    setAddOpen(false);
    // promote to running after a beat
    setTimeout(() => setMakers((prev) =>
      prev.map((m) => m.id === id ? { ...m, status: "running", uptime: "00:01:12" } : m)
    ), 1600);
  };

  // ── Activity ────────────────────────────────────────────────────────────────
  const activityRows = t.activity === "empty" ? [] : ACTIVITY;

  // ── Layout class ────────────────────────────────────────────────────────────
  const gridCols = t.makerCount >= 4 ? (t.makerCount >= 5 ? "" : "") : "";
  const gridCls = `makers-grid ${t.density === "compact" ? "compact" : ""}`;

  return (
    <div className="page">
      {/* Top band */}
      <header className="top-band">
        <div className="brand-wrap">
          <span className="net-pill">
            <span className="pip"></span>
            Signet · v0.4.2
          </span>
          <div className="brand-row">
            <span className="brand-mark">C</span>
            <h1 className="h1">Coinswap Maker</h1>
          </div>
          <p className="subtitle">Operate maker instances · earn fees from Coinswap takers</p>
        </div>
        <div className="top-right">
          <div className="metric-strip">
            <MetricCard variant="orange"
              label="Spendable"
              value={fmtBtc(spendable)} unit="BTC"
              sub={`${makers.length} maker${makers.length === 1 ? "" : "s"}`}
            />
            <MetricCard variant="green"
              label="Net earnings"
              value={`+${fmtSats(earnedSats)}`} unit="SATS"
              sub={`${activityRows.length} swap${activityRows.length === 1 ? "" : "s"} today`}
            />
          </div>
        </div>
      </header>

      {/* Section: Makers */}
      <div className="section-head">
        <div className="left">
          <h2>Makers</h2>
          <FilterTabs value={tab} onChange={setTab} counts={counts} />
        </div>
        <button className="btn" onClick={() => { window.location.href = "Add Maker.html"; }}>
          <span className="icn">{ICONS.plus}</span>
          Add new maker
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="activity-card" style={{ marginBottom: 44 }}>
          <div className="activity-empty">
            <span className="glyph">{ICONS.swap}</span>
            <span className="head">No makers in this view</span>
            <span className="sub">Switch tabs or add a new maker to get started.</span>
          </div>
        </div>
      ) : (
        <div className={gridCls}>
          {visible.map((m) => (
            <MakerCard key={m.id} maker={m} onManage={openManage} />
          ))}
        </div>
      )}

      {/* Activity */}
      <ActivityCard rows={activityRows} />

      {/* Add modal */}
      <AddMakerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={onCreateMaker}
        nextIndex={makers.length + 1}
      />

      {/* Manage drawer */}
      <ManageDrawer
        maker={drawerMaker}
        open={drawerOpen}
        onClose={closeDrawer}
        onStart={onStart}
        onStop={onStop}
        onRestart={onRestart}
        onDelete={onDelete}
      />

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout" />
        <TweakSlider label="Maker count" value={t.makerCount} min={1} max={5} step={1}
                     onChange={(v) => setTweak('makerCount', v)} />
        <TweakRadio label="Card density" value={t.density}
                    options={['comfortable', 'compact']}
                    onChange={(v) => setTweak('density', v)} />

        <TweakSection label="Content" />
        <TweakRadio label="Activity" value={t.activity}
                    options={['populated', 'empty']}
                    onChange={(v) => setTweak('activity', v)} />

        <TweakSection label="Theme" />
        <TweakRadio label="Accent" value={t.accent}
                    options={['orange', 'blue']}
                    onChange={(v) => setTweak('accent', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
