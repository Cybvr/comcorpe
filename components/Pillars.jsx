/* global React */
const pillStyles = {
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
  head: {
    display: 'grid', gridTemplateColumns: '6fr 6fr', gap: 64, marginBottom: 96, alignItems: 'end',
  },
  h2: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(48px, 7vw, 112px)', lineHeight: 0.94, letterSpacing: '-0.045em',
    color: 'var(--paper)', margin: 0, textWrap: 'balance',
  },
  blue: { color: 'var(--blue)' },
  rhs: { fontFamily: 'var(--font-text)', fontSize: 18, lineHeight: 1.5, color: 'rgba(246,244,239,0.72)', maxWidth: '38ch' },
  rhsBold: { fontFamily: 'var(--font-display)', color: 'var(--paper)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.02em', display: 'block', marginBottom: 12 },
  pillars: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 0,
    border: '1px solid rgba(246,244,239,0.18)',
  },
  pillar: {
    padding: '48px 40px',
    borderRight: '1px solid rgba(246,244,239,0.18)',
    minHeight: 460,
    display: 'flex', flexDirection: 'column',
    position: 'relative',
    cursor: 'default',
    transition: 'background var(--dur-base) var(--ease)',
  },
  pillarLast: { borderRight: 'none' },
  pillarHover: { background: 'rgba(31,77,255,0.08)' },
  pNumWrap: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 64 },
  pNum: {
    fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(246,244,239,0.6)',
  },
  pVerb: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 64, lineHeight: 0.92, letterSpacing: '-0.045em',
    color: 'var(--paper)',
  },
  pColon: { color: 'var(--blue)' },
  pTitle: {
    fontFamily: 'var(--font-text)', fontSize: 13, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'rgba(246,244,239,0.6)', marginBottom: 20,
  },
  pBody: {
    fontFamily: 'var(--font-text)', fontSize: 16, lineHeight: 1.55,
    color: 'rgba(246,244,239,0.85)',
    marginBottom: 'auto',
  },
  pTags: {
    marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 8,
  },
  pTag: {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: 'var(--paper)',
    padding: '6px 10px', border: '1px solid rgba(246,244,239,0.24)',
  },
  compare: {
    marginTop: 96,
    border: '1px solid rgba(246,244,239,0.18)',
    display: 'grid',
    gridTemplateColumns: '180px 1fr 1fr',
  },
  compareHead: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(246,244,239,0.18)',
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(246,244,239,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  compareHeadOurs: {
    background: 'var(--blue)',
    color: '#fff',
    borderBottom: '1px solid var(--blue)',
  },
  compareLabel: {
    padding: '24px',
    borderBottom: '1px solid rgba(246,244,239,0.12)',
    borderRight: '1px solid rgba(246,244,239,0.18)',
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(246,244,239,0.6)',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  compareCell: {
    padding: '24px',
    borderBottom: '1px solid rgba(246,244,239,0.12)',
    borderRight: '1px solid rgba(246,244,239,0.18)',
    fontFamily: 'var(--font-text)', fontSize: 17, color: 'rgba(246,244,239,0.85)',
  },
  compareCellOurs: {
    background: 'rgba(31,77,255,0.08)',
    color: 'var(--paper)',
    fontWeight: 500,
    borderRight: 'none',
  },
};

function Pillars() {
  const [hov, setHov] = React.useState(null);
  const pillars = [
    {
      i: '01', verb: 'Architect',
      title: 'Design the growth system',
      body: 'We map the unit economics, the channel architecture and the commercial logic before we build anything. The output is a system, not a slide.',
      tags: ['UNIT ECONOMICS', 'COMMERCIAL DESIGN', 'FEEDBACK LOOPS'],
    },
    {
      i: '02', verb: 'Assemble',
      title: 'Curate best-fit execution talent',
      body: 'Specialist Pods are configured to the problem, not the org chart. Drawn from a curated network of operators, never a static bench.',
      tags: ['SPECIALIST PODS', 'GLOBAL TALENT', 'ON-DEMAND'],
    },
    {
      i: '03', verb: 'Operate',
      title: 'Drive implementation and iteration',
      body: 'We ship, measure and rewire. Every engagement compounds: knowledge becomes proprietary, systems become reusable, talent becomes fluent.',
      tags: ['EXECUTION', 'ITERATION', 'COMPOUNDING'],
    },
  ];

  const rows = [
    { label: 'Teams', a: 'Fixed, salaried, project-staffed', b: 'Modular pods, configured to the brief' },
    { label: 'Engagements', a: 'Linear: brief → deck → handoff', b: 'Idea-led, continuous, iterative' },
    { label: 'Overhead', a: 'High structural drag', b: 'Low structural drag' },
    { label: 'Output', a: 'Recommendations and creative', b: 'A growth engine that runs' },
  ];

  return (
    <section id="model" data-screen-label="04 Pillars" style={pillStyles.section}>
      <div style={pillStyles.topRow}>
        <span style={pillStyles.eyebrow}><span style={pillStyles.tick} />The Comcorpᵉ Proposition</span>
        <span style={pillStyles.index}>03 / 09</span>
      </div>
      <div style={pillStyles.head}>
        <h2 style={pillStyles.h2}>
          We do not deliver recommendations.<br/>
          <span style={pillStyles.blue}>We build growth engines that run.</span>
        </h2>
        <div style={pillStyles.rhs}>
          <span style={pillStyles.rhsBold}>Three pillars hold the model.</span>
          Architect, Assemble, Operate. Together they collapse the gap between strategy
          and execution that defines every traditional engagement.
        </div>
      </div>

      <div style={pillStyles.pillars}>
        {pillars.map((p, i) => (
          <div
            key={p.i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              ...pillStyles.pillar,
              ...(i === pillars.length - 1 ? pillStyles.pillarLast : {}),
              ...(hov === i ? pillStyles.pillarHover : {}),
            }}
          >
            <div style={pillStyles.pNumWrap}>
              <span style={pillStyles.pNum}>{p.i}.</span>
            </div>
            <div style={pillStyles.pVerb}>{p.verb}<span style={pillStyles.pColon}>.</span></div>
            <div style={{height: 24}} />
            <div style={pillStyles.pTitle}>{p.title}</div>
            <p style={pillStyles.pBody}>{p.body}</p>
            <div style={pillStyles.pTags}>
              {p.tags.map(t => <span key={t} style={pillStyles.pTag}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div style={pillStyles.compare}>
        <div style={{...pillStyles.compareHead, borderRight: '1px solid rgba(246,244,239,0.18)'}}>vs.</div>
        <div style={{...pillStyles.compareHead, borderRight: '1px solid rgba(246,244,239,0.18)'}}>Traditional Model</div>
        <div style={{...pillStyles.compareHead, ...pillStyles.compareHeadOurs}}>Comcorpᵉ Model</div>
        {rows.map((r, i) => (
          <React.Fragment key={r.label}>
            <div style={{...pillStyles.compareLabel, ...(i === rows.length-1 ? {borderBottom: 'none'} : {})}}>{r.label}</div>
            <div style={{...pillStyles.compareCell, ...(i === rows.length-1 ? {borderBottom: 'none'} : {})}}>{r.a}</div>
            <div style={{...pillStyles.compareCell, ...pillStyles.compareCellOurs, ...(i === rows.length-1 ? {borderBottom: 'none'} : {})}}>{r.b}</div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

window.Pillars = Pillars;
