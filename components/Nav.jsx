/* global React */
const { useState, useEffect } = React;

const navStyles = {
  bar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    height: 'var(--nav-height)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 var(--grid-gutter)',
    transition: 'background var(--dur-base) var(--ease), border-color var(--dur-base) var(--ease)',
    borderBottom: '1px solid transparent',
  },
  barScrolled: {
    background: 'rgba(246, 244, 239, 0.72)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--ink-10)',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 22,
    letterSpacing: '-0.045em',
    color: 'var(--ink)',
    lineHeight: 1,
    cursor: 'pointer',
  },
  e: {
    background: 'var(--gradient-e)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    fontSize: '0.5em',
    verticalAlign: 'super',
    marginLeft: '-0.02em',
  },
  links: {
    marginLeft: 'auto',
    display: 'flex',
    gap: 36,
    alignItems: 'center',
  },
  link: {
    fontFamily: 'var(--font-text)',
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '-0.005em',
    color: 'var(--ink)',
    cursor: 'pointer',
    borderBottom: '1px solid transparent',
    transition: 'border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
    paddingBottom: 2,
  },
  cta: {
    fontFamily: 'var(--font-text)',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.2,
    padding: '10px 18px',
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    transition: 'background var(--dur-fast) var(--ease)',
  },
};

function Nav({ onCtaClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [ctaHover, setCtaHover] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = ['Provocation', 'Model', 'Arenas', 'Cases'];

  return (
    <nav style={{ ...navStyles.bar, ...(scrolled ? navStyles.barScrolled : {}) }}>
      <a href="#top" style={navStyles.brand}>Comcorp<span style={navStyles.e}>e</span></a>
      <div style={navStyles.links}>
        {items.map((label, i) => (
          <a
            key={label}
            href={`#${label.toLowerCase().replace(/ /g, '-')}`}
            onMouseEnter={() => setHoveredLink(i)}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              ...navStyles.link,
              borderBottomColor: hoveredLink === i ? 'var(--blue)' : 'transparent',
              color: hoveredLink === i ? 'var(--blue)' : 'var(--ink)',
            }}
          >
            {label}
          </a>
        ))}
        <button
          onClick={onCtaClick}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{ ...navStyles.cta, background: ctaHover ? 'var(--blue)' : 'var(--ink)' }}
        >
          Request a brief
        </button>
      </div>
    </nav>
  );
}

window.Nav = Nav;
