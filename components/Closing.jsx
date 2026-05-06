/* global React */
const closeStyles = {
  section: {
    padding: '160px var(--grid-gutter)',
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderBottom: '1px solid var(--ink)',
    position: 'relative',
    overflow: 'hidden',
  },
  topRow: { display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 64 },
  eyebrow: {
    fontFamily: 'var(--font-text)', fontSize: 12, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--paper)',
    display: 'inline-flex', alignItems: 'center', gap: 10,
  },
  tick: { width: 24, height: 1, background: 'var(--paper)', display: 'inline-block' },
  index: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(246,244,239,0.6)', marginLeft: 'auto' },
  manifesto: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(56px, 8vw, 144px)', lineHeight: 0.92,
    letterSpacing: '-0.05em',
    color: 'var(--paper)',
    margin: 0,
    textWrap: 'balance',
  },
  dim: { color: 'rgba(246,244,239,0.4)' },
  blue: { color: 'var(--blue)' },
  layout: {
    marginTop: 96,
    display: 'grid',
    gridTemplateColumns: '6fr 6fr',
    gap: 64,
    alignItems: 'end',
  },
  ambition: {
    fontFamily: 'var(--font-text)', fontSize: 17, lineHeight: 1.5,
    color: 'rgba(246,244,239,0.72)', maxWidth: '40ch',
  },
  ambHead: {
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(246,244,239,0.5)', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 16,
  },
  pills: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
    marginTop: 24,
  },
  pill: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--paper)', padding: '8px 12px',
    border: '1px solid rgba(246,244,239,0.24)',
  },
  ctaWrap: {
    display: 'flex', flexDirection: 'column', gap: 16,
    alignItems: 'flex-end',
  },
  ctaLabel: {
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(246,244,239,0.5)', textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  ctaBig: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 0.95,
    letterSpacing: '-0.04em',
    color: 'var(--paper)',
    textAlign: 'right',
    border: 'none', background: 'transparent',
    cursor: 'pointer',
    padding: 0,
  },
  ctaArrow: {
    fontSize: '0.9em',
    color: 'var(--blue)',
    display: 'inline-block',
    marginLeft: 16,
    transition: 'transform var(--dur-base) var(--ease)',
  },
  inputRow: {
    marginTop: 16,
    display: 'flex',
    gap: 0,
    border: '1px solid rgba(246,244,239,0.24)',
    width: '100%',
    maxWidth: 480,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none', outline: 'none',
    color: 'var(--paper)',
    padding: '16px 20px',
    fontFamily: 'var(--font-text)', fontSize: 14,
  },
  inputBtn: {
    background: 'var(--blue)',
    color: '#fff',
    border: 'none',
    padding: '0 24px',
    fontFamily: 'var(--font-text)', fontSize: 13, fontWeight: 600,
    letterSpacing: 0,
    cursor: 'pointer',
  },
  bigE: {
    position: 'absolute',
    bottom: -160,
    right: -80,
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 720,
    lineHeight: 0.8,
    background: 'linear-gradient(180deg, rgba(31,77,255,0.20) 0%, rgba(123,59,255,0.08) 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    pointerEvents: 'none',
    fontStyle: 'italic',
    letterSpacing: '-0.06em',
  },
};

function Closing({ onSubmit }) {
  const [hov, setHov] = React.useState(false);
  const [email, setEmail] = React.useState('');
  return (
    <section id="closing" data-screen-label="09 Closing" style={closeStyles.section}>
      <div style={closeStyles.bigE}>e</div>
      <div style={closeStyles.topRow}>
        <span style={closeStyles.eyebrow}><span style={closeStyles.tick} />Closing manifesto</span>
        <span style={closeStyles.index}>09 / 09</span>
      </div>
      <h2 style={closeStyles.manifesto}>
        We are not building a firm.<br/>
        <span style={closeStyles.dim}>We are building </span>
        <span style={closeStyles.blue}>the infrastructure</span>
        <span style={closeStyles.dim}> for growth in complex markets.</span>
      </h2>

      <div style={closeStyles.layout}>
        <div>
          <div style={closeStyles.ambHead}>3–5 Year Ambition</div>
          <p style={closeStyles.ambition}>
            Define and own the Growth Systems category. Become the trusted partner for complex
            growth mandates. Build a portfolio of high-impact engagements. Develop a globally
            relevant operating model.
          </p>
          <div style={closeStyles.pills}>
            <span style={closeStyles.pill}>A Company</span>
            <span style={closeStyles.pill}>A Model</span>
            <span style={closeStyles.pill}>A Long-term Institutional Play</span>
          </div>
        </div>

        <div style={closeStyles.ctaWrap}>
          <span style={closeStyles.ctaLabel}>Take the next step</span>
          <button
            onClick={onSubmit}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={closeStyles.ctaBig}
          >
            Request a brief
            <span style={{...closeStyles.ctaArrow, transform: hov ? 'translateX(12px)' : 'translateX(0)'}}>→</span>
          </button>
          <div style={closeStyles.inputRow}>
            <input
              style={closeStyles.input}
              placeholder="your-name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              style={closeStyles.inputBtn}
              onClick={(e) => { e.preventDefault(); onSubmit && onSubmit(email); }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Closing = Closing;
