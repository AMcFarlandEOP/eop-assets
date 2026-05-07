/**
 * EOP Dashboard Bundle — eop-dashboard.iife.js
 * Host on GitHub Pages: https://AMcFarlandEOP.github.io/eop-assets/eop-dashboard.iife.js
 *
 * Usage on WordPress page:
 *   <div id="eop-dashboard-root"></div>
 *   <script src="https://AMcFarlandEOP.github.io/eop-assets/eop-dashboard.iife.js"></script>
 */

(async () => {

// ── CONFIG ────────────────────────────────────────────────────
const TACT_ADDRESS   = "0xddD6C7D0494B2fD4fA3E3F25485b1f210e8DFDd2";
const OBST_ADDRESS   = "0xa92bAee9c2445B8c400CE13e0110c1E4f6594Af6";
const MEMBERS_PAGE   = "https://eopmedia.com/members/";
const CLIENT_ID      = "a83405fb2a3910cfc51a6bb4b227655d";

const LUMA_TACT_CALENDAR_ID = "cal-rZpQJCqIvCR4nlC";
const LUMA_OBST_CALENDAR_ID = "cal-rZpQJCqIvCR4nlC";

const LOGO_URL       = "https://eopmedia.com/wp-content/uploads/2026/04/EOP-Logo-Header-145x88-1.png";
const TACT_TOKEN_IMG = "https://eopmedia.com/wp-content/uploads/2026/05/The-Agency-Collective-03.19.2026.png";
const OBST_TOKEN_IMG = "https://eopmedia.com/wp-content/uploads/2026/05/Observer-Token-03.19.2026.png";

const LIBRARY_URL    = "https://eopmedia.com/member-dashboard/strategy-sessions/";
const LAB_URL        = "https://eopmedia.com/member-dashboard/agency-lab/";
const TANGEM_URL     = "https://eopmedia.com/member-dashboard/guest-speakers/";
const UPGRADE_URL    = "https://eopmedia.com/the-agency-collective/";
const TERMS_URL      = "https://eopmedia.com/terms-and-conditions/";
const PRIVACY_URL    = "https://eopmedia.com/privacy-policy/";
const CANCEL_URL     = "https://eopmedia.com/cancellation-policy/";

// ── STYLES ────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

  #eop-db-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  #eop-db-wrap {
    font-family: Georgia, 'Times New Roman', serif;
    background: #0a0a0f;
    color: #e8e8f0;
    min-height: 100vh;
    line-height: 1.6;
    width: 100%;
  }

  /* ── Loading / Error ── */
  #eop-db-wrap .eop-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    gap: 20px;
    text-align: center;
    padding: 40px 20px;
  }
  #eop-db-wrap .eop-spinner {
    width: 36px; height: 36px;
    border: 2px solid rgba(255,255,255,0.08);
    border-top-color: #7c6af7;
    border-radius: 50%;
    animation: eop-spin 0.8s linear infinite;
  }
  @keyframes eop-spin { to { transform: rotate(360deg); } }
  #eop-db-wrap .eop-logo-mark {
    font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #5f5e5a;
  }
  #eop-db-wrap .eop-notoken { max-width: 440px; text-align: center; }
  #eop-db-wrap .eop-notoken h2 {
    font-size: 24px; font-weight: 400;
    color: #e8e8f0; margin-bottom: 10px;
  }
  #eop-db-wrap .eop-notoken p {
    font-family: 'Poppins', sans-serif;
    font-size: 13px; font-weight: 300;
    color: #6b6b80; margin-bottom: 20px;
  }
  #eop-db-wrap .eop-btn-primary {
    display: inline-block;
    padding: 11px 24px;
    background: #7c6af7;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 6px;
    transition: opacity 0.2s;
  }
  #eop-db-wrap .eop-btn-primary:hover { opacity: 0.85; }
  #eop-db-wrap .eop-btn-teal { background: #2ab89a; }

  /* ── Nav bar ── */
  #eop-db-wrap .eop-nav {
    background: #111118;
    border-bottom: 0.5px solid rgba(255,255,255,0.06);
    padding: 16px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  #eop-db-wrap .eop-nav-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  #eop-db-wrap .eop-nav-logo {
    height: 32px;
    width: auto;
  }
  #eop-db-wrap .eop-nav-divider {
    width: 0.5px;
    height: 22px;
    background: rgba(255,255,255,0.1);
  }
  #eop-db-wrap .eop-nav-portal {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #5f5e5a;
  }
  #eop-db-wrap .eop-badge {
    font-family: 'Poppins', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-radius: 100px;
    padding: 4px 14px;
    white-space: nowrap;
  }
  #eop-db-wrap .eop-badge-tact {
    color: #a89ff8;
    background: rgba(124,106,247,0.1);
    border: 0.5px solid rgba(124,106,247,0.25);
  }
  #eop-db-wrap .eop-badge-obst {
    color: #5dd8be;
    background: rgba(42,184,154,0.1);
    border: 0.5px solid rgba(42,184,154,0.25);
  }

  /* ── Hero ── */
  #eop-db-wrap .eop-hero {
    padding: 40px 40px 32px;
    display: flex;
    align-items: center;
    gap: 24px;
    border-bottom: 0.5px solid rgba(255,255,255,0.06);
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }
  #eop-db-wrap .eop-hero-token {
    width: 72px; height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }
  #eop-db-wrap .eop-hero-token.tact {
    border: 0.5px solid rgba(124,106,247,0.3);
    background: rgba(124,106,247,0.08);
  }
  #eop-db-wrap .eop-hero-token.obst {
    border: 0.5px solid rgba(42,184,154,0.3);
    background: rgba(42,184,154,0.08);
  }
  #eop-db-wrap .eop-hero-token img {
    width: 100%; height: 100%;
    object-fit: cover;
  }
  #eop-db-wrap .eop-hero-text h1 {
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 400;
    color: #e8e8f0;
    line-height: 1.2;
    margin-bottom: 6px;
  }
  #eop-db-wrap .eop-hero-text h1 em { color: #6b6b80; font-style: italic; }
  #eop-db-wrap .eop-hero-text p {
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 300;
    color: #6b6b80; margin: 0;
  }
  #eop-db-wrap .eop-wallet-tag {
    font-family: 'Courier New', monospace;
    font-size: 10px; color: #444441;
    display: block; margin-top: 6px;
  }

  /* ── Content area ── */
  #eop-db-wrap .eop-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 40px 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* ── Section ── */
  #eop-db-wrap .eop-section-label {
    font-family: 'Poppins', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6b6b80;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 0.5px solid rgba(255,255,255,0.06);
    display: block;
  }

  /* ── Cards grid ── */
  #eop-db-wrap .eop-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
  }
  #eop-db-wrap .eop-card {
    background: #111118;
    border: 0.5px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }
  #eop-db-wrap .eop-card:hover {
    border-color: rgba(255,255,255,0.14);
    transform: translateY(-2px);
  }
  #eop-db-wrap .eop-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1.5px;
  }
  #eop-db-wrap .eop-card.tact::before { background: linear-gradient(90deg, #7c6af7, transparent); }
  #eop-db-wrap .eop-card.obst::before { background: linear-gradient(90deg, #2ab89a, transparent); }

  #eop-db-wrap .eop-card-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    font-size: 16px;
  }
  #eop-db-wrap .eop-card.tact .eop-card-icon { background: rgba(124,106,247,0.1); }
  #eop-db-wrap .eop-card.obst .eop-card-icon { background: rgba(42,184,154,0.1); }

  #eop-db-wrap .eop-card-tag {
    font-family: 'Poppins', sans-serif;
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 5px;
    display: block;
  }
  #eop-db-wrap .eop-card.tact .eop-card-tag { color: #a89ff8; }
  #eop-db-wrap .eop-card.obst .eop-card-tag { color: #5dd8be; }

  #eop-db-wrap .eop-card-title {
    font-size: 15px; font-weight: 400;
    color: #e8e8f0;
    display: block; margin-bottom: 6px;
  }
  #eop-db-wrap .eop-card-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 300;
    color: #6b6b80; line-height: 1.55;
    display: block; margin-bottom: 16px;
  }
  #eop-db-wrap .eop-card-link {
    font-family: 'Poppins', sans-serif;
    font-size: 10px; font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: gap 0.2s;
  }
  #eop-db-wrap .eop-card-link:hover { gap: 8px; }
  #eop-db-wrap .eop-card.tact .eop-card-link { color: #7c6af7; }
  #eop-db-wrap .eop-card.obst .eop-card-link { color: #2ab89a; }
  #eop-db-wrap .eop-card-meta {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 0.5px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
  }
  #eop-db-wrap .eop-card-meta span {
    font-family: 'Poppins', sans-serif;
    font-size: 10px; color: #444441;
  }

  /* ── Video cards (Tangem) ── */
  #eop-db-wrap .eop-vid-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }
  #eop-db-wrap .eop-vid {
    background: #111118;
    border: 0.5px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  #eop-db-wrap .eop-vid:hover { border-color: rgba(255,255,255,0.14); }
  #eop-db-wrap .eop-vid-thumb {
    aspect-ratio: 16/9;
    background: #18181f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    position: relative;
  }
  #eop-db-wrap .eop-vid-soon {
    position: absolute;
    bottom: 6px; right: 6px;
    font-family: 'Poppins', sans-serif;
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: #111118;
    border: 0.5px solid rgba(255,255,255,0.1);
    padding: 2px 7px;
    border-radius: 4px;
    color: #5f5e5a;
  }
  #eop-db-wrap .eop-vid-info { padding: 12px 14px; }
  #eop-db-wrap .eop-vid-info h4 {
    font-size: 13px; font-weight: 400;
    color: #e8e8f0; margin-bottom: 3px;
  }
  #eop-db-wrap .eop-vid-info p {
    font-family: 'Poppins', sans-serif;
    font-size: 11px; color: #6b6b80;
  }

  /* ── Calendar ── */
  #eop-db-wrap .eop-calendar {
    background: #111118;
    border: 0.5px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    overflow: hidden;
  }
  #eop-db-wrap .eop-calendar-head {
    padding: 14px 18px;
    border-bottom: 0.5px solid rgba(255,255,255,0.07);
    font-family: 'Poppins', sans-serif;
    font-size: 12px; color: #6b6b80;
  }
  #eop-db-wrap .eop-calendar-note {
    font-family: 'Poppins', sans-serif;
    font-size: 11px; color: #444441;
    margin-top: 8px;
    font-style: italic;
    padding-left: 2px;
  }

  /* ── Agency Lab panel ── */
  #eop-db-wrap .eop-lab-panel {
    background: rgba(124,106,247,0.06);
    border: 0.5px solid rgba(124,106,247,0.2);
    border-radius: 8px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  #eop-db-wrap .eop-lab-tag {
    font-family: 'Poppins', sans-serif;
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #a89ff8;
    margin-bottom: 4px;
    display: block;
  }
  #eop-db-wrap .eop-lab-panel h3 {
    font-size: 16px; font-weight: 400;
    color: #e8e8f0; margin-bottom: 4px;
  }
  #eop-db-wrap .eop-lab-panel p {
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 300;
    color: #6b6b80; max-width: 460px;
  }

  /* ── Upgrade panel (OBST) ── */
  #eop-db-wrap .eop-upgrade {
    background: rgba(42,184,154,0.06);
    border: 0.5px solid rgba(42,184,154,0.2);
    border-radius: 8px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  #eop-db-wrap .eop-upgrade h3 {
    font-size: 16px; font-weight: 400;
    color: #e8e8f0; margin-bottom: 4px;
  }
  #eop-db-wrap .eop-upgrade p {
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 300;
    color: #6b6b80; max-width: 460px;
  }

  /* ── Footer ── */
  #eop-db-wrap .eop-footer {
    background: #111118;
    border-top: 0.5px solid rgba(255,255,255,0.06);
    padding: 16px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  #eop-db-wrap .eop-footer-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #eop-db-wrap .eop-footer-logo { height: 22px; width: auto; opacity: 0.5; }
  #eop-db-wrap .eop-footer-copy {
    font-family: 'Poppins', sans-serif;
    font-size: 10px; color: #444441;
  }
  #eop-db-wrap .eop-footer-links {
    display: flex;
    gap: 16px;
  }
  #eop-db-wrap .eop-footer-links a {
    font-family: 'Poppins', sans-serif;
    font-size: 10px; color: #5f5e5a;
    text-decoration: none;
    transition: color 0.2s;
  }
  #eop-db-wrap .eop-footer-links a:hover { color: #888780; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    #eop-db-wrap .eop-nav { padding: 14px 20px; }
    #eop-db-wrap .eop-hero { padding: 28px 20px 24px; }
    #eop-db-wrap .eop-content { padding: 24px 20px 40px; }
    #eop-db-wrap .eop-footer { padding: 14px 20px; flex-direction: column; align-items: flex-start; gap: 10px; }
    #eop-db-wrap .eop-lab-panel, #eop-db-wrap .eop-upgrade { flex-direction: column; }
  }
