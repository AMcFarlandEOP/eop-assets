/**
 * EOP Dashboard Bundle — eop-dashboard.iife.js
 * Host on GitHub Pages alongside eop-connect.iife.js
 *
 * Usage on WordPress page:
 *   <div id="eop-dashboard-root"></div>
 *   <script src="https://AMcFarlandEOP.github.io/eop-assets/eop-dashboard.iife.js"></script>
 *
 * Before deploying, replace the two Luma calendar IDs:
 *   LUMA_TACT_CALENDAR_ID  — your TACT member sessions calendar
 *   LUMA_OBST_CALENDAR_ID  — your Observer biweekly sessions calendar
 */

(async () => {

// ── CONFIG ────────────────────────────────────
const TACT_ADDRESS = "0xddD6C7D0494B2fD4fA3E3F25485b1f210e8DFDd2";
const OBST_ADDRESS = "0xa92bAee9c2445B8c400CE13e0110c1E4f6594Af6";
const MEMBERS_PAGE = "https://eopmedia.com/members/";

// ⬇ Replace these with your real Luma calendar IDs when ready
const LUMA_TACT_CALENDAR_ID = https://luma.com/embed/calendar/cal-rZpQJCqIvCR4nlC/events; // e.g. "cal-xxxxxxxxxxxxxxxx"
const LUMA_OBST_CALENDAR_ID = https://luma.com/embed/calendar/cal-rZpQJCqIvCR4nlC/events; // e.g. "cal-xxxxxxxxxxxxxxxx"

const RPC_ENDPOINTS = [
  "https://rpc.ankr.com/polygon",
  "https://polygon-bor-rpc.publicnode.com",
  "https://polygon.drpc.org"
];

// ── STYLES ────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --bg:          #0a0a0f;
    --surface:     #111118;
    --surface2:    #18181f;
    --border:      rgba(255,255,255,0.07);
    --border-hi:   rgba(255,255,255,0.14);
    --text:        #e8e8f0;
    --muted:       #6b6b80;
    --tact:        #7c6af7;
    --tact-glow:   rgba(124,106,247,0.18);
    --tact-dim:    rgba(124,106,247,0.08);
    --obst:        #2ab89a;
    --obst-glow:   rgba(42,184,154,0.18);
    --obst-dim:    rgba(42,184,154,0.08);
  }

  #eop-db-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  #eop-db-wrap {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--text);
    background: var(--bg);
    min-height: 100vh;
    line-height: 1.6;
  }

  .eop-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    gap: 20px;
    text-align: center;
    padding: 40px 20px;
  }

  .eop-spinner {
    width: 36px; height: 36px;
    border: 2px solid rgba(255,255,255,0.1);
    border-top-color: var(--tact);
    border-radius: 50%;
    animation: eop-spin 0.8s linear infinite;
  }
  @keyframes eop-spin { to { transform: rotate(360deg); } }

  .eop-logo-mark {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .eop-notoken { max-width: 480px; }
  .eop-notoken h2 {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .eop-notoken p { color: var(--muted); font-size: 15px; margin-bottom: 16px; }

  .eop-btn {
    display: inline-block;
    padding: 12px 28px;
    background: var(--tact);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 6px;
    transition: opacity 0.2s;
    margin-top: 8px;
  }
  .eop-btn:hover { opacity: 0.85; }
  .eop-btn.obst-btn { background: var(--obst); }

  .eop-dash {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 24px 80px;
    animation: eop-fadeUp 0.5s ease both;
  }
  @keyframes eop-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .eop-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 48px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .eop-header-left h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(22px, 4vw, 34px);
    font-weight: 800;
    line-height: 1.15;
  }
  .eop-header-left p { color: var(--muted); margin-top: 6px; font-size: 14px; }
  .eop-wallet-tag {
    font-size: 12px;
    color: var(--muted);
    margin-top: 10px;
    font-family: monospace;
    letter-spacing: 0.04em;
  }

  .eop-tier-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border-radius: 100px;
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .eop-tier-badge.tact-badge {
    background: var(--tact-dim);
    border: 1px solid rgba(124,106,247,0.3);
    color: #a89ff8;
  }
  .eop-tier-badge.obst-badge {
    background: var(--obst-dim);
    border: 1px solid rgba(42,184,154,0.3);
    color: #5dd8be;
  }
  .eop-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .tact-badge .eop-badge-dot { background: var(--tact); box-shadow: 0 0 6px var(--tact); }
  .obst-badge .eop-badge-dot { background: var(--obst); box-shadow: 0 0 6px var(--obst); }

  .eop-section { margin-bottom: 40px; }
  .eop-section-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .eop-section-head h2 {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }
  .eop-section-line { flex: 1; height: 1px; background: var(--border); }

  .eop-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .eop-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .eop-card:hover { border-color: var(--border-hi); transform: translateY(-2px); }
  .eop-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 12px 12px 0 0;
  }
  .eop-card.tc::before { background: linear-gradient(90deg, var(--tact), transparent); }
  .eop-card.oc::before { background: linear-gradient(90deg, var(--obst), transparent); }

  .eop-card-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 18px;
  }
  .tc .eop-card-icon { background: var(--tact-dim); }
  .oc .eop-card-icon { background: var(--obst-dim); }

  .eop-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .eop-card p { font-size: 13px; color: var(--muted); line-height: 1.55; margin-bottom: 20px; }
  .eop-card-link {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: gap 0.2s;
  }
  .tc .eop-card-link { color: var(--tact); }
  .oc .eop-card-link { color: var(--obst); }
  .eop-card-link:hover { gap: 10px; }

  .eop-calendar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .eop-calendar-head {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
  }
  .eop-calendar-head h3 {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
  }
  .eop-cal-placeholder {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 40px 20px;
    text-align: center;
  }
  .eop-cal-placeholder .ci { font-size: 28px; }
  .eop-cal-placeholder p { color: var(--muted); font-size: 13px; }
  .eop-cal-placeholder code {
    font-size: 11px;
    color: var(--tact);
    background: var(--tact-dim);
    padding: 6px 12px;
    border-radius: 4px;
    font-family: monospace;
  }

  .eop-video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  .eop-vid {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .eop-vid:hover { border-color: var(--border-hi); }
  .eop-vid-thumb {
    aspect-ratio: 16/9;
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    position: relative;
  }
  .eop-vid-soon {
    position: absolute;
    bottom: 8px; right: 8px;
    font-size: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 4px;
    color: var(--muted);
  }
  .eop-vid-info { padding: 14px 16px; }
  .eop-vid-info h4 {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .eop-vid-info p { font-size: 12px; color: var(--muted); }

  .eop-lab {
    background: linear-gradient(135deg, var(--tact-dim) 0%, var(--surface) 60%);
    border: 1px solid rgba(124,106,247,0.25);
    border-radius: 14px;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }
  .eop-lab-tag {
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--tact);
    margin-bottom: 10px;
    display: block;
  }
  .eop-lab h3 {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 8px;
  }
  .eop-lab p { color: var(--muted); font-size: 14px; max-width: 480px; }

  @media (max-width: 600px) {
    .eop-dash { padding: 32px 16px 60px; }
    .eop-header, .eop-lab { flex-direction: column; }
    .eop-grid, .eop-video-grid { grid-template-columns: 1fr; }
  }
`;

// ── HELPERS ───────────────────────────────────
function injectStyles() {
  if (document.getElementById('eop-db-css')) return;
  const s = document.createElement('style');
  s.id = 'eop-db-css';
  s.textContent = css;
  document.head.appendChild(s);
}

const short = a => a ? a.slice(0,6) + '…' + a.slice(-4) : '';

async function getBalance(wallet, token) {
  const w = wallet.slice(2).padStart(64,'0');
  const d = '0x00fdd58e' + w + '1'.padStart(64,'0');
  for (const rpc of RPC_ENDPOINTS) {
    try {
      const r = await fetch(rpc, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_call',params:[{to:token,data:d},'latest']}),
        signal: AbortSignal.timeout(5000)
      });
      const j = await r.json();
      if (j.result && j.result !== '0x') return BigInt(j.result) > 0n ? 1 : 0;
    } catch(_){ continue; }
  }
  return 0;
}

function getWallet() {
  try {
    if (!localStorage.getItem('thirdweb:active-wallet-id')) return null;
    for (const k of Object.keys(localStorage)) {
      if (!k.startsWith('thirdweb')) continue;
      try {
        const v = JSON.parse(localStorage.getItem(k));
        const a = v?.address || v?.account?.address || v?.accounts?.[0];
        if (a?.startsWith('0x') && a.length === 42) return a;
      } catch(_){}
    }
  } catch(_){}
  return null;
}

function calEmbed(id, label) {
  if (!id) return `
    <div class="eop-cal-placeholder">
      <div class="ci">📅</div>
      <p>Sessions calendar will appear here</p>
      <code>Replace LUMA_${label}_CALENDAR_ID with your calendar ID</code>
    </div>`;
  return `<iframe src="https://lu.ma/embed/calendar/${id}/events"
    width="100%" height="350" frameborder="0"
    style="border:none" allowfullscreen></iframe>`;
}

const videos = [
  {e:'📦',t:'Initial Setup',d:'Unboxing and first-time wallet activation'},
  {e:'↗️',t:'Sending & Receiving',d:'How to send and receive crypto safely'},
  {e:'🔐',t:'Security',d:'PIN management, backup cards, best practices'},
  {e:'♻️',t:'Recovery',d:'Restoring access if you lose your card'},
];

const vidCards = () => videos.map(v=>`
  <div class="eop-vid">
    <div class="eop-vid-thumb">${v.e}<span class="eop-vid-soon">Coming soon</span></div>
    <div class="eop-vid-info"><h4>${v.t}</h4><p>${v.d}</p></div>
  </div>`).join('');

// ── SCREENS ───────────────────────────────────
const loading = () => `
  <div id="eop-db-wrap"><div class="eop-center">
    <div class="eop-spinner"></div>
    <span class="eop-logo-mark">EOP Media — Verifying access</span>
  </div></div>`;

const noWallet = () => `
  <div id="eop-db-wrap"><div class="eop-center"><div class="eop-notoken">
    <div class="eop-logo-mark" style="margin-bottom:24px">EOP Media</div>
    <h2>Connect your wallet</h2>
    <p>Your session has expired or no wallet was found.</p>
    <a class="eop-btn" href="${MEMBERS_PAGE}">Connect wallet →</a>
  </div></div></div>`;

const noAccess = addr => `
  <div id="eop-db-wrap"><div class="eop-center"><div class="eop-notoken">
    <div class="eop-logo-mark" style="margin-bottom:24px">EOP Media</div>
    <h2>No membership token</h2>
    <p>Wallet <code style="font-size:12px;color:var(--tact)">${short(addr)}</code> does not hold a TACT or OBST token.</p>
    <a class="eop-btn" href="https://eopmedia.com/the-agency-collective/">Learn about membership →</a>
  </div></div></div>`;

const tactDash = addr => `
  <div id="eop-db-wrap"><div class="eop-dash">
    <div class="eop-header">
      <div class="eop-header-left">
        <h1>Agency Collective<br>Member Portal</h1>
        <p>Full member access — TACT token verified</p>
        <div class="eop-wallet-tag">${short(addr)}</div>
      </div>
      <div><div class="eop-tier-badge tact-badge"><span class="eop-badge-dot"></span>Full Member</div></div>
    </div>

    <div class="eop-section">
      <div class="eop-lab">
        <div>
          <span class="eop-lab-tag">Eligible</span>
          <h3>The Agency Lab</h3>
          <p>As a TACT holder you are eligible for invitations to The Agency Lab — our collaborative co-creation space for members working on active projects.</p>
        </div>
        <a class="eop-btn" href="mailto:info@eopmedia.com?subject=Agency Lab Invitation Request">Express interest →</a>
      </div>
    </div>

    <div class="eop-section">
      <div class="eop-section-head"><h2>Upcoming Sessions</h2><div class="eop-section-line"></div></div>
      <div class="eop-calendar">
        <div class="eop-calendar-head"><h3>Member Sessions — Strategy, Guest Speakers &amp; Biweekly Q&amp;A</h3></div>
        ${calEmbed(LUMA_TACT_CALENDAR_ID, 'TACT')}
      </div>
    </div>

    <div class="eop-section">
      <div class="eop-section-head"><h2>Member Content</h2><div class="eop-section-line"></div></div>
      <div class="eop-grid">
        <div class="eop-card tc">
          <div class="eop-card-icon">📊</div>
          <h3>Strategy Sessions</h3>
          <p>Deeper crypto planning, market context and small business enablement — recorded and archived by topic.</p>
          <a class="eop-card-link" href="#">Browse archive →</a>
        </div>
        <div class="eop-card tc">
          <div class="eop-card-icon">🎙️</div>
          <h3>Guest Speakers</h3>
          <p>Expert interviews and panels covering the topics that matter most to founders and creators in the new economy.</p>
          <a class="eop-card-link" href="#">View sessions →</a>
        </div>
        <div class="eop-card tc">
          <div class="eop-card-icon">🗳️</div>
          <h3>Governance</h3>
          <p>Participate in proposals and weighted voting that shapes the direction of The Agency Collective.</p>
          <a class="eop-card-link" href="#">Open proposals →</a>
        </div>
      </div>
    </div>

    <div class="eop-section">
      <div class="eop-section-head"><h2>Tangem Setup Library</h2><div class="eop-section-line"></div></div>
      <div class="eop-video-grid">${vidCards()}</div>
    </div>
  </div></div>`;

const obstDash = addr => `
  <div id="eop-db-wrap"><div class="eop-dash">
    <div class="eop-header">
      <div class="eop-header-left">
        <h1>Observer Portal</h1>
        <p>Welcome — your Tangem full-price benefit is active</p>
        <div class="eop-wallet-tag">${short(addr)}</div>
      </div>
      <div><div class="eop-tier-badge obst-badge"><span class="eop-badge-dot"></span>Observer</div></div>
    </div>

    <div class="eop-section">
      <div class="eop-section-head"><h2>Upcoming Sessions</h2><div class="eop-section-line"></div></div>
      <div class="eop-calendar">
        <div class="eop-calendar-head"><h3>Biweekly Sessions — Trends, Capabilities &amp; Live Q&amp;A</h3></div>
        ${calEmbed(LUMA_OBST_CALENDAR_ID, 'OBST')}
      </div>
      <p style="font-size:12px;color:var(--muted);margin-top:12px;padding-left:4px">
        Sessions are live only — not recorded. Register to receive your Zoom link.
      </p>
    </div>

    <div class="eop-section">
      <div class="eop-section-head"><h2>Tangem Setup Library</h2><div class="eop-section-line"></div></div>
      <div class="eop-video-grid">${vidCards()}</div>
    </div>

    <div class="eop-section">
      <div class="eop-section-head"><h2>Agency Collective</h2><div class="eop-section-line"></div></div>
      <div class="eop-card oc" style="max-width:540px">
        <div class="eop-card-icon">🚀</div>
        <h3>Ready to go deeper?</h3>
        <p>Agency Collective members get strategy sessions, guest speakers, governance and eligibility for The Agency Lab — all with a TACT token.</p>
        <a class="eop-card-link" href="https://eopmedia.com/the-agency-collective/">Learn about membership →</a>
      </div>
    </div>
  </div></div>`;

// ── INIT ──────────────────────────────────────
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
    root.innerHTML = `
      <div id="eop-db-wrap"><div class="eop-center"><div class="eop-notoken">
        <div class="eop-logo-mark" style="margin-bottom:16px">EOP Media</div>
        <h2>Verification error</h2>
        <p>Could not verify your token. Please try refreshing.</p>
        <a class="eop-btn" href="${MEMBERS_PAGE}" style="margin-top:16px">Back to members page →</a>
      </div></div></div>`;
  }
}

init();

})();
