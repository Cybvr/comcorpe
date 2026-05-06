/* global React */
const ucStyles = {
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
  head: { display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 96, marginBottom: 64, alignItems: 'baseline' },
  h2: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.02, letterSpacing: '-0.04em',
    color: 'var(--ink)', margin: 0, textWrap: 'balance',
  },
  rhs: { fontFamily: 'var(--font-text)', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-60)' },
  cases: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 0,
    border: '1px solid var(--ink)',
  },
  card: {
    padding: 36,
    borderRight: '1px solid var(--ink-10)',
    background: 'var(--paper)',
    display: 'flex', flexDirection: 'column',
    minHeight: 460,
    cursor: 'default',
  },
  cardLast: { borderRight: 'none' },
  caseN: {
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'var(--ink-60)', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 12,
  },
  caseT: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.03em',
    color: 'var(--ink)', marginBottom: 12,
  },
  caseS: {
    fontFamily: 'var(--font-text)', fontSize: 16, lineHeight: 1.5,
    color: 'var(--ink-60)', marginBottom: 28, fontStyle: 'italic',
  },
  steps: { display: 'flex', flexDirection: 'column', gap: 0, marginTop: 'auto' },
  step: {
    display: 'grid', gridTemplateColumns: '40px 1fr', gap: 12,
    padding: '14px 0',
    borderTop: '1px solid var(--ink-10)',
    alignItems: 'baseline',
  },
  stepLast: { borderBottom: '1px solid var(--ink-10)' },
  stepN: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--blue)', fontWeight: 500 },
  stepT: { fontFamily: 'var(--font-text)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.4 },
  closer: {
    marginTop: 64,
    paddingTop: 32,
    borderTop: '1px solid var(--ink)',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'baseline', gap: 32,
  },
  closerL: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(28px, 3.6vw, 48px)', letterSpacing: '-0.03em',
    color: 'var(--ink)', lineHeight: 1.1, textWrap: 'balance', maxWidth: '24ch',
  },
  closerBlue: { color: 'var(--blue)' },
  closerR: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-60)' },
};

function UseCases() {
  const cases = [
    {
      n: 'Case 01', t: 'Market Entry', s: 'A global brand entering Nigeria.',
      steps: [
        'Design go-to-market strategy',
        'Build local partnerships',
        'Deploy launch execution team',
      ],
    },
    {
      n: 'Case 02', t: 'Growth Stagnation', s: 'A local leader plateauing.',
      steps: [
        'Diagnose growth bottlenecks',
        'Rewire commercial model',
        'Deploy targeted execution pods',
      ],
    },
    {
      n: 'Case 03', t: 'Opportunity Creation', s: 'A new revenue stream we identify.',
      steps: [
        'Develop concept',
        'Pitch client',
        'Execute rollout',
      ],
    },
  ];
  return (
    <section id="cases" data-screen-label="07 Use Cases" style={ucStyles.section}>
      <div style={ucStyles.topRow}>
        <span style={ucStyles.eyebrow}><span style={ucStyles.tick} />Early use cases</span>
        <span style={ucStyles.index}>06 / 09</span>
      </div>
      <div style={ucStyles.head}>
        <h2 style={ucStyles.h2}>Three patterns. One operating method.</h2>
        <p style={ucStyles.rhs}>
          Every engagement falls into one of three shapes — entering, unblocking or originating.
          The architecture is shared; the configuration is bespoke.
        </p>
      </div>
      <div style={ucStyles.cases}>
        {cases.map((c, i) => (
          <div key={c.n} style={{...ucStyles.card, ...(i === cases.length-1 ? ucStyles.cardLast : {})}}>
            <div style={ucStyles.caseN}>{c.n}</div>
            <div style={ucStyles.caseT}>{c.t}</div>
            <p style={ucStyles.caseS}>{c.s}</p>
            <div style={ucStyles.steps}>
              {c.steps.map((s, j) => (
                <div key={j} style={{...ucStyles.step, ...(j === c.steps.length-1 ? ucStyles.stepLast : {})}}>
                  <span style={ucStyles.stepN}>0{j+1}/</span>
                  <span style={ucStyles.stepT}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={ucStyles.closer}>
        <div style={ucStyles.closerL}>
          We do not wait for problems. <span style={ucStyles.closerBlue}>We create opportunities.</span>
        </div>
        <div style={ucStyles.closerR}>06 / 09 · Operating method</div>
      </div>
    </section>
  );
}

window.UseCases = UseCases;