`;

// ── HELPERS ───────────────────────────────────────────────────
function injectStyles() {
  if (document.getElementById('eop-db-css')) return;
  const s = document.createElement('style');
  s.id = 'eop-db-css';
  s.textContent = css;
  document.head.appendChild(s);
}

const short = a => a ? a.slice(0,6) + '\u2026' + a.slice(-4) : '';

async function getBalance(walletAddr, contractAddr) {
  const rpc = `https://137.rpc.thirdweb.com/${CLIENT_ID}`;
  const payload = {
    jsonrpc: "2.0", id: 1, method: "eth_call",
    params: [{
      to: contractAddr,
      data: "0x70a08231" + walletAddr.slice(2).padStart(64, "0")
    }, "latest"]
  };
  try {
    const r = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000)
    });
    const j = await r.json();
    if (!j.error && j.result && j.result !== "0x" &&
        j.result !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
      return BigInt(j.result) > 0n ? 1 : 0;
    }
  } catch(e) {
    console.error("Balance error:", contractAddr, e.message);
  }
  return 0;
}

function getWallet() {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlWallet = params.get('wallet');
    if (urlWallet && urlWallet.startsWith('0x') && urlWallet.length === 42) return urlWallet;
  } catch(_) {}
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (!key.includes('thirdweb')) continue;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        if (raw.startsWith('0x') && raw.length === 42) return raw;
        const val = JSON.parse(raw);
        if (Array.isArray(val)) {
          for (const item of val) {
            if (typeof item === 'string' && item.startsWith('0x') && item.length === 42) return item;
            const addr = item?.address || item?.account?.address;
            if (addr && addr.startsWith('0x') && addr.length === 42) return addr;
          }
        }
        const addr = val?.address || val?.account?.address || val?.accounts?.[0];
        if (addr && addr.startsWith('0x') && addr.length === 42) return addr;
      } catch(_) {}
    }
  } catch(_) {}
  return null;
}

