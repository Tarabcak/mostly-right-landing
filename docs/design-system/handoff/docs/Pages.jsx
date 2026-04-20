/** @jsx React.createElement */

function QuickstartPage() {
  return (
    <article>
      <p style={eyebrow}>Get started</p>
      <h1 style={h1}>Quickstart</h1>
      <p style={lead}>Install the SDK, authenticate, and pull your first point-in-time snapshot in under 60 seconds.</p>

      <Steps steps={[
        { n: '01', t: 'Install the SDK' },
        { n: '02', t: 'Authenticate' },
        { n: '03', t: 'Your first query' },
      ]} />

      <h2 id="install" style={h2}><span style={num}>01</span> Install</h2>
      <p style={p}>Python 3.10+ required.</p>
      <CodeTabs tabs={[
        { label: 'pip', lang: 'bash', code: 'pip install mostlyright' },
        { label: 'poetry', lang: 'bash', code: 'poetry add mostlyright' },
        { label: 'uv', lang: 'bash', code: 'uv add mostlyright' },
      ]} />

      <h2 id="authenticate" style={h2}><span style={num}>02</span> Authenticate</h2>
      <p style={p}>Grab your API key from the dashboard and export it.</p>
      <CodeTabs tabs={[
        { label: 'bash', lang: 'bash', code: 'export MOSTLYRIGHT_API_KEY="mr_live_..."' },
      ]} />

      <h2 id="first-query" style={h2}><span style={num}>03</span> Your first query</h2>
      <p style={p}>Every query is point-in-time correct: the response is what the data actually looked like at that instant.</p>
      <CodeTabs tabs={[
        { label: 'Python', lang: 'python', filename: 'first_query.py', code: `from mostlyright import MostlyRightClient\n\nclient = MostlyRightClient()\n\nsnap = client.snapshot("NYC", as_of="2024-07-04T18:00:00Z")\n\nsnap.observations     # cleaned station data\nsnap.forecasts        # NBM, GFS, HRRR, ECMWF\nsnap.settlement       # NWS CLI, LST-aware\nsnap.version          # reproducibility token` },
        { label: 'curl', lang: 'bash', code: `curl https://api.mostlyright.md/v1/snapshot \\\n  -H "Authorization: Bearer $MOSTLYRIGHT_API_KEY" \\\n  -d city=NYC \\\n  -d as_of=2024-07-04T18:00:00Z` },
      ]} />

      <Callout kind="tip" title="as_of is not optional in production">
        Omit it and you get the latest snapshot. Your backtest will not replay exactly. Always pin a timestamp in historical code.
      </Callout>

      <h2 id="try-it" style={h2}>Try it live</h2>
      <p style={p}>Sandbox account. No key required.</p>
      <Playground />

      <h2 id="next" style={h2}>Next</h2>
      <ul style={ul}>
        <li><a href="#pit">Point-in-time queries →</a></li>
        <li><a href="#as_tools">Drop the SDK into Claude tool-use →</a></li>
        <li><a href="#snapshot">API reference: <code>snapshot()</code> →</a></li>
      </ul>
    </article>
  );
}

function ApiRefPage() {
  return (
    <article>
      <p style={eyebrow}>API Reference · Weather</p>
      <h1 style={h1}>snapshot()</h1>
      <p style={lead}>Return market prices and the real-world data that settles them, for one city at one point in time.</p>
      <Endpoint method="GET" path="/v1/snapshot" auth="Bearer" rate="600 req/min" />

      <h2 id="params" style={h2}>Parameters</h2>
      <Params rows={[
        { name: 'city', type: 'string', required: true, desc: 'IATA-like code for a covered city. 60+ available.' },
        { name: 'as_of', type: 'ISO-8601 timestamp', required: true, desc: 'Point-in-time anchor. Response reflects what was known at this instant.' },
        { name: 'format', type: 'enum', desc: '"json" | "toon" | "pandas" | "polars". TOON is ~60% fewer tokens than JSON.', default: '"json"' },
        { name: 'include', type: 'string[]', desc: 'Subset of fields to return. Omit for everything.',
          children: [
            { name: 'observations', type: 'bool', desc: 'Station-level current conditions.' },
            { name: 'forecasts', type: 'bool', desc: 'NBM, GFS, HRRR, ECMWF.' },
            { name: 'settlement', type: 'bool', desc: 'NWS CLI record used to resolve the contract.' },
          ] },
      ]} />

      <h2 id="example" style={h2}>Example</h2>
      <CodeTabs tabs={[
        { label: 'Python', lang: 'python', code: `snap = client.snapshot("NYC", as_of="2024-07-04T18:00:00Z")` },
        { label: 'curl', lang: 'bash', code: `curl "https://api.mostlyright.md/v1/snapshot?city=NYC&as_of=2024-07-04T18:00Z" \\\n  -H "Authorization: Bearer $MOSTLYRIGHT_API_KEY"` },
      ]} />

      <h2 id="response" style={h2}>Response</h2>
      <CodeTabs tabs={[
        { label: '200 OK', lang: 'json', code: `{\n  "city": "NYC",\n  "as_of": "2024-07-04T18:00:00Z",\n  "market": { "id": "KXHIGHNY-24JUL04-T88", "mid": 0.62 },\n  "observations": { "temp_f": 87.4, "source": "IEM" },\n  "forecast": { "model": "NBM", "temp_f": 88 },\n  "settlement": { "station": "KNYC", "basis": "NWS CLI" },\n  "version": "v0.4.2"\n}` },
      ]} />
    </article>
  );
}

function Steps({ steps }) {
  return (
    <ol style={{
      listStyle: 'none', padding: 0,
      margin: '28px 0 44px',
      display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
      gap: 0, border: '1px solid var(--docs-border)',
    }}>
      {steps.map((s, i) => (
        <li key={s.n} style={{
          padding: '16px 18px',
          borderRight: i < steps.length - 1 ? '1px solid var(--docs-border)' : 0,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <span style={{ fontSize: 10, letterSpacing: '.14em', color: 'var(--docs-fg-faint)', fontWeight: 700 }}>{s.n}</span>
          <span style={{ fontSize: 13, color: 'var(--docs-fg-heading)' }}>{s.t}</span>
        </li>
      ))}
    </ol>
  );
}

Object.assign(window, { QuickstartPage, ApiRefPage });

const eyebrow = { fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--docs-fg-faint)', margin: '0 0 20px', fontWeight: 600 };
const h1 = { fontFamily: 'var(--display)', fontWeight: 400, fontSize: 56, lineHeight: 1.02, letterSpacing: '-0.035em', color: 'var(--docs-fg-heading)', margin: '0 0 24px' };
const h2 = { fontFamily: 'var(--display)', fontWeight: 400, fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--docs-fg-heading)', margin: '56px 0 14px', display: 'flex', alignItems: 'baseline', gap: 12 };
const num = { fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', color: 'var(--docs-fg-faint)' };
const lead = { fontSize: 17, lineHeight: 1.6, color: 'var(--docs-fg-muted)', margin: '0 0 24px', maxWidth: 620, fontFamily: 'var(--display)', fontWeight: 300, letterSpacing: '-0.005em' };
const p = { fontSize: 14, lineHeight: 1.75, color: 'var(--docs-fg-muted)', margin: '0 0 14px' };
const ul = { margin: '0 0 14px', padding: 0, listStyle: 'none', fontSize: 14, lineHeight: 2, color: 'var(--docs-fg-muted)' };
