// maker-modals.jsx — AddMakerModal + ManageDrawer

const { useState: useStateM, useEffect: useEffectM } = React;

// ─── AddMakerModal ────────────────────────────────────────────────────────────
function AddMakerModal({ open, onClose, onCreate, nextIndex }) {
  const [name, setName] = useStateM("");
  const [port, setPort] = useStateM(6112);
  const [fidelity, setFidelity] = useStateM(0.00010000);

  useEffectM(() => {
    if (open) {
      setName(`maker-0${nextIndex}`);
      setPort(6100 + nextIndex * 2);
      setFidelity(0.00010000);
    }
  }, [open, nextIndex]);

  useEffectM(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), port: Number(port), fidelity: Number(fidelity) });
  };

  return (
    <div className={`backdrop ${open ? "open" : ""}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="ttl">
            <span className="eyebrow">Spin up</span>
            <h3>Add new maker</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">{ICONS.x}</button>
        </div>
        <div className="modal-body">
          <div className="field">
            <span className="lbl">Maker name</span>
            <div className="input-wrap">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="maker-04" />
            </div>
            <div className="hint">
              <span>Used in your dashboard and logs.</span>
              <span></span>
            </div>
          </div>

          <div className="field">
            <span className="lbl">Listening port</span>
            <div className="input-wrap">
              <input type="number" value={port} min="6100" max="6999"
                     onChange={(e) => setPort(e.target.value)} />
            </div>
            <div className="hint">
              <span>Must be free locally.</span>
              <span>6100–6999</span>
            </div>
          </div>

          <div className="field">
            <span className="lbl">Fidelity bond</span>
            <div className="input-wrap">
              <input type="number" step="0.00001" value={fidelity}
                     onChange={(e) => setFidelity(e.target.value)} />
            </div>
            <div className="hint">
              <span>Locked into a timelocked contract to prove staking.</span>
              <span>BTC</span>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn ghost sm" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={submit}>Create maker</button>
        </div>
      </div>
    </div>
  );
}

// ─── ManageDrawer ─────────────────────────────────────────────────────────────
function ManageDrawer({ maker, open, onClose, onStart, onStop, onRestart, onDelete }) {
  useEffectM(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!maker) return (
    <>
      <div className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose}></div>
      <div className={`drawer ${open ? "open" : ""}`}></div>
    </>
  );

  const totalEarned = (maker.earnedSats / 1e8).toFixed(8);
  const statusLabel =
    maker.status === "running" ? "Running" :
    maker.status === "warming" ? "Warming up" : "Stopped";

  return (
    <>
      <div className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose}></div>
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <div className="ttl">
            <span className="eyebrow">Maker · :{maker.port}</span>
            <h3>
              <StatusDot status={maker.status} />
              {maker.name}
            </h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">{ICONS.x}</button>
        </div>

        <div className="drawer-body">
          <div>
            <h4 className="sec-title">Network</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="detail-row">
                <span className="lbl">Status</span>
                <span className="v" style={{
                  color: maker.status === "running" ? "var(--green)"
                       : maker.status === "warming" ? "var(--amber)"
                       : "var(--text-3)"
                }}>{statusLabel} · uptime {maker.uptime}</span>
              </div>
              <div className="detail-row">
                <span className="lbl">Tor address</span>
                <span className="v">{maker.tor}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="sec-title">Balances</h4>
            <div className="metric-row">
              <div className="metric-cell">
                <div className="lbl">Spendable</div>
                <div className="v" style={{ color: "var(--orange)" }}>
                  {fmtBtc(maker.balances.spend)} <small>BTC</small>
                </div>
              </div>
              <div className="metric-cell">
                <div className="lbl">Regular</div>
                <div className="v">
                  {fmtBtc(maker.balances.regular)} <small>BTC</small>
                </div>
              </div>
              <div className="metric-cell">
                <div className="lbl">Swap</div>
                <div className="v">
                  {fmtBtc(maker.balances.swap)} <small>BTC</small>
                </div>
              </div>
              <div className="metric-cell">
                <div className="lbl">Fidelity</div>
                <div className="v" style={{ color: "var(--purple)" }}>
                  {fmtBtc(maker.balances.fidelity)} <small>BTC</small>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="sec-title">Activity</h4>
            <div className="metric-row">
              <div className="metric-cell">
                <div className="lbl">Swaps · total</div>
                <div className="v">{maker.swapsTotal}</div>
              </div>
              <div className="metric-cell">
                <div className="lbl">Swaps · today</div>
                <div className="v">{maker.swapsToday}</div>
              </div>
              <div className="metric-cell">
                <div className="lbl">Earned · sats</div>
                <div className="v" style={{ color: "var(--green)" }}>
                  +{fmtSats(maker.earnedSats)}
                </div>
              </div>
              <div className="metric-cell">
                <div className="lbl">Earned · BTC</div>
                <div className="v" style={{ color: "var(--green)" }}>
                  {totalEarned} <small>BTC</small>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="sec-title">Danger zone</h4>
            <div className="danger-zone">
              <div className="copy">
                <span className="h">Delete this maker</span>
                <span className="s">Removes config. Fidelity bond unlocks at timelock expiry.</span>
              </div>
              <button className="btn danger" onClick={() => onDelete(maker)}>Delete</button>
            </div>
          </div>
        </div>

        <div className="drawer-foot">
          {maker.status === "running" ? (
            <>
              <button className="btn ghost" onClick={() => onRestart(maker)} style={{ flex: 1 }}>
                <span className="icn">{ICONS.refresh}</span>
                Restart
              </button>
              <button className="btn" onClick={() => onStop(maker)} style={{ flex: 1 }}>
                <span className="icn">{ICONS.power}</span>
                Stop maker
              </button>
            </>
          ) : (
            <button className="btn" onClick={() => onStart(maker)} style={{ flex: 1 }}>
              <span className="icn">{ICONS.power}</span>
              Start maker
            </button>
          )}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { AddMakerModal, ManageDrawer });
