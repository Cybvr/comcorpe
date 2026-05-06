/* global React */
const forcesStyles = {
  section: {
    padding: '128px var(--grid-gutter)',
    borderBottom: '1px solid var(--ink)',
    background: 'var(--paper)',
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
    display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 96, marginBottom: 80, alignItems: 'baseline',
  },
  h2: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.02, letterSpacing: '-0.04em',
    color: 'var(--ink)', margin: 0, textWrap: 'balance',
  },
  rhs: { fontFamily: 'var(--font-text)', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-60)' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 0,
    border: '1px solid var(--ink)',
  },
  card: {
    padding: 40,
    borderRight: '1px solid var(--ink)',
    background: 'var(--paper)',
    minHeight: 280,
    display: 'flex', flexDirection: 'column',
    transition: 'background var(--dur-base) var(--ease)',
    cursor: 'default',
  },
  cardLast: { borderRight: 'none' },
  cardHover: { background: 'var(--ink)', color: 'var(--paper)' },
  cardIdx: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    marginBottom: 'auto',
    paddingBottom: 80,
  },
  cardTitle: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.03em',
    marginBottom: 16,
  },
  cardBody: {
    fontFamily: 'var(--font-text)', fontSize: 15, lineHeight: 1.55,
    margin: 0,
  },
  closer: {
    marginTop: 64,
    paddingTop: 32,
    borderTop: '1px solid var(--ink)',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 'clamp(28px, 3.6vw, 56px)',
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    color: 'var(--ink)',
    textWrap: 'balance',
    maxWidth: '24ch',
  },
};

function Forces() {
  const [hov, setHov] = React.useState(null);
  const items = [
    { i: '01', t: 'Market Maturity', b: 'Businesses are scaling beyond founder-led growth. The era of charismatic improvisation is closing.' },
    { i: '02', t: 'Talent Liquidity', b: 'High-quality operators now exist outside traditional employment structures. Capability is rentable, not just hireable.' },
    { i: '03', t: 'Complexity Explosion', b: 'Channels, partnerships and markets have multiplied. Old models cannot handle this complexity.' },
  ];
  return (
    <section id="forces" data-screen-label="03 Forces" style={forcesStyles.section}>
      <div style={forcesStyles.topRow}>
        <span style={forcesStyles.eyebrow}><span style={forcesStyles.tick} />The Shift</span>
        <span style={forcesStyles.index}>02 / 09</span>
      </div>
      <div style={forcesStyles.head}>
        <h2 style={forcesStyles.h2}>Three forces have converged.</h2>
        <p style={forcesStyles.rhs}>
          The conditions for a new operating layer are here. Growth is no longer a function any single
          firm — agency, consultancy or in-house team — can hold end to end.
        </p>
      </div>
      <div style={forcesStyles.grid}>
        {items.map((it, i) => (
          <div
            key={it.i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              ...forcesStyles.card,
              ...(i === items.length - 1 ? forcesStyles.cardLast : {}),
              ...(hov === i ? forcesStyles.cardHover : {}),
            }}
          >
            <div style={{...forcesStyles.cardIdx, color: hov===i ? 'rgba(246,244,239,0.6)' : 'var(--ink-60)'}}>{it.i}.</div>
            <div style={forcesStyles.cardTitle}>{it.t}</div>
            <p style={{...forcesStyles.cardBody, color: hov===i ? 'rgba(246,244,239,0.72)' : 'var(--ink-60)'}}>{it.b}</p>
          </div>
        ))}
      </div>
      <div style={forcesStyles.closer}>
        Old models cannot handle this complexity. <span style={{color:'var(--blue)'}}>A new layer is required.</span>
      </div>
    </section>
  );
}

window.Forces = Forces;
