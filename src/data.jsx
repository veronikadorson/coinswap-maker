// Icons, mock data, and formatters

export const ICONS = {
  plus: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  copy: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2"/>
      <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l5 5L20 7"/>
    </svg>
  ),
  arrowDown: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 13l5 5 5-5M12 4v14"/>
    </svg>
  ),
  arrowUp: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11l5-5 5 5M12 4v16"/>
    </svg>
  ),
  external: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8"/>
    </svg>
  ),
  refresh: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M6 18L18 6"/>
    </svg>
  ),
  swap: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h13l-3-3"/>
      <path d="M21 16H8l3 3"/>
    </svg>
  ),
  log: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11l3 3v13H5z"/>
      <path d="M8 9h6M8 13h8M8 17h5"/>
    </svg>
  ),
  power: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v8"/>
      <path d="M17 7a8 8 0 1 1-10 0"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6"/>
    </svg>
  ),
  eye: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  eyeOff: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18"/>
      <path d="M10.6 6.1A10.4 10.4 0 0 1 12 6c6.5 0 10 6 10 6a17.5 17.5 0 0 1-3.3 4"/>
      <path d="M6.6 6.6A17.5 17.5 0 0 0 2 12s3.5 6 10 6a10.6 10.6 0 0 0 4.2-.9"/>
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
    </svg>
  ),
  info: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 8h.01M11 12h1v5h1"/>
    </svg>
  ),
  alert: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4 2 20h20L12 4z"/>
      <path d="M12 10v4M12 17h.01"/>
    </svg>
  ),
  xSmall: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M6 18L18 6"/>
    </svg>
  ),
  checkSmall: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l5 5L20 7"/>
    </svg>
  ),
};

export const MAKERS_BASE = [
  {
    id: "maker-01",
    name: "maker-01",
    status: "running",
    tor:   "j7hpn7nmgzv6n47aoa8q3xmw9hsf2k1rrcw0pqz4d8x.onion:6102",
    port:  6102,
    uptime: "14d 6h",
    swapsTotal: 41,
    swapsToday: 3,
    earnedSats: 18420,
    balances: { spend: 0.09989528, regular: 0.09989528, swap: 0.00000000, fidelity: 0.00010000 },
  },
  {
    id: "maker-02",
    name: "v-mark",
    status: "running",
    tor:   "ht3nnsbenqen44ocno5kx2vmcwz9bxsap8m4qrad.onion:6104",
    port:  6104,
    uptime: "9d 17h",
    swapsTotal: 28,
    swapsToday: 1,
    earnedSats: 11206,
    balances: { spend: 0.09989528, regular: 0.09989528, swap: 0.00000000, fidelity: 0.00010000 },
  },
  {
    id: "maker-03",
    name: "mark-dcada",
    status: "running",
    tor:   "bq2xdcodtywyze4tv64nz1qj7sd9vp6xydonion.onion:6106",
    port:  6106,
    uptime: "21d 4h",
    swapsTotal: 63,
    swapsToday: 5,
    earnedSats: 25804,
    balances: { spend: 0.49989528, regular: 0.49989528, swap: 0.00000000, fidelity: 0.00010000 },
  },
  {
    id: "maker-04",
    name: "north-relay",
    status: "warming",
    tor:   "p4nx72m93lo4chdf5kbo3yqaz0n2hccxgsap9be.onion:6108",
    port:  6108,
    uptime: "00:04:21",
    swapsTotal: 0,
    swapsToday: 0,
    earnedSats: 0,
    balances: { spend: 0.02500000, regular: 0.02500000, swap: 0.00000000, fidelity: 0.00010000 },
  },
  {
    id: "maker-05",
    name: "cold-stub",
    status: "stopped",
    tor:   "w8m1aq6xtfd0gh53zk4r2nbpcvr7yqs7lo2eddu.onion:6110",
    port:  6110,
    uptime: "—",
    swapsTotal: 12,
    swapsToday: 0,
    earnedSats: 5210,
    balances: { spend: 0.04200000, regular: 0.04200000, swap: 0.00000000, fidelity: 0.00010000 },
  },
];

export const ACTIVITY = [
  { id: "a1", t: "14:02", maker: "mark-dcada",  port: 6106, dir: "in",  cp: "f3a7b2e8…d918dc60.onion", amtSats: 4_280_000, feeSats: 1840, kind: "swap-complete" },
  { id: "a2", t: "13:47", maker: "maker-01",    port: 6102, dir: "in",  cp: "b91c0a4d…77c12af3.onion", amtSats: 2_150_000, feeSats:  920, kind: "swap-complete" },
  { id: "a3", t: "13:11", maker: "v-mark",      port: 6104, dir: "in",  cp: "7e2dba91…04ff883a.onion", amtSats: 1_080_000, feeSats:  460, kind: "swap-complete" },
  { id: "a4", t: "12:58", maker: "mark-dcada",  port: 6106, dir: "in",  cp: "c45e1f08…ab2107df.onion", amtSats:   725_000, feeSats:  310, kind: "swap-complete" },
  { id: "a5", t: "11:24", maker: "maker-01",    port: 6102, dir: "in",  cp: "5a0db381…e22f9c1b.onion", amtSats: 3_500_000, feeSats: 1500, kind: "swap-complete" },
  { id: "a6", t: "09:06", maker: "v-mark",      port: 6104, dir: "in",  cp: "9810dbe4…66c7a015.onion", amtSats:   980_000, feeSats:  420, kind: "swap-complete" },
];

export const PRECHECKS = [
  { id: "btc-sync",  title: "Bitcoin Core is running and fully synced",
    desc: "Fully synced node — testnet, regtest, or signet work for testing." },
  { id: "btc-rpc",   title: "Bitcoin Core RPC is enabled",
    desc: "rpcuser, rpcpassword, and server=1 set in bitcoin.conf." },
  { id: "btc-rest",  title: "Bitcoin Core REST is enabled",
    desc: "Dashboard checks /rest/chaininfo.json — needs rest=1 in bitcoin.conf." },
  { id: "zmq",       title: "ZMQ notifications are configured",
    desc: "zmqpubrawblock and zmqpubrawtx endpoints reachable on the configured port." },
  { id: "tor",       title: "Tor is running",
    desc: "Required for taker discovery, fidelity bonds, and routing all swap requests." },
];

export function fmtBtc(n) {
  return n.toFixed(8);
}
export function fmtSats(n) {
  return n.toLocaleString("en-US");
}
export function truncTor(tor, head = 8, tail = 12) {
  if (!tor) return "";
  if (tor.length <= head + tail + 3) return tor;
  return tor.slice(0, head) + "…" + tor.slice(-tail);
}
