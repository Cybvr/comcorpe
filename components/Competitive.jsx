/* global React */
const cmpStyles = {
  section: {
    padding: '128px var(--grid-gutter)',
    background: 'var(--paper)',
    borderBottom: '1px solid var(--ink)',
  },
  topRow: { display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 56 },
  eyebrow: {
    fontFamily: 'var(--font-text)', fontSize: 12, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)',
    display: 'inline-flex', alignItems: 'center', gap: 10,
  },
  tick: { width: 24, height: 1, background: 'var(--ink)', display: 'inline-block' },
  index: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-60)', marginLeft: 'auto' },
  head: {
    display: 'grid', gridTemplateColumns: '6fr 6fr', gap: 96, marginBottom: 56, alignItems: 'baseline',
  },
  h2: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 0.96, letterSpacing: '-0.045em',
    color: 'var(--ink)', margin: 0, textWrap: 'balance',
  },
  rhs: { fontFamily: 'var(--font-text)', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-60)' },
  matrix: {
    border: '1px solid var(--ink)',
    display: 'grid',
    gridTemplateColumns: '1.4fr repeat(3, 1fr) 1.2fr',
  },
  hcell: {
    padding: '20px 24px',
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.08em',
    borderBottom: '1px solid var(--ink)',
    borderRight: '1px solid var(--ink-10)',
  },
  hcellOurs: {
    background: 'var(--ink)', color: 'var(--paper)',
    borderRight: '1px solid var(--ink)',
  },
  hcellLast: { borderRight: 'none' },
  rcell: {
    padding: '24px',
    borderBottom: '1px solid var(--ink-10)',
    borderRight: '1px solid var(--ink-10)',
    fontFamily: 'var(--font-text)', fontSize: 14,
    color: 'var(--ink)',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  rcellLabel: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 18, letterSpacing: '-0.02em', color: 'var(--ink)',
  },
  rcellOurs: {
    background: 'rgba(31,77,255,0.06)',
    fontWeight: 500,
  },
  rcellLast: { borderRight: 'none' },
  dot: {
    width: 10, height: 10, borderRadius: '50%',
    display: 'inline-block', flex: 'none',
  },
  no: { background: 'transparent', border: '1px solid var(--ink-20)' },
  partial: { background: 'var(--ink-40)' },
  yes: { background: 'var(--blue)' },
  closer: {
    marginTop: 56,
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(28px, 3.6vw, 48px)', letterSpacing: '-0.03em',
    lineHeight: 1.05, textWrap: 'balance', maxWidth: '28ch',
  },
  closerBlue: { color: 'var(--blue)' },
};

function Cell({ kind, text }) {
  const cls = kind === 'yes' ? cmpStyles.yes : kind === 'partial' ? cmpStyles.partial : cmpStyles.no;
  return (
    <div style={cmpStyles.rcell}>
      <span style={{...cmpStyles.dot, ...cls}} />
      <span>{text}</span>
    </div>
  );
}

function Competitive() {
  const rows = [
    {
      cap: 'Idea origination',
      strategy: ['no', '—'],
      agency: ['partial', 'Reactive'],
      advisor: ['no', '—'],
      ours: ['yes', 'Proprietary'],
    },
    {
      cap: 'System design',
      strategy: ['yes', 'In-house'],
      agency: ['no', '—'],
      advisor: ['partial', 'Frameworks'],
      ours: ['yes', 'Architectural'],
    },
    {
      cap: 'Flexible execution',
      strategy: ['no', '—'],
      agency: ['yes', 'Static'],
      advisor: ['no', '—'],
      ours: ['yes', 'Modular pods'],
    },
    {
      cap: 'Compounding knowledge',
      strategy: ['partial', 'Decks'],
      agency: ['no', '—'],
      advisor: ['partial', 'Personal'],
      ours: ['yes', 'Systematic'],
    },
  ];

  return (
    <section id="competitive" data-screen-label="08 Competitive" style={cmpStyles.section}>
      <div style={cmpStyles.topRow}>
        <span style={cmpStyles.eyebrow}><span style={cmpStyles.tick} />Competitive Reality</span>
        <span style={cmpStyles.index}>07 / 09</span>
      </div>
      <div style={cmpStyles.head}>
        <h2 style={cmpStyles.h2}>We intersect with many. We resemble none.</h2>
        <p style={cmpStyles.rhs}>
          Strategy firms, agency networks and independent advisors each hold one piece of the
          system. None combine origination, design, execution and compounding into a single layer.
          <br/><br/>
          <strong style={{color:'var(--ink)'}}>Our competition is structural, not direct.</strong>
        </p>
      </div>

      <div style={cmpStyles.matrix}>
        <div style={cmpStyles.hcell}>Capability</div>
        <div style={cmpStyles.hcell}>Strategy firms</div>
        <div style={cmpStyles.hcell}>Agency networks</div>
        <div style={cmpStyles.hcell}>Independent advisors</div>
        <div style={{...cmpStyles.hcell, ...cmpStyles.hcellOurs, ...cmpStyles.hcellLast}}>Comcorpᵉ</div>

        {rows.map((r, i) => (
          <React.Fragment key={r.cap}>
            <div style={{...cmpStyles.rcell, ...(i === rows.length-1 ? {borderBottom: 'none'} : {})}}>
              <span style={cmpStyles.rcellLabel}>{r.cap}</span>
            </div>
            <Cell kind={r.strategy[0]} text={r.strategy[1]} />
            <Cell kind={r.agency[0]} text={r.agency[1]} />
            <Cell kind={r.advisor[0]} text={r.advisor[1]} />
            <div style={{...cmpStyles.rcell, ...cmpStyles.rcellOurs, ...cmpStyles.rcellLast, ...(i === rows.length-1 ? {borderBottom: 'none'} : {})}}>
              <span style={{...cmpStyles.dot, ...cmpStyles.yes}} />
              <span>{r.ours[1]}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div style={cmpStyles.closer}>
        None combine idea origination, system design and flexible execution.{' '}
        <span style={cmpStyles.closerBlue}>We do.</span>
      </div>
    </section>
  );
}

window.Competitive = Competitive;
