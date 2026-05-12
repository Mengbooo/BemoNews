import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/2026-05-12/quick", label: "Briefing" },
  { to: "/2026-05-12/full", label: "Trending" },
  { to: "/2026-05-12", label: "Resources" },
  { to: "/", label: "Archive" },
];

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" aria-label="bemoNews home">
          <span className="brand-mark" />
          <span>bemoNews</span>
        </Link>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions">
          <Link to="/2026-05-12/full" className="button-secondary">Latest issue</Link>
          <a href="mailto:hello@bemonews.local" className="button">Subscribe</a>
          <button className="icon-button mobile-menu" type="button" aria-label="Menu">☰</button>
        </div>
      </div>
    </header>
  );
}