function calEmbed(id) {
  if (!id) return `
    <div style="min-height:160px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;padding:32px 20px">
      <span style="font-family:Poppins,sans-serif;font-size:12px;color:#444441;">📅 Calendar will appear here once scheduled</span>
    </div>`;
  return `<iframe src="https://lu.ma/embed/calendar/${id}/events"
    width="100%" height="320" frameborder="0"
    style="border:none;" allowfullscreen></iframe>`;
}

const navHTML = (portalLabel, badgeClass, badgeText) => `
  <div class="eop-nav">
    <div class="eop-nav-left">
      <img class="eop-nav-logo" src="${LOGO_URL}" alt="EOP Media"
        onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=&quot;font-family:Poppins,sans-serif;font-size:11px;color:#5f5e5a;letter-spacing:0.1em;text-transform:uppercase;&quot;>EOP Media</span>')">
      <div class="eop-nav-divider"></div>
      <span class="eop-nav-portal">${portalLabel}</span>
    </div>
    <span class="eop-badge ${badgeClass}">${badgeText}</span>
  </div>`;

const footerHTML = `
  <div class="eop-footer">
    <div class="eop-footer-left">
      <img class="eop-footer-logo" src="${LOGO_URL}" alt="EOP Media"
        onerror="this.style.display='none'">
      <span class="eop-footer-copy">© 2026 EOP Media, LLC</span>
    </div>
    <div class="eop-footer-links">
      <a href="${TERMS_URL}">Terms</a>
      <a href="${PRIVACY_URL}">Privacy</a>
      <a href="${CANCEL_URL}">Cancellation</a>
    </div>
  </div>`;

