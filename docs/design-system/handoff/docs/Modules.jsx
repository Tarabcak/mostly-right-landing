/** @jsx React.createElement */

// ─── simple Python / curl / HTTP syntax highlighter (span-based) ─────
function highlight(code, lang) {
  if (!code) return null;
  const rules = {
    python: [
      [/(#[^\n]*)/g, 'c'],
      [/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, 's'],
      [/\b(from|import|as|def|class|return|if|else|elif|for|in|with|not|and|or|None|True|False|await|async|try|except|raise)\b/g, 'k'],
      [/\b([A-Z][A-Za-z0-9_]*)\b/g, 'f'],
      [/\b(\d+(?:\.\d+)?)\b/g, 'n'],
    ],
    bash: [
      [/(#[^\n]*)/g, 'c'],
      [/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, 's'],
      [/(\$\w+|\$\{[^}]+\})/g, 'f'],
      [/(\s-{1,2}[a-zA-Z-]+)/g, 'k'],
    ],
    http: [
      [/^(GET|POST|PATCH|DELETE|PUT)\b/gm, 'k'],
      [/(#[^\n]*)/g, 'c'],
    ],
    json: [
      [/("(?:\\.|[^"\\])*")\s*:/g, 'f'],
      [/:\s*("(?:\\.|[^"\\])*")/g, 's'],
      [/\b(true|false|null)\b/g, 'k'],
      [/\b(-?\d+(?:\.\d+)?)\b/g, 'n'],
    ],
  };
  const r = rules[lang] || [];
  const marks = [];
  r.forEach(([re, cls]) => {
    code.replace(re, (m, g1, idx) => {
      const s = typeof g1 === 'string' ? idx + m.indexOf(g1) : idx;
      const len = typeof g1 === 'string' ? g1.length : m.length;
      marks.push({ s, e: s + len, cls });
      return m;
    });
  });
  marks.sort((a,b) => a.s - b.s);
  const out = [];
  let cur = 0;
  const taken = new Set();
  for (const m of marks) {
    if (m.s < cur) continue;
    if (m.s > cur) out.push(code.slice(cur, m.s));
    out.push({ t: code.slice(m.s, m.e), cls: m.cls });
    cur = m.e;
  }
  if (cur < code.length) out.push(code.slice(cur));
  return out.map((p, i) => typeof p === 'string' ? p :
    React.createElement('span', { key: i, className: 'tk-' + p.cls }, p.t)
  );
}

// ─── CodeTabs ───────────────────────────────────────────────────────
function CodeTabs({ tabs, defaultTab }) {
  const [active, setActive] = React.useState(defaultTab || tabs[0].label);
  const [copied, setCopied] = React.useState(false);
  const current = tabs.find(t => t.label === active) || tabs[0];
  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(current.code);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div style={{
      border: '1px solid var(--docs-border-strong)',
      background: 'var(--docs-bg-code)',
      margin: '24px 0',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 1px 0 rgba(0,0,0,0.4)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--docs-border-strong)',
        background: 'rgba(255,255,255,0.02)',
        paddingLeft: 14,
      }}>
        <span style={{ display: 'flex', gap: 5, marginRight: 14 }}>
          {['#3a3a3a','#2a2a2a','#2a2a2a'].map((c,i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </span>
        {tabs.map(t => (
          <button key={t.label} onClick={() => setActive(t.label)} style={{
            background: active === t.label ? 'var(--docs-bg-code)' : 'transparent',
            border: 0,
            padding: '10px 14px',
            font: 'inherit', fontSize: 11, letterSpacing: '.06em', textTransform: 'lowercase', fontWeight: 500,
            color: active === t.label ? 'var(--docs-fg-heading)' : 'var(--docs-fg-subtle)',
            borderBottom: active === t.label ? '1px solid var(--docs-accent-live)' : '1px solid transparent',
            marginBottom: -1, cursor: 'pointer',
            fontFamily: 'var(--mono)',
          }}>{t.label}</button>
        ))}
        <span style={{ flex: 1 }} />
        {current.filename && (
          <span style={{ fontSize: 11, color: 'var(--docs-fg-faint)', padding: '0 12px', fontFamily: 'var(--mono)' }}>{current.filename}</span>
        )}
        <button onClick={copy} style={{
          background: 'transparent', border: 0,
          padding: '10px 14px',
          font: 'inherit', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
          color: copied ? 'var(--docs-accent-live)' : 'var(--docs-fg-muted)',
          cursor: 'pointer',
        }}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <div style={{ display: 'flex', overflow: 'auto' }}>
        <div aria-hidden style={{
          padding: '18px 12px 18px 16px',
          fontSize: 13, lineHeight: 1.7,
          color: 'var(--docs-fg-faint)',
          fontFamily: 'var(--mono)',
          textAlign: 'right',
          userSelect: 'none',
          borderRight: '1px solid var(--docs-border)',
          background: 'rgba(0,0,0,0.25)',
          minWidth: 36,
          fontVariantNumeric: 'tabular-nums',
        }}>{current.code.split('\n').map((_, i) => <div key={i}>{i+1}</div>)}</div>
        <pre style={{
          margin: 0, padding: '18px 20px',
          fontSize: 13, lineHeight: 1.7,
          color: 'var(--code-fg)',
          flex: 1,
          whiteSpace: 'pre',
        }}>{highlight(current.code, current.lang)}</pre>
      </div>
    </div>
  );
}

// ─── Endpoint header ───────────────────────────────────────────────
function Endpoint({ method, path, auth, rate }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      padding: '14px 18px', margin: '16px 0 28px',
      background: 'var(--docs-bg-elevated)',
      border: '1px solid var(--docs-border)',
      fontFamily: 'var(--mono)',
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
        color: `var(--docs-${method.toLowerCase()})`,
        padding: '2px 8px',
        border: `1px solid var(--docs-${method.toLowerCase()})`,
      }}>{method}</span>
      <code style={{ fontSize: 14, color: 'var(--docs-fg-heading)', background: 'transparent', border: 0, padding: 0 }}>{path}</code>
      <span style={{ flex: 1 }} />
      {auth && <span style={{ fontSize: 11, color: 'var(--docs-fg-subtle)' }}>auth · <span style={{ color: 'var(--docs-fg-muted)' }}>{auth}</span></span>}
      {rate && <span style={{ fontSize: 11, color: 'var(--docs-fg-subtle)' }}>rate · <span style={{ color: 'var(--docs-fg-muted)' }}>{rate}</span></span>}
    </div>
  );
}

// ─── Params table ───────────────────────────────────────────────────
function Params({ rows }) {
  const [open, setOpen] = React.useState({});
  return (
    <div style={{ border: '1px solid var(--docs-border)', margin: '20px 0' }}>
      {rows.map((r, i) => (
        <div key={r.name} style={{ borderTop: i === 0 ? 0 : '1px solid var(--docs-border)' }}>
          <div
            onClick={() => r.children && setOpen(o => ({ ...o, [r.name]: !o[r.name] }))}
            style={{
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 16,
              padding: '14px 18px',
              cursor: r.children ? 'pointer' : 'default',
              alignItems: 'start',
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <code style={{ fontSize: 13, fontWeight: 600, color: 'var(--docs-fg-heading)', background: 'transparent', border: 0, padding: 0 }}>{r.name}</code>
                <span style={{ fontSize: 11, color: 'var(--docs-fg-subtle)' }}>{r.type}</span>
                {r.required && <span style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--docs-caution)', textTransform: 'uppercase' }}>required</span>}
                {r.children && <span style={{ fontSize: 11, color: 'var(--docs-fg-faint)', marginLeft: 'auto' }}>{open[r.name] ? '▾' : '▸'} {r.children.length} fields</span>}
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: 'var(--docs-fg-muted)' }}>{r.desc}</p>
              {r.default && <p style={{ margin: 0, fontSize: 11, color: 'var(--docs-fg-faint)' }}>default: <code>{r.default}</code></p>}
            </div>
          </div>
          {r.children && open[r.name] && (
            <div style={{ padding: '0 18px 14px 32px', borderLeft: '2px solid var(--docs-border-strong)', marginLeft: 18 }}>
              {r.children.map(c => (
                <div key={c.name} style={{ padding: '10px 0', borderTop: '1px solid var(--docs-border)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <code style={{ fontSize: 12, color: 'var(--docs-fg-heading)', background: 'transparent', border: 0, padding: 0 }}>{c.name}</code>
                    <span style={{ fontSize: 11, color: 'var(--docs-fg-subtle)' }}>{c.type}</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--docs-fg-muted)' }}>{c.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Callout ────────────────────────────────────────────────────────
function Callout({ kind = 'note', title, children }) {
  const colors = {
    note: 'var(--docs-note)',
    tip: 'var(--docs-tip)',
    warn: 'var(--docs-warn)',
    caution: 'var(--docs-caution)',
  };
  const labels = { note: 'NOTE', tip: 'TIP', warn: 'WARNING', caution: 'CAUTION' };
  return (
    <div style={{
      margin: '20px 0', padding: '14px 18px',
      border: '1px solid var(--docs-border)',
      borderLeft: `3px solid ${colors[kind]}`,
      background: 'var(--docs-bg-elevated)',
      display: 'flex', gap: 14,
    }}>
      <div style={{ minWidth: 64 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', color: colors[kind] }}>{labels[kind]}</span>
      </div>
      <div style={{ flex: 1 }}>
        {title && <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: 'var(--docs-fg-heading)' }}>{title}</p>}
        <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--docs-fg-muted)' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Diff block (without/with) ──────────────────────────────────────
function Diff({ before, after }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, border: '1px solid var(--docs-border)', background: 'var(--docs-border)', margin: '20px 0' }}>
      {[{ side: 'Without Mostly Right', code: before, bad: true }, { side: 'With Mostly Right', code: after, bad: false }].map(col => (
        <div key={col.side} style={{ background: 'var(--docs-bg-code)' }}>
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--docs-border)',
            fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
            color: col.bad ? 'var(--docs-caution)' : 'var(--docs-accent-live)',
          }}>{col.side}</div>
          <pre style={{ margin: 0, padding: '14px 16px', fontSize: 12, lineHeight: 1.7, color: 'var(--code-fg)', overflow: 'auto' }}>{highlight(col.code, 'python')}</pre>
        </div>
      ))}
    </div>
  );
}

// ─── Playground ─────────────────────────────────────────────────────
function Playground() {
  const [city, setCity] = React.useState('NYC');
  const [asOf, setAsOf] = React.useState('2024-07-04T18:00:00Z');
  const [format, setFormat] = React.useState('json');
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState(null);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const jitter = () => (0.58 + Math.random() * 0.08).toFixed(3);
      const data = {
        city, as_of: asOf,
        market: { id: 'KXHIGHNY-24JUL04-T88', mid: parseFloat(jitter()), bid: 0.57, ask: 0.61 },
        observations: { temp_f: 87.4, source: 'IEM', ts: '2024-07-04T17:51:00Z' },
        forecast: { model: 'NBM', temp_f: 88, issued: '2024-07-04T06:00:00Z' },
        settlement: { station: 'KNYC', basis: 'NWS CLI', lst: true },
        version: 'v0.4.2',
      };
      setResponse(format === 'json' ? JSON.stringify(data, null, 2) : toToon(data));
      setLoading(false);
    }, 650);
  };

  return (
    <div style={{ border: '1px solid var(--docs-border)', margin: '24px 0' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--docs-border)', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--docs-fg-muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 6, height: 6, background: 'var(--docs-accent-live)', display: 'inline-block' }} />
        Live playground
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--docs-border)' }}>
        {/* Inputs */}
        <div style={{ background: 'var(--docs-bg-code)', padding: '18px 20px' }}>
          <p style={{ margin: '0 0 16px', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--docs-fg-faint)' }}>Request</p>
          <Field label="city" value={city} onChange={setCity} />
          <Field label="as_of" value={asOf} onChange={setAsOf} />
          <div style={{ margin: '14px 0 18px' }}>
            <label style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--docs-fg-subtle)', display: 'block', marginBottom: 6 }}>format</label>
            <div style={{ display: 'flex', border: '1px solid var(--docs-border-strong)' }}>
              {['json','toon'].map(f => (
                <button key={f} onClick={() => setFormat(f)} style={{
                  flex: 1, padding: '8px 10px', font: 'inherit', fontSize: 12,
                  background: format === f ? 'var(--docs-fg-heading)' : 'transparent',
                  color: format === f ? 'var(--docs-bg)' : 'var(--docs-fg-muted)',
                  border: 0, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.08em',
                }}>{f}</button>
              ))}
            </div>
          </div>
          <button onClick={run} disabled={loading} style={{
            width: '100%', padding: '12px 16px',
            background: 'var(--docs-fg-heading)', color: 'var(--docs-bg)',
            border: '2px solid var(--docs-fg-heading)',
            font: 'inherit', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em',
            cursor: 'pointer',
          }}>{loading ? 'Running…' : 'Run request →'}</button>
        </div>
        {/* Response */}
        <div style={{ background: 'var(--docs-bg-code)' }}>
          <div style={{ padding: '18px 20px 10px', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--docs-fg-faint)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Response</span>
            {response && <span style={{ color: 'var(--docs-accent-live)' }}>200 · 43ms</span>}
          </div>
          <pre style={{ margin: 0, padding: '0 20px 20px', fontSize: 12, lineHeight: 1.7, color: 'var(--code-fg)', overflow: 'auto', maxHeight: 300, minHeight: 240 }}>
            {response ? highlight(response, format === 'json' ? 'json' : 'python') : <span style={{ color: 'var(--docs-fg-faint)' }}>{'// click "Run request" to see a real response'}</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--docs-fg-subtle)', display: 'block', marginBottom: 4 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', padding: '8px 10px',
        background: 'transparent', color: 'var(--docs-fg-heading)',
        border: '1px solid var(--docs-border-strong)',
        font: 'inherit', fontSize: 13, outline: 'none',
      }} onFocus={e => e.target.style.borderColor = 'var(--docs-border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--docs-border-strong)'} />
    </div>
  );
}
function toToon(obj, indent = 0) {
  // rough TOON-ish serializer for visual demo
  const pad = '  '.repeat(indent);
  if (obj === null) return 'null';
  if (typeof obj !== 'object') return typeof obj === 'string' ? obj : String(obj);
  return Object.entries(obj).map(([k, v]) => {
    if (v && typeof v === 'object') return pad + k + ':\n' + toToon(v, indent + 1);
    return pad + k + ': ' + (typeof v === 'string' ? v : String(v));
  }).join('\n');
}

// ─── AsTools preview ────────────────────────────────────────────────
function AsToolsPreview() {
  const tools = [
    { name: 'snapshot', desc: 'Get market + real-world data for a contract at a point in time.', params: ['city','as_of','format'] },
    { name: 'candles', desc: 'OHLC-style price bars for a market.', params: ['market_id','interval','start','end'] },
    { name: 'book_snapshot', desc: 'Level-2 order book at a given timestamp.', params: ['market_id','ts'] },
    { name: 'markets', desc: 'List contracts matching filters.', params: ['platform','vertical','status'] },
  ];
  return (
    <div style={{ border: '1px solid var(--docs-border)', margin: '24px 0', background: 'var(--docs-bg-elevated)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--docs-border)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--docs-fg-muted)' }}>
        <span>client.as_tools() → Anthropic tool definitions</span>
        <span style={{ color: 'var(--docs-fg-faint)' }}>{tools.length} tools</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--docs-border)' }}>
        {tools.map(t => (
          <div key={t.name} style={{ background: 'var(--docs-bg-code)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <code style={{ fontSize: 13, fontWeight: 600, color: 'var(--docs-fg-heading)', background: 'transparent', border: 0, padding: 0 }}>{t.name}</code>
              <span style={{ fontSize: 10, color: 'var(--docs-fg-faint)' }}>{t.params.length} params</span>
            </div>
            <p style={{ margin: '6px 0 10px', fontSize: 12, color: 'var(--docs-fg-muted)', lineHeight: 1.55 }}>{t.desc}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {t.params.map(p => (
                <span key={p} style={{ fontSize: 10, padding: '2px 6px', border: '1px solid var(--docs-border-strong)', color: 'var(--docs-fg-muted)' }}>{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CmdK palette ──────────────────────────────────────────────────
function CmdK({ open, onClose }) {
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);

  const all = [
    { group: 'Pages', t: 'Quickstart', sub: 'Install → first query in 60s', hint: '/quickstart' },
    { group: 'Pages', t: 'Authentication', sub: 'API keys, scopes, rotation', hint: '/auth' },
    { group: 'Pages', t: 'Point-in-time queries', sub: 'as_of semantics', hint: '/pit' },
    { group: 'API', t: 'snapshot()', sub: 'GET /v1/snapshot', hint: 'python' },
    { group: 'API', t: 'as_tools()', sub: 'Export SDK as Anthropic tools', hint: 'python' },
    { group: 'API', t: 'candles()', sub: 'GET /v1/candles', hint: 'python' },
    { group: 'Recent', t: 'Weather contracts', sub: 'Guides', hint: 'visited 2d ago' },
    { group: 'Ask AI', t: `Ask "${q || 'How do I backtest?'}"`, sub: 'Powered by Claude · answers cited from docs', hint: '↵', ai: true },
  ];
  const filtered = q ? all.filter(x => (x.t + x.sub).toLowerCase().includes(q.toLowerCase()) || x.ai) : all;

  React.useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 20); } }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(filtered.length - 1, s + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
      if (e.key === 'Enter') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered.length, onClose]);

  if (!open) return null;

  // group ordering
  const groups = ['Ask AI','Recent','Pages','API'];
  const byGroup = {};
  filtered.forEach((it, i) => { (byGroup[it.group] = byGroup[it.group] || []).push({ ...it, _i: i }); });

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.72)',
      display: 'flex', justifyContent: 'center', paddingTop: '12vh',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 620, maxWidth: 'calc(100vw - 40px)',
        background: 'var(--docs-bg)', border: '1px solid var(--docs-border-strong)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', maxHeight: '72vh',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--docs-border)' }}>
          <span style={{ color: 'var(--docs-fg-faint)' }}>⌕</span>
          <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setSel(0); }} placeholder="Search docs, API methods, ask AI…"
            style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', font: 'inherit', fontSize: 14, color: 'var(--docs-fg-heading)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.1em', border: '1px solid var(--docs-border)', padding: '1px 6px', color: 'var(--docs-fg-subtle)' }}>ESC</span>
        </div>
        <div style={{ overflowY: 'auto' }}>
          {groups.map(g => byGroup[g] && (
            <div key={g}>
              <div style={{ padding: '10px 18px 6px', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--docs-fg-faint)' }}>{g}</div>
              {byGroup[g].map(it => (
                <div key={it._i} onMouseEnter={() => setSel(it._i)} style={{
                  padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12,
                  background: sel === it._i ? 'var(--docs-bg-elevated)' : 'transparent',
                  borderLeft: sel === it._i ? '2px solid var(--docs-fg-heading)' : '2px solid transparent',
                  cursor: 'pointer',
                }}>
                  <span style={{ color: it.ai ? 'var(--docs-accent-live)' : 'var(--docs-fg-faint)', fontSize: 13 }}>{it.ai ? '✦' : '›'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--docs-fg-heading)', fontSize: 13 }}>{it.t}</div>
                    <div style={{ color: 'var(--docs-fg-subtle)', fontSize: 11, marginTop: 2 }}>{it.sub}</div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--docs-fg-faint)' }}>{it.hint}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 18, padding: '10px 18px', borderTop: '1px solid var(--docs-border)', fontSize: 11, color: 'var(--docs-fg-faint)' }}>
          <span><kbd style={kbd}>↑</kbd><kbd style={kbd}>↓</kbd> navigate</span>
          <span><kbd style={kbd}>↵</kbd> open</span>
          <span><kbd style={kbd}>esc</kbd> close</span>
          <span style={{ marginLeft: 'auto' }}>Mostly Right · ⌘K</span>
        </div>
      </div>
    </div>
  );
}
const kbd = { border: '1px solid var(--docs-border-strong)', padding: '0 5px', marginRight: 4, fontSize: 10, color: 'var(--docs-fg-subtle)' };

// Expose
Object.assign(window, { CodeTabs, Endpoint, Params, Callout, Diff, Playground, AsToolsPreview, CmdK, highlight });
