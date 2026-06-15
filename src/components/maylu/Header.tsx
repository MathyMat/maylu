import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-cocoa">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-butter text-cocoa shadow-sm">
            🐾
          </span>
          Ayuda a Maylu
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold text-cocoa">
          {[
            { to: "/", label: "Inicio" },
            { to: "/historia", label: "Historia" },
            { to: "/ayuda", label: "Ayudar" },
            { to: "/juego", label: "Juego" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-butter text-cocoa" }}
              className="rounded-full px-3 py-1.5 transition hover:bg-butter/60"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
