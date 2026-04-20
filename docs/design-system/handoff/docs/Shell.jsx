/** @jsx React.createElement */
const { useState, useEffect, useRef, useMemo } = React;

// ─── TopBar (calmer: just logo + search + version) ───
function TopBar({ onSearch, shell }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      display: 'flex', alignItems: 'center', gap: 20,
      padding: shell === 'airy' ? '18px 32px' : '14px 24px',
      borderBottom: '1px solid var(--docs-border)',
      background: 'var(--docs-bg)',
      fontSize: 12,
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, border: 0 }}>
        <img src="../../assets/logo-white.svg?v=3" alt="Mostly Right" style={{ height: 18 }} />
        <span style={{ color: 'var(--docs-fg-faint)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>/ docs</span>
      </a>
      <div style={{ flex: 1 }} />
      <button onClick={onSearch} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 10px 6px 12px',
        background: 'transparent',
        border: '1px solid var(--docs-border)',
        color: 'var(--docs-fg-subtle)',
        font: 'inherit', fontSize: 12, cursor: 'pointer',
        minWidth: 260,
      }}>
        <span style={{ opacity: .5 }}>⌕</span>
        <span>Search</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, letterSpacing: '.1em', color: 'var(--docs-fg-faint)' }}>⌘K</span>
      </button>
      <span style={{ fontSize: 11, color: 'var(--docs-fg-faint)' }}>v0.4.2</span>
      <a href="#" style={{ fontSize: 11, color: 'var(--docs-fg-muted)', border: 0 }}>GitHub ↗</a>
    </header>
  );
}

// ─── Sidebar (quieter: one active section bolded, others collapsible look) ──
const SIDEBAR = [
  { k: 'Get started', open: true, items: [
    { t: 'Introduction', id: 'intro' },
    { t: 'Quickstart', id: 'quickstart', active: true },
    { t: 'Authentication', id: 'auth' },
    { t: 'Reproducibility', id: 'repro' },
  ]},
  { k: 'Guides', open: true, items: [
    { t: 'Weather contracts', id: 'weather' },
    { t: 'Point-in-time queries', id: 'pit' },
    { t: 'Backtest to live', id: 'backtest' },
  ]},
  { k: 'Agents', open: false, items: [
    { t: 'as_tools()', id: 'as_tools' },
    { t: 'TOON format', id: 'toon' },
  ]},
  { k: 'API Reference', open: false, items: [
    { t: 'snapshot()', id: 'snapshot' },
    { t: 'candles()', id: 'candles' },
    { t: 'book_snapshot()', id: 'book' },
    { t: 'markets()', id: 'markets' },
  ]},
];

function Sidebar({ shell }) {
  const [opened, setOpened] = React.useState(() => Object.fromEntries(SIDEBAR.map(s => [s.k, s.open])));
  return (
    <aside style={{
      width: 'var(--sb-w)',
      borderRight: '1px solid var(--docs-border)',
      padding: shell === 'airy' ? '36px 24px 60px 32px' : '28px 20px 60px 24px',
      position: 'sticky',
      top: shell === 'airy' ? 65 : 51,
      alignSelf: 'flex-start',
      height: `calc(100vh - ${shell === 'airy' ? 65 : 51}px)`,
      overflowY: 'auto',
      background: 'var(--docs-bg-sidebar)',
      fontSize: 13,
    }}>
      {SIDEBAR.map(sec => (
        <div key={sec.k} style={{ marginBottom: 20 }}>
          <button onClick={() => setOpened(o => ({ ...o, [sec.k]: !o[sec.k] }))} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', textAlign: 'left',
            margin: '0 0 8px', padding: 0,
            fontSize: 11, fontWeight: 600, letterSpacing: '.04em',
            color: 'var(--docs-fg-heading)',
            background: 'transparent', border: 0, cursor: 'pointer',
            font: 'inherit',
          }}>
            <span style={{ color: 'var(--docs-fg-faint)', fontSize: 9 }}>{opened[sec.k] ? '▾' : '▸'}</span>
            <span>{sec.k}</span>
          </button>
          {opened[sec.k] && (
            <ul style={{ listStyle: 'none', margin: 0, padding: '0 0 0 16px' }}>
              {sec.items.map(it => (
                <li key={it.id}>
                  <a href={'#'+it.id} style={{
                    display: 'block',
                    padding: '4px 0',
                    border: 0,
                    color: it.active ? 'var(--docs-fg-heading)' : 'var(--docs-fg-muted)',
                    fontSize: 13,
                    fontWeight: it.active ? 500 : 400,
                    position: 'relative',
                  }}>
                    {it.active && (
                      <span style={{ position: 'absolute', left: -16, top: 0, bottom: 0, width: 2, background: 'var(--docs-fg-heading)' }} />
                    )}
                    {it.t}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}

Object.assign(window, { TopBar, Sidebar, SIDEBAR });
