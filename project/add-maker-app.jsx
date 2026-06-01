// add-maker-app.jsx — Full-page Add Maker form

const { useState: useStateAM, useEffect: useEffectAM, useMemo: useMemoAM, useRef: useRefAM, useCallback: useCallbackAM } = React;

// ─── Pre-check definitions ────────────────────────────────────────────────────
const PRECHECKS = [
  { id: "btc-sync",   title: "Bitcoin Core is running and fully synced",
    desc: "Fully synced node — testnet, regtest, or signet work for testing." },
  { id: "btc-rpc",    title: "Bitcoin Core RPC is enabled",
    desc: "rpcuser, rpcpassword, and server=1 set in bitcoin.conf." },
  { id: "btc-rest",   title: "Bitcoin Core REST is enabled",
    desc: "Dashboard checks /rest/chaininfo.json — needs rest=1 in bitcoin.conf." },
  { id: "zmq",        title: "ZMQ notifications are configured",
    desc: "zmqpubrawblock and zmqpubrawtx endpoints reachable on the configured port." },
  { id: "tor",        title: "Tor is running",
    desc: "Required for taker discovery, fidelity bonds, and routing all swap requests." },
];

const DEFAULTS = {
  makerId: "",
  dataDir: "",
  makerPassword: "",
  btcRpcEndpoint: "127.0.0.1:38332",
  rpcUser: "",
  rpcPassword: "",
  zmqEndpoint: "tcp://127.0.0.1:28332",
  socksPort: "9050",
  controlPort: "9051",
  torAuthPassword: "",
  networkPort: "6106",
  rpcPort: "6107",
  requiredConfirmations: "1",
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "preCheckState": "idle",
  "showInfoCallout": true,
  "accent": "orange"
}/*EDITMODE-END*/;

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, required, optional, hint, hintCode, error, children }) {
  return (
    <div className="am-field">
      <div className="lbl-row">
        <span className="lbl">
          {label}
          {required && <span className="req">*</span>}
        </span>
        {optional && <span className="opt">Optional</span>}
      </div>
      {children}
      {error ? (
        <span className="err">{error}</span>
      ) : hint && (
        <span className="hint">
          {hint}
          {hintCode && <code>{hintCode}</code>}
        </span>
      )}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, error, type = "text", onBlur, autoFocus }) {
  return (
    <div className={`am-input-wrap ${error ? "error" : ""}`}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoFocus={autoFocus}
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, error, onBlur }) {
  const [show, setShow] = useStateAM(false);
  return (
    <div className={`am-input-wrap ${error ? "error" : ""}`}>
      <input
        type={show ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        spellCheck={false}
        autoComplete="off"
      />
      <button type="button" className="eye" onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}>
        {show ? ICONS.eyeOff : ICONS.eye}
      </button>
    </div>
  );
}

