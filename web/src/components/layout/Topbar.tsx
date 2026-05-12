import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Today" },
  { to: "/2026-05-12", label: "Archive" },
];

export function Topbar() {
  return (
    <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold">
            BN
          </span>
          <div>
            <div className="text-lg font-semibold tracking-tight">bemoNews</div>
            <div className="text-sm text-ink-400">Low-noise personal intelligence desk</div>
          </div>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
        <nav className="flex items-center gap-2 text-sm text-ink-400">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-full px-3 py-2",
                  isActive ? "bg-white/10 text-ink-100" : "hover:bg-white/5 hover:text-ink-100",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="mailto:hello@bemonews.local"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink-100 hover:bg-white/10"
          >
            Subscribe
          </a>
        </div>
      </div>
    </header>
  );
}
