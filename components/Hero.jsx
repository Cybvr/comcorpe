/* global React */
const heroStyles = {
  wrap: {
    padding: '96px var(--grid-gutter) 0',
    borderBottom: '1px solid var(--ink)',
    position: 'relative',
    overflow: 'hidden',
  },
  topRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 24,
    marginBottom: 56,
  },
  eyebrow: {
    fontFamily: 'var(--font-text)',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--ink)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
  },
  tick: { width: 24, height: 1, background: 'var(--ink)', display: 'inline-block' },
  index: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-60)',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 'clamp(72px, 11vw, 184px)',
    lineHeight: 0.88,
    letterSpacing: '-0.05em',
    color: 'var(--ink)',
    margin: 0,
    textWrap: 'balance',
  },
  notLine: {
    display: 'block',
    color: 'var(--ink-40)',
  },
  weAre: { display: 'block' },
  growthLine: {
    display: 'block',
  },
  italic: { fontStyle: 'italic', fontWeight: 400, fontFamily: 'var(--font-text)', letterSpacing: '-0.02em' },
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: '5fr 7fr',
    gap: 96,
    marginTop: 80,
    paddingBottom: 56,
    alignItems: 'end',
  },
  lede: {
    fontFamily: 'var(--font-text)',
    fontSize: 22,
    lineHeight: 1.4,
    color: 'var(--ink-60)',
    margin: 0,
    letterSpacing: '-0.005em',
    maxWidth: '34ch',
  },
  rhs: { display: 'flex', flexDirection: 'column', gap: 32 },
  ctaRow: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  primary: {
    fontFamily: 'var(--font-text)',
    fontSize: 14,
    fontWeight: 600,
    padding: '14px 24px',
    background: 'var(--blue)',
    color: '#fff',
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    transition: 'background var(--dur-fast) var(--ease)',
  },
  secondary: {
    fontFamily: 'var(--font-text)',
    fontSize: 14,
    fontWeight: 600,
    padding: '14px 24px',
    background: 'transparent',
    color: 'var(--ink)',
    border: '1px solid var(--ink)',
    cursor: 'pointer',
    transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
  },
  meta: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 32,
    paddingTop: 32,
    borderTop: '1px solid var(--ink-10)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-60)',
  },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 6 },
  metaValue: {
    color: 'var(--ink)',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 36,
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  ticker: {
    marginTop: 64,
    borderTop: '1px solid var(--ink)',
    borderBottom: '1px solid var(--ink)',
    overflow: 'hidden',
    padding: '14px 0',
    marginLeft: 'calc(var(--grid-gutter) * -1)',
    marginRight: 'calc(var(--grid-gutter) * -1)',
    whiteSpace: 'nowrap',
  },
  tickerInner: {
    display: 'inline-block',
    animation: 'ccticker 40s linear infinite',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 32,
    letterSpacing: '-0.03em',
    color: 'var(--ink)',
  },
  tickerItem: { display: 'inline-block', padding: '0 32px' },
  tickerDot: { color: 'var(--blue)', display: 'inline-block', padding: '0 8px' },
};

function Hero({ onPrimary, onSecondary }) {
  const [pHover, setPHover] = React.useState(false);
  const [sHover, setSHover] = React.useState(false);

  const tickerWords = [
    'ARCHITECT', 'ASSEMBLE', 'OPERATE',
    'TECHNOLOGY & FINTECH', 'PUBLIC INFRASTRUCTURE', 'CONSUMER & BRAND',
    'GROWTH PLAYS', 'SPECIALIST PODS', 'INTERNATIONAL BOARD',
  ];

  return (
    <section id="top" data-screen-label="01 Hero" style={heroStyles.wrap}>
      <style>{`
        @keyframes ccticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div style={heroStyles.topRow}>
        <span style={heroStyles.eyebrow}><span style={heroStyles.tick} />A Growth Systems Company</span>
        <span style={heroStyles.index}>00 / Manifesto · Lagos / London / Singapore</span>
      </div>

      <h1 style={heroStyles.headline}>
        <span style={heroStyles.notLine}><span style={heroStyles.italic}>not&nbsp;</span>an agency.</span>
        <span style={heroStyles.notLine}><span style={heroStyles.italic}>not&nbsp;</span>a consultancy.</span>
        <span style={heroStyles.growthLine}>A system for<br/>building growth<span style={{color:'var(--blue)'}}>.</span></span>
      </h1>

      <div style={heroStyles.bottomRow}>
        <p style={heroStyles.lede}>
          Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems —
          designed not just to communicate, but to perform.
        </p>
        <div style={heroStyles.rhs}>
          <div style={heroStyles.ctaRow}>
            <button
              onClick={onPrimary}
              onMouseEnter={() => setPHover(true)}
              onMouseLeave={() => setPHover(false)}
              style={{ ...heroStyles.primary, background: pHover ? 'var(--blue-hover)' : 'var(--blue)' }}
            >
              Request a brief
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </button>
            <button
              onClick={onSecondary}
              onMouseEnter={() => setSHover(true)}
              onMouseLeave={() => setSHover(false)}
              style={{
                ...heroStyles.secondary,
                background: sHover ? 'var(--ink)' : 'transparent',
                color: sHover ? 'var(--paper)' : 'var(--ink)',
              }}
            >
              See the model
            </button>
          </div>
          <div style={heroStyles.meta}>
            <div style={heroStyles.metaItem}>
              <span style={heroStyles.metaValue}>03</span>
              <span>Arenas</span>
            </div>
            <div style={heroStyles.metaItem}>
              <span style={heroStyles.metaValue}>17</span>
              <span>Active pods</span>
            </div>
            <div style={heroStyles.metaItem}>
              <span style={heroStyles.metaValue}>12</span>
              <span>Growth plays</span>
            </div>
            <div style={heroStyles.metaItem}>
              <span style={heroStyles.metaValue}>09</span>
              <span>Markets</span>
            </div>
          </div>
        </div>
      </div>

      <div style={heroStyles.ticker}>
        <div style={heroStyles.tickerInner}>
          {[...tickerWords, ...tickerWords].map((w, i) => (
            <span key={i} style={heroStyles.tickerItem}>
              {w}<span style={heroStyles.tickerDot}>●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