// ─── Pre-check Row ────────────────────────────────────────────────────────────
function PreCheckRow({ row, state, onRun }) {
  let icon;
  if (state === "running") icon = <span className="spinner"></span>;
  else if (state === "passed") icon = <span className="pop">{ICONS.checkSmall}</span>;
  else if (state === "failed") icon = <span className="pop">{ICONS.xSmall}</span>;

  const actionLabel = {
    idle:    "Click to test",
    running: "Testing…",
    passed:  "Passed",
    failed:  "Retry test",
  }[state || "idle"];

  return (
    <div className="precheck-row">
      <span className={`pc-dot ${state || ""}`} aria-hidden="true">{icon}</span>
      <div className="pc-text">
        <span className={`ttl ${state === "failed" ? "fail" : ""}`}>{row.title}</span>
        <span className="desc">{row.desc}</span>
      </div>
      <button className={`pc-action ${state === "passed" ? "done" : ""} ${state === "failed" ? "fail" : ""}`}
              onClick={onRun} disabled={state === "running"}>
        {actionLabel}
      </button>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(form) {
  const errs = {};
  if (!form.makerId.trim()) errs.makerId = "Maker ID is required.";
  else if (!/^[a-z0-9][a-z0-9-]{1,31}$/i.test(form.makerId.trim()))
    errs.makerId = "Use letters, numbers, and hyphens. 2–32 chars.";

  if (!form.btcRpcEndpoint.trim()) errs.btcRpcEndpoint = "RPC endpoint is required.";
  else if (!/^[a-z0-9.\-]+:\d{2,5}$/i.test(form.btcRpcEndpoint.trim()))
    errs.btcRpcEndpoint = "Expected host:port (e.g. 127.0.0.1:38332).";

  if (!form.rpcUser.trim()) errs.rpcUser = "RPC username is required.";
  if (!form.rpcPassword) errs.rpcPassword = "RPC password is required.";

  if (!form.zmqEndpoint.trim()) errs.zmqEndpoint = "ZMQ endpoint is required.";
  else if (!/^tcp:\/\/[a-z0-9.\-]+:\d{2,5}$/i.test(form.zmqEndpoint.trim()))
    errs.zmqEndpoint = "Expected tcp://host:port (e.g. tcp://127.0.0.1:28332).";

  const portRange = (v) => /^\d+$/.test(v) && +v >= 1 && +v <= 65535;
  if (!portRange(form.socksPort))   errs.socksPort   = "Port must be 1–65535.";
  if (!portRange(form.controlPort)) errs.controlPort = "Port must be 1–65535.";
  if (!portRange(form.networkPort)) errs.networkPort = "Port must be 1–65535.";
  if (!portRange(form.rpcPort))     errs.rpcPort     = "Port must be 1–65535.";

  if (form.networkPort === form.rpcPort && form.networkPort)
    errs.rpcPort = "Network and RPC ports must differ.";

  const conf = parseInt(form.requiredConfirmations, 10);
  if (!Number.isInteger(conf) || conf < 0 || conf > 144)
    errs.requiredConfirmations = "Required confirmations must be 0–144.";

  return errs;
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffectAM(() => {
    document.body.dataset.flow = t.accent === "blue" ? "swap" : "wallet";
  }, [t.accent]);

  const [form, setForm] = useStateAM(DEFAULTS);
  const [touched, setTouched] = useStateAM({});
  const [submitted, setSubmitted] = useStateAM(false);
  const [submitting, setSubmitting] = useStateAM(false);
  const [cancelOpen, setCancelOpen] = useStateAM(false);

  // pre-check state per id
  const [pcState, setPcState] = useStateAM(() => Object.fromEntries(PRECHECKS.map(r => [r.id, "idle"])));

  // Sync from tweaks for demoing pre-check states
  useEffectAM(() => {
    if (t.preCheckState === "idle") {
      setPcState(Object.fromEntries(PRECHECKS.map(r => [r.id, "idle"])));
    } else if (t.preCheckState === "all-passed") {
      setPcState(Object.fromEntries(PRECHECKS.map(r => [r.id, "passed"])));
    } else if (t.preCheckState === "mixed") {
      setPcState({
        "btc-sync": "passed", "btc-rpc": "passed",
        "btc-rest": "failed", "zmq": "passed", "tor": "passed",
      });
    } else if (t.preCheckState === "running") {
      setPcState(Object.fromEntries(PRECHECKS.map(r => [r.id, "running"])));
    }
  }, [t.preCheckState]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const mark = (k) => setTouched((p) => ({ ...p, [k]: true }));

  const errs = useMemoAM(() => validate(form), [form]);
  const showErr = (k) => (touched[k] || submitted) && errs[k];

  // dirty check (for cancel confirm)
  const isDirty = useMemoAM(() => {
    return Object.keys(DEFAULTS).some((k) => form[k] !== DEFAULTS[k]);
  }, [form]);

  // pre-check counts
  const pcCounts = useMemoAM(() => {
    const v = Object.values(pcState);
    return {
      passed: v.filter((x) => x === "passed").length,
      failed: v.filter((x) => x === "failed").length,
      running: v.filter((x) => x === "running").length,
      total: PRECHECKS.length,
    };
  }, [pcState]);

  // Run one check
  const runCheck = (id) => {
    setPcState((p) => ({ ...p, [id]: "running" }));
    const delay = 600 + Math.random() * 700;
    // for demo purposes, BtC-rest fails when mixed mode is set, otherwise random
    const willFail = id === "btc-rest" && Math.random() < 0.18;
    setTimeout(() => {
      setPcState((p) => ({ ...p, [id]: willFail ? "failed" : "passed" }));
    }, delay);
  };

  // Run all checks (staggered)
  const runAll = () => {
    PRECHECKS.forEach((row, i) => {
      setPcState((p) => ({ ...p, [row.id]: "idle" }));
    });
    PRECHECKS.forEach((row, i) => {
      setTimeout(() => runCheck(row.id), 220 * i);
    });
  };

  const onAddMaker = () => {
    setSubmitted(true);
    if (Object.keys(errs).length) {
      // scroll to first error
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    // Persist new maker for Dashboard to pick up
    const dataDir = form.dataDir.trim() || `~/.coinswap/${form.makerId.trim()}`;
    const tor = `${Math.random().toString(36).slice(2,10)}${Math.random().toString(36).slice(2,10)}xxxx.onion:${form.networkPort}`;
    const newMaker = {
      id: `maker-${Date.now()}`,
      name: form.makerId.trim(),
      status: "warming",
      tor,
      port: parseInt(form.networkPort, 10),
      uptime: "00:00:04",
      swapsTotal: 0, swapsToday: 0, earnedSats: 0,
      balances: { spend: 0, regular: 0, swap: 0, fidelity: 0.00010000 },
      _meta: { dataDir, rpcEndpoint: form.btcRpcEndpoint, createdAt: Date.now() },
    };
    try {
      const queueRaw = localStorage.getItem("coinswap:newMaker");
      localStorage.setItem("coinswap:newMaker", JSON.stringify(newMaker));
    } catch (_) {}

    setTimeout(() => {
      window.location.href = "Maker Dashboard.html";
    }, 1400);
  };

  const onCancel = () => {
    if (isDirty) setCancelOpen(true);
    else window.location.href = "Maker Dashboard.html";
  };

  const confirmCancel = () => {
    setCancelOpen(false);
    window.location.href = "Maker Dashboard.html";
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="am-head">
        <div className="left">
          <button className="back-link" onClick={onCancel}>
            {ICONS.chevronLeft}
            Back to dashboard
          </button>
          <h1>Add New Maker</h1>
          <p className="sub">Configure a new maker instance.</p>
        </div>
        <span className="net-pill" style={{ alignSelf: "start" }}>
          <span className="pip"></span>
          Signet · v0.4.2
        </span>
      </header>

      <div className="am-form">
        {/* Basic Information */}
        <section className="section-card">
          <div className="head">
            <h3>Basic information</h3>
            <p className="note">Identifies this maker across logs, RPC calls, and dashboards.</p>
          </div>
          <div className="body">
            <div data-field="makerId">
              <Field label="Maker ID" required
                     hint="Unique identifier — used in all API calls. Cannot be changed later."
                     error={showErr("makerId")}>
                <TextInput value={form.makerId}
                           onChange={(v) => update("makerId", v)}
                           onBlur={() => mark("makerId")}
                           placeholder="e.g. maker-1"
                           error={showErr("makerId")} />
              </Field>
            </div>
            <Field label="Data directory" optional
                   hint="Where maker data is stored. Defaults to "
                   hintCode={`~/.coinswap/${form.makerId.trim() || "<id>"}`}>
              <TextInput value={form.dataDir}
                         onChange={(v) => update("dataDir", v)}
                         placeholder="e.g. ~/.coinswap/maker-1 (leave blank for default)" />
            </Field>
            <Field label="Maker password" optional
                   hint="Encrypts the maker's wallet on disk.">
              <PasswordInput value={form.makerPassword}
                             onChange={(v) => update("makerPassword", v)}
                             placeholder="Optional" />
            </Field>
          </div>
        </section>

        {/* Bitcoin + Tor (2-col) */}
        <div className="am-row-pair">
          <section className="section-card">
            <div className="head">
              <h3>Bitcoin connection</h3>
              <p className="note">Bitcoin Core RPC + ZMQ for chain state and notifications.</p>
            </div>
            <div className="body">
              <div data-field="btcRpcEndpoint">
                <Field label="Bitcoin RPC endpoint" required
                       hint="Format: host:port"
                       error={showErr("btcRpcEndpoint")}>
                  <TextInput value={form.btcRpcEndpoint}
                             onChange={(v) => update("btcRpcEndpoint", v)}
                             onBlur={() => mark("btcRpcEndpoint")}
                             placeholder="127.0.0.1:38332"
                             error={showErr("btcRpcEndpoint")} />
                </Field>
              </div>
              <div className="split-row">
                <div data-field="rpcUser">
                  <Field label="RPC username" required error={showErr("rpcUser")}>
                    <TextInput value={form.rpcUser}
                               onChange={(v) => update("rpcUser", v)}
                               onBlur={() => mark("rpcUser")}
                               placeholder="user"
                               error={showErr("rpcUser")} />
                  </Field>
                </div>
                <div data-field="rpcPassword">
                  <Field label="RPC password" required error={showErr("rpcPassword")}>
                    <PasswordInput value={form.rpcPassword}
                                   onChange={(v) => update("rpcPassword", v)}
                                   onBlur={() => mark("rpcPassword")}
                                   placeholder="••••••••"
                                   error={showErr("rpcPassword")} />
                  </Field>
                </div>
              </div>
              <div data-field="zmqEndpoint">
                <Field label="ZMQ endpoint" required
                       hint="Subscribe to rawblock + rawtx notifications."
                       error={showErr("zmqEndpoint")}>
                  <TextInput value={form.zmqEndpoint}
                             onChange={(v) => update("zmqEndpoint", v)}
                             onBlur={() => mark("zmqEndpoint")}
                             placeholder="tcp://127.0.0.1:28332"
                             error={showErr("zmqEndpoint")} />
                </Field>
              </div>
            </div>
          </section>

          <section className="section-card">
            <div className="head">
              <h3>Tor configuration</h3>
              <p className="note">
                Ports must match your Tor instance. Auth password is required if your control port uses <code>HashedControlPassword</code>.
              </p>
            </div>
            <div className="body">
              <div className="split-row">
                <div data-field="socksPort">
                  <Field label="SOCKS port" required error={showErr("socksPort")}>
                    <TextInput value={form.socksPort}
                               onChange={(v) => update("socksPort", v)}
                               onBlur={() => mark("socksPort")}
                               placeholder="9050"
                               error={showErr("socksPort")} />
                  </Field>
                </div>
                <div data-field="controlPort">
                  <Field label="Control port" required error={showErr("controlPort")}>
                    <TextInput value={form.controlPort}
                               onChange={(v) => update("controlPort", v)}
                               onBlur={() => mark("controlPort")}
                               placeholder="9051"
                               error={showErr("controlPort")} />
                  </Field>
                </div>
              </div>
              <Field label="Tor auth password" optional
                     hint="Leave blank if no auth configured.">
                <PasswordInput value={form.torAuthPassword}
                               onChange={(v) => update("torAuthPassword", v)}
                               placeholder="Optional" />
              </Field>
            </div>
          </section>
        </div>

        {/* Maker Network Ports */}
        <section className="section-card">
          <div className="head">
            <h3>Maker network ports</h3>
            <p className="note">Ports this maker listens on. Must be unique across all makers running locally.</p>
          </div>
          <div className="body">
            <div className="split-row">
              <div data-field="networkPort">
                <Field label="Network port" required
                       hint="Used by takers to connect."
                       error={showErr("networkPort")}>
                  <TextInput value={form.networkPort}
                             onChange={(v) => update("networkPort", v)}
                             onBlur={() => mark("networkPort")}
                             placeholder="6106"
                             error={showErr("networkPort")} />
                </Field>
              </div>
              <div data-field="rpcPort">
                <Field label="RPC port" required
                       hint="Used by maker-cli."
                       error={showErr("rpcPort")}>
                  <TextInput value={form.rpcPort}
                             onChange={(v) => update("rpcPort", v)}
                             onBlur={() => mark("rpcPort")}
                             placeholder="6107"
                             error={showErr("rpcPort")} />
                </Field>
              </div>
            </div>
            <div data-field="requiredConfirmations">
              <Field label="Required confirmations" required
                     hint="Funding confirmations required before swaps continue."
                     error={showErr("requiredConfirmations")}>
                <TextInput value={form.requiredConfirmations}
                           onChange={(v) => update("requiredConfirmations", v)}
                           onBlur={() => mark("requiredConfirmations")}
                           placeholder="1"
                           error={showErr("requiredConfirmations")} />
              </Field>
            </div>
          </div>
        </section>

        {/* Pre-checks */}
        <section className="section-card">
          <div className="head">
            <h3>Pre-checks</h3>
            <p className="note">Run a live check against your current Bitcoin Core and Tor settings before adding the maker.</p>
          </div>
          <div className="precheck-list">
            {PRECHECKS.map((row) => (
              <PreCheckRow key={row.id} row={row} state={pcState[row.id]}
                           onRun={() => runCheck(row.id)} />
            ))}
          </div>
          <div className="precheck-foot">
            <span className="summary">
              {pcCounts.passed > 0 && (
                <span className="stat ok"><span className="pip"></span>{pcCounts.passed} Passed</span>
              )}
              {pcCounts.failed > 0 && (
                <span className="stat bad"><span className="pip"></span>{pcCounts.failed} Failed</span>
              )}
              {pcCounts.passed === 0 && pcCounts.failed === 0 && pcCounts.running === 0 && (
                <span>{pcCounts.total} checks · not run</span>
              )}
              {pcCounts.running > 0 && (
                <span>Running…</span>
              )}
            </span>
            <button className="btn sm" onClick={runAll}>
              <span className="icn">{ICONS.refresh}</span>
              Test all
            </button>
          </div>
        </section>

        {/* Footer */}
        <div className="am-foot">
          <button className="btn ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button className="btn" onClick={onAddMaker} disabled={submitting}>
            {submitting ? (
              <>
                <span className="icn"><span className="spin"></span></span>
                Creating maker…
              </>
            ) : (
              <>
                <span className="icn">{ICONS.plus}</span>
                Add maker
              </>
            )}
          </button>
        </div>

        {/* Info callout */}
        {t.showInfoCallout && (
          <aside className="info-callout">
            <span className="ic">{ICONS.info}</span>
            <div className="body">
              <span className="h">Before adding a maker</span>
              <ul>
                <li>Ensure Bitcoin Core is running and synced.</li>
                <li>The <code>maker ID</code> must be unique and cannot be changed later.</li>
                <li>Both <code>RPC username</code> and <code>password</code> are required.</li>
                <li>Your <code>ZMQ endpoint</code> must match what's set in <code>bitcoin.conf</code>.</li>
              </ul>
            </div>
          </aside>
        )}
      </div>

      {/* Cancel confirmation */}
      <div className={`backdrop ${cancelOpen ? "open" : ""}`} onClick={() => setCancelOpen(false)}>
        <div className="modal cancel-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-head">
            <div className="ttl">
              <span className="eyebrow" style={{ color: "var(--amber)" }}>Unsaved changes</span>
              <h3>Discard this maker?</h3>
            </div>
            <button className="icon-btn" onClick={() => setCancelOpen(false)} aria-label="Close">{ICONS.x}</button>
          </div>
          <div className="modal-body">
            <p>You've entered configuration that hasn't been saved. Leaving now will discard it.</p>
          </div>
          <div className="modal-foot">
            <button className="btn ghost sm" onClick={() => setCancelOpen(false)}>Keep editing</button>
            <button className="btn sm" style={{ background: "var(--red)" }} onClick={confirmCancel}>
              Discard changes
            </button>
          </div>
        </div>
      </div>

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Pre-checks" />
        <TweakSelect label="State" value={t.preCheckState}
                     options={["idle", "running", "all-passed", "mixed"]}
                     onChange={(v) => setTweak('preCheckState', v)} />

        <TweakSection label="Layout" />
        <TweakToggle label="Show info callout" value={t.showInfoCallout}
                     onChange={(v) => setTweak('showInfoCallout', v)} />

        <TweakSection label="Theme" />
        <TweakRadio label="Accent" value={t.accent}
                    options={['orange', 'blue']}
                    onChange={(v) => setTweak('accent', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
