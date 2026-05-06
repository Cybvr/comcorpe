/* global React */
const provStyles = {
  section: {
    padding: '128px var(--grid-gutter)',
    background: 'var(--paper)',
    borderBottom: '1px solid var(--ink)',
  },
  topRow: { display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 80 },
  eyebrow: {
    fontFamily: 'var(--font-text)', fontSize: 12, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)',
    display: 'inline-flex', alignItems: 'center', gap: 10,
  },
  tick: { width: 24, height: 1, background: 'var(--ink)', display: 'inline-block' },
  index: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-60)', marginLeft: 'auto' },
  pull: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 'clamp(48px, 6.5vw, 104px)',
    lineHeight: 0.96,
    letterSpacing: '-0.045em',
    color: 'var(--ink)',
    margin: 0,
    maxWidth: '20ch',
    textWrap: 'balance',
  },
  blue: { color: 'var(--blue)' },
  dim: { color: 'var(--ink-40)' },
  splitRow: {
    marginTop: 96,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 0,
    borderTop: '1px solid var(--ink)',
  },
  panel: {
    padding: '48px 48px 48px 0',
    borderRight: '1px solid var(--ink-10)',
  },
  panelRight: {
    padding: '48px 0 48px 48px',
    background: 'var(--ink)',
    color: 'var(--paper)',
    marginRight: 'calc(var(--grid-gutter) * -1)',
    paddingRight: 'var(--grid-gutter)',
  },
  panelLeftPad: {
    paddingLeft: 'var(--grid-gutter)',
    marginLeft: 'calc(var(--grid-gutter) * -1)',
  },
  panelLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-60)',
    marginBottom: 24,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  panelLabelDark: { color: 'rgba(246,244,239,0.6)' },
  panelTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 32,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    marginBottom: 32,
  },
  bullets: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 },
  bullet: {
    padding: '20px 0',
    borderBottom: '1px solid var(--ink-10)',
    display: 'grid',
    gridTemplateColumns: '32px 1fr',
    gap: 16,
    fontFamily: 'var(--font-text)',
    fontSize: 16,
    lineHeight: 1.5,
    color: 'var(--ink)',
  },
  bulletDark: { borderBottomColor: 'rgba(246,244,239,0.12)', color: 'var(--paper)' },
  bulletNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-60)',
  },
  bulletNumDark: { color: 'rgba(246,244,239,0.5)' },
  resultBox: {
    marginTop: 32,
    padding: '24px 28px',
    background: 'var(--blue)',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 22,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
};

function Provocation() {
  const insights = [
    'Strategy exists without execution',
    'Execution exists without coherence',
    'Talent exists without orchestration',
    'Opportunities exist without structure',
  ];

  return (
    <section id="provocation" data-screen-label="02 Provocation" style={provStyles.section}>
      <div style={provStyles.topRow}>
        <span style={provStyles.eyebrow}><span style={provStyles.tick} />The Provocation</span>
        <span style={provStyles.index}>01 / 09</span>
      </div>

      <h2 style={provStyles.pull}>
        Growth is the most <span style={provStyles.blue}>mismanaged</span> function in emerging markets.<br/>
        <span style={provStyles.dim}>Not for lack of capital. Not for lack of ambition.</span>
      </h2>

      <div style={provStyles.splitRow}>
        <div style={{...provStyles.panel, ...provStyles.panelLeftPad}}>
          <div style={provStyles.panelLabel}>The Diagnosis</div>
          <div style={provStyles.panelTitle}>Growth is not treated as a system.</div>
          <ul style={provStyles.bullets}>
            {insights.map((b, i) => (
              <li key={i} style={provStyles.bullet}>
                <span style={provStyles.bulletNum}>0{i+1}</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={provStyles.panelRight}>
          <div style={{...provStyles.panelLabel, ...provStyles.panelLabelDark}}>The Result</div>
          <div style={{...provStyles.panelTitle, color: 'var(--paper)'}}>
            Reactive. Fragmented. Non-compounding.
          </div>
          <p style={{fontFamily: 'var(--font-text)', fontSize: 17, lineHeight: 1.55, color: 'rgba(246,244,239,0.72)', margin: 0, maxWidth: '40ch'}}>
            Across markets, growth is delivered as disconnected interventions: a campaign here,
            a hire there, a deck somewhere else. Each cycle starts from zero. Knowledge does not
            accumulate. Outcomes do not compound.
          </p>
          <div style={provStyles.resultBox}>
            We treat growth as architecture, not effort.
          </div>
        </div>
      </div>
    </section>
  );
}

window.Provocation = Provocation;
