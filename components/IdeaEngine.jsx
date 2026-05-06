/* global React */
const ieStyles = {
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '7fr 5fr',
    gap: 96,
    alignItems: 'start',
  },
  pull: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(56px, 7.5vw, 128px)', lineHeight: 0.92,
    letterSpacing: '-0.05em',
    color: 'var(--ink)', margin: 0, textWrap: 'balance',
  },
  pullLine2: { color: 'var(--blue)' },
  rhs: {
    display: 'flex', flexDirection: 'column', gap: 24,
    paddingTop: 16,
  },
  lede: {
    fontFamily: 'var(--font-text)', fontSize: 19, lineHeight: 1.5,
    color: 'var(--ink-60)', margin: 0, letterSpacing: '-0.005em',
  },
  list: { display: 'flex', flexDirection: 'column', marginTop: 12 },
  liRow: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr',
    gap: 16,
    padding: '20px 0',
    borderTop: '1px solid var(--ink-10)',
    alignItems: 'baseline',
  },
  liLast: { borderBottom: '1px solid var(--ink-10)' },
  liNum: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-60)' },
  liText: {
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22,
    letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)',
  },
  liSub: {
    fontFamily: 'var(--font-text)', fontSize: 14, color: 'var(--ink-60)',
    marginTop: 6, fontWeight: 400, lineHeight: 1.4, letterSpacing: 0,
  },
  badge: {
    display: 'inline-block',
    marginTop: 24,
    padding: '8px 14px',
    background: 'var(--ink)',
    color: 'var(--paper)',
    fontFamily: 'var(--font-mono)', fontSize: 12,
    letterSpacing: '0.08em', textTransform: 'uppercase',
  },
};

function IdeaEngine() {
  const items = [
    { n: '→', t: 'Proprietary, insight-driven opportunities', s: 'Originated from market signal, not client request.' },
    { n: '→', t: 'Developed ahead of client demand', s: 'A backlog of plays, ready to deploy when the window opens.' },
    { n: '→', t: 'Designed to unlock revenue or market entry', s: 'Each play maps to a measurable commercial outcome.' },
  ];
  return (
    <section id="idea-engine" data-screen-label="05 Idea Engine" style={ieStyles.section}>
      <div style={ieStyles.topRow}>
        <span style={ieStyles.eyebrow}><span style={ieStyles.tick} />The Idea Engine</span>
        <span style={ieStyles.index}>04 / 09</span>
      </div>
      <div style={ieStyles.layout}>
        <h2 style={ieStyles.pull}>
          Most firms wait for briefs.<br/>
          <span style={ieStyles.pullLine2}>We originate them.</span>
        </h2>
        <div style={ieStyles.rhs}>
          <p style={ieStyles.lede}>
            Beyond client engagements, Comcorpᵉ originates proprietary <em>Growth Plays</em> —
            strategic constructs developed from market insight and transformed into
            <em> Strategic Opportunity Briefs</em> for forward-looking organisations.
          </p>
          <div style={ieStyles.list}>
            {items.map((it, i) => (
              <div key={i} style={{...ieStyles.liRow, ...(i === items.length-1 ? ieStyles.liLast : {})}}>
                <span style={ieStyles.liNum}>{it.n}</span>
                <div>
                  <div style={ieStyles.liText}>{it.t}</div>
                  <div style={ieStyles.liSub}>{it.s}</div>
                </div>
              </div>
            ))}
          </div>
          <span style={ieStyles.badge}>Asymmetric advantage in business development</span>
        </div>
      </div>
    </section>
  );
}

window.IdeaEngine = IdeaEngine;
