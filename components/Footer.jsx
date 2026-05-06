/* global React */
const footerStyles = {
  wrap: { background: 'var(--ink)', color: 'var(--paper)' },
  plate: {
    padding: '120px var(--grid-gutter) 96px',
    borderBottom: '1px solid rgba(246,244,239,0.12)',
  },
  eyebrow: {
    fontFamily: 'var(--font-text)', fontSize: 12, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--paper)',
    display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32,
  },
  tick: { width: 24, height: 1, background: 'var(--paper)', display: 'inline-block' },
  bigMark: {
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 'clamp(96px, 18vw, 280px)', lineHeight: 0.85, letterSpacing: '-0.06em',
    color: 'var(--paper)', margin: 0,
  },
  e: {
    background: 'var(--gradient-e)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
    color: 'transparent', fontSize: '0.5em', verticalAlign: 'super', marginLeft: '-0.02em',
  },
  tagline: {
    marginTop: 32,
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: 22, letterSpacing: '-0.02em',
    color: 'var(--paper)',
  },
  taglineDim: { color: 'rgba(246,244,239,0.5)' },
  cols: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48,
    padding: '64px var(--grid-gutter)',
  },
  col: { display: 'flex', flexDirection: 'column', gap: 14 },
  colHead: {
    fontFamily: 'var(--font-text)', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(246,244,239,0.5)',
    marginBottom: 8,
  },
  link: {
    fontFamily: 'var(--font-text)', fontSize: 14, color: 'var(--paper)',
    cursor: 'pointer', borderBottom: '1px solid transparent',
    transition: 'border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
    paddingBottom: 1,
    width: 'fit-content',
  },
  bar: {
    padding: '24px var(--grid-gutter)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderTop: '1px solid rgba(246,244,239,0.12)',
    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(246,244,239,0.5)',
  },
};

function FooterLink({ children }) {
  const [h, setH] = React.useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ ...footerStyles.link, borderBottomColor: h ? 'var(--blue)' : 'transparent', color: h ? 'var(--blue)' : 'var(--paper)' }}
    >
      {children}
    </a>
  );
}

function Footer() {
  return (
    <footer data-screen-label="05 Footer" style={footerStyles.wrap}>
      <div style={footerStyles.plate}>
        <span style={footerStyles.eyebrow}><span style={footerStyles.tick} />Orchestrating capability</span>
        <h2 style={footerStyles.bigMark}>Comcorp<span style={footerStyles.e}>e</span></h2>
        <div style={footerStyles.tagline}>
          Orchestrating capability. <span style={footerStyles.taglineDim}>Delivering outcomes. Scaling impact.</span>
        </div>
      </div>
      <div style={footerStyles.cols}>
        <div style={footerStyles.col}>
          <span style={footerStyles.colHead}>Model</span>
          <FooterLink>Orchestration</FooterLink>
          <FooterLink>Specialist Pods</FooterLink>
          <FooterLink>Growth Plays</FooterLink>
        </div>
        <div style={footerStyles.col}>
          <span style={footerStyles.colHead}>Arenas</span>
          <FooterLink>Technology &amp; Fintech</FooterLink>
          <FooterLink>Public Infrastructure</FooterLink>
          <FooterLink>Consumer &amp; Brand</FooterLink>
        </div>
        <div style={footerStyles.col}>
          <span style={footerStyles.colHead}>Company</span>
          <FooterLink>International Board</FooterLink>
          <FooterLink>Strategic Opportunity Briefs</FooterLink>
          <FooterLink>Press</FooterLink>
        </div>
        <div style={footerStyles.col}>
          <span style={footerStyles.colHead}>Contact</span>
          <FooterLink>Request a brief</FooterLink>
          <FooterLink>hello@comcorp.e</FooterLink>
          <FooterLink>London · Lagos · Singapore</FooterLink>
        </div>
      </div>
      <div style={footerStyles.bar}>
        <span>© 2026 Comcorpᵉ Ltd. All rights reserved.</span>
        <span>A Growth Systems Company</span>
      </div>
    </footer>
  );
}

window.Footer = Footer;