const videos = [
  {e:'📦', t:'Initial Setup',       d:'Unboxing and first-time wallet activation'},
  {e:'↗️', t:'Sending & Receiving', d:'How to send and receive crypto safely'},
  {e:'🔐', t:'Security',            d:'PIN management, backup cards, best practices'},
  {e:'♻️', t:'Recovery',            d:'Restoring access if you lose your card'},
];

const vidCards = () => videos.map(v => `
  <div class="eop-vid">
    <div class="eop-vid-thumb">${v.e}<span class="eop-vid-soon">Coming soon</span></div>
    <div class="eop-vid-info"><h4>${v.t}</h4><p>${v.d}</p></div>
  </div>`).join('');

// ── SCREENS ───────────────────────────────────────────────────
const loading = () => `
  <div id="eop-db-wrap"><div class="eop-center">
    <div class="eop-spinner"></div>
    <span class="eop-logo-mark">EOP Media — Verifying access</span>
  </div></div>`;

const noWallet = () => `
  <div id="eop-db-wrap"><div class="eop-center"><div class="eop-notoken">
    <img src="${LOGO_URL}" alt="EOP Media" style="height:36px;opacity:0.5;margin-bottom:24px;"
      onerror="this.style.display='none'">
    <h2>Session expired</h2>
    <p>No wallet session found. Return to the members page to reconnect.</p>
    <a class="eop-btn-primary" href="${MEMBERS_PAGE}">Connect wallet →</a>
  </div></div></div>`;

