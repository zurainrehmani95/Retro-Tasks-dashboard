import { useEffect, useState } from 'react';
import useRubberBand from '../hooks/useRubberBand.js';

const LINKS = [
  { href: '#main-section', label: 'Home' },
  { href: '#stats-section', label: 'Stats' },
  { href: '#music-section', label: 'Radio' },
  { href: '#arcade-section', label: 'Arcade' },
];

export default function Navbar() {
  const rubberRef = useRubberBand();
  const [activeHref, setActiveHref] = useState(LINKS[0].href);

  // Scrollspy: highlight whichever section is crossing the viewport centre.
  useEffect(() => {
    const sections = LINKS
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="navbar rubber" ref={rubberRef}>
      <div className="nav-logo">RETRO TASKS</div>
      <ul className="nav-links">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={activeHref === link.href ? 'active' : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
