import { useState, useEffect } from 'react';
import { ICONS, fmtBtc, fmtSats } from '../data.jsx';

// ─── MetricCard ───────────────────────────────────────────────────────────────
export function MetricCard({ variant, label, value, unit, sub, delta }) {
  return (
    <div className={`bcard ${variant}`}>
      <span className="accent-line"></span>
      <div className="label">
        <span>{label}</span>
      </div>
      <div className="val">
        {value}
        {unit && <small>{unit}</small>}
      </div>
      {sub && (
        <div className="sub">
          {delta && <span className={`delta ${delta.startsWith("-") ? "neg" : ""}`}>{delta}</span>}
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Status dot ───────────────────────────────────────────────────────────────
export function StatusDot({ status }) {
  return <span className={`status-dot ${status}`} aria-hidden="true"></span>;
}

// ─── CopyButton ───────────────────────────────────────────────────────────────
export function CopyButton({ text, title = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const onClick = (e) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText(text);
    } catch (_) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (_) {}
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button className={`icon-btn ${copied ? "copied" : ""}`} onClick={onClick}
            aria-label={title} title={title}>
      {copied ? ICONS.check : ICONS.copy}
    </button>
  );
}

// ─── MakerCard ────────────────────────────────────────────────────────────────
export function MakerCard({ maker, onManage }) {
  return (
    <div className="maker-card">
      <div className="mhead">
        <StatusDot status={maker.status} />
        <span className="name">{maker.name}</span>
      </div>

      <div className="tor-line">
        <span className="label">TOR</span>
        <span className="tor-text" title={maker.tor}>{maker.tor}</span>
        <CopyButton text={maker.tor} title="Copy address" />
      </div>

      <div className="bal-grid">
        <div className="bal-cell spend">
          <span className="lbl">Spendable</span>
          <span className="v">{fmtBtc(maker.balances.spend)} <small>BTC</small></span>
        </div>
        <div className="bal-cell">
          <span className="lbl">Regular</span>
          <span className="v">{fmtBtc(maker.balances.regular)} <small>BTC</small></span>
        </div>
        <div className="bal-cell">
          <span className="lbl">Swap</span>
          <span className="v">{fmtBtc(maker.balances.swap)} <small>BTC</small></span>
        </div>
        <div className="bal-cell fidel">
          <span className="lbl">Fidelity</span>
          <span className="v">{fmtBtc(maker.balances.fidelity)} <small>BTC</small></span>
        </div>
      </div>

      <div className="mfoot">
        <span className="uptime">
          {maker.status === "running" && `Uptime · ${maker.uptime}`}
          {maker.status === "warming" && `Warming up · ${maker.uptime}`}
          {maker.status === "stopped" && `Stopped`}
        </span>
        <button className="btn sm" onClick={() => onManage(maker)}>Manage</button>
      </div>
    </div>
  );
}

// ─── FilterTabs ───────────────────────────────────────────────────────────────
export function FilterTabs({ value, onChange, counts }) {
  const tabs = [
    { id: "all",     label: "All",      n: counts.all },
    { id: "running", label: "Running",  n: counts.running },
    { id: "stopped", label: "Stopped",  n: counts.stopped },
  ];
  return (
    <div className="filter-tabs" role="tablist">
      {tabs.map((tb) => (
        <button key={tb.id}
                role="tab"
                aria-selected={value === tb.id}
                className={value === tb.id ? "active" : ""}
                onClick={() => onChange(tb.id)}>
          {tb.label} <span className="n">{tb.n}</span>
        </button>
      ))}
    </div>
  );
}

// ─── ActivityRow ──────────────────────────────────────────────────────────────
export function ActivityRow({ row }) {
  return (
    <div className="activity-row">
      <span className="ts">{row.t}</span>
      <span className={`tx-arrow ${row.dir === "out" ? "out" : ""}`}>
        {row.dir === "out" ? ICONS.arrowUp : ICONS.arrowDown}
      </span>
      <div className="maker">
        <div>{row.maker}</div>
        <div className="sub">:{row.port}</div>
      </div>
      <span className="counterparty" title={row.cp}>{row.cp}</span>
      <span className="amt">+{fmtSats(row.amtSats)} <small>SATS</small></span>
      <span className="pill">Swap · +{fmtSats(row.feeSats)}</span>
    </div>
  );
}

// ─── ActivityCard ─────────────────────────────────────────────────────────────
export function ActivityCard({ rows }) {
  return (
    <div className="activity-card">
      <div className="card-head">
        <h3>
          Recent activity
          <span className="count">{rows.length} events</span>
        </h3>
      </div>
      {rows.length === 0 ? (
        <div className="activity-empty">
          <span className="glyph">{ICONS.log}</span>
          <span className="head">No swaps yet</span>
          <span className="sub">When your makers complete swaps, they'll show up here with txids and earned fees.</span>
        </div>
      ) : (
        <div className="activity-list">
          {rows.map((r) => <ActivityRow key={r.id} row={r} />)}
        </div>
      )}
    </div>
  );
}