const noAccess = addr => `
  <div id="eop-db-wrap"><div class="eop-center"><div class="eop-notoken">
    <img src="${LOGO_URL}" alt="EOP Media" style="height:36px;opacity:0.5;margin-bottom:24px;"
      onerror="this.style.display='none'">
    <h2>No membership token</h2>
    <p>Wallet <code style="font-size:11px;color:#7c6af7">${short(addr)}</code> does not hold a TACT or OBST token.</p>
    <a class="eop-btn-primary" href="https://eopmedia.com/the-agency-collective/" style="margin-top:8px;">Learn about membership →</a>
  </div></div></div>`;

const tactDash = addr => `
  <div id="eop-db-wrap">
    ${navHTML('Member Portal', 'eop-badge-tact', 'Full Member')}

    <div class="eop-hero">
      <div class="eop-hero-token tact">
        <img src="${TACT_TOKEN_IMG}" alt="TACT Token" onerror="this.style.display='none'">
      </div>
      <div class="eop-hero-text">
        <h1>Agency Collective<br><em>Member Portal</em></h1>
        <p>TACT token verified · Full access active</p>
        <span class="eop-wallet-tag">${short(addr)}</span>
      </div>
    </div>

    <div class="eop-content">

      <div>
        <div class="eop-lab-panel">
          <div>
            <span class="eop-lab-tag">Eligible</span>
            <h3>The Agency Lab</h3>
            <p>As a TACT holder you are eligible for invitations to The Agency Lab — our collaborative co-creation space for members working on active projects.</p>
          </div>
          <a class="eop-btn-primary" href="mailto:info@eopmedia.com?subject=Agency Lab Invitation Request">Express interest →</a>
        </div>
      </div>

      <div>
        <span class="eop-section-label">Upcoming Sessions</span>
        <div class="eop-calendar">
          <div class="eop-calendar-head">Member Sessions — Strategy, Guest Speakers &amp; Biweekly Q&amp;A</div>
          ${calEmbed(LUMA_TACT_CALENDAR_ID)}
        </div>
      </div>

      <div>
        <span class="eop-section-label">Member Content</span>
        <div class="eop-cards">
          <div class="eop-card tact">
            <div class="eop-card-icon">📚</div>
            <span class="eop-card-tag">Knowledge base</span>
            <span class="eop-card-title">The Library</span>
            <span class="eop-card-desc">Articles, opinions, and training from select members — curated perspectives on building in the new economy.</span>
            <a class="eop-card-link" href="${LIBRARY_URL}">Browse the library →</a>
            <div class="eop-card-meta">
              <span>Articles</span><span>·</span><span>Opinions</span><span>·</span><span>Training</span>
            </div>
          </div>
          <div class="eop-card tact">
            <div class="eop-card-icon">🗳️</div>
            <span class="eop-card-tag">Community proposals</span>
            <span class="eop-card-title">The Lab</span>
            <span class="eop-card-desc">Review development proposals, leave comments, and vote on the ideas that should shape the collective's next chapter.</span>
            <a class="eop-card-link" href="${LAB_URL}">View proposals →</a>
            <div class="eop-card-meta">
              <span>Proposals</span><span>·</span><span>Comments</span><span>·</span><span>Voting</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <span class="eop-section-label">Tangem Setup Library</span>
        <div class="eop-vid-grid">${vidCards()}</div>
      </div>

    </div>

    ${footerHTML}
  </div>`;

