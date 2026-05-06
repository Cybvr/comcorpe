/* global React */
const wwpStyles = {
  section: {
    padding: '128px var(--grid-gutter)',
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderBottom: '1px solid var(--ink)',
  },
  topRow: { display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 56 },
  eyebrow: {
    fontFamily: 'var(--font-text)', fontSize: 12, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--paper)',
    display: 'inline-flex', alignItems: 'center', gap: 10,
  },
  tick: { width: 24, height: 1, background: 'var(--paper)', display: 'inline-block' },
  index: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(246,244,239,0.6)', marginLeft: 'auto' },
  h2: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 0.96, letterSpacing: '-0.045em',
    color: 'var(--paper)', margin: '0 0 80px', maxWidth: '20ch', textWrap: 'balance',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '5fr 7fr',
    gap: 64,
    alignItems: 'start',
  },
  arenaWrap: {
    border: '1px solid rgba(246,244,239,0.18)',
  },
  arenaCard: {
    padding: '32px 28px',
    borderBottom: '1px solid rgba(246,244,239,0.18)',
    cursor: 'default',
    transition: 'background var(--dur-base) var(--ease)',
  },
  arenaLast: { borderBottom: 'none' },
  arenaHover: { background: 'rgba(31,77,255,0.10)' },
  arenaTop: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 },
  arenaIdx: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(246,244,239,0.6)' },
  arenaTitle: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 26, letterSpacing: '-0.025em', lineHeight: 1.1,
    color: 'var(--paper)',
  },
  arenaSub: {
    fontFamily: 'var(--font-text)', fontSize: 14, lineHeight: 1.5,
    color: 'rgba(246,244,239,0.7)', margin: 0,
  },
  arenaTags: { marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 },
  arenaTag: {
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--paper)',
    padding: '4px 8px', border: '1px solid rgba(246,244,239,0.24)',
  },
  rhsLabel: {
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(246,244,239,0.6)', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 20,
  },
  rhsTitle: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1.05,
    color: 'var(--paper)', marginBottom: 32,
  },
  ladder: { display: 'flex', flexDirection: 'column' },
  rung: {
    display: 'grid',
    gridTemplateColumns: '32px 1fr auto',
    gap: 20, padding: '22px 0',
    borderTop: '1px solid rgba(246,244,239,0.18)',
    alignItems: 'baseline',
  },
  rungLast: { borderBottom: '1px solid rgba(246,244,239,0.18)' },
  rungN: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(246,244,239,0.6)' },
  rungL: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 22, letterSpacing: '-0.02em', color: 'var(--paper)',
  },
  rungD: {
    fontFamily: 'var(--font-text)', fontSize: 14,
    color: 'rgba(246,244,239,0.7)', marginTop: 4,
  },
  rungR: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'rgba(246,244,239,0.5)', textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  closer: {
    marginTop: 32,
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 24, letterSpacing: '-0.02em',
    color: 'var(--paper)',
  },
  closerBlue: { color: 'var(--blue)' },
  expansion: {
    marginTop: 24,
    padding: '20px 24px',
    border: '1px solid rgba(246,244,239,0.18)',
    display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 20,
  },
  expLabel: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'rgba(246,244,239,0.6)', marginBottom: 4,
  },
  expValue: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 18, letterSpacing: '-0.02em', color: 'var(--paper)',
  },
  expRight: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'rgba(246,244,239,0.5)',
  },
};

function WhereWePlay() {
  const [hov, setHov] = React.useState(null);
  const arenas = [
    { i: '01', t: 'Technology & Fintech Platforms', s: 'Activation, brand and growth systems for high-velocity tech and regulated financial platforms.', tags: ['FINTECH', 'PAYMENTS', 'PLATFORMS'] },
    { i: '02', t: 'Public Infrastructure & Impact Systems', s: 'Behaviour-shifting communication for state, civic and impact-led organisations operating at population scale.', tags: ['CIVIC', 'STATE', 'IMPACT'] },
    { i: '03', t: 'Consumer & Brand Ecosystems', s: 'Brand worlds and commercial systems for consumer companies that need to perform across every channel.', tags: ['FMCG', 'TELECOMS', 'GAMING'] },
  ];
  const rungs = [
    { n: '01', l: 'Retainers', d: 'System oversight and ongoing orchestration', r: 'Recurring' },
    { n: '02', l: 'Project Fees', d: 'Builds and execution sprints', r: 'Milestone' },
    { n: '03', l: 'Success Fees', d: 'Performance-linked outcomes', r: 'Variable' },
    { n: '04', l: 'Equity Participation', d: 'Selective, high-conviction partnerships', r: 'Aligned' },
  ];

  return (
    <section id="arenas" data-screen-label="06 Where We Play" style={wwpStyles.section}>
      <div style={wwpStyles.topRow}>
        <span style={wwpStyles.eyebrow}><span style={wwpStyles.tick} />Where we play</span>
        <span style={wwpStyles.index}>05 / 09</span>
      </div>
      <h2 style={wwpStyles.h2}>Concentration over coverage. Three arenas, anchored in Pan-Africa.</h2>

      <div style={wwpStyles.layout}>
        <div style={wwpStyles.arenaWrap}>
          {arenas.map((a, i) => (
            <div
              key={a.i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                ...wwpStyles.arenaCard,
                ...(i === arenas.length-1 ? wwpStyles.arenaLast : {}),
                ...(hov === i ? wwpStyles.arenaHover : {}),
              }}
            >
              <div style={wwpStyles.arenaTop}>
                <span style={wwpStyles.arenaIdx}>{a.i}.</span>
                <span style={wwpStyles.arenaTitle}>{a.t}</span>
              </div>
              <p style={wwpStyles.arenaSub}>{a.s}</p>
              <div style={wwpStyles.arenaTags}>
                {a.tags.map(t => <span key={t} style={wwpStyles.arenaTag}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={wwpStyles.rhsLabel}>Business Model</div>
          <div style={wwpStyles.rhsTitle}>We align with growth, not just activity.</div>
          <div style={wwpStyles.ladder}>
            {rungs.map((r, i) => (
              <div key={r.n} style={{...wwpStyles.rung, ...(i === rungs.length-1 ? wwpStyles.rungLast : {})}}>
                <span style={wwpStyles.rungN}>{r.n}</span>
                <div>
                  <div style={wwpStyles.rungL}>{r.l}</div>
                  <div style={wwpStyles.rungD}>{r.d}</div>
                </div>
                <span style={wwpStyles.rungR}>{r.r}</span>
              </div>
            ))}
          </div>

          <div style={wwpStyles.expansion}>
            <div>
              <div style={wwpStyles.expLabel}>Anchor market</div>
              <div style={wwpStyles.expValue}>Pan-Africa</div>
            </div>
            <div style={wwpStyles.expRight}>
              <span style={{color:'var(--blue)'}}>→</span> Global mandates via network
            </div>
          </div>

          <div style={wwpStyles.closer}>
            Financial services. FMCG. Betting & gaming. Telecoms. <span style={wwpStyles.closerBlue}>Consumer platforms.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

window.WhereWePlay = WhereWePlay;