const obstDash = addr => `
  <div id="eop-db-wrap">
    ${navHTML('Observer Portal', 'eop-badge-obst', 'Observer')}

    <div class="eop-hero">
      <div class="eop-hero-token obst">
        <img src="${OBST_TOKEN_IMG}" alt="OBST Token" onerror="this.style.display='none'">
      </div>
      <div class="eop-hero-text">
        <h1>Observer<br><em>Portal</em></h1>
        <p>OBST token verified · Observer access active</p>
        <span class="eop-wallet-tag">${short(addr)}</span>
      </div>
    </div>

    <div class="eop-content">

      <div>
        <span class="eop-section-label">Upcoming Sessions</span>
        <div class="eop-calendar">
          <div class="eop-calendar-head">Biweekly Sessions — Trends, Capabilities &amp; Live Q&amp;A</div>
          ${calEmbed(LUMA_OBST_CALENDAR_ID)}
        </div>
        <p class="eop-calendar-note">Sessions are live only — not recorded. Register to receive your Zoom link.</p>
      </div>

      <div>
        <span class="eop-section-label">Tangem Setup Library</span>
        <div class="eop-vid-grid">${vidCards()}</div>
      </div>

      <div>
        <span class="eop-section-label">Agency Collective</span>
        <div class="eop-upgrade">
          <div>
            <h3>Ready to go <em>deeper?</em></h3>
            <p>Full members get access to The Library, The Lab, strategy sessions, guest speakers, and eligibility for The Agency Lab — all with a TACT token.</p>
          </div>
          <a class="eop-btn-primary eop-btn-teal" href="${UPGRADE_URL}">Learn about membership →</a>
        </div>
      </div>

    </div>

    ${footerHTML}
  </div>`;

// ── INIT ──────────────────────────────────────────────────────
async function init() {
  const root = document.getElementById('eop-dashboard-root');
  if (!root) return;
  injectStyles();
  root.innerHTML = loading();

  const address = getWallet();
  if (!address) { root.innerHTML = noWallet(); return; }

  try {
    const [tact, obst] = await Promise.all([
      getBalance(address, TACT_ADDRESS),
      getBalance(address, OBST_ADDRESS)
    ]);
    if      (tact > 0) root.innerHTML = tactDash(address);
    else if (obst > 0) root.innerHTML = obstDash(address);
    else               root.innerHTML = noAccess(address);
  } catch(e) {
    console.error("Dashboard init error:", e);
    root.innerHTML = `
      <div id="eop-db-wrap"><div class="eop-center"><div class="eop-notoken">
        <h2>Verification error</h2>
        <p>Could not verify your token. Please try refreshing.</p>
        <a class="eop-btn-primary" href="${MEMBERS_PAGE}" style="margin-top:8px;">Back to members page →</a>
      </div></div></div>`;
  }
}

init();

})();
